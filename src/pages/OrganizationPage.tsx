import React, { ReactNode, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import UsersPage from "./UsersPage";
import SpecificTaskPage from "./SpecficTaskPage";

import { CurrentSideBarSelection } from "../components/Sidebar";
import { useBackEnd } from "../contexts/BackEndProvider";
import { toast } from "react-toastify";
import { LoadingIcon } from "../components/LoadingIcon";

type OrganizationPageProps = {
  currentSelection: "tasks" | "crowdfunding" | "users" | "profile";
  organizationId: string;
  children: ReactNode;
};

const OrganizationPage = ({
  currentSelection,
  organizationId,
  children,
}: OrganizationPageProps) => {
  const [organization, setOrganization] = useState<OrganizationData | null>(
    null
  );

  const backEnd = useBackEnd()!;
  const navigate = useNavigate();

  useEffect(() => {
    loadOrganization();
  }, []);

  const loadOrganization = async () => {
    try {
      const organization = await backEnd.getOrganization(organizationId);
      setOrganization(organization);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        navigate("/not-found");
      } else if (error?.response?.data?.detail) {
        toast.error(`Server error: ${error.response.data.detail}`);
        navigate("/");
      } else {
        toast.error("Server error while trying to get organization tasks");
        navigate("/");
      }
    }
  };

  return (
    <div className="bg-slate-100 h-screen w-full">
      <Header border background />
      {organization === null && (
        <div className="flex w-full justify-center items-center">
          <LoadingIcon className="text-blue-500 w-24 h-24" />
        </div>
      )}

      {organization && (
        <div className="mt-20">
          <Sidebar
            organizationName={organization.name}
            currentSelection={currentSelection}
          />

          <div className="fixed pb-20 ml-80 pr-80 overflow-auto h-full w-full">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationPage;
