# Shape Wiz 🧙‍♂️

**An AI-powered quiz that gamifies the Shape Network and rewards players with NFTs. Built with Next.js, GPT-4, and blockchain integration.**

<img width="300" height="300" alt="shape wiz" src="https://github.com/user-attachments/assets/81c3f9fc-776c-416a-af15-d284b335debb" />
(This NFT was also AI generated on Night Cafe and edited in canva!)

---

## 🎯 Concept

Shape Wiz transforms the Shape Network ecosystem into an interactive learning game. Players answer AI-generated quiz questions derived from **real-time onchain data** via Shape MCP, earning **NFT rewards** for perfect scores. This gamified approach educates users while showcasing the power of AI + blockchain synergy.

---

## 🎨 Innovation & Creativity

- Real-time AI quiz generation from **Shape MCP tools**, including Gasback analytics, NFT collections, and top creators.
- Adaptive questions mixing **doc-based knowledge** with **live blockchain state**.
- Every NFT reward reflects **onchain achievements**, turning knowledge into collectible assets.

---

## 🤖 AI Effectiveness

- GPT-4 generates dynamic open-ended or multiple choice questions from Shape MCP data.
- Validates answers against **live onchain state**.
- Fallback handling ensures smooth gameplay even if some MCP tools are temporarily unavailable.
- Streaming interface shows AI tool calls and results in real-time for transparency.

---

## 🏗️ Technical Integration

- **Frontend:** Next.js + React + Tailwind + shadcn/ui components
- **Wallet Integration:** RainbowKit + Wagmi for Shape Network connections
- **AI:** GPT-4 (OpenAI API)
- **Shape MCP Tools:**
  - `getTopShapeCreators`
  - `getCollectionAnalytics`
  - `simulateGasbackRewards`
- **NFT Rewards:** 
  - Alchemy NFT API mints collectible NFTs upon perfect quiz scores
  - FREE mint, gas-sponsored, and ai bot executed for seamless reward execution 
  - Soul-bound and limited to one per wallet address as a single achievement NFT

---

## 🌟 Ecosystem Impact

Shape Wiz encourages engagement and learning within the Shape Network:

- Players explore **onchain primitives** like NFTs, Gasback, and Stack achievements.
- Educational gameplay rewards knowledge with **tangible digital collectibles** with a FREE soul-bound achievement NFT to Collect. 
- Promotes adoption of Shape Network features through a fun, interactive trivia game.
- Real-time generated quiz questions for dynamic and evolving content at minimal effort.
- Prevent cheats with open-ended questions that are instantly reviewed.
- Enriched learning by testing applied knowledge, critical thinking, and comprehension.

---

## 🎮 User Experience

- Connect your Shape wallet (MetaMask or compatible).
- Click **Start Quiz** → answer 5 AI-generated questions.
- Real-time feedback with streaming AI tool calls.
- Perfect score → claim your **Shape Wiz NFT** instantly executed by the ai for free.
- Clean, intuitive interface using Tailwind + shadcn/ui.

---

## 🚀 Demo

**Watch Shape Wiz in action:** 

https://www.youtube.com/watch?v=7HaTo7-WAZ4

Flow: Start Quiz → Answer Questions → Mint NFT → View on Shape testnet.

---

## 🛠️ Setup

### Prerequisites

- Node.js 18+
- Yarn or npm
- Shape Network wallet (MetaMask, etc.)

### Environment Variables

Create a `.env.local` file:

```bash
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_ALCHEMY_KEY=your_alchemy_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_CHAIN_ID=360
MCP_SERVER_URL=https://shape-mcp-server-eta.vercel.app/mcp
```

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd shape-builder-kit-1

# Install dependencies
yarn install
# or
npm install

# Run development server
yarn dev
# or
npm run dev
```

### Building for Production

```bash
yarn build
yarn start
# or
npm run build
npm start

```

### 🤖 AI + MCP Integration

- GPT-4 uses live Shape MCP data to generate adaptive quiz questions.
- Example: "Who are the top 3 Gasback earners today?"
- AI validates answers against onchain state, providing instant feedback.
- Fallbacks ensure the quiz continues even if certain tools or APIs are temporarily unavailable.

### Model Context Protocol (MCP) Integration

The application leverages MCP to connect GPT-4 with real-time Shape Network data:

```typescript
// lib/mcp.ts - Core MCP client
export async function listMcpTools() {
  return rpc<{ tools: Array<{ name: string; description?: string }> }>('tools/list');
}

export async function callMcpTool(name: string, args: Record<string, unknown> = {}) {
  return rpc<unknown>('tools/call', { name, arguments: args });
}
```

### AI Tools Configuration

```typescript
// app/api/chat/route.ts - AI tools setup
const mcpTools = tool({
  name: 'shape-mcp',
  description: 'Call an MCP tool by exact name with JSON arguments',
  inputSchema: z.object({
    name: z.string(),
    args: z.record(z.string(), z.unknown()).default({}),
  }),
  execute: async ({ name, args }) => {
    const result = await callMcpTool(name, args);
    return typeof result === 'string' ? result : JSON.stringify(result);
  },
});
```

### System Prompt Design

The AI is configured with a specialized system prompt that defines:

- **Role**: Quiz and trivia game host for Shape Network
- **Data Sources**: MCP tools for blockchain data, Alchemy API as fallback
- **Game Rules**: 5 questions, 15-second timeouts, scoring system
- **Error Handling**: Graceful degradation and user support
- **NFT Rewards**: Automated minting process for winners

### Real-time Tool Visualization

The chat interface displays AI tool calls in real-time:

```typescript
// components/chat-interface.tsx - Tool call rendering
case 'tool-call':
  return (
    <div className="text-xs whitespace-pre-wrap opacity-80">
      Tool call: {part.type} {JSON.stringify(part.input)}
    </div>
  );
