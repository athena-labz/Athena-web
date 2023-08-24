import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Header from "../components/Header";


const SignIn = () => {
  return (
    <div className="h-screen w-full bg-white">
      <Header border disableUserHandler />
      <div className="mt-20 pb-20 p-16">
        <span className="text-lg text-slate-600 font-semibold">Oops! The page you are trying to access doesn't exist.</span>
      </div>
    </div>
  );
};

export default SignIn;
