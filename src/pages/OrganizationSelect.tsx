import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import { OrganizationCard } from "../components/OrganizationCard";
import { LoadingIcon } from "../components/LoadingIcon";

import { useUser } from "../contexts/UserProvider";
import { toast } from "react-toastify";
import { useBackEnd } from "../contexts/BackEndProvider";


const OrganizationSelector = () => {
  const [organizationData, setOrganizationData] =
    useState<OrganizationListData | null>(null);

  const [page, setPage] = useState<number>(1);

  const navigate = useNavigate();

  const { user } = useUser()!;
  const backend = useBackEnd()!;

  useEffect(() => {
    getOrganization();
  }, [])

  const getOrganization = async () => {
    if (user === null) {
      toast.error("Tried to join organization while signed out");
    }

    try {
      const organizationListData = await backend.getUserOrganizations(
        user!.token,
        page,
        10
      );
      setOrganizationData(organizationListData);
    } catch (error: any) {
      if (error?.response?.data?.detail) {
        toast.error(`Server error: ${error.response.data.detail}`);
      } else {
        toast.error("Server error while trying to get organizations");
      }
    }
  };

  return (
    <div className="p-12 inline-block w-full">
      <div className="mb-8 w-full flex flex-row justify-between items-center">
        <h1 className="text-4xl text-slate-600 font-semibold">Organizations</h1>
        <div className="flex justify-end">
          <div
            onClick={() => navigate(`/organization/join`)}
            className="p-4 mb-4 hover:cursor-pointer flex flex-row gap-2 items-center bg-dark-blue rounded-lg"
          >
            <img className="h-8" src="/assets/add_task.svg" />
            <span className="text-white text-lg font-bold">
              Join organization
            </span>
          </div>
        </div>
      </div>

      {organizationData === null && (
        <div className="flex w-full justify-center items-center">
          <LoadingIcon className="text-blue-500 w-24 h-24" />
        </div>
      )}

      {organizationData && organizationData.elements.length === 0 && (
        <span>No organizations yet</span>
      )}

      {organizationData && (
        <div className="flex flex-wrap gap-4">
          {page > 1 && (
            <div className="flex items-center">
              <img
                onClick={() => setPage(page - 1)}
                className="h-16 p-2 rounded-full transition delay-100 hover:bg-slate-200 hover:cursor-pointer"
                src="/assets/left.svg"
              />
            </div>
          )}

          {organizationData.elements.map(
            ({ identifier, name, description, areas }) => (
              <OrganizationCard
                identifier={identifier}
                name={name}
                description={description}
                areas={areas}
              />
            )
          )}

          {page < organizationData.maxPage && (
            <div className="flex items-center">
              <img
                onClick={() => setPage(page + 1)}
                className="h-16 p-2 rounded-full transition delay-100 hover:bg-slate-200 hover:cursor-pointer"
                src="/assets/right.svg"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const OrganizationSelect = () => {
  useEffect(() => {
    document.body.classList.add("bg-slate-100");
  });

  return (
    <div className="">
      <Header background={true} />
      <div className="mt-20 w-full flex">
        <OrganizationSelector />
      </div>
    </div>
  );
};

export default OrganizationSelect;
