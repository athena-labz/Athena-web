import { useEffect, useState } from "react";

import { Avatar } from "../components/User";
import { LoadingIcon } from "../components/LoadingIcon";
import { ProjectCard } from "../components/ProjectCard";

import { useBackEnd } from "../contexts/BackEndProvider";

import { capitalize, abbreviate } from "../utils/stringHelpers";
import { useUser } from "../contexts/UserProvider";
import { toast } from "react-toastify";
import { GroupCard } from "../components/GroupCard";
import { useNavigate } from "react-router-dom";

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
  const [stakeAddressAbbreviated, setStakeAddressAbbreviated] = useState(true);

  return (
    <div className="w-full flex flex-row justify-between gap-4 bg-white rounded-lg p-8">
      <div className="flex flex-row gap-8">
        <Avatar email={email} className="h-24 rounded-full" />
        <div className="h-full flex">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <span className="text-4xl text-slate-600">{email}</span>
              <span
                onClick={() =>
                  setStakeAddressAbbreviated(!stakeAddressAbbreviated)
                }
                className="text-slate-500 hover:cursor-pointer"
              >
                {stakeAddressAbbreviated
                  ? abbreviate(stakeAddress, 13, 3)
                  : stakeAddress}
              </span>
            </div>
            <div className="flex flex-row text-dark-blue font-semibold items-end gap-1">
              <img className="h-6" src="/assets/role.svg" />
              <span>{capitalize(type)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type TasksContainerProps = {
  userTasks: TaskListData | null;
  updateUserTasks: (page: number) => Promise<void>;
};

const TasksContainer = ({
  userTasks,
  updateUserTasks,
}: TasksContainerProps) => {
  const [userTasksPage, setUserTasksPage] = useState<number>(1);

  useEffect(() => {
    updateUserTasks(userTasksPage);
  }, [userTasksPage]);

  return (
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

      {userTasks && userTasks.elements.length === 0 && (
        <div className="px-4 text-lg text-slate-400">
          <span>No tasks assigned to this user.</span>
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
  );
};

type GroupsContainerProps = {
  organizationId: string;
  userGroups: GroupMembersipListData | null;
  updateUserGroups: (page: number) => Promise<void>;
};

const GroupsContainer = ({
  organizationId,
  userGroups,
  updateUserGroups,
}: GroupsContainerProps) => {
  const [userGroupsPage, setUserGroupsPage] = useState<number>(1);

  const navigate = useNavigate();

  useEffect(() => {
    updateUserGroups(userGroupsPage);
  }, [userGroupsPage]);

  return (
    <div className="inline-block w-full">
      <div className="p-4 mb-4 w-full flex flex-row justify-between items-center">
        <h1 className="text-4xl text-slate-600 font-semibold">Group invites</h1>
        <div className="flex justify-end">
          <div
            onClick={() =>
              navigate(`/organization/${organizationId}/group/create`)
            }
            className="p-4 mb-4 hover:cursor-pointer flex flex-row gap-2 items-center bg-dark-blue rounded-lg"
          >
            <img className="h-8" src="/assets/add_task.svg" />
            <span className="text-white text-lg font-bold">Create group</span>
          </div>
        </div>
      </div>

      {userGroups === null && (
        <div className="flex w-full justify-center items-center">
          <LoadingIcon className="text-blue-500 w-24 h-24" />
        </div>
      )}

      {userGroups && userGroups.elements.length === 0 && (
        <div className="px-4 text-lg text-slate-400">
          <span>No group invites.</span>
        </div>
      )}

      {userGroups && (
        <div className="flex flex-row gap-8">
          <div className="flex flex-row gap-4">
            {userGroupsPage > 1 && (
              <div className="flex items-center">
                <img
                  onClick={() => setUserGroupsPage(userGroupsPage - 1)}
                  className="h-16 p-2 rounded-full transition delay-100 hover:bg-slate-200 hover:cursor-pointer"
                  src="/assets/left.svg"
                />
              </div>
            )}

            {userGroups.elements.map(({ status, group, date }) => (
              <GroupCard
                organizationId={organizationId}
                groupId={group.identifier}
                name={group.name}
                status={status}
                date={date}
                onAction={() => updateUserGroups(userGroupsPage)}
              />
            ))}
          </div>

          {userGroupsPage < userGroups.maxPage && (
            <div className="flex items-center">
              <img
                onClick={() => setUserGroupsPage(userGroupsPage + 1)}
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

type ProfilePageProps = {
  organization: string;
};

const ProfilePage = ({ organization }: ProfilePageProps) => {
  const [userTasks, setUserTasks] = useState<TaskListData | null>(null);
  const [userGroups, setUserGroups] = useState<GroupMembersipListData | null>(
    null
  );

  const { user } = useUser()!;
  const { getUserTasks, getUserGroups } = useBackEnd()!;

  const updateUserTasks = async (page: number) => {
    if (user === null) {
      toast.error("Tried to access profile with user signed out");
      return;
    }

    setUserTasks(null);

    const assignedTasks = await getUserTasks(user.token, organization, page, 3);
    setUserTasks(assignedTasks);
  };

  const updateUserGroups = async (page: number) => {
    if (user === null) {
      toast.error("Tried to access profile with user signed out");
      return;
    }

    setUserGroups(null);

    const groups = await getUserGroups(user.token, organization, page, 3);
    setUserGroups(groups);
  };

  return (
    <div className="p-8 w-full h-full inline-block overflow-auto">
      {user === null && (
        <div className="flex w-full justify-center items-center">
          <LoadingIcon className="text-blue-500 w-24 h-24" />
        </div>
      )}

      {user && (
        <div className="w-full flex flex-col gap-8">
          <ProfileContainer
            email={user.email}
            type={user.userType}
            stakeAddress={user.stakeAddress}
          />

          <TasksContainer
            userTasks={userTasks}
            updateUserTasks={updateUserTasks}
          />

          <GroupsContainer
            organizationId={organization}
            userGroups={userGroups}
            updateUserGroups={updateUserGroups}
          />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