case 'tool-result':
  return (
    <pre className="text-xs opacity-70">
      {typeof part.output === 'string'
        ? part.output
        : JSON.stringify(part.output, null, 2)}
    </pre>
  );
```

## 🔄 Data Flow

1. **User Interaction**: Player connects wallet and starts quiz
2. **AI Processing**: GPT-4 generates questions using MCP tools for current Shape Network data
3. **Real-time Feedback**: Tool calls and blockchain queries shown in chat
4. **Answer Evaluation**: AI validates answers against blockchain sources
5. **NFT Reward**: Automatic minting for perfect scores (5/5 correct)

## 🛠️ Available MCP Tools

The Shape Network MCP server provides tools for:

- Block information and network statistics
- Transaction data and history
- Token information and balances
- NFT data and ownership
- Network activity metrics

## 📁 Project Structure

```
shape-builder-kit/
├── app/
│   ├── api/
│   │   ├── chat/       # AI chat endpoint
│   │   ├── mint-nft/   # NFT minting
│   │   └── get-nfts/   # NFT querying
│   └── page.tsx        # Main app
├── components/
│   ├── chat-interface.tsx  # Quiz chat UI
│   ├── wallet-connect.tsx  # Wallet connection
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── mcp.ts           # MCP client
│   ├── clients.ts       # Alchemy/RPC clients
│   └── config.ts        # Environment config
└── hooks/
    └── web3.ts          # Web3 React hooks

```

## 🎮 How to Play

1. **Connect Wallet**: Use any Web3 wallet on Shape Network
2. **Start Quiz**: Click "Start Quiz" to begin
3. **Answer Questions**: Type "START" and answer 5 AI-generated questions
4. **Earn NFT**: Get all 5 correct to receive a free Shape Wiz NFT
5. **View Results**: See real-time tool calls and blockchain verification

## ⚠️ Known Issues & Future Plans

### 🚨 Known Issues

- **NFT Minting**: Unable to get ai to execute minter
- **Timer Functionality**: No 15-second question timer implementation in the chat interface
- **NFT Validation**: No checking if users already own the quiz NFT before allowing multiple attempts
- **Blockchain POSTS:** Retrieves data, but is unable to post data retrieved

### 🔄 In Progress

- **Smart Contract Development**: Will redeploy to mainnet after minting is fixed.
- **Real NFT Minting**: Integrating with a deployed mainnet contract for actual on-chain NFT rewards
- **MCP Server Stability**: Improving error handling when Shape MCP server is unavailable
- **Question Pool**: Cross-checking questions and answers for correctness.

### 🎯 Future Plans

- **Timer Implementation**: Add visual countdown timer for each question (15 seconds)
- **Leaderboard**: Track high scores and fastest completion times
- **Multiple Difficulty Levels**: Easy, Medium, Hard question categories
- **More NFTs to Collect:** More NFTS for achievements unlocked from milestone hits
- **Social Features**: Share quiz results and NFT achievements
- **Mobile Optimization**: Enhanced mobile-first design and wallet connection
- **Analytics Dashboard**: Track user engagement and quiz performance metrics
- **Custom Question Themes**: Allow users to choose specific Shape Network topics
- **Bot and Mini-App Integration**: Integrate a multi-platform experience with options to play via Discord, Telegram, BaseApp, or Farcaster.
- **Dynamic Prizes**: Ai generated dynamic prize NFTs based and distributed depending on newly acquired content. 
- **Visual Enhancements**: Update template UI, naming conventions, confetti triggers, and message format, displays, and modules

### 🛠️ Technical Debt

- **Error Boundaries**: Add React error boundaries for better error handling
- **Loading States**: Improve loading indicators during MCP tool calls
- **TypeScript Coverage**: Add missing type definitions for MCP responses
- **Testing Suite**: Add unit and integration tests for AI chat functionality
- **Performance**: Optimize large MCP response handling and streaming

## 🔗 Links

- [GitHub Repository](https://github.com/TalonDragon000/shape-builder-kit)
- [MCP Server](https://github.com/TalonDragon000/shape-mcp-server)
- NFT Minter Contract by DaveProxy80: [0x81f1C034CBDD7E23694cA1a895bFC8Fb080D65e6](https://sepolia.shapescan.xyz/address/0x81f1C034CBDD7E23694cA1a895bFC8Fb080D65e6)
- [Shape Network](https://shape.network)
- [Shapecraft Hackathon](https://shape.network/shapecraft)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Support

For issues and support, please visit: [GitHub Issues](https://github.com/TalonDragon000/shape-builder-kit/issues)
