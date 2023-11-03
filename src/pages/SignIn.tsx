import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import { useUser } from "../contexts/UserProvider";
import { SignInHandler } from "../components/SignInHandler";

const whitelistedWallets = ["eternl", "nami"];

const SignIn = () => {
  const navigate = useNavigate();
  const user = useUser()!;

  return (
    <div className="h-screen w-full bg-white">
      <Header border disableUserHandler />
      <div className="flex flex-col w-full md:w-[48rem] gap-8 mt-20 pb-20 p-16">
        <span className="text-lg text-slate-600 font-semibold">
          Oops! The page you are trying to access requires an account. Please
          sign in or create an account if you don't have one.
        </span>
        <div className="flex flex-row justify-start gap-4 items-center">
          <SignInHandler
            whitelistedWallets={whitelistedWallets}
            onSignIn={() => navigate("/")}
            className="py-2 w-full md:w-36 rounded-full border-dark-blue border-2 text-dark-blue text-normal md:text-lg font-bold"
          >
            Sign In
          </SignInHandler>

          <button
            onClick={() => navigate("/signup")}
            className="py-2 w-full md:w-36 rounded-full border-dark-blue border-2 bg-dark-blue text-normal text-white md:text-lg font-bold"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
