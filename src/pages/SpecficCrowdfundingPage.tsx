import { useEffect, useState } from "react";

import { Avatar } from "../components/User";
import { LoadingIcon } from "../components/LoadingIcon";
import { TaskStatusContainer } from "../components/TaskStatusContainer";

import { useBackEnd } from "../contexts/BackEndProvider";
import { toast } from "react-toastify";
import { useUser } from "../contexts/UserProvider";

type TaskContentProps = {
  name: string;
  description: string;
  date: Date;
};

const TaskContent = ({ name, description, date }: TaskContentProps) => (
  <div className="flex h-full items-start col-span-2">
    <div className="flex flex-col w-full gap-4 bg-white rounded-lg p-8">
      <h1 className="text-3xl text-slate-600 font-semibold">{name}</h1>
      <hr />
      <h1 className="text-2xl text-slate-600 font-semibold">About this task</h1>
      <span className="text-justify">{description}</span>
      <hr />
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center text-slate-500 text-sm">
          <span>{date.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  </div>
);

type SpecificCrowdfundingPageProps = {
  organizationId: string;
  taskId: string;
};

const SpecificCrowdfundingPage = ({
  organizationId,
  taskId,
}: SpecificCrowdfundingPageProps) => {
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [taskOwner, setTaskOwner] = useState<ExternalUserData | null>(
    null
  );
  const [taskActions, setTaskActions] = useState<TaskActionData[] | null>(null);

  const { user } = useUser()!;
  const backEnd = useBackEnd()!;

  useEffect(() => {
    loadTaskInformation();
  }, []);

  const loadTaskInformation = async () => {
    try {
      const task = await backEnd.getTask(organizationId, taskId);
      setTaskData(task);
    } catch (error: any) {
      if (error?.response?.data?.detail) {
        toast.error(`Server error: ${error.response.data.detail}`);
      } else {
        console.error(error);
        toast.error("Server error while trying to get task");
      }
    }

    try {
      const actions = await backEnd.getTaskActions(
        organizationId,
        taskId,
        1,
        20
      );
      setTaskActions(actions.elements);
    } catch (error: any) {
      if (error?.response?.data?.detail) {
        toast.error(`Server error: ${error.response.data.detail}`);
      } else {
        console.error(error);
        toast.error("Server error while trying to get task actions");
      }
    }

    try {
      const owner = await backEnd.getTaskOwner(organizationId, taskId);
      setTaskOwner(owner);
    } catch (error: any) {
      if (error?.response?.data?.detail) {
        toast.error(`Server error: ${error.response.data.detail}`);
      } else {
        console.error(error);
        toast.error("Server error while trying to get task owner");
      }
    }
  };

  return (
    <div className="p-8 w-full h-full inline-block">
      {taskData === null && (
        <div className="flex w-full h-full justify-center items-center">
          <LoadingIcon className="text-blue-500 w-36 h-36" />
        </div>
      )}

      {taskData && taskActions && taskOwner && user && (
        <div className="flex flex-wrap md:grid md:grid-cols-3 gap-4">
          <TaskContent
            name={taskData.name}
            description={taskData.description}
            date={taskData.date}
          />

          <div className="flex h-full items-start">
            <TaskStatusContainer
              organizationId={organizationId}
              taskId={taskId}
              actionHistory={taskActions}
              isStarted={taskData.status !== "Awaiting"}
              isRejected={taskData.status === "Rejected"}
              isCompleted={taskData.status === "Approved"}
              isUserAssigned={true}
              isUserTeacher={user.userType === "teacher"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecificCrowdfundingPage;
