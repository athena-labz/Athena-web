import { useEffect, useState } from "react";

import { Avatar } from "../components/User";
import { LoadingIcon } from "../components/LoadingIcon";

import { useBackEnd } from "../contexts/BackEndProvider";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";
import { toast } from "react-toastify";

type GroupCreatePageProps = {
  organizationId: string;
};

const GroupCreatePage = ({ organizationId }: GroupCreatePageProps) => {
  const [identifier, setIdentifier] = useState<string>("");
  const [name, setName] = useState<string>("");

  const [groupMembers, setGroupMembers] = useState<string[]>([]);

  const { user } = useUser()!;
  const backEnd = useBackEnd()!;
  const navigate = useNavigate();

  const updateGroupMember = (index: number, email: string) => {
    const groupMembersCopy = [...groupMembers];
    groupMembersCopy[index] = email;

    setGroupMembers(groupMembersCopy);
  };

  const addGroupMember = () => {
    if (groupMembers.length === 4) {
      return;
    }

    setGroupMembers([...groupMembers, ""]);
  };

  const removeGroupMember = (index: number) => {
    const groupMembersCopy = [...groupMembers];
    groupMembersCopy.splice(index, 1);

    setGroupMembers(groupMembersCopy);
  };

  const createGroup = async () => {
    if (user === null) {
      toast.error("User tried to create task while signed out");
      return;
    }

    try {
      await backEnd.createGroup(
        user.token,
        organizationId,
        identifier,
        name,
        groupMembers
      );
      navigate(`/organization/${organizationId}/profile`);
    } catch (error: any) {
      if (
        error?.response?.data?.detail &&
        typeof error?.response?.data?.detail === "string"
      ) {
        toast.error(`Server error: ${error.response.data.detail}`);
      } else {
        console.error(error);
        toast.error("Server error while trying to create group");
      }
    }
  };

  return (
    <div className="p-8 w-full inline-block">
      <div className="p-4 mb-8">
        <h1 className="text-4xl text-slate-600 font-semibold">Create Group</h1>
      </div>
      <div className="text-lg md:text-xl font-semibold w-full flex flex-col gap-8 bg-white rounded-lg p-8">
        <div className="flex flex-col gap-2 w-full">
          <span>What is the name of your group?</span>
          <input
            className="p-4 bg-opposite-pale border-400 border-2 text-black rounded-lg"
            placeholder="Cool Group"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <span>What is a good unique id name?</span>
          <input
            className="p-4 bg-opposite-pale border-400 border-2 text-black rounded-lg"
            placeholder="awesome_group_2023"
            pattern="^[a-zA-Z0-9_-]{1,50}$"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <span>Who will be the members of your group?</span>

          <div className="flex flex-col gap-4">
            <span className="p-4 w-96 rounded-lg bg-slate-200 border-slate-200 border-2 text-slate-400">
              You
            </span>

            {groupMembers.map((email, index) => (
              <div className="flex flex-row items-center gap-4">
                <input
                  className="p-4 w-96 rounded-lg border-slate-200 border-2"
                  placeholder="alice@email.com"
                  value={email}
                  onChange={(e) => updateGroupMember(index, e.target.value)}
                />
                <img
                  className="h-12 hover:cursor-pointer"
                  onClick={() => removeGroupMember(index)}
                  src="/assets/remove_circle.svg"
                />
              </div>
            ))}

            <div className="flex justify-left">
              <div
                onClick={addGroupMember}
                className={`${
                  groupMembers.length === 4 ? "opacity-75" : ""
                } p-4 hover:cursor-pointer flex flex-row gap-2 items-center bg-slate-600 rounded-lg`}
              >
                <img className="h-6" src="/assets/add_circle.svg" />
                <span className="text-white text-base font-bold">
                  Add group member
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-end gap-4">
          <div
            onClick={() => navigate(`/organization/${organizationId}/profile`)}
            className="p-4 px-8 mb-4 hover:cursor-pointer flex flex-row gap-2 items-center border-dark-blue border-2 rounded-lg"
          >
            <span className="text-dark-blue text-2xl font-bold">Back</span>
          </div>
          <div
            onClick={createGroup}
            className="p-4 px-8 mb-4 hover:cursor-pointer flex flex-row gap-2 items-center bg-dark-blue rounded-lg"
          >
            <span className="text-white text-2xl font-bold">Create group</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCreatePage;
