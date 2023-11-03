import * as React from "react";

import { createContext, useState, useContext, useEffect } from "react";

import { useBackEnd } from "./BackEndProvider";
import { FullWallet, useWallet } from "./WalletProvider";

import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { jwtDecode } from "jwt-decode";

export type UserContext = {
  isLoaded: boolean;
  isUserSignedIn: boolean;
  user: UserData | null;
  signIn: () => Promise<void>;
  signUp: (
    userType: "student" | "teacher" | "organizer",
    email: string
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

  const logOut = () => {
    localStorage.removeItem("@user");
    setUser(null);
  };

  const signIn = async () => {
    const stakeAddress = await wallet.getStakeAddress();
    const signedMessage = await wallet.signMessage(
      `=====ONLY SIGN THIS IF YOU ARE IN athenateams.com=====${Math.floor(
        Date.now() / 1000
      )}`
    );

    try {
      const token = await backEnd.signIn(
        stakeAddress,
        signedMessage.key + "H1+DFJCghAmokzYG" + signedMessage.signature
      );

      const user = await backEnd.getUserMe(token);

      saveUser(user);
      toast.success("Signed in successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Login failed! Make sure you have a valid account.");
      Promise.reject(error);
    }
  };

  const signUp = async (
    userType: "student" | "teacher" | "organizer",
    email: string
  ) => {
    const stakeAddress = await wallet.getStakeAddress();

    try {
      const signedMessage = await wallet.signMessage(
        `=====ONLY SIGN THIS IF YOU ARE IN athenateams.com=====${Math.floor(
          Date.now() / 1000
        )}`
      );

      try {
        await backEnd.signUp(
          userType,
          email,
          stakeAddress,
          signedMessage.key + "H1+DFJCghAmokzYG" + signedMessage.signature
        );
      } catch (error) {
        console.error(error);
        toast.error(
          "Register failed! Make sure you have the right information."
        );
      }

      try {
        const token = await backEnd.signIn(
          stakeAddress,
          signedMessage.key + "H1+DFJCghAmokzYG" + signedMessage.signature
        );
        console.log(token);
      } catch (error) {
        console.error(error);
        toast.error("Server error while trying to sign in");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while signing the message");
    }
  };

  return (
    <User.Provider
      value={{
        isLoaded,
        user,
        isUserSignedIn: user !== null,
        signIn,
        signUp,
        logOut,
      }}
    >
      {children}
    </User.Provider>
  );
};

export const useUser = () => useContext(User);
