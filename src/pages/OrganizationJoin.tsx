import React, { useEffect, useState } from "react";

import { WalletHandler } from "../components/WalletHandler";

import { useNavigate } from "react-router-dom";

import { useWallet, WalletContext } from "../contexts/WalletProvider";
import { useUser, UserContext } from "../contexts/UserProvider";

import { capitalize } from "../utils/stringHelpers";

import Header from "../components/Header";
import { BackEndContext, useBackEnd } from "../contexts/BackEndProvider";
import { toast } from "react-toastify";

const whitelistedWallets = ["eternl", "nami"];

type OrganizationJoinFormProps = {
  backend: BackEndContext;
  user: UserContext;
};

const reduceAreas = (areas: string[]) => {
  if (areas.length > 5) {
    const subareas = areas.slice(0, 5);
    return subareas.join(", ") + ", etc";
  } else {
    return areas.join(", ");
  }
};

const OrganizationJoinForm = ({ backend, user }: OrganizationJoinFormProps) => {
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [areas, setAreas] = useState<string[] | null>(null);
  const [area, setArea] = useState<string>("");

  const [stage, setStage] = useState<"NameAndPassword" | "Area">(
    "NameAndPassword"
  );

  const navigate = useNavigate();

  // useEffect(() => {
  //   loadAreas();
  // }, []);

  const organizationExists = async () => {
    try {
      const organization = await backend.getOrganization(identifier);
      return true;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return false;
      } else if (error?.response?.data?.detail) {
        toast.error(`Server error: ${error.response.data.detail}`);
      } else {
        toast.error("Server error while trying to get organization tasks");
      }
    }
  };

  const loadAreas = async () => {
    try {
      const organizationAreas = await backend.getOrganizationAreas(identifier);
      setAreas(organizationAreas);
      setArea(organizationAreas[0]);
    } catch (error: any) {
      if (error?.response?.data?.detail) {
        toast.error(`Server error: ${error.response.data.detail}`);
      } else {
        console.error(error);
        toast.error(
          "Server error while trying to get information about organization"
        );
      }
    }
  };

  const joinOrganization = async () => {
    if (user.user === null) {
      toast.error("Tried to join organization while signed out");
      return;
    }

    try {
      await backend.joinOrganization(
        user.user.token,
        identifier,
        user.user.userType === "student" ? area : null,
        password
      );
      navigate(`/organization/${identifier}`);
    } catch (error: any) {
      if (error?.response?.data?.detail) {
        toast.error(`Server error: ${error.response.data.detail}`);
      } else {
        console.error(error);
        toast.error("Server error while trying to join organization");
      }
    }
  };

  const handleConfirm = async () => {
    if (stage === "NameAndPassword") {
      const exists = await organizationExists();

      if (exists === undefined) return;

      if (exists) {
        await loadAreas();
        setStage("Area");
      } else {
        toast.error("Organization identifier not found!");
      }
    } else {
      joinOrganization();
      setStage("NameAndPassword");
    }
  };

  return (
    <div className="text-lg md:text-xl font-semibold w-full flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span>Organization ID (unique name)</span>
          <input
            className="p-4 bg-opposite-pale border-400 border-2 text-black rounded-lg"
            placeholder="org123"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>

        {stage === "Area" &&
          (areas ? (
            <div className="flex flex-col gap-2">
              <span>What is your area?</span>
              <select
                name="user_types"
                value={area}
                onChange={(event) => setArea(event.target.value)}
                className="p-4 bg-opposite-pale border-2 text-black rounded-lg"
              >
                {areas.map((orgArea) => (
                  <option value={orgArea}>{capitalize(orgArea)}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <span>What is your area?</span>
              <input
                className="p-4 bg-opposite-pale border-400 border-2 text-black rounded-lg"
                placeholder="Math"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
          ))}

        <div className="flex flex-col gap-2">
          <span>Password</span>
          <input
            className="p-4 bg-opposite-pale border-400 border-2 text-black rounded-lg"
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-between items-center">
        <button
          className="bg-white border-dark-blue border-2 py-4 w-full md:w-72 rounded-lg text-dark-blue text-lg md:text-2xl font-bold"
          onClick={() => navigate("/organization/select")}
        >
          Back to select
        </button>
        <button
          className="bg-dark-blue py-4 w-full md:w-72 rounded-lg text-white text-lg md:text-2xl font-bold"
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

const OrganizationJoin = () => {
  const backend = useBackEnd()!;
  const user = useUser()!;

  const navigate = useNavigate();

  if (user.user === null) {
    toast.error("Tried to join organization while signed out");
    navigate("/signin");
  }

  return (
    <div className="">
      <Header disableUserHandler />
      <div className="mt-20 md:mt-0 md:bg-slate-100 h-screen w-full flex md:items-center md:justify-center">
        <div className="p-0 px-8 pb-28 md:pb-8 overflow-auto md:p-12 flex flex-col bg-white rounded-lg items-center">
          <h2 className="text-opposite font-bold text-3xl md:text-5xl w-full mb-8">
            Join organization
          </h2>
          <OrganizationJoinForm backend={backend} user={user} />
        </div>
      </div>
    </div>
  );
};

export default OrganizationJoin;
