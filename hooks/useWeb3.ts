import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

const FUJI_CHAIN_ID = "0xa86a"; // 43113 in hex
const FUJI_RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc";
const FUJI_EXPLORER_URL = "https://testnet.snowtrace.io/";
const TREASURY_ADDRESS = "0x5462Dbc41F0A448B693dEE3dF620b7842eD42B02"; // Mock Treasury Address

export const useWeb3 = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if wallet is connected on mount
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const ethereum = (window as any).ethereum;

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          updateBalance(accounts[0]);
        } else {
          setAccount(null);
          setBalance(null);
          setIsConnected(false);
        }
      };

      const handleChainChanged = (hexChainId: string) => {
        setChainId(hexChainId);
        if (account) updateBalance(account);
      };

      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);

      // Check current connection status
      ethereum.request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            updateBalance(accounts[0]);
          }
        })
        .catch((err: any) => console.error("Error checking eth_accounts", err));

      ethereum.request({ method: "eth_chainId" })
        .then((hexChainId: string) => {
          setChainId(hexChainId);
        })
        .catch((err: any) => console.error("Error checking eth_chainId", err));

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, [account]);

  // Update balance helper
  const updateBalance = async (address: string) => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const bal = await provider.getBalance(address);
        setBalance(ethers.utils.formatEther(bal));
      } catch (err: any) {
        console.error("Error updating balance:", err);
      }
    }
  };

  // Switch to Fuji Network
  const switchToFujiNetwork = async (): Promise<boolean> => {
    if (typeof window === "undefined" || !(window as any).ethereum) return false;
    const ethereum = (window as any).ethereum;

    try {
      // Try switching
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: FUJI_CHAIN_ID }],
      });
      return true;
    } catch (switchError: any) {
      // Code 4902 means the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: FUJI_CHAIN_ID,
                chainName: "Avalanche Fuji Testnet",
                nativeCurrency: {
                  name: "AVAX",
                  symbol: "AVAX",
                  decimals: 18,
                },
                rpcUrls: [FUJI_RPC_URL],
                blockExplorerUrls: [FUJI_EXPLORER_URL],
              },
            ],
          });
          return true;
        } catch (addError: any) {
          setError("Failed to add Avalanche Fuji network to MetaMask.");
          return false;
        }
      }
      setError("Failed to switch network. Please switch to Avalanche Fuji Testnet in MetaMask.");
      return false;
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      setError("MetaMask is not installed. Please install MetaMask to use this application.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const ethereum = (window as any).ethereum;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        await updateBalance(accounts[0]);

        // Auto-switch to Fuji
        const currentChain = await ethereum.request({ method: "eth_chainId" });
        if (currentChain !== FUJI_CHAIN_ID) {
          await switchToFujiNetwork();
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while connecting wallet.");
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
    setIsConnected(false);
    setError(null);
  };

  // Send AVAX Payment
  const sendAVAXPayment = async (amountInAVAX: number): Promise<string> => {
    if (!isConnected || !account) {
      throw new Error("Wallet not connected.");
    }

    if (typeof window === "undefined" || !(window as any).ethereum) {
      throw new Error("MetaMask not found.");
    }

    const ethereum = (window as any).ethereum;
    
    // Switch chain if not on Fuji
    const currentChain = await ethereum.request({ method: "eth_chainId" });
    if (currentChain !== FUJI_CHAIN_ID) {
      const switched = await switchToFujiNetwork();
      if (!switched) throw new Error("Please switch your network to Avalanche Fuji Testnet.");
    }

    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      
      const parsedAmount = ethers.utils.parseEther(amountInAVAX.toFixed(6));

      // In hackathon demo, if the user doesn't have balance, they can still trigger a transaction or we send it to their own address (which works for testing since they pay gas only).
      // Or they can send it to their own address as self-transaction to verify Web3 functionality without losing tokens to an external wallet.
      // We will send to TREASURY_ADDRESS by default.
      const tx = await signer.sendTransaction({
        to: TREASURY_ADDRESS,
        value: parsedAmount,
      });

      return tx.hash;
    } catch (err: any) {
      console.error("Payment error:", err);
      throw new Error(err.message || "Payment transaction failed.");
    }
  };

  return {
    account,
    balance,
    chainId,
    isConnected,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    sendAVAXPayment,
    switchToFujiNetwork,
    updateBalance: () => account && updateBalance(account),
  };
};
