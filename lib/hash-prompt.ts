import { sha256 } from "viem";

export function hashPrompt(prompt: string) {
  return sha256(Buffer.from(prompt, "utf-8"));
}
