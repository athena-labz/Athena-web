import { ProjectCard } from "../components/ProjectCard";
import { taskListSample } from "../assets/samples";
import { useNavigate } from "react-router-dom";
import { useBackEnd } from "../contexts/BackEndProvider";
import { useEffect, useState } from "react";
import { LoadingIcon } from "../components/LoadingIcon";

type TasksPageProps = {
  organization: string;
};

const TasksPage = ({ organization }: TasksPageProps) => {
  const [tasksList, setTasksList] = useState<TaskListData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const backEnd = useBackEnd()!;
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks(currentPage);
  }, []);

  const loadTasks = async (page: number) => {
      // TODO
    // const taskList = await backEnd.getTaskList(organization, page, 10);

    // setTasksList(taskList);
  };

  return (
    <div className="w-full p-8 inline-block">
      <div className="p-4 mb-8 flex flex-row justify-between items-center">
        <h1 className="text-4xl text-slate-600 font-semibold">Tasks</h1>
        <div className="flex justify-end">
          <div
            onClick={() =>
              navigate(`/organization/${organization}/tasks/create`)
            }
            className="p-4 mb-4 hover:cursor-pointer flex flex-row gap-2 items-center bg-dark-blue rounded-lg"
          >
            <img className="h-8" src="/assets/add_task.svg" />
            <span className="text-white text-lg font-bold">Create task</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {tasksList === null && (
          <div className="flex w-full justify-center items-center">
            <LoadingIcon className="text-blue-500 w-24 h-24" />
          </div>
        )}

        {tasksList && tasksList.elements.length === 0 && (
          <div className="p-4 text-lg text-slate-400">
            <span>No tasks created yet.</span>
          </div>
        )}

        {tasksList &&
          tasksList.elements.map(
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
    </div>
  );
};

export default TasksPage;
