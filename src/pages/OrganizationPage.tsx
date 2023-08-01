import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import gravatar from "gravatar";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import { CurrentSideBarSelection } from "../components/Sidebar";

type AvatarProps = {
  email: string;
  size?: number;
  className?: string;
};

const Avatar = ({ email, size, className }: AvatarProps) => {
  const avatarURL = gravatar.url(email, {
    s: size?.toString() || "200",
    d: "identicon",
  });

  return <img className={className ?? ""} src={avatarURL} alt="Avatar" />;
};

const UserCard = () => {
  return (
    <div className="inline-block text-slate-600 gap-4 w-72 p-8 bg-white rounded-lg hover:cursor-pointer">
      <div className="flex flex-row justify-start items-center gap-2">
        <Avatar email="alice@email.com" className="w-8 rounded-full" />
        <span className="text-lg font-semibold">alice_theone</span>
      </div>
      <div className="flex flex-col gap-2 mt-4 mb-4">
        <span className="truncate">alice@email.com</span>
        <span className="truncate">
          stake_test1upmpu3pjqgjx4amy8ulv4fxpy26cmh553yhxhjhqurz9y7qrymfne
        </span>
      </div>
      <div className="inline-block w-full">
        <hr className="mb-2" />
        <span className="text-slate-400">3 projects completed</span>
      </div>
    </div>
  );
};

const ProjectCard = () => {
  return (
    <div className="flex flex-col text-slate-600 gap-2 w-72 p-8 bg-white rounded-lg hover:cursor-pointer">
      <span className="text-lg font-semibold">Project 1</span>
      <span className="text-justify line-clamp-3">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
        dapibus lacinia est eu hendrerit. Etiam quis fringilla velit, eget porta
        mauris. Quisque sit amet leo dictum, lacinia nisi quis, finibus metus.
        Nulla eget consectetur dolor. Mauris fringilla, nisl sit amet lacinia
        tristique, ex tortor porttitor augue, eu ultricies nulla nibh sed mi.
        Pellentesque lobortis pellentesque nisl, a semper elit facilisis congue.
        Nulla mattis fermentum massa, vitae interdum lorem accumsan sit amet.
        Maecenas tempus nisl eget felis vehicula, quis fermentum mi cursus.
      </span>
      <hr className="mt-2" />
      <div className="flex flex-row text-sm text-slate-400 justify-between items-center">
        <span>Awaiting Approval</span>
        <span>Jun 2, 2023</span>
      </div>
    </div>
  );
};

const TasksPage = () => {
  // Task name
  // Description (shortened)
  // Status
  //    * Awaiting approval - Acceptance deadline - Until when can it be aproved
  //    * In progress - Due date
  //    * Completed
  //    * Rejected
  //    * Needs review
  // Rewards

  return (
    <div className="p-8 inline-block">
      <div className="p-4 mb-8">
        <h1 className="text-4xl text-slate-600 font-semibold">Tasks</h1>
      </div>
      <div className="flex flex-wrap gap-4">
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
      </div>
    </div>
  );
};

const UsersPage = () => {
  return (
    <div className="p-8 inline-block">
      <div className="p-4 mb-8">
        <h1 className="text-4xl text-slate-600 font-semibold">Users</h1>
      </div>
      <div className="flex flex-wrap gap-4">
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
      </div>
    </div>
  );
};

const OrganizationPage = () => {
  const [currentSelection, setCurrentSelection] =
    useState<CurrentSideBarSelection>("Tasks");

  return (
    <div className="bg-slate-100 h-screen w-full">
      <div className="">
        <Sidebar
          currentSelection={currentSelection}
          setCurrentSelection={setCurrentSelection}
        />
        <div className="fixed left-80 overflow-auto h-screen w-full pr-64">
          {/* Your main page content */}

          {currentSelection === "Tasks" && <TasksPage />}

          {currentSelection === "Users" && <UsersPage />}

          {/* {currentSelection === "Profile" && <ProfilePage />} */}
        </div>
      </div>
    </div>
  );
};

export default OrganizationPage;
