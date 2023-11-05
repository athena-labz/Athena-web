import { useNavigate, useParams } from "react-router-dom";

import { useBackEnd } from "../contexts/BackEndProvider";
import { useUser } from "../contexts/UserProvider";
import { toast } from "react-toastify";
import { useState } from "react";

type GroupCardProps = {
  organizationId: string;
  groupId: string;
  name: string;
  status: GroupMembersipStatus;
  date: Date;
  onAction: () => void;
};

export const GroupCard = ({
  organizationId,
  groupId,
  name,
  status,
  date,
  onAction,
}: GroupCardProps) => {
  const [disableButtons, setDisableButtons] = useState(false);

  const { user } = useUser()!;
  const backEnd = useBackEnd()!;

  const acceptInvite = async () => {
    if (disableButtons) return;

    if (user === null) {
      toast.error("Tried to accept group invite while signed out");
      return;
    }
    
    setDisableButtons(true);

    try {
      await backEnd.acceptGroup(user.token, organizationId, groupId);
      toast.success("Successfully accepted group invite!");
      onAction();
    } catch (error: any) {
      if (
        error?.response?.data?.detail &&
        typeof error?.response?.data?.detail === "string"
      ) {
        toast.error(`Server error: ${error.response.data.detail}`);
      } else {
        console.error(error);
        toast.error("Server error while trying to accept invite");
      }
    }

    setDisableButtons(false);
  };

  const rejectInvite = async () => {
    if (disableButtons) return;

    if (user === null) {
      toast.error("Tried to accept group invite while signed out");
      return;
    }

    setDisableButtons(true);

    try {
      await backEnd.rejectGroup(user.token, organizationId, groupId);
      toast.success("Successfully accepted group invite!");
      onAction();
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

    setDisableButtons(false);
  };

  return (
    <div className="flex flex-col text-slate-600 gap-2 w-72 p-8 bg-white rounded-lg">
      <span className="text-dark-blue font-semibold">{status}</span>
      <span className="text-lg font-semibold">{name}</span>
      {status === "Invite" && (
        <div className="mt-4 flex flex-row gap-2 justify-end">
          <div
            onClick={acceptInvite}
            className={`${disableButtons ? "opacity-75" : ""} p-2 px-4 hover:cursor-pointer flex flex-row gap-2 items-center bg-green-400 hover:bg-green-600 rounded-lg`}
          >
            <span className="text-white text-sm font-bold">Accept</span>
          </div>
          <div
            onClick={rejectInvite}
            className={`${disableButtons ? "opacity-75" : ""} p-2 px-4 hover:cursor-pointer flex flex-row gap-2 items-center bg-red-400 hover:bg-red-600 rounded-lg`}
          >
            <span className="text-white text-sm font-bold">Reject</span>
          </div>
        </div>
      )}
      <hr className="mt-2" />
      <div className="flex flex-row text-sm text-slate-400 justify-between items-center">
        <span>{groupId}</span>
        <span>{date.toDateString()}</span>
      </div>
    </div>
  );
};
