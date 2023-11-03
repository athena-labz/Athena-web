import { useState, useEffect, ReactNode } from "react";

import { toast } from "react-toastify";

import { WalletSelector } from "./WalletSelector";
import { FullWallet, useWallet } from "../contexts/WalletProvider";

type WalletHandlerProps = {
  whitelistedWallets: Array<string>;
  onConnect: () => void;
  className: string;
  children: ReactNode;
};

export const WalletHandler = ({
  whitelistedWallets,
  onConnect,
  className,
  children,
}: WalletHandlerProps) => {
  const [walletSelectorShow, setWalletSelectorShow] = useState(false);

  const { connect } = useWallet()!;

  return (
    <div>
      <button onClick={() => setWalletSelectorShow(true)} className={className}>
        {children}
      </button>

      <WalletSelector
        show={walletSelectorShow}
        onHide={() => setWalletSelectorShow(false)}
        whitelistedWallets={whitelistedWallets}
        onConnectWallet={(wallet) => {
          setWalletSelectorShow(false); // Close modal

          connect(wallet)
            .then(() => {
              if (wallet === null) {
                console.error("Got null wallet from connection");
                toast.error("Something went wrong while connecting to wallet!");
              } else {
                toast.success("Successfully connected wallet!");
                onConnect()
              }
            })
            .catch((error: any) => {
              console.error("Oops!");
              if (error === undefined || error === null)
                toast.error("User denied access to wallet");
              else if (
                typeof error === "object" &&
                !Array.isArray(error) &&
                error !== null &&
                "info" in error
              )
                toast.error(error.info);
              else toast.error(error);
              console.error(error);
            });
        }}
      />
    </div>
  );
};
