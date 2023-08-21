import { Avatar } from "./User";


export const UserCard = () => {
  return (
    <div className="inline-block text-slate-600 gap-4 w-72 p-8 bg-white rounded-lg hover:cursor-pointer">
      <div className="flex flex-row justify-start items-center gap-2">
        <Avatar email="alice@email.com" className="w-8 rounded-full" />
        <span className="text-lg font-semibold">alice_theone</span>
      </div>
      <div className="flex flex-col gap-2 mt-4 mb-4">
        <span className="truncate">alice@email.com</span>
        <span className="truncate">
          stake_test1upmpu3pjqgjx4amy8ulv4fxpy26cmh553yhxhjhqurz9y7qrymfne
        </span>
      </div>
      <div className="inline-block w-full">
        <hr className="mb-2" />
        <span className="text-slate-400">3 projects completed</span>
      </div>
    </div>
  );
};
