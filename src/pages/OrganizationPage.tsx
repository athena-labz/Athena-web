import React, { ReactNode, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import UsersPage from "./UsersPage";
import SpecificTaskPage from "./SpecficTaskPage";

import { CurrentSideBarSelection } from "../components/Sidebar";

type OrganizationPageProps = {
  currentSelection: "tasks" | "users" | "profile";
  children: ReactNode;
};

const OrganizationPage = ({
  currentSelection,
  children,
}: OrganizationPageProps) => {
  return (
    <div className="bg-slate-100 h-screen w-full">
      <Header border />
      <div className="mt-20">
        <Sidebar currentSelection={currentSelection} />

        <div className="fixed pb-20 ml-80 pr-80 overflow-auto h-full w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default OrganizationPage;
