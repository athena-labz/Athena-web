import { ProjectCard } from "../components/ProjectCard";
import { taskListSample } from "../assets/samples";
import { useNavigate } from "react-router-dom";
import { useBackEnd } from "../contexts/BackEndProvider";
import { useEffect, useState } from "react";
import { LoadingIcon } from "../components/LoadingIcon";
import { toast } from "react-toastify";

type TasksPageProps = {
  organizationId: string;
};

const TasksPage = ({ organizationId }: TasksPageProps) => {
  const [tasksList, setTasksList] = useState<TaskListData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const backEnd = useBackEnd()!;
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks(currentPage);
  }, [currentPage]);

  const loadTasks = async (page: number) => {
    try {
      const taskList = await backEnd.getOrganizationTasks(
        organizationId,
        page,
        9,
        'group'
      );
      setTasksList(taskList);
    } catch (error: any) {
      if (error?.response?.data?.detail) {
        toast.error(`Server error: ${error.response.data.detail}`);
      } else {
        toast.error("Server error while trying to get organization tasks");
      }
    }
  };

  return (
    <div className="w-full p-8 inline-block">
      <div className="p-4 mb-8 flex flex-row justify-between items-center">
        <h1 className="text-4xl text-slate-600 font-semibold">Tasks</h1>
        <div className="flex justify-end">
          <div
            onClick={() =>
              navigate(`/organization/${organizationId}/tasks/create`)
            }
            className="p-4 mb-4 hover:cursor-pointer flex flex-row gap-2 items-center bg-dark-blue rounded-lg"
          >
            <img className="h-8" src="/assets/add_task.svg" />
            <span className="text-white text-lg font-bold">Create task</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
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

        {tasksList && tasksList.elements.length > 0 && (
          <div className="flex flex-col">
            <div className="flex flex-wrap gap-4">
              {tasksList.elements.map(
                ({ identifier, name, description, status, date }) => (
                  <ProjectCard
                    projectId={identifier}
                    name={name}
                    description={description}
                    status={status as TaskStatus}
                    type={"group"}
                    date={date}
                  />
                )
              )}
            </div>

            <div className="flex flex-row justify-center">
              <div className="flex items-center">
                <img
                  onClick={() =>
                    currentPage > 1 ? setCurrentPage(currentPage - 1) : null
                  }
                  className={`${
                    currentPage === 1 ? "opacity-75" : ""
                  } h-16 p-2 rounded-full transition delay-100 hover:bg-slate-200 hover:cursor-pointer`}
                  src="/assets/left.svg"
                />
              </div>
              <div className="flex items-center">
                <span className="text-lg text-slate-600">{currentPage}</span>
              </div>
              <div className="flex items-center">
                <img
                  onClick={() =>
                    currentPage < tasksList.maxPage
                      ? setCurrentPage(currentPage + 1)
                      : null
                  }
                  className={`${
                    currentPage === tasksList.maxPage ? "opacity-75" : ""
                  } h-16 p-2 rounded-full transition delay-100 hover:bg-slate-200 hover:cursor-pointer`}
                  src="/assets/right.svg"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
