import React, { useEffect, useState } from "react";

import { WalletHandler } from "../components/WalletHandler";

import { useNavigate } from "react-router-dom";

import { useWallet, WalletContext } from "../contexts/WalletProvider";
import { useUser, UserContext } from "../contexts/UserProvider";

import Header from "../components/Header";

const whitelistedWallets = ["eternl", "nami"];

type SignUpFormProps = {
  wallet: WalletContext;
  user: UserContext;
};

const SignUpForm = ({ wallet, user }: SignUpFormProps) => {
  const [userType, setUserType] = useState<"student" | "teacher" | "organizer">(
    "student"
  );
  const [email, setEmail] = useState<string>("");

  const [waitForSignUp, setWaitForSignUp] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (waitForSignUp && wallet.currentWallet != null) {
      setWaitForSignUp(false);
      signUp();
    }
  }, [waitForSignUp, wallet.currentWallet]);

  const signUp = async () => {
    await user.signUp(userType, email);
  };

  return (
    <div className="text-lg md:text-xl font-semibold w-full flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span>Select your role</span>
          <select
            name="user_types"
            value={userType}
            onChange={(event) => setUserType(event.target.value as any)}
            className="p-4 bg-opposite-pale border-2 text-slate-600 rounded-lg"
          >
            <option value="student">Student</option>
            <option value="organizer">Organizer</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <span>What is your email?</span>
          <input
            className="p-4 bg-opposite-pale border-400 border-2 text-black rounded-lg"
            placeholder="alice@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <button
            className="bg-white border-dark-blue border-2 py-4 w-full md:w-72 rounded-lg text-dark-blue text-lg md:text-2xl font-bold"
            onClick={() => navigate("/")}
          >
            Back to home
          </button>
          <WalletHandler
            whitelistedWallets={whitelistedWallets}
            onConnect={() => setWaitForSignUp(true)}
            className="bg-dark-blue py-4 w-full md:w-72 rounded-lg text-white text-lg md:text-2xl font-bold"
          >
            Sign Up
          </WalletHandler>
        </div>
        <span className="text-base text-slate-400 hover:cursor-pointer hover:opacity-75">
          Already have an account?
        </span>
      </div>
    </div>
  );
};

const SignUp = () => {
  const wallet = useWallet()!;
  const user = useUser()!;

  return (
    <div className="">
      <Header disableUserHandler />
      <div className="mt-20 md:mt-0 md:bg-slate-100 h-screen w-full flex md:items-center md:justify-center">
        <div className="p-0 px-8 pb-28 md:pb-8 overflow-auto md:p-12 flex flex-col bg-white rounded-lg items-center">
          <h2 className="text-opposite font-bold text-3xl md:text-5xl w-full mb-8">
            Create an account
          </h2>
          <SignUpForm wallet={wallet} user={user} />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
