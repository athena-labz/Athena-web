import { ReactNode } from "react";

import { taskStatusDisplay } from "../utils/taskHelpers";

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

type TaskStatusContainerProps = {
  actionHistory: TaskActionData[];
  isStarted: boolean;
  isRejected: boolean;
  isCompleted: boolean;
  isUserAssigned: boolean;
  isUserTeacher: boolean;
};

export const TaskStatusContainer = ({
  actionHistory,
  isStarted,
  isRejected,
  isCompleted,
  isUserAssigned,
  isUserTeacher,
}: TaskStatusContainerProps) => {
  const ActionHistory = () => (
    <div className="flex flex-col gap-4">
      <span className="text-2xl text-slate-600 font-semibold">
        Action history
      </span>
      <div className="flex flex-col gap-2 h-32 overflow-y-scroll">
        {actionHistory.length === 0 && <span>No actions yet</span>}

        {actionHistory.map(
          ({ name, description, isSubmission, isReview, date }) => (
            <div
              className={`flex flex-row justify-between items-center rounded-lg p-2 border-2 ${
                isSubmission ? "border-main-blue" : "border-yellow-500"
              } border-slate-200`}
            >
              <div className="flex items-center text-slate-500 text-sm">
                <span className="w-32 truncate">{name}</span>
                <span className="text-justify line-clamp-3">{description}</span>
              </div>
              <div className="flex items-center text-slate-500 text-sm">
                <span>{date.toISOString()}</span>
              </div>
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

      {isStarted && !isRejected && !isCompleted && isUserAssigned && (
        <div className="mt-2">
          <ButtonContainer onClick={() => {}}>
            Submit work for review
          </ButtonContainer>
        </div>
      )}

      {isStarted && !isRejected && !isCompleted && isUserTeacher && (
        <div className="mt-2">
          <ButtonContainer onClick={() => {}}>Review work</ButtonContainer>
        </div>
      )}
    </div>
  );
};
