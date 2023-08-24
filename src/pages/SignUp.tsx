import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Header from "../components/Header";

const SignUpForm = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const navigate = useNavigate();

  return (
    <div className="text-lg md:text-xl font-semibold w-full flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4 w-full">
          <input
            className="p-4 w-full bg-opposite-pale border-400 border-2 text-black rounded-lg"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="p-4 w-full bg-opposite-pale border-400 border-2 text-black rounded-lg"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span>What is your username?</span>
          <input
            className="p-4 bg-opposite-pale border-400 border-2 text-black rounded-lg"
            placeholder="aliceIs_right"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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
          <button
            className="bg-dark-blue py-4 w-full md:w-72 rounded-lg text-white text-lg md:text-2xl font-bold"
            onClick={() => {}}
          >
            Sign Up
          </button>
        </div>
        <span className="text-base text-slate-400 hover:cursor-pointer hover:opacity-75">Already have an account?</span>
      </div>
    </div>
  );
};

const SignUp = () => {
  return (
    <div className="">
      <Header disableUserHandler />
      <div className="mt-20 md:mt-0 md:bg-slate-100 h-screen w-full flex md:items-center md:justify-center">
        <div className="p-0 px-8 pb-28 md:pb-8 overflow-auto md:p-12 flex flex-col bg-white rounded-lg items-center">
          <h2 className="text-opposite font-bold text-3xl md:text-5xl w-full mb-8">
            Create an account
          </h2>
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
