This project is a blockchain-based certificate management system that ensures secure, decentralized issuance, verification, and storage of digital certificates using blockchain and IPFS technologies. The system involves three key personas: Certificate Owner (student), Certificate Issuer (educational institution), and Certificate Validator (employer). The frontend provides an intuitive interface for login, certificate upload, viewing, signing, and verification. The backend manages user roles, authentication, certificate storage, and data encryption. A smart contract facilitates secure certificate creation, signing, and validation, while IPFS ensures efficient and tamper-proof storage and retrieval of certificate files. This system enhances transparency, security, and accessibility in digital credential management.

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
