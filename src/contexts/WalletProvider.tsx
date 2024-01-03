import * as React from "react";

import { createContext, useState, useContext, useEffect } from "react";
import {
  C,
  Lucid,
  Blockfrost,
  WalletApi,
  Cardano,
  SignedMessage,
  M
} from "lucid-cardano";


window.cardano = window.cardano || {};

export type WalletContext = {
  walletLoaded: boolean;
  currentWallet: FullWallet | null;
  getWallets: () => Cardano | null;
  connect: (wallet: string) => Promise<void>;
  getStakeAddress: () => Promise<string>;
  getChangeAddress: () => Promise<string>;
  signMessage: (message: string) => Promise<SignedMessage>;
};

export interface FullWallet extends WalletApi {
  name: string;
  icon: string;
  apiVersion: string;
}

export const Wallet = createContext<WalletContext | null>(null);

const toHex = (bytes: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) =>
  Buffer.from(bytes).toString("hex");
const fromHex = (hex: WithImplicitCoercion<string>) => Buffer.from(hex, "hex");

type WalletProviderProps = {
  children: JSX.Element;
  networkMode: "testnet" | "mainnet";
};

export const WalletProvider = ({
  children,
  networkMode,
}: WalletProviderProps) => {
  const [currentWallet, setCurrentWallet] = useState<string | null>(null);
  const [currentFullWallet, setCurrentFullWallet] = useState<FullWallet | null>(
    null
  );
  const [lucid, setLucid] = useState<Lucid | null>(null);
  const [wallets, setWallets] = useState<Cardano | null>(null);
  const [walletLoaded, setWalletLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (window && window.cardano) loadCardano();
  }, []);

  useEffect(() => {
    if (window && window.cardano) updateCurrentFullWallet(currentWallet);
  }, [currentWallet, wallets]);

  const loadCardano = async () => {
    await setupLucid();
    setupWallets();

    setWalletLoaded(true);
  };

  const setupLucid = async () => {
    const newLucid = await Lucid.new(
      new Blockfrost(
        networkMode === "testnet"
          ? "https://cardano-preprod.blockfrost.io/api/v0"
          : "https://cardano-mainnet.blockfrost.io/api/v0",
        process.env.REACT_APP_PROJECT_ID
      ),
      networkMode === "testnet" ? "Preprod" : "Mainnet"
    );

    setLucid(newLucid);
  };

  const setupWallets = () => {
    const wallets: Cardano = {};
    if (window && window.cardano) {
      for (let key of Object.keys(window.cardano)) {
        if (
          typeof window.cardano[key] === "object" &&
          window.cardano[key] !== null &&
          "name" in window.cardano[key] &&
          "icon" in window.cardano[key] &&
          "enable" in window.cardano[key] &&
          "isEnabled" in window.cardano[key] &&
          "apiVersion" in window.cardano[key]
        ) {
          wallets[key] = {
            name: window.cardano[key].name,
            icon: window.cardano[key].icon,
            apiVersion: window.cardano[key].apiVersion,
            enable: window.cardano[key].enable,
            isEnabled: window.cardano[key].isEnabled,
          };
        }
      }

      if (Object.keys(wallets).length > 0) {
        setWallets(wallets);
      }
    }
  };

  const updateCurrentFullWallet = async (wallet: string | null) => {
    const currentFullWallet = await getCurrentWallet(wallet);
    setCurrentFullWallet(currentFullWallet);
    return Promise.resolve(currentFullWallet);
  };

  const getCurrentWallet = async (wallet: string | null) => {
    if (wallet && wallets !== null && wallet in wallets) {
      const fullWallet = await wallets[wallet].enable();

      return { ...fullWallet, ...wallets[wallet] };
    } else {
      return null;
    }
  };

  const connect = async (wallet: string) => {
    setCurrentWallet(null);
    setCurrentFullWallet(null);
    
    if (walletLoaded === false) {
      return Promise.reject("Cardano extensions not loaded yet.");
    } else if (wallets === null) {
      return Promise.reject(
        "User doesn't have any wallet extensions installed."
      );
    } else if (!(wallet in wallets)) {
      return Promise.reject(`Wallet ${wallet} not installed.`);
    } else {
      setCurrentWallet(wallet);
      updateCurrentFullWallet(wallet);
    }
  };

  const getStakeAddress = async () => {
    if (!walletLoaded) {
      return Promise.reject("Wallet not loaded yet!");
    }

    if (!currentFullWallet) {
      return Promise.reject("No wallet was selected!");
    }

    lucid!.selectWallet(currentFullWallet);

    const address = await lucid!.wallet.rewardAddress();

    if (address === null) {
      return Promise.reject("Selected wallet does not have stake address");
    }

    return address;
  };

  const getChangeAddress = async () => {
    if (!walletLoaded) {
      return Promise.reject("Wallet not loaded yet!");
    }

    if (!currentFullWallet) {
      return Promise.reject("No wallet was selected!");
    }

    lucid!.selectWallet(currentFullWallet);

    const address = await lucid!.wallet.address();

    if (address === null) {
      return Promise.reject("Selected wallet does not have change address");
    }

    return address;
  };

  const signMessage = async (message: string) => {
    if (!walletLoaded) {
      return Promise.reject("Wallet not loaded yet!");
    }

    if (!currentFullWallet) {
      return Promise.reject("No wallet was selected!");
    }

    lucid!.selectWallet(currentFullWallet);

    const address = await lucid!.wallet.rewardAddress();
    if (address === null) {
      return Promise.reject("Selected wallet does not have stake address");
    }

    const signedMessage = await lucid!
      .newMessage(address, toHex(Buffer.from(message, "utf8")))
      .sign();

    return signedMessage;
  };

  return (
    <Wallet.Provider
      value={{
        walletLoaded,
        currentWallet: currentFullWallet,
        getWallets: () => wallets,
        connect,
        getStakeAddress,
        getChangeAddress,
        signMessage,
      }}
    >
      {children}
    </Wallet.Provider>
  );
};

export const useWallet = () => useContext(Wallet);
