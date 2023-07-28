import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Header from "../components/Header";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-center bg-cover h-screen min-h-144 bg-[url('./assets/background.jpg')]">
      <div className="z-10 absolute inset-0 bg-black opacity-75"></div>
      <div className="z-20 relative h-full">
        <Header />
        <div className="pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="pointer-events-auto flex flex-col gap-16 p-8 w-screen justify-center items-center">
            <div className="flex flex-col gap-4">
              <span className="text-white text-5xl md:text-7xl font-extrabold">
                Provide reliable services made easy
              </span>
              <span className="text-main-blue text-xl md:text-3xl font-extrabold">
                Building trust among peers through blockchain technology.
              </span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-6">
              <button className="bg-white py-4 w-72 rounded-lg text-dark-blue text-2xl font-bold">
                Enter organization
              </button>
              <button
                className="bg-dark-blue py-4 w-72 rounded-lg text-white text-2xl font-bold"
                onClick={() => navigate("/create-organization")}
              >
                Create organization
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
