import { useEffect, useState } from "react";

import { Avatar } from "../components/User";
import { LoadingIcon } from "../components/LoadingIcon";
import { ProjectCard } from "../components/ProjectCard";

import { useBackEnd } from "../contexts/BackEndProvider";

import { capitalize, abbreviate } from "../utils/stringHelpers";
import { useUser } from "../contexts/UserProvider";

type ProfileContainerProps = {
  email: string;
  stakeAddress: string;
  type: string;
};

const ProfileContainer = ({
  email,
  stakeAddress,
  type,
}: ProfileContainerProps) => {
  const Selector = () => {
    const [optionSelected, setOptionSelected] = useState<"wallet" | "email">(
      "email"
    );
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
    <div className="w-full flex flex-row justify-between gap-4 bg-white rounded-lg p-8">
      <div className="flex flex-row gap-8">
        <Avatar email={email} className="h-24 rounded-full" />
        <div className="h-full flex">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <span className="text-4xl text-slate-600">{email}</span>
              <Selector />
            </div>
            <div className="flex flex-row text-dark-blue font-semibold items-end gap-1">
              <img className="h-6" src="/assets/role.svg" />
              <span>{capitalize(type)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-2 bg-slate-100 p-4 px-8 rounded-lg">
          <span className="text-lg text-slate-600 font-bold text-right">
            Tokens
          </span>
          <div className="flex flex-col text-right">
            <span className="text-sm text-slate-500">Earned: 400 BSC</span>
            <span className="text-sm text-slate-500">Pending: 100 BSC</span>
            <span className="text-sm text-slate-600">Total: 500 BSC</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 bg-slate-100 p-4 px-8 rounded-lg">
          <span className="text-lg text-slate-600 font-bold text-right">
            Tasks
          </span>
          <div className="flex flex-col text-right">
            <span className="text-sm text-slate-500">Completed: 7</span>
            <span className="text-sm text-slate-500">In progress: 3</span>
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
  const [userTasks, setUserTasks] = useState<TaskListData | null>(null);
  const [userTasksPage, setUserTasksPage] = useState<number>(1);

  const { user } = useUser()!;
  const { getUserTasks } = useBackEnd()!;

  useEffect(() => {
    updateUserTasks(userTasksPage);
  }, [userTasksPage]);

  useEffect(() => {
    if (user !== null) {
      setUserData(user);
    }
  }, [user]);

  const updateUserTasks = async (page: number) => {
    setUserTasks(null);

    const assignedTasks = await getUserTasks(username, organization, page, 3);
    setUserTasks(assignedTasks);
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
            type={userData.userType}
            stakeAddress={userData.stakeAddress}
          />

          <div className="inline-block">
            <div className="p-4 mb-4">
              <h1 className="text-4xl text-slate-600 font-semibold">
                Assigned tasks
              </h1>
            </div>

            {userTasks === null && (
              <div className="flex w-full justify-center items-center">
                <LoadingIcon className="text-blue-500 w-24 h-24" />
              </div>
            )}

            {userTasks && (
              <div className="flex flex-row gap-8">
                <div className="flex flex-row gap-4">
                  {userTasksPage > 1 && (
                    <div className="flex items-center">
                      <img
                        onClick={() => setUserTasksPage(userTasksPage - 1)}
                        className="h-16 p-2 rounded-full transition delay-100 hover:bg-slate-200 hover:cursor-pointer"
                        src="/assets/left.svg"
                      />
                    </div>
                  )}

                  {userTasks.elements.map(
                    ({ identifier, name, description, status, date }) => (
                      <ProjectCard
                        projectId={identifier}
                        name={name}
                        description={description}
                        status={status as TaskStatus}
                        date={date}
                      />
                    )
                  )}
                </div>

                {userTasksPage < userTasks.maxPage && (
                  <div className="flex items-center">
                    <img
                      onClick={() => setUserTasksPage(userTasksPage + 1)}
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
