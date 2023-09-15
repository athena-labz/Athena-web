import { useEffect, useState } from "react";

import { Avatar } from "../components/User";
import { LoadingIcon } from "../components/LoadingIcon";
import { TaskStatusContainer } from "../components/TaskStatusContainer";

import { taskContentSample } from "../assets/samples";
import { useBackEnd } from "../contexts/BackEndProvider";

type TaskContent = {
  name: string;
  taskStatus: TaskStatus;
  description: string;
  date: string;
  submissionHistory: SubmissionEventData[];
  userAssigned?: {
    username: string;
    email: string;
  };
};

type TaskContentProps = {
  name: string;
  description: string;
  date: string;
  userAssigned?: {
    username: string;
    email: string;
  };
};

const TaskContent = ({
  name,
  description,
  date,
  userAssigned,
}: TaskContentProps) => (
  <div className="flex h-full items-start col-span-2">
    <div className="flex flex-col w-full gap-4 bg-white rounded-lg p-8">
      <h1 className="text-3xl text-slate-600 font-semibold">{name}</h1>
      <hr />
      <h1 className="text-2xl text-slate-600 font-semibold">About this task</h1>
      <span className="text-justify">{description}</span>
      <hr />
      <div className="flex flex-row justify-between items-center">
        {userAssigned && (
          <div className="flex flex-row gap-2 items-center text-slate-500 text-sm">
            <span>Assigned to</span>
            <div className="flex flex-row justify-start items-center gap-1 hover:text-slate-600 hover:cursor-pointer">
              <Avatar email={userAssigned.email} className="w-4 rounded-full" />
              <span className="">{userAssigned.username}</span>
            </div>
          </div>
        )}

        <div className="flex flex-row gap-2 items-center text-slate-500 text-sm">
          <span>{date}</span>
        </div>
      </div>
    </div>
  </div>
);

type SpecificTaskPageProps = {
  taskId: string;
};

const SpecificTaskPage = ({ taskId }: SpecificTaskPageProps) => {
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [submissionHistory, setSubmissionHistory] = useState<
    SubmissionEventData[] | null
  >(null);

  const backEnd = useBackEnd()!;

  useEffect(() => {
    loadTaskInformation();
  }, []);

  const loadTaskInformation = async () => {
    backEnd.getTaskInformation(taskId).then((taskData) => {
      setTaskData(taskData);
    });

    backEnd.getTaskSubmissionHistory(taskId).then((submissionHistory) => {
      setSubmissionHistory(submissionHistory);
    });
  };

  return (
    <div className="p-8 w-full h-full inline-block">
      {taskData === null && (
        <div className="flex w-full h-full justify-center items-center">
          <LoadingIcon className="text-blue-500 w-36 h-36" />
        </div>
      )}

      {taskData && submissionHistory && (
        <div className="flex flex-wrap md:grid md:grid-cols-3 gap-4">
          <TaskContent
            name={taskData.name}
            description={taskData.description}
            date={taskData.date}
            userAssigned={taskData.userAssigned}
          />

          <div className="flex h-full items-start">
            <TaskStatusContainer
              taskStatus={taskData.status}
              userRole="AssignedUser"
              submissionHistory={submissionHistory}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecificTaskPage;
