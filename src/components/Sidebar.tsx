import React, { ReactNode, useEffect, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

export type CurrentSideBarSelection =
  | "tasks"
  | "users"
  | "profile"
  | "SpecificTask"
  | "SpecificUser";

type SidebarSelectionContainerProps = {
  title: string;
  iconName: string;
  selected: boolean;
  onSelect: () => void;
};

const SidebarSelectionContainer = ({
  title,
  iconName,
  selected,
  onSelect,
}: SidebarSelectionContainerProps) => {
  return (
    <div
      onClick={onSelect}
      className={`${
        selected ? "bg-dark-blue" : "border-dark-blue border-2"
      } p-4 mb-4 flex flex-row gap-2 items-center rounded-lg hover:cursor-pointer`}
    >
      <img
        className="h-8"
        src={`/assets/${iconName}${selected ? "_selected" : ""}.svg`}
      />
      <span
        className={`${
          selected ? "text-white" : "text-dark-blue"
        } text-lg font-bold`}
      >
        {title}
      </span>
    </div>
  );
};

type Params = {
  organization: string;
};

type SidebarProps = {
  currentSelection: CurrentSideBarSelection;
};

const Sidebar = ({ currentSelection }: SidebarProps) => {
  const [showSidebar, setShowSidebar] = useState(true);

  const { organization } = useParams<Params>();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const HideShowButton = () => {
    return (
      <div className="fixed z-20 bottom-2 left-0 right-0 flex justify-center">
        <div
          className="flex flex-col hover:cursor-pointer"
          onClick={() => toggleSidebar()}
        >
          <span className="uppercase font-extrabold text-xs text-[#BEBEC7]">
            {showSidebar ? "Hide" : "Show"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div>
      {showSidebar && (
        <div className="fixed top-20 left-0 h-screen w-80 bg-white overflow-auto">
          <ul className="flex flex-col p-4">
            <div className="flex p-2 mb-4">
              <span className="text-2xl text-dark-blue font-extrabold">
                Basketball team organization
              </span>
            </div>

            <hr className="mb-4" />

            <SidebarSelectionContainer
              title="Tasks"
              iconName="task"
              selected={currentSelection === "tasks"}
              onSelect={() => navigate(`/organization/${organization}/tasks`)}
            />

            <SidebarSelectionContainer
              title="Users"
              iconName="group"
              selected={currentSelection === "users"}
              onSelect={() => navigate(`/organization/${organization}/users`)}
            />

            <SidebarSelectionContainer
              title="Profile"
              iconName="person"
              selected={currentSelection === "profile"}
              onSelect={() =>
                navigate(`/organization/${organization}/profile`)
              }
            />

            <div className="flex justify-end">
              <div
                onClick={() => navigate("/")}
                className="p-4 mb-4 hover:cursor-pointer flex flex-row gap-2 items-center bg-dark-blue rounded-lg"
              >
                <img className="h-8" src="/assets/logout_white.svg" />
                <span className="text-white text-lg font-bold">
                  Back to home
                </span>
              </div>
            </div>
          </ul>
        </div>
      )}

      <HideShowButton />
    </div>
  );
};

export default Sidebar;
