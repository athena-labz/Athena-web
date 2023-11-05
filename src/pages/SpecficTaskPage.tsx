import { useEffect, useState } from "react";

import { Avatar } from "../components/User";
import { LoadingIcon } from "../components/LoadingIcon";
import { TaskStatusContainer } from "../components/TaskStatusContainer";

import { taskContentSample } from "../assets/samples";
import { useBackEnd } from "../contexts/BackEndProvider";
import { toast } from "react-toastify";
import { useUser } from "../contexts/UserProvider";

type TaskContentProps = {
  name: string;
  description: string;
  date: Date;
  users: string[]; // email of the group participants
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

type SpecificTaskPageProps = {
  organizationId: string;
  taskId: string;
};

const SpecificTaskPage = ({
  organizationId,
  taskId,
}: SpecificTaskPageProps) => {
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [taskMembers, setTaskMembers] = useState<ExternalUserData[] | null>(
    null
  );
  const [taskActions, setTaskActions] = useState<TaskActionData[] | null>(null);
  const [isUserAssigned, setIsUserAssigned] = useState(false);

  const { user } = useUser()!;
  const backEnd = useBackEnd()!;

  useEffect(() => {
    if (user === null || taskMembers === null) {
      return;
    }

    if (taskMembers.map(({ email }) => email).includes(user.email)) {
      setIsUserAssigned(true);
    } else {
      setIsUserAssigned(false);
    }
  }, [taskMembers]);

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
      const members = await backEnd.getTaskMembers(organizationId, taskId);
      setTaskMembers(members);
    } catch (error: any) {
      if (error?.response?.data?.detail) {
        toast.error(`Server error: ${error.response.data.detail}`);
      } else {
        console.error(error);
        toast.error("Server error while trying to get task members");
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

      {taskData && taskActions && taskMembers && user && (
        <div className="flex flex-wrap md:grid md:grid-cols-3 gap-4">
          <TaskContent
            name={taskData.name}
            description={taskData.description}
            date={taskData.date}
            users={[]}
          />

          <div className="flex h-full items-start">
            <TaskStatusContainer
              actionHistory={taskActions}
              isStarted={taskData.status !== "Awaiting"}
              isRejected={taskData.status === "Rejected"}
              isCompleted={taskData.status === "Approved"}
              isUserAssigned={isUserAssigned}
              isUserTeacher={user.userType === "teacher"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecificTaskPage;
