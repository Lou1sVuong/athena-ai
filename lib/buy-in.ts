import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import BUYIN_ABI from "@/abi/buy-in.json";
import { toast } from "@/hooks/use-toast";

const contractAddress = "0x7a5E899E31348cd6bb9d31A0667c1C91bbd39D10";

export function useBuyIn() {
  // Set up the contract write function
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  async function BuyIn(hashedPrompt: string) {
    try {
      writeContract({
        address: contractAddress,
        abi: BUYIN_ABI,
        functionName: "buyIn",
        args: [hashedPrompt],
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
