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
  const [userRole, setUserRole] = useState<string | null>(null);

  const [userAssignedTasks, setUserAssignedTasks] =
    useState<TaskListData | null>(null);
  const [userAssignedTasksPage, setUserAssignedTasksPage] = useState<number>(1);

  const [userNFTs, setUserNFTs] = useState<NFTListData | null>({
    currentPage: 1,
    maxPage: 1,
    elements: [
      { nftId: "", name: "Isola Bella", image: "/assets/isola_bella_nft.png" },
      {
        nftId: "",
        name: "Forte di Orino",
        image: "/assets/forte_di_orino_nft.png",
      },
      {
        nftId: "",
        name: "The Basilica",
        image: "/assets/the_basilica_nft.png",
      },
    ],
  });
  const [userNFTsPage, setUserNFTsPage] = useState<number>(1);

  const { getUserInformation, getTaskListAssignedUser, getUserRole } =
    useBackEnd()!;

  useEffect(() => {
    updateUserData();
  }, []);

  useEffect(() => {
    updateUserAssignedTasks(userAssignedTasksPage);
  }, [userAssignedTasksPage]);

  const updateUserData = async () => {
    getUserMe(username).then((userData) => {
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
              <h1 className="text-4xl text-slate-600 font-semibold">NFTs</h1>
            </div>

            {userNFTs === null && (
              <div className="flex w-full justify-center items-center">
                <LoadingIcon className="text-blue-500 w-24 h-24" />
              </div>
            )}

            {userNFTs && (
              <div className="flex flex-row gap-8">
                <div className="flex flex-row gap-4">
                  {userNFTsPage > 1 && (
                    <div className="flex items-center">
                      <img
                        onClick={() => setUserNFTsPage(userNFTsPage - 1)}
                        className="h-16 p-2 rounded-full transition delay-100 hover:bg-slate-200 hover:cursor-pointer"
                        src="/assets/left.svg"
                      />
                    </div>
                  )}

                  {userNFTs.elements.map(({ name, image }) => (
                    <div className="flex flex-col text-slate-600 gap-2 w-72 p-8 px-12 bg-white rounded-lg text-center justify-center w-full">
                      <span className="text-lg font-semibold">{name}</span>
                      <img className="h-48 w-48 p-2 rounded-lg" src={image} />

                      <div className="mt-4">
                        <button className="p-4 px-12 hover:cursor-pointer gap-2 items-center bg-dark-blue rounded-lg">
                          <span className="text-white text-lg font-bold">
                            Claim
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {userNFTsPage < userNFTs.maxPage && (
                  <div className="flex items-center">
                    <img
                      onClick={() => setUserNFTsPage(userNFTsPage + 1)}
                      className="h-16 p-2 rounded-full transition delay-100 hover:bg-slate-200 hover:cursor-pointer"
                      src="/assets/right.svg"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

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
