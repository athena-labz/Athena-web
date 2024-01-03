import { useNavigate, useParams } from "react-router-dom";
import { taskStatusDisplay } from "../utils/taskHelpers";
import { useEffect } from "react";

type Params = {
  organizationId: string;
};

type ProjectCardProps = {
  projectId: string;
  name: string;
  description: string;
  status: TaskStatus;
  date: Date;
  type: 'group' | 'individual';
  theme?: 'default' | 'border';
};

export const ProjectCard = ({
  projectId,
  name,
  description,
  status,
  date,
  type,
  theme = "default"
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const { organizationId } = useParams<Params>();

  if (theme === "default")
    return (
      <div
        onClick={() =>
          navigate(`/organization/${organizationId}/${type === 'individual' ? 'crowdfunding' : 'tasks'}/${projectId}`)
        }
        className="flex flex-col text-slate-600 gap-2 w-72 p-8 bg-white rounded-lg hover:cursor-pointer"
      >
        <span className="text-lg font-semibold">{name}</span>
        <span className="text-justify line-clamp-3">{description}</span>
        <hr className="mt-2" />
        <div className="flex flex-row text-sm text-slate-400 justify-between items-center">
          <span>{taskStatusDisplay(status)}</span>
          <span>{date.toLocaleDateString()}</span>
        </div>
      </div>
    );
  else if (theme === "border")
    return (
      <div
        onClick={() =>
          navigate(`/organization/${organizationId}/${type === 'individual' ? 'crowdfunding' : 'tasks'}/${projectId}`)
        }
        className="flex flex-col text-slate-600 gap-2 w-72 p-8 bg-white border-2 border-slate-400 rounded-lg hover:cursor-pointer"
      >
        <span className="text-lg text-slate-600 font-semibold">{name}</span>
        <span className="text-justify line-clamp-3">{description}</span>
        <hr className="mt-2" />
        <div className="flex flex-row text-sm text-slate-400 justify-between items-center">
          <span>{taskStatusDisplay(status)}</span>
          <span>{date.toLocaleDateString()}</span>
        </div>
      </div>
    );
  else
    return <></>
};
