import { capitalize } from "../utils/stringHelpers";
import { Avatar } from "./User";

type UserCardProps = {
  email: string;
  stakeAddress: string;
  userType: UserType;
};

export const UserCard = ({ email, stakeAddress, userType }: UserCardProps) => {
  return (
    <div className="inline-block text-slate-600 gap-4 w-72 p-8 bg-white rounded-lg hover:cursor-pointer">
      <div className="flex flex-row justify-start items-center gap-2">
        <Avatar email={email} className="w-8 rounded-full" />
        <span className="text-lg font-semibold">{email}</span>
      </div>
      <div className="flex flex-col gap-2 mt-4 mb-4">
        <span className="truncate">{stakeAddress}</span>
      </div>
      <div className="inline-block w-full">
        <hr className="mb-2" />
        <div className="flex flex-row text-dark-blue font-semibold items-end gap-1">
          <img className="h-6" src="/assets/role.svg" />
          <span>{capitalize(userType)}</span>
        </div>
      </div>
    </div>
  );
};
