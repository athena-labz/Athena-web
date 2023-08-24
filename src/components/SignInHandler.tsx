import { useState, useEffect, ReactNode } from "react";

import { ToastContainer, toast } from "react-toastify";

import { WalletSelector } from "./WalletSelector";
import { Modal } from "./Modal";
import { useWallet } from "../contexts/WalletProvider";
import { useUser } from "../contexts/UserProvider";

type SignInHandlerProps = {
  whitelistedWallets: Array<string>;
  onSignIn: () => void;
  className: string;
};

export const SignInHandler = ({
  whitelistedWallets,
  onSignIn,
  className,
}: SignInHandlerProps) => {
  const [walletSelectorShow, setWalletSelectorShow] = useState(false);

  const { connect } = useWallet()!;
  const { signIn } = useUser()!;

  return (
    <div>
      <button onClick={() => setWalletSelectorShow(true)} className={className}>
        Sign In
      </button>

      <WalletSelector
        show={walletSelectorShow}
        onHide={() => setWalletSelectorShow(false)}
        whitelistedWallets={whitelistedWallets}
        onConnectWallet={(wallet) => {
          setWalletSelectorShow(false); // Close modal

          connect(wallet)
            .then(() => {
              signIn()
                .then(() => {
                  onSignIn();
                })
                .catch((error) => {
                  toast.error(error);
                });
            })
            .catch((error: any) => {
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
