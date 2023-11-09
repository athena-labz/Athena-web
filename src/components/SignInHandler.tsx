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
  children: ReactNode;
};

export const SignInHandler = ({
  whitelistedWallets,
  onSignIn,
  className,
  children,
}: SignInHandlerProps) => {
  const [walletSelectorShow, setWalletSelectorShow] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const { connect, currentWallet } = useWallet()!;
  const { signIn } = useUser()!;

  useEffect(() => {
    if (currentWallet !== null && walletConnected) {
      setWalletConnected(false);

      signIn().then(() => {
        onSignIn();
      });
    }
  }, [currentWallet, walletConnected]);

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
          setWalletConnected(false);
          setWalletSelectorShow(false); // Close modal

          connect(wallet)
            .then(() => {
              setWalletConnected(true);
            })
            .catch((error: any) => {
              setWalletConnected(false);
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
