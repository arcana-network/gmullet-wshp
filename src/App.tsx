import "./App.css";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import React, { useEffect, useState } from "react";
import WalletConnect from "./components/wallet-connect";
import { NFT_PRICE } from "./lib/utils";
import { Loader2 } from "lucide-react";
import { GMULLET_ABI, GMULLET_CONTRACT_ADDRESS } from "./contracts/GMulletNFT";
import { toast } from "sonner";
import {
  useAccount,
  useBalance,
  useClient,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { formatEther, parseEther } from "viem";
import { waitForTransactionReceipt } from "viem/actions";

const App: React.FC = () => {
  const { status, address, chainId } = useAccount();
  const balance = useBalance({ address });
  const [isMinting, setIsMinting] = useState(false);
  const client = useClient();
  const isConnecting = ["connecting", "reconnecting"].includes(status);
  const isLoading = isConnecting || balance.isFetching || isMinting;
  const { switchChain } = useSwitchChain();
  useEffect(() => {
    if (chainId !== 10) {
      switchChain({ chainId: 10 });
    }
  }, []);
  console.log({ ineg: balance });
  const hasInsufficientBalance =
    !isLoading &&
    address &&
    parseFloat(formatEther(balance.data?.value ?? 0n)) < NFT_PRICE;

  const isMintDisabled = !address || hasInsufficientBalance || isLoading;
  console.log({ isMinting, isLoading, isMintDisabled });
  const { writeContractAsync } = useWriteContract();
  const handleMint = async () => {
    if (!address) return;
    try {
      setIsMinting(true);
      const hash = await writeContractAsync({
        address: GMULLET_CONTRACT_ADDRESS,
        abi: GMULLET_ABI,
        functionName: "claim",
        value: parseEther(NFT_PRICE.toString()),
        account: address as `0x${string}`,
        args: [
          address,
          1n,
          "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          50000000000000n,
          {
            proof: [],
            quantityLimitPerWallet: 0n,
            pricePerToken:
              115792089237316195423570985008687907853269984665640564039457584007913129639935n,
            currency: "0x0000000000000000000000000000000000000000",
          },
          "0x",
        ],
      });
      toast.loading("Minting your GMullet NFT...", {
        id: hash,
      });
      if (client) {
        // Wait for transaction to be mined
        const receipt = await waitForTransactionReceipt(client, {
          hash,
        });

        // Show success toast
        toast.success("Successfully minted your GMullet NFT!", {
          id: hash,
        });

        // Add link to transaction
        toast.message("View on Optimism Scan", {
          action: {
            label: "View",
            onClick: () =>
              window.open(
                `https://optimistic.etherscan.io/tx/${receipt.transactionHash}`,
                "_blank"
              ),
          },
        });
      }
    } catch (error) {
      console.error("Minting error:", { error });
      if (error instanceof Error) {
        toast.error(
          // @ts-ignore
          "shortMessage" in error ? error.shortMessage : error.message
        );
      } else {
        toast.error("Failed to mint NFT");
      }
    } finally {
      setIsMinting(false);
    }
  };

  const getStatusMessage = () => {
    if (isLoading) {
      return (
        <div className="mt-4 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{isMinting ? "Minting..." : "Checking balance..."}</span>
        </div>
      );
    }

    if (!address) {
      return (
        <div className="mt-4 text-center text-gray-500 text-sm">
          Connect wallet to mint
        </div>
      );
    }

    if (hasInsufficientBalance) {
      return (
        <div className="mt-4 text-center text-red-500 text-sm">
          Insufficient Balance
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-800">GMullet</span>
          </div>

          <WalletConnect />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="aspect-square relative mb-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mullet%20Guy%202-01-jUnBDjE5qHyYpTyl8H6MMcVA9WjDbQ.png"
                alt="NFT Preview"
              />
            </div>

            <div className="flex items-end gap-4">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Price
                </div>
                <Input
                  type="text"
                  value={`${NFT_PRICE.toFixed(5)} ETH`}
                  className="bg-gray-50"
                  readOnly
                />
              </div>
              <Button
                size="lg"
                variant="secondary"
                className="bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isMintDisabled}
                onClick={handleMint}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{isMinting ? "Minting..." : "Loading..."}</span>
                  </div>
                ) : (
                  "Mint"
                )}
              </Button>
            </div>

            {getStatusMessage()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
