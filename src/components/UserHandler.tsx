import { useState } from "react";

import { useUser } from "../contexts/UserProvider";
import { Avatar } from "./User";

import { abbreviate } from "../utils/stringHelpers";
import { useNavigate } from "react-router-dom";
import { SignInHandler } from "./SignInHandler";

const whitelistedWallets = ["eternl", "nami"];

type SelectorProps = {
  email: string;
  stakeAddress: string;
};

const Selector = ({ email, stakeAddress }: SelectorProps) => {
  const [optionSelected, setOptionSelected] = useState<
    "wallet" | "email" | "username"
  >("email");
  const [stakeAddressAbbreviated, setStakeAddressAbbreviated] = useState(true);

  return (
    <div className="hidden lg:flex lg:flex-row items-center gap-2">
      <div className="flex flex-row items-center gap-1">
        <div
          onClick={() => setOptionSelected("email")}
          className={`${
            optionSelected === "email" ? "bg-slate-500" : ""
          } rounded-full border-slate-500 border p-1 hover:cursor-pointer`}
        >
          <img
            className="h-4"
            src={`/assets/mail_profile${
              optionSelected === "email" ? "_selected" : ""
            }.svg`}
          />
        </div>
        <div
          onClick={() => setOptionSelected("wallet")}
          className={`${
            optionSelected === "wallet" ? "bg-slate-500" : ""
          } rounded-full border-slate-500 border p-1 hover:cursor-pointer`}
        >
          <img
            className="h-4"
            src={`/assets/wallet_profile${
              optionSelected === "wallet" ? "_selected" : ""
            }.svg`}
          />
        </div>
      </div>
      {optionSelected === "email" ? (
        <span className="text-slate-500">{email}</span>
      ) : (
        <span
          onClick={() => setStakeAddressAbbreviated(!stakeAddressAbbreviated)}
          className="text-slate-500 hover:cursor-pointer"
        >
          {stakeAddressAbbreviated
            ? abbreviate(stakeAddress, 13, 3)
            : stakeAddress}
        </span>
      )}
    </div>
  );
};

type UserHandlerProps = {};

export const UserHandler = ({}: UserHandlerProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useUser()!;

  if (user === null) {
    return (
      <div className="flex flex-row gap-4 items-center">
        <SignInHandler
          whitelistedWallets={whitelistedWallets}
          onSignIn={() => {}}
          className="py-2 px-8 rounded-full bg-white text-dark-blue text-normal md:text-lg font-bold"
        >
          Sign In
        </SignInHandler>
        <button
          onClick={() => navigate("/signup")}
          className="py-2 px-8 rounded-full bg-dark-blue text-normal text-white md:text-lg font-bold"
        >
          Sign Up
        </button>
      </div>
    );
  } else {
    return (
      <div className="flex flex-row gap-4 justify-between items-center bg-white p-2 px-4 rounded-lg">
        <div className="flex flex-row justify-between gap-2">
          <Avatar email={user.email} className="h-12 rounded-full" />
          <Selector email={user.email} stakeAddress={user.stakeAddress} />
        </div>
        <img
          className="h-8 hover:cursor-pointer"
          src={`/assets/logout.svg`}
          onClick={() => signOut()}
        />
      </div>
    );
  }
};
