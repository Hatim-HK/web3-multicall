# Web3 Multicall NestJS Project

This project demonstrates how to batch on-chain ERC‑20 balance calls using a Multicall smart contract in a NestJS application.

## Features
- **RPC Batching with Multicall**: Aggregate multiple `balanceOf` calls into a single eth_call to reduce latency and rate-limit errors.
- **Swagger API**: Interactive API documentation available via Swagger UI.
- **Environment Configuration**: Load RPC endpoint from `.env`.

## Project Structure
```
nestjs-multicall-project/
├── .env                   # Environment variables
├── README.md              # Project documentation
├── package.json           # Dependencies & scripts
├── tsconfig.json          # TypeScript configuration
└── src
    ├── main.ts            # Bootstrap & Swagger setup
    ├── app.module.ts      # Root module
    └── onchain
        ├── onchain.module.ts     # Onchain Nest module
        ├── onchain.service.ts    # Multicall batching service
        └── onchain.controller.ts # REST controller for balance endpoint
```

## Setup

1. **Clone** this repository:
   ```bash
   git clone <repo-url>
   cd nestjs-multicall-project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or using yarn:
   yarn install
   ```

3. **Configure environment**:
   - Create a `.env` file at project root:
     ```text
     RPC_URL=https://your.rpc.endpoint
     ```

4. **Run in development**:
   ```bash
   npm run start:dev
   # or:
   yarn start:dev
   ```

5. **Access Swagger UI**:
   Open your browser to [http://localhost:3000/api](http://localhost:3000/api) to view and test the API.

## Usage

- **Endpoint**: `GET /onchain/balances`
  - **Query Parameters**:
    - `wallet` (string, required): Wallet address to query.
    - `tokens` (string, required): Comma-separated list of ERC‑20 token addresses.

- **Example with provided tokens**:
  ```bash
  curl -G http://localhost:3000/onchain/balances \
    --data-urlencode "wallet=0xYourWalletAddress&" \
    --data-urlencode "tokens=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48%2C0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  ```bash
  curl -X 'GET' \
  'http://localhost:3000/onchain/balances?wallet=0xYourWalletAddress&&tokens=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48%2C0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' \
  -H 'accept: */*'
  ```
  **Expected Response**:
  ```json
  {
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": "<balance_of_USDC>",
    "0xC02aaA39b223FE8D0A0e5C4F27eaD9083C756Cc2": "<balance_of_WETH>"
  }
  ```

## Notes
- Make sure your RPC provider supports `eth_call` to the Multicall contract address.
- Update the Multicall contract address in `onchain.service.ts` if needed.

---

Happy batching! Feel free to customize modules, add new endpoints, or integrate additional Multicall methods as needed.
