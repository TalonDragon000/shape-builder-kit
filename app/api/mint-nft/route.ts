// app/api/mint-nft/route.ts
// get user wallet address from wallet connect modal
// check if the user already has the nft
// if they do, tell them they already have the nft
// if they don't, mint the nft for the user and send to their address
// return the nft image url, token id, and token address

import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, createWalletClient, http, isAddress, parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { shapeSepolia } from 'viem/chains';
import { z } from 'zod';

// Contract ABI - only include the functions you need
const contractAbi = parseAbi([
    'function mint(address to) external',
    'function balanceOf(address owner) external view returns (uint256)',
    'function totalSupply() external view returns (uint256)',
    'function tokenURI(uint256 tokenId) external view returns (string)',
]);

// Configuration
const CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS as `0x${string}`;
const PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY as `0x${string}`;
const RPC_URL = process.env.RPC_URL || 'https://eth-sepolia.public.blastapi.io';
const CHAIN = shapeSepolia;

const mintNftSchema = z.object({
    address: z.string().refine((val) => isAddress(val), {
        message: 'Invalid Ethereum address format',
    }),
});

export async function POST(request: NextRequest) {
    try {
        // Validate environment variables
        if (!CONTRACT_ADDRESS || !PRIVATE_KEY) {
            return NextResponse.json(
                { error: 'Server configuration error: Missing contract address or private key' },
                { status: 500 }
            );
        }

        const body = await request.json();

        // Validate request body
        const validation = mintNftSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Invalid address',
                    details: validation.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { address } = validation.data;

        // Create clients
        const publicClient = createPublicClient({
            chain: CHAIN,
            transport: http(RPC_URL),
        });

        const account = privateKeyToAccount(PRIVATE_KEY);
        const walletClient = createWalletClient({
            account,
            chain: CHAIN,
            transport: http(RPC_URL),
        });

        // Check if user already has an NFT
        const balance = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: contractAbi,
            functionName: 'balanceOf',
            args: [address as `0x${string}`],
        });

        if (balance > 0) {
            return NextResponse.json(
                {
                    error: 'Address already owns an NFT',
                    message: 'This address already has an NFT from this collection',
                    balance: balance.toString(),
                },
                { status: 400 }
            );
        }

        // Get the current total supply to determine the next token ID
        const totalSupply = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: contractAbi,
            functionName: 'totalSupply',
        });

        const nextTokenId = totalSupply + BigInt('1');

        // Mint the NFT
        const hash = await walletClient.writeContract({
            address: CONTRACT_ADDRESS,
            abi: contractAbi,
            functionName: 'mint',
            args: [address as `0x${string}`],
        });

        // Wait for transaction confirmation
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status !== 'success') {
            throw new Error('Transaction failed');
        }

        return NextResponse.json({
            success: true,
            message: 'NFT minted successfully!',
            tokenId: nextTokenId.toString(),
            contractAddress: CONTRACT_ADDRESS,
            imageUrl: '/shape-wiz.png',
            recipient: address,
            transactionHash: hash,
            blockNumber: receipt.blockNumber.toString(),
        });
    } catch (error) {
        console.error('Error minting NFT:', error);

        // Handle specific contract errors
        if (error instanceof Error) {
            if (error.message.includes('AccessControl')) {
                return NextResponse.json({ error: 'Minting permission denied' }, { status: 403 });
            }
            if (error.message.includes('insufficient funds')) {
                return NextResponse.json({ error: 'Insufficient funds for gas' }, { status: 400 });
            }
        }

        return NextResponse.json(
            {
                error: 'Failed to mint NFT',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}