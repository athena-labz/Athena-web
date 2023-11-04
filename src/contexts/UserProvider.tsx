import * as React from "react";

import { createContext, useState, useContext, useEffect } from "react";

import { useBackEnd } from "./BackEndProvider";
import { FullWallet, useWallet } from "./WalletProvider";

import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { jwtDecode } from "jwt-decode";
import { SignedMessage } from "lucid-cardano";

export type UserContext = {
  isLoaded: boolean;
  isUserSignedIn: boolean;
  user: UserData | null;
  signIn: () => Promise<boolean>;
  signUp: (
    userType: "student" | "teacher" | "organizer",
    email: string
  ) => Promise<boolean>;
  signOut: () => void;
};

type UserProviderProps = {
  children: React.ReactNode;
};

export const User = createContext<UserContext | null>(null);

type StoredSignature = {
  stakeAddress: string;
  signature: SignedMessage;
  expire: number;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const [signature, setSignature] = useState<StoredSignature | null>(null);

  const backEnd = useBackEnd()!;
  const wallet = useWallet()!;

  useEffect(() => {
    retrieveUser();
  }, []);

  useEffect(() => {
    if (user !== null) setIsSignedIn(true);
    else setIsSignedIn(false);
  }, [user]);

  const getSignature = async () => {
    const currentDate = Math.floor(Date.now() / 1000);
    const stakeAddress = await wallet.getStakeAddress();

    if (signature && signature.stakeAddress === stakeAddress) {
      if (currentDate > signature.expire) {
        setSignature(null);
      } else {
        return signature;
      }
    }

    const signedMessage = await wallet.signMessage(
      `=====ONLY SIGN THIS IF YOU ARE IN athenateams.com=====${currentDate}`
    );

    const sig = {
      stakeAddress: stakeAddress,
      signature: signedMessage,
      expire: currentDate + 30 * 60 * 60,
    };

    setSignature(sig);
    return sig;
  };

  const retrieveUser = () => {
    const currentUser = localStorage.getItem("@user");

    if (currentUser !== null) {
      const parsedUser: UserData = JSON.parse(currentUser);
      console.log("token", jwtDecode(parsedUser.token));
      setUser(parsedUser);
    }

    setIsLoaded(true);
  };

  const saveUser = (user: UserData) => {
    console.log("token", jwtDecode(user.token));
    localStorage.setItem("@user", JSON.stringify(user));
    setUser(user);
  };

  const signOut = () => {
    localStorage.removeItem("@user");
    setUser(null);
    setSignature(null);
  };

  const signIn = async () => {
    const signature = await getSignature();

    try {
      const token = await backEnd.signIn(
        signature.stakeAddress,
        signature.signature.key +
          "H1+DFJCghAmokzYG" +
          signature.signature.signature
      );

      const user = await backEnd.getUserInformation(token);

      saveUser(user);
      toast.success("Signed in successfully!");

      return true;
    } catch (error) {
      console.error(error);
      toast.error("Login failed! Make sure you have a valid account.");

      return false;
    }
  };

  const signUp = async (
    userType: "student" | "teacher" | "organizer",
    email: string
  ) => {
    const signature = await getSignature();

    try {
      try {
        await backEnd.signUp(
          userType,
          email,
          signature.stakeAddress,
          signature.signature.key +
            "H1+DFJCghAmokzYG" +
            signature.signature.signature
        );

        try {
          const token = await backEnd.signIn(
            signature.stakeAddress,
            signature.signature.key +
              "H1+DFJCghAmokzYG" +
              signature.signature.signature
          );

          saveUser({
            userType: userType,
            email: email,
            stakeAddress: signature.stakeAddress,
            token: token,
          });

          return true;
        } catch (error) {
          console.error(error);
          toast.error("Server error while trying to sign in");
        }
      } catch (error) {
        console.error(error);
        toast.error(
          "Register failed! Make sure you have the right information."
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while signing the message");
    }

    return false;
  };

  return (
    <User.Provider
      value={{
        isLoaded,
        user,
        isUserSignedIn: isSignedIn,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </User.Provider>
  );
};

export const useUser = () => useContext(User);
