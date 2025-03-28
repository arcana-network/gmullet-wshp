"use client";

import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Copy, ChevronDown, LogOut } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { formatEther } from "viem";
import { useBalance } from "@arcana/ca-wagmi";

const chainId = 10;

export default function WalletConnect() {
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { status, address } = useAccount();
  const balance = useBalance({ symbol: "ETH" });

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  if (status === "reconnecting") {
    return (
      <Button
        disabled={true}
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        Reconnecting
      </Button>
    );
  }

  if (status === "disconnected" || address === undefined) {
    return (
      <Button
        onClick={() => connect({ connector: injected(), chainId })}
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm text-gray-600">
        {formatEther(balance.data?.value ?? 0n)} ETH
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => disconnect()}>
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
