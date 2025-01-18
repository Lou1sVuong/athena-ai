import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import BUYIN_ABI from "@/abi/buy-in.json";
import { toast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import {
  CREATOR_ADDRESS,
  MULTISIG_WALLET_ADDRESS,
  SC_ADDRESS,
} from "@/constants/address";

export function useBuyIn() {
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const valueInWei = ethers.parseEther("0.001");

  const feeWallet = CREATOR_ADDRESS;
  const multisigWallet = MULTISIG_WALLET_ADDRESS;

  async function BuyIn({
    hashedPrompt,
    callData,
    routerAddress,
  }: {
    hashedPrompt: string;
    callData: string;
    routerAddress: string;
  }) {
    try {
      writeContract({
        address: SC_ADDRESS,
        abi: BUYIN_ABI,
        functionName: "buyIn",
        args: [
          hashedPrompt,
          routerAddress,
          callData,
          feeWallet,
          multisigWallet,
        ],
        value: valueInWei,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "An error occurred",
      });
    }
  }

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    BuyIn,
    isPending,
    error,
    hash,
    isLoading,
    isSuccess,
  };
}
