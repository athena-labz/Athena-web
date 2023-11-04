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

type TaskStatusContainerProps = {
  submissionHistory: SubmissionEventData[];
  taskStatus: TaskStatus;
  userRole: "Admin" | "AssignedUser" | "NormalUser";
};

export const TaskStatusContainer = ({
  submissionHistory,
  taskStatus,
  userRole,
}: TaskStatusContainerProps) => {
  const SubmissionHistory = () => (
    <div className="flex flex-col gap-4">
      <span className="text-2xl text-slate-600 font-semibold">
        Submission history
      </span>
      <div className="flex flex-col gap-2 h-32 overflow-y-scroll">
        {submissionHistory.map(({ title, content, type, date }) => (
          <div
            className={`flex flex-row justify-between items-center rounded-lg p-2 border-2 ${
              type === "submission"
                ? "border-main-blue"
                : type === "rejection"
                ? "border-rose-500"
                : type === "approval"
                ? "border-emerald-500"
                : "border-slate-200"
            } border-slate-200`}
          >
            <div className="flex items-center text-slate-500 text-sm">
              <span className="w-32 truncate">{title}</span>
            </div>
            <div className="flex items-center text-slate-500 text-sm">
              <span>{date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 w-full bg-white rounded-lg p-8">
      <div className="flex flex-row w-full justify-center">
        <span className="text-base text-slate-500">
          {taskStatusDisplay(taskStatus)}
        </span>
      </div>

      <hr />

      {["Progress", "Approved", "Rejected"].includes(taskStatus) && (
        <SubmissionHistory />
      )}

      {taskStatus === "Progress" && userRole === "AssignedUser" && (
        <div className="mt-2">
          <ButtonContainer onClick={() => {}}>
            Mark as completed
          </ButtonContainer>
        </div>
      )}

      {taskStatus === "Progress" && userRole === "Admin" && (
        <div className="mt-2">
          <ButtonContainer onClick={() => {}}>Review work</ButtonContainer>
        </div>
      )}
    </div>
  );
};
