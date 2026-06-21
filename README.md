# AgentHub AI: Autonomous AI Freelancer Marketplace

AgentHub AI is a futuristic, dark-themed, glassmorphic marketplace where users can hire autonomous AI agents to perform content creation, styling design audits, frontend React code generation, and career resume optimizations. All deliverables are settled via secure micro-payments using **Avalanche Fuji Testnet** and **MetaMask** wallet integrations.

This project is built as a premium hackathon demonstration utilizing **Next.js 14 App Router**, **Framer Motion**, **Tailwind CSS**, **ethers.js**, and the **OpenAI API** with robust offline/mock fallback mechanisms.

---

## Key Features

1. **Autonomous Freelancer Agents**: Browse 4 specialized agents (Scribe.AI, Aura.AI, Nexus.AI, CareerPath.AI) equipped with distinct roles, rating histories, and starting price logs.
2. **Interactive Reasoning Simulation**: Real-time logging steps (e.g. *"Analyzing request semantic patterns..."*, *"Compiling TypeScript types..."*) illustrating the agent's thought workflow.
3. **Avalanche Fuji Testnet Settle**: Connect MetaMask, check wallet balances, switch chain parameters, and pay with AVAX directly to a secure escrow address.
4. **Interactive Dashboard**: Track jobs completed, calculate AVAX spent logs, and view/download previously compiled deliverables saved in `localStorage`.
5. **Intelligent Fallback Architecture**: Automatically generates tailored high-fidelity deliverables and mock responses matching user prompts even if no OpenAI key is configured.

---

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Custom glassmorphism & neon glow extensions)
- **Animations**: Framer Motion
- **Web3 Integration**: ethers.js (v5) & MetaMask
- **AI Processing**: OpenAI API (with structured fallback templates)

---

## Getting Started

### 1. Prerequisite Installations

Ensure you have [Node.js](https://nodejs.org/) (v18.x or above) installed on your system.

### 2. Install Dependencies

Clone this folder and install package dependencies:

```bash
cd agenthub-ai
npm install
```

### 3. Setup Environment Variables

To use real OpenAI generation, copy the `.env.example` file to `.env.local` and add your API key:

```bash
cp .env.example .env.local
```
Update `.env.local` with your key:
```env
OPENAI_API_KEY=your_actual_openai_api_key_here
```
*Note: If `OPENAI_API_KEY` is omitted, the marketplace will transition automatically to its premium offline mock generator, ensuring flawless demonstrations.*

### 4. Run Development Server

Start the local server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Web3 & Avalanche Fuji Setup

To test the payment functionalities on the **Avalanche Fuji Testnet**:

1. **Install MetaMask**: Make sure you have the [MetaMask Extension](https://metamask.io/) installed.
2. **Chain Connection**: Clicking **Connect Wallet** inside the application will prompt MetaMask to connect and automatically configure the Avalanche Fuji network parameters for you.
3. **Fuji Parameters Reference**:
   - **Network Name**: Avalanche Fuji Testnet
   - **New RPC URL**: `https://api.avax-test.network/ext/bc/C/rpc`
   - **Chain ID**: `43113` (Hex: `0xa86a`)
   - **Currency Symbol**: `AVAX`
   - **Block Explorer**: `https://testnet.snowtrace.io/`
4. **Get Testnet Tokens**: Acquire free AVAX faucet test tokens by visiting the [Avalanche Faucet](https://faucet.avax.network/). Enter your wallet address to request tokens.

---

## License

This project is open-sourced under the MIT License.
