import { ReactNode, useState } from "react";

import { useBackEnd } from "../contexts/BackEndProvider";
import { useUser } from "../contexts/UserProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type ButtonContainerProps = {
  children: ReactNode;
  onClick: () => void;
};

const ButtonContainer = ({ children, onClick }: ButtonContainerProps) => (
  <div className="flex w-full h-full justify-center items-center">
    <button
      className="bg-dark-blue py-4 w-72 md:w-full rounded-lg text-white text-2xl font-bold"
      onClick={onClick}
    >
      {children}
    </button>
  </div>
);

const findTaskStatus = (
  isStarted: boolean,
  isRejected: boolean,
  isCompleted: boolean
) => {
  if (isRejected) {
    return "Rejected";
  } else if (isCompleted) {
    return "Completed";
  } else if (isStarted) {
    return "In progress";
  } else {
    return "Awaiting approval";
  }
};

type CrowdfundingStatusContainerProps = {
  organizationId: string;
  taskId: string;
  actionHistory: TaskActionData[];
  isStarted: boolean;
  isRejected: boolean;
  isCompleted: boolean;
  isUserOwner: boolean;
  isUserTeacher: boolean;
};

export const CrowdfundingStatusContainer = ({
  organizationId,
  taskId,
  actionHistory,
  isStarted,
  isRejected,
  isCompleted,
  isUserOwner,
  isUserTeacher,
}: CrowdfundingStatusContainerProps) => {
  const navigate = useNavigate();

  const backEnd = useBackEnd()!;
  const { user } = useUser()!;

  const [disableButtons, setDisableButtons] = useState(false);

  const approveStart = async () => {
    if (user === null) {
      toast.error("Tried to approve start of task while signed out");
      return;
    }

    setDisableButtons(true);

    try {
      await backEnd.approveStartTask(user.token, organizationId, taskId);
      toast.success("Successfully approved task!");
      navigate(`/organization/${organizationId}/crowdfunding/${taskId}`);
    } catch (error: any) {
      if (error?.response?.data?.detail) {
        toast.error(`Server error: ${error.response.data.detail}`);
      } else {
        console.error(error);
        toast.error("Server error while trying to approve task");
      }
    }

    setDisableButtons(false);
  };

  const rejectStart = async () => {
    if (user === null) {
      toast.error("Tried to reject start of task while signed out");
      return;
    }

    setDisableButtons(true);

    try {
      await backEnd.rejectStartTask(user.token, organizationId, taskId);
      toast.success("Successfully rejected task!");
      navigate(`/organization/${organizationId}/crowdfunding/${taskId}`);
    } catch (error: any) {
      if (error?.response?.data?.detail) {
        toast.error(`Server error: ${error.response.data.detail}`);
      } else {
        console.error(error);
        toast.error("Server error while trying to reject task");
      }
    }

    setDisableButtons(false);
  };

  const ActionHistory = () => (
    <div className="flex flex-col gap-4">
      <span className="text-2xl text-slate-600 font-semibold">
        Action history
      </span>
      <div className="flex flex-col gap-2 max-h-32 overflow-y-scroll">
        {actionHistory.length === 0 && <span>No actions yet</span>}

        {actionHistory.map(
          ({ name, description, isSubmission, isReview, date }) => (
            <div
              className={`flex flex-col rounded-lg p-2 border-2 ${isSubmission ? "border-slate-200" : "border-dark-blue"
                }`}
            >
              <div className="flex flex-row justify-between items-center gap-4">
                <div className="flex items-center text-slate-500 text-sm">
                  <span className="w-32 truncate">{name}</span>
                </div>
                <div className="flex items-center text-slate-500 text-sm">
                  <span>{date.toLocaleDateString()}</span>
                </div>
              </div>
              <span className="text-justify">{description}</span>
            </div>
          )
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 w-full bg-white rounded-lg p-8">
      <div className="flex flex-row w-full justify-center">
        <span className="text-base text-slate-500">
          {findTaskStatus(isStarted, isRejected, isCompleted)}
        </span>
      </div>

      <hr />

      <ActionHistory />

      {isStarted && !isRejected && !isCompleted && isUserOwner && (
        <div className="mt-2">
          <ButtonContainer
            onClick={() =>
              navigate(`/organization/${organizationId}/crowdfunding/${taskId}/submit`)
            }
          >
            Submit work
          </ButtonContainer>
        </div>
      )}

      {isStarted && !isRejected && !isCompleted && !isUserOwner && (
        <div className="mt-2">
          <ButtonContainer
            onClick={() =>
              navigate(`/organization/${organizationId}/crowdfunding/${taskId}/fund`)
            }
          >
            Fund task
          </ButtonContainer>
        </div>
      )}

      {!isStarted && isUserTeacher && (
        <div className="flex w-full h-full justify-center items-center">
          <button
            disabled={disableButtons}
            className={`${disableButtons ? "opacity-75" : ""
              } bg-dark-blue py-4 w-72 md:w-full rounded-lg text-white text-lg font-bold`}
            onClick={approveStart}
          >
            Approve start
          </button>
        </div>
      )}

      {!isStarted && isUserTeacher && (
        <div className="flex w-full h-full justify-center items-center">
          <button
            disabled={disableButtons}
            className={`${disableButtons ? "opacity-75" : ""
              } border-dark-blue border-2 text-dark-blue py-4 w-72 md:w-full rounded-lg text-lg font-bold`}
            onClick={rejectStart}
          >
            Reject start
          </button>
        </div>
      )}

      {isStarted && !isRejected && !isCompleted && isUserTeacher && (
        <div className="mt-2">
          <ButtonContainer
            onClick={() =>
              navigate(`/organization/${organizationId}/crowdfunding/${taskId}/review`)
            }
          >
            Review work
          </ButtonContainer>
        </div>
      )}
    </div>
  );
};