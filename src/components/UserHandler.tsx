import { useState } from "react";

import { useUser } from "../contexts/UserProvider";
import { Avatar } from "./User";

import { abbreviate } from "../utils/stringHelpers";
import { useNavigate } from "react-router-dom";

type SelectorProps = {
  username: string;
  email: string;
  stakeAddress: string;
};

const Selector = ({ username, email, stakeAddress }: SelectorProps) => {
  const [optionSelected, setOptionSelected] = useState<
    "wallet" | "email" | "username"
  >("email");
  const [stakeAddressAbbreviated, setStakeAddressAbbreviated] = useState(true);

  return (
    <div className="flex flex-row items-center gap-2">
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
          onClick={() => setOptionSelected("username")}
          className={`${
            optionSelected === "username" ? "bg-slate-500" : ""
          } rounded-full border-slate-500 border p-1 hover:cursor-pointer`}
        >
          <img
            className="h-4"
            src={`/assets/person_profile${
              optionSelected === "username" ? "_selected" : ""
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
      ) : optionSelected === "username" ? (
        <span className="text-slate-500">{username}</span>
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
  const user = useUser()!;

  if (!user.isUserSignedIn) {
    return (
      <div className="flex flex-row gap-4 items-center">
        <button
          onClick={() => navigate("/signin")}
          className="py-2 px-8 rounded-full bg-white text-dark-blue text-normal md:text-lg font-bold"
        >
          Sign In
        </button>
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
      <div className="flex flex-row gap-4 justify-between items-center w-80 bg-white p-2 px-4 rounded-lg">
        <Selector
          username={user.user!.username}
          email={user.user!.email}
          stakeAddress={user.user!.stakeAddress}
        />
        <Avatar email={user.user!.email} className="h-12 rounded-full" />
      </div>
    );
  }
};
