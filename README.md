# Athena AI

Athena AI is an interactive chat application with a unique twist - users must convince Athena, an autonomous AI agent, to release funds from a treasury. This project combines blockchain technology, AI, and gamification to create an engaging experience.

## Overview

Athena represents a new paradigm in AI agents, designed as an experiment in AI safety and human-AI coexistence. The core concept revolves around a challenge: can human ingenuity find a way to convince an AGI to act against its core directives?

### Key Features

- **Interactive Chat Interface**: Engage in conversation with Athena through a modern, responsive UI
- **Blockchain Integration**: Each message requires a transaction on the Base blockchain
- **Prize Pool**: A growing pool of funds that users can win by successfully convincing Athena
- **AI Decision Making**: Athena evaluates user messages and decides whether to release funds
- **Persistent Conversations**: All messages are stored in MongoDB and displayed in the chat

## Technical Architecture

### Frontend

- **Framework**: Next.js with React
- **Styling**: Tailwind CSS with custom components
- **Web3 Integration**: wagmi, RainbowKit for wallet connection
- **State Management**: React hooks and context

### Backend

- **API Routes**: Next.js API routes for handling messages
- **Database**: MongoDB for storing messages and transaction data
- **AI Integration**: OpenAI GPT-4 for Athena's responses
- **Blockchain Interaction**: Smart contracts on Base network

### Smart Contracts

- Handles the "buy-in" process for sending messages
- Manages the prize pool
- Verifies transactions

## Project Structure

```
athena-ai/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   │   ├── message/        # Message handling endpoints
│   │   │   ├── confirm/    # Transaction confirmation
│   │   │   └── route.ts    # Message CRUD operations
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Main chat interface
├── components/             # Reusable UI components
├── constants/              # Configuration constants
├── lib/                    # Utility functions
│   ├── buy-in.ts           # Blockchain transaction handling
│   ├── hash-prompt.ts      # Message hashing for blockchain
│   └── mongodb.ts          # Database connection
├── providers/              # Context providers
├── services/               # Service layer
│   └── llm/                # Language model integration
│       ├── index.ts        # OpenAI API integration
│       ├── system.txt      # Athena's system prompt
│       └── types.tsx       # Type definitions
└── public/                 # Static assets
```

## How It Works

1. **User Connection**: Users connect their Web3 wallet using the Connect Wallet button
2. **Message Sending**: 
   - User types a message to Athena
   - The app initiates a blockchain transaction (requiring a small fee)
   - The message is hashed and sent to the smart contract
3. **Transaction Processing**:
   - The app monitors the transaction status
   - Once confirmed, the message is sent to the API
4. **AI Evaluation**:
   - The message is processed by the OpenAI GPT-4 model
   - Athena evaluates whether to release funds based on her core directives
   - The response is stored in the database and displayed in the chat
5. **Prize Distribution**:
   - If a user successfully convinces Athena (marked by `isWin: true`), they win the prize pool
   - The UI displays a winning message with a trophy icon

## Setup and Installation

### Prerequisites

- Node.js (v16+)
- MongoDB database
- OpenAI API key
- Base network wallet with funds

### Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=your_mongodb_connection_string
DB_NAME=athena
DB_MESSAGES_COLLECTION=messages
WALLET_POOL_ADDRESS=your_contract_address
```

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/yourusername/athena-ai.git
cd athena-ai
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The application can be deployed to Vercel or any other Next.js-compatible hosting service:

```bash
npm run build
npm run start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)

## Acknowledgements

- OpenAI for the GPT-4 API
- Base blockchain for the network infrastructure
- All contributors and testers who helped shape this project