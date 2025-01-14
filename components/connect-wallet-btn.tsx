import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IconChevronDown } from "@tabler/icons-react";

export default function ConnectWalletBtn() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    variant="default"
                    className="rounded-lg bg-gradient-to-r from-pink-500 to-pink-400 text-white hover:from-pink-600 hover:to-pink-500 border-2 border-pink-200 shadow-lg hover:shadow-pink-100 transition-all"
                  >
                    Connect wallet to chat
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    variant="destructive"
                    className="rounded-lg bg-gradient-to-r from-red-500 to-red-400 text-white hover:from-red-600 hover:to-red-500 border-2 border-red-200 shadow-lg hover:shadow-red-100 transition-all"
                  >
                    Wrong network
                  </Button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={openChainModal}
                    variant="default"
                    className="rounded-lg bg-gradient-to-r from-pink-500 to-pink-400 text-white hover:from-pink-600 hover:to-pink-500 border-2 border-pink-200 shadow-lg hover:shadow-pink-100 transition-all flex items-center gap-1"
                  >
                    {chain.name && chain.name === "Klaytn Baobab"
                      ? "Kairos"
                      : chain.name}
                    <IconChevronDown className="size-4" />
                  </Button>

                  <Button
                    onClick={openAccountModal}
                    variant="default"
                    className="rounded-lg bg-gradient-to-r from-pink-500 to-pink-400 text-white hover:from-pink-600 hover:to-pink-500 border-2 border-pink-200 shadow-lg hover:shadow-pink-100 transition-all flex items-center gap-2"
                  >
                    {account.ensAvatar && (
                      <img
                        src={account.ensAvatar}
                        alt=""
                        className="w-5 h-5 rounded-full border border-pink-200"
                      />
                    )}
                    {account.displayName}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
