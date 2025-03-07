// src/hooks/useWeb3.ts
import { useEffect, useState } from "react";
import { BrowserProvider, JsonRpcProvider, Wallet } from "ethers";
import { Web3Service } from "../services/Web3Service";

export const useWeb3 = () => {
  const [web3Service, setWeb3Service] = useState<Web3Service | null>(null);
  const [account, setAccount] = useState<string>("");

  // Connect via MetaMask
  const connectMetaMask = async () => {
    if ((window as any).ethereum) {
      try {
        const provider = new BrowserProvider((window as any).ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await (await signer).address;
        setAccount(address);
        const service = new Web3Service(provider, await signer);
        setWeb3Service(service);

        // Optional: Listen for account changes
        (window as any).ethereum.on("accountsChanged", async (accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            const newService = new Web3Service(provider, await provider.getSigner());
            setWeb3Service(newService);
          } else {
            setAccount("");
            setWeb3Service(null);
          }
        });
      } catch (error) {
        console.error("MetaMask connection failed:", error);
        alert("MetaMask connection failed.");
      }
    } else {
      alert("MetaMask is not installed!");
    }
  };

  // Connect via Private Key
  const connectPrivateKey = async (privateKey: string) => {
    try {
      const provider = new JsonRpcProvider('http://127.0.0.1:8545');
      const wallet = new Wallet(privateKey, provider);
      const address = wallet.address;
      setAccount(address);
      const service = new Web3Service(provider, wallet);
      setWeb3Service(service);
    } catch (error) {
      console.error("Private Key connection failed:", error);
      alert("Invalid Private Key!");
    }
  };

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      if ((window as any).ethereum && (window as any).ethereum.removeListener) {
        (window as any).ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);

  return { web3Service, account, connectMetaMask, connectPrivateKey };
};
