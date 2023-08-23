import { useEffect, useState } from "react";

import { Avatar } from "../components/User";
import { LoadingIcon } from "../components/LoadingIcon";
import { ProjectCard } from "../components/ProjectCard";

import { useBackEnd } from "../contexts/BackEndProvider";

import { capitalize, abbreviate } from "../utils/stringHelpers";

type ProfileContainerProps = {
  email: string;
  username: string;
  name: string;
  role: string;
  stakeAddress: string;
};

const ProfileContainer = ({
  email,
  username,
  name,
  role,
  stakeAddress,
}: ProfileContainerProps) => {
  const Selector = () => {
    const [optionSelected, setOptionSelected] = useState<
      "wallet" | "email" | "username"
    >("email");
    const [stakeAddressAbbreviated, setStakeAddressAbbreviated] =
      useState(true);

    return (
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-row items-center gap-1">
          <div
            onClick={() => setOptionSelected("email")}
            className={`${
              optionSelected === "email" ? "bg-slate-500" : ""
            } rounded-full border-slate-500 border p-1 hover:cursor-pointer`}
          >
            <img
              className="h-4"
              src={`/assets/mail_profile${
                optionSelected === "email" ? "_selected" : ""
              }.svg`}
            />
          </div>
          <div
            onClick={() => setOptionSelected("username")}
            className={`${
              optionSelected === "username" ? "bg-slate-500" : ""
            } rounded-full border-slate-500 border p-1 hover:cursor-pointer`}
          >
            <img
              className="h-4"
              src={`/assets/person_profile${
                optionSelected === "username" ? "_selected" : ""
              }.svg`}
            />
          </div>
          <div
            onClick={() => setOptionSelected("wallet")}
            className={`${
              optionSelected === "wallet" ? "bg-slate-500" : ""
            } rounded-full border-slate-500 border p-1 hover:cursor-pointer`}
          >
            <img
              className="h-4"
              src={`/assets/wallet_profile${
                optionSelected === "wallet" ? "_selected" : ""
              }.svg`}
            />
          </div>
        </div>
        {optionSelected === "email" ? (
          <span className="text-slate-500">{email}</span>
        ) : optionSelected === "username" ? (
          <span className="text-slate-500">{username}</span>
        ) : (
          <span
            onClick={() => setStakeAddressAbbreviated(!stakeAddressAbbreviated)}
            className="text-slate-500 hover:cursor-pointer"
          >
            {stakeAddressAbbreviated
              ? abbreviate(stakeAddress, 13, 3)
              : stakeAddress}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-white rounded-lg p-8">
      <div className="flex flex-row gap-8">
        <Avatar email={email} className="h-24 rounded-full" />
        <div className="h-full flex items-center">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <span className="text-4xl text-slate-600">{name}</span>
              <Selector />
            </div>
            <div className="flex flex-row text-dark-blue font-semibold items-end gap-1">
              <img className="h-6" src="/assets/role.svg" />
              <span>{capitalize(role)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type ProfilePageProps = {
  organization: string;
  username: string;
};

const ProfilePage = ({ organization, username }: ProfilePageProps) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userAssignedTasks, setUserAssignedTasks] =
    useState<TaskListData | null>(null);
  const [userAssignedTasksPage, setUserAssignedTasksPage] = useState<number>(1);

  const { getUserInformation, getTaskListAssignedUser, getUserRole } =
    useBackEnd()!;

  useEffect(() => {
    updateUserData();
  }, []);

  useEffect(() => {
    updateUserAssignedTasks(userAssignedTasksPage);
  }, [userAssignedTasksPage]);

  const updateUserData = async () => {
    getUserInformation(username).then((userData) => {
      setUserData(userData);

      getUserRole(username).then((role) => {
        setUserRole(role);
      });
    });
  };

  const updateUserAssignedTasks = async (page: number) => {
    setUserAssignedTasks(null);

    const assignedTasks = await getTaskListAssignedUser(
      username,
      organization,
      page,
      3
    );

    setTimeout(() => {
      setUserAssignedTasks(assignedTasks);
    }, 2_000);
  };

  return (
    <div className="p-8 w-full h-full inline-block overflow-auto">
      {userData === null && (
        <div className="flex w-full justify-center items-center">
          <LoadingIcon className="text-blue-500 w-24 h-24" />
        </div>
      )}

      {userData && (
        <div className="w-full flex flex-col gap-8">
          <ProfileContainer
            email={userData.email}
            username={userData.username}
            name={`${userData.firstName} ${userData.lastName}`}
            role={userRole ? userRole : "Role not found"}
            stakeAddress={userData.stakeAddress}
          />

          <div className="inline-block">
            <div className="p-4 mb-4">
              <h1 className="text-4xl text-slate-600 font-semibold">
                Assigned tasks
              </h1>
            </div>

            {userAssignedTasks === null && (
              <div className="flex w-full justify-center items-center">
                <LoadingIcon className="text-blue-500 w-24 h-24" />
              </div>
            )}

            {userAssignedTasks && (
              <div className="flex flex-row gap-8">
                <div className="flex flex-row gap-4">
                  {userAssignedTasksPage > 1 && (
                    <div className="flex items-center">
                      <img
                        onClick={() =>
                          setUserAssignedTasksPage(userAssignedTasksPage - 1)
                        }
                        className="h-16 p-2 rounded-full transition delay-100 hover:bg-slate-200 hover:cursor-pointer"
                        src="/assets/left.svg"
                      />
                    </div>
                  )}

                  {userAssignedTasks.elements.map(
                    ({ projectId, name, description, status, date }) => (
                      <ProjectCard
                        projectId={projectId}
                        name={name}
                        description={description}
                        status={status as TaskStatus}
                        date={date}
                      />
                    )
                  )}
                </div>

                {userAssignedTasksPage < userAssignedTasks.maxPage && (
                  <div className="flex items-center">
                    <img
                      onClick={() =>
                        setUserAssignedTasksPage(userAssignedTasksPage + 1)
                      }
                      className="h-16 p-2 rounded-full transition delay-100 hover:bg-slate-200 hover:cursor-pointer"
                      src="/assets/right.svg"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
