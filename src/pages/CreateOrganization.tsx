import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Header from "../components/Header";

const CreateOrganizationForm = () => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  return (
    <div className="text-lg md:text-xl font-semibold w-full flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 w-full">
          <span>What is the organization name?</span>
          <input
            className="p-4 bg-opposite-pale border-400 border-2 text-black rounded-lg"
            placeholder="Awesome Project 2023"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span>Create a password for users to enter the organization</span>
          <input
            className="p-4 bg-opposite-pale border-400 border-2 text-black rounded-lg"
            placeholder="**********"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

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
          Create
        </button>
      </div>
    </div>
  );
};

const CreateOrganization = () => {
  return (
    <div className="">
      <Header />
      <div className="mt-20 md:mt-0 md:bg-slate-100 h-screen w-full flex md:items-center md:justify-center">
        <div className="p-8 md:p-12 flex flex-col bg-white rounded-lg items-center">
          <h2 className="text-opposite font-bold text-3xl md:text-5xl w-full mb-8">
            Create Organization
          </h2>
          <CreateOrganizationForm />
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;
