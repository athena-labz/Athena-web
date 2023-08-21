import { useNavigate, useParams } from "react-router-dom";
import { taskStatusDisplay } from "../utils/taskHelpers";

type Params = {
  organization: string;
};

type ProjectCardProps = {
  projectId: string;
  name: string;
  description: string;
  status: TaskStatus;
  date: string;
};

export const ProjectCard = ({
  projectId,
  name,
  description,
  status,
  date,
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const { organization } = useParams<Params>();

  return (
    <div
      onClick={() =>
        navigate(`/organization/${organization}/tasks/${projectId}`)
      }
      className="flex flex-col text-slate-600 gap-2 w-72 p-8 bg-white rounded-lg hover:cursor-pointer"
    >
      <span className="text-lg font-semibold">{name}</span>
      <span className="text-justify line-clamp-3">{description}</span>
      <hr className="mt-2" />
      <div className="flex flex-row text-sm text-slate-400 justify-between items-center">
        <span>{taskStatusDisplay(status)}</span>
        <span>{date}</span>
      </div>
    </div>
  );
};
