import * as React from "react";

import { createContext, useState, useContext, useEffect } from "react";

import { useBackEnd } from "./BackEndProvider";
import { FullWallet, useWallet } from "./WalletProvider";

import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

type UserContext = {
  isLoaded: boolean;
  isUserSignedIn: boolean;
  user: UserData | null;
  signIn: () => Promise<void>;
  navigateAfterSignIn: (route: string) => Promise<void>;
  signUp: (
    firstName: string,
    lastName: string,
    username: string,
    email: string
  ) => Promise<void>;
  registerInOrganization: (
    organizationId: string,
    role: string
  ) => Promise<void>;
  logOut: () => void;
};

type UserProviderProps = {
  children: React.ReactNode;
};

export const User = createContext<UserContext | null>(null);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();
  const backEnd = useBackEnd()!;
  const wallet = useWallet()!;

  useEffect(() => {
    retrieveUser();
  }, []);

  const retrieveUser = () => {
    const user = localStorage.getItem("@user");

    if (user !== null) {
      updateUser(JSON.parse(user) as UserData);
    }

    setIsLoaded(true);
  };

  const updateUser = (user: UserData) => {
    localStorage.setItem("@user", JSON.stringify(user));

    setUser(user);
  };

  const logOut = () => {
    localStorage.removeItem("@user");
    setUser(null);
  };

  const signIn = async () => {
    const stakeAddress = await wallet.getStakeAddress();
    const signedMessage = await wallet.signMessage(
      `Signing in at Athena at ${Date.now()} with code ${uuidv4()}`
    );

    try {
      const user = await backEnd.signIn(
        stakeAddress,
        signedMessage.key,
        signedMessage.signature
      );

      updateUser(user);

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error as string);
    }
  };

  const navigateAfterSignIn = async (route: string) => {
    signIn()
      .then(() => {
        navigate(route);
      })
      .catch((error) => {
        // Replace by toastify
        console.error(error);
      });
  };

  const signUp = async (
    username: string,
    email: string,
    firstName: string,
    lastName: string
  ) => {
    const stakeAddress = await wallet.getStakeAddress();
    const signedMessage = await wallet.signMessage(
      `Signing up at Athena at ${Date.now()} with code ${uuidv4()}`
    );

    try {
      const user = await backEnd.signUp(
        stakeAddress,
        signedMessage.key,
        signedMessage.signature,
        username,
        email,
        firstName,
        lastName
      );

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error as string);
    }
  };

  return (
    <User.Provider
      value={{
        isLoaded,
        user,
        isUserSignedIn: user !== null,
        signIn,
        navigateAfterSignIn,
        signUp,
        logOut,
        registerInOrganization: backEnd.registerInOrganization,
      }}
    >
      {children}
    </User.Provider>
  );
};

export const useUser = () => useContext(User);
