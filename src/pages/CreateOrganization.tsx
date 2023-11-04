import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import { LoadingIcon } from "../components/LoadingIcon";

import { useUser } from "../contexts/UserProvider";
import { toast } from "react-toastify";
import { useBackEnd } from "../contexts/BackEndProvider";

const CreateOrganizationForm = () => {
  const [identifier, setIdentifier] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([""]);

  const [studentsPassword, setStudentsPassword] = useState<string>("");
  const [teachersPassword, setTeachersPassword] = useState<string>("");

  const [blockCreateButton, setBlockCreateButton] = useState<boolean>(false);

  const navigate = useNavigate();

  const { user, isLoaded } = useUser()!;
  const backend = useBackEnd()!;

  const updateSelectedArea = (index: number, area: string) => {
    const selectedAreasCopy = [...selectedAreas];
    selectedAreasCopy[index] = area;

    setSelectedAreas(selectedAreasCopy);
  };

  const addArea = () => {
    setSelectedAreas([...selectedAreas, ""]);
  };

  const removeSelectedArea = (index: number) => {
    const selectedAreasCopy = [...selectedAreas];
    selectedAreasCopy.splice(index, 1);

    setSelectedAreas(selectedAreasCopy);
  };

  const createOrganization = async () => {
    if (!user) {
      toast.error("Tried to create organization signed out");
      return;
    }

    try {
      await backend.createOrganization(
        user.token,
        "groups",
        identifier,
        name,
        description,
        studentsPassword,
        teachersPassword,
        selectedAreas
      );

      toast.success("Successfully created organization")
      navigate(`/organization/${identifier}`)
    } catch (error: any) {
      console.dir(error);
      if (error?.response?.data?.detail) {
        toast.error(`Server error: ${error.response.data.detail}`);
      } else {
        toast.error("Server error while trying to create organization");
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center">
        <LoadingIcon className="text-blue-500 w-24 h-24" />
      </div>
    );
  }

  if (isLoaded && user === null) {
    navigate("/signin");
  }

  return (
    <div className="text-lg md:text-xl font-semibold w-full flex flex-col gap-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 w-full">
            <span>What is the name of your organization?</span>
            <input
              className="p-4 bg-opposite-pale border-400 border-2 text-black rounded-lg"
              placeholder="Awesome Project 2023"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <span>What is a good unique id name?</span>
            <input
              className="p-4 bg-opposite-pale border-400 border-2 text-black rounded-lg"
              placeholder="awesome_project_2023"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <span>Describe in more detail what this organization is</span>
            <textarea
              className="w-full h-40 p-4 bg-opposite-paleborder-400 border-2 text-black rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={"This is..."}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <span>
              Select the areas which the students will be able to choose from
            </span>

            <div className="flex flex-col gap-4">
              {selectedAreas.map((area, index) => (
                <div className="flex flex-row items-center gap-4">
                  <input
                    className="p-4 w-96 rounded-lg border-slate-200 border-2"
                    placeholder="Math"
                    value={area}
                    onChange={(e) => updateSelectedArea(index, e.target.value)}
                  />
                  <img
                    className="h-12 hover:cursor-pointer"
                    onClick={() => removeSelectedArea(index)}
                    src="/assets/remove_circle.svg"
                  />
                </div>
              ))}

              <div className="flex justify-left">
                <div
                  onClick={() => addArea()}
                  className="p-4 hover:cursor-pointer flex flex-row gap-2 items-center bg-slate-600 rounded-lg"
                >
                  <img className="h-6" src="/assets/add_circle.svg" />
                  <span className="text-white text-base font-bold">
                    Add area
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-slate-600">
            Here you need to specify two passwords. They will be used to enter
            the organization. One will allow the user to be recognized as a
            "teacher", the other as a "student".
          </span>
          <span className="text-slate-600">
            Remember these passwords, anyone who wants to join the organization
            will need to know them.
          </span>
          <div className="flex flex-col gap-2">
            <span>For the teachers</span>
            <input
              className="p-4 bg-opposite-pale border-400 border-2 text-black rounded-lg"
              placeholder="**********"
              type="password"
              value={studentsPassword}
              onChange={(e) => setStudentsPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span>For the students</span>
            <input
              className="p-4 bg-opposite-pale border-400 border-2 text-black rounded-lg"
              placeholder="**********"
              type="password"
              value={teachersPassword}
              onChange={(e) => setTeachersPassword(e.target.value)}
            />
          </div>
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
          disabled={blockCreateButton}
          className={`${
            blockCreateButton ? "opacity-75" : ""
          } bg-dark-blue py-4 w-full md:w-72 rounded-lg text-white text-lg md:text-2xl font-bold`}
          onClick={createOrganization}
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
      <Header background={true} />
      <div className="md:bg-slate-100 w-full flex md:justify-center">
        <div className="mt-20 md:mt-40 mb-20 p-8 md:p-12 md:w-1/2 flex flex-col bg-white rounded-lg items-center">
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
