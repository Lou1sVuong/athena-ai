import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address: string): string {
  if (!address || address.length < 6) {
    throw new Error("Invalid address");
  }
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
}
