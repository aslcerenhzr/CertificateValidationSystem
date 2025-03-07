# Project Setup Guide

Follow the steps below to set up and run the project. You will need 4 terminals for this process.

## 1. Terminal (Frontend)

Navigate to the `Frontend` directory and run the following commands:

```bash
cd Frontend
npm install
npm run dev
```

## 2. Terminal (Backend)

Navigate to the `Backend` directory and run the following commands:

```bash
cd Backend
npx tsc
npm run dev
```

## 3. Terminal (Blockchain - Part 1)

Navigate to the `Blockchain` directory and run the following commands:

```bash
cd Blockchain
npm install
npx hardhat compile
npx hardhat node
```

## 4. Terminal (Blockchain - Part 2)

In a separate terminal, still in the `Blockchain` directory, deploy the smart contract:

```bash
cd Blockchain
npx hardhat run scripts/deploy.ts --network localhost
```

## Notes

- Ensure you have all necessary dependencies installed for each terminal.
- Make sure `Hardhat` is installed globally or locally in your project.
- The `localhost` network must be running (from Terminal 3) before deploying the smart contracts in Terminal 4.
- If any issues arise, check the logs in the respective terminal for debugging.
