import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import BUYIN_ABI from "@/abi/buy-in.json";
import { toast } from "@/hooks/use-toast";
import { ethers } from "ethers";

const contractAddress = "0x8e305cE49E7F37e287B4A958588CB2CBf1c262c2";

export function useBuyIn() {
  // Set up the contract write function
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const valueInWei = ethers.parseEther("0.01");

  async function BuyIn(hashedPrompt: string) {
    try {
      writeContract({
        address: contractAddress,
        abi: BUYIN_ABI,
        functionName: "buyIn",
        args: [hashedPrompt],
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

  // Call useWaitForTransactionReceipt at the top level of the hook

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return { BuyIn, isPending, error, hash, isConfirming, isConfirmed };
}
