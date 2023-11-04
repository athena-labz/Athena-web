import { useNavigate } from "react-router-dom";
import { Avatar } from "./User";

type OrganizationCardProps = {
  identifier: string;
  name: string;
  description: string;
  areas: string[];
};

export const OrganizationCard = ({
  identifier,
  name,
  description,
  areas,
}: OrganizationCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/organization/${identifier}`)}
      className="flex flex-col text-slate-600 gap-2 w-72 p-8 bg-white rounded-lg hover:cursor-pointer"
    >
      <span className="text-lg font-semibold">{name}</span>
      <span className="text-justify line-clamp-3">{description}</span>
      <hr className="mt-2" />
      <div className="flex flex-row text-sm text-slate-400 justify-between items-center">
        <span className="truncate">{areas.join(", ")}</span>
      </div>
    </div>
  );
};
