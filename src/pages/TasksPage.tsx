import { ProjectCard } from "../components/ProjectCard";
import { taskListSample } from "../assets/samples";

const TasksPage = () => {
  return (
    <div className="p-8 inline-block">
      <div className="p-4 mb-8">
        <h1 className="text-4xl text-slate-600 font-semibold">Tasks</h1>
      </div>
      <div className="flex flex-wrap gap-4">
        {taskListSample.map(
          ({ projectId, name, description, status, date }) => (
            <ProjectCard
              projectId={projectId}
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
