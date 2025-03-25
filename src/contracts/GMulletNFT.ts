export const GMULLET_CONTRACT_ADDRESS =
  "0x938190c0acb55A8df16f30A146f5165f78032B21";

export const GMULLET_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_receiver", type: "address" },
      { internalType: "uint256", name: "_quantity", type: "uint256" },
      { internalType: "address", name: "_currency", type: "address" },
      { internalType: "uint256", name: "_pricePerToken", type: "uint256" },
      {
        components: [
          { internalType: "bytes32[]", name: "proof", type: "bytes32[]" },
          {
            internalType: "uint256",
            name: "quantityLimitPerWallet",
            type: "uint256",
          },
          { internalType: "uint256", name: "pricePerToken", type: "uint256" },
          { internalType: "address", name: "currency", type: "address" },
        ],
        internalType: "struct IDrop.AllowlistProof",
        name: "_allowlistProof",
        type: "tuple",
      },
      { internalType: "bytes", name: "_data", type: "bytes" },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;
