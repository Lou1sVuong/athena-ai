import { createConfig } from "@wagmi/core";
import { base } from "wagmi/chains";

import { http } from "wagmi";

export const getBalanceConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http("https://base.drpc.org"),
  },
});
