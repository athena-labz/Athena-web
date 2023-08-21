import { UserCard } from "../components/UserCard";


const UsersPage = () => {
  return (
    <div className="p-8 inline-block">
      <div className="p-4 mb-8">
        <h1 className="text-4xl text-slate-600 font-semibold">Users</h1>
      </div>
      <div className="flex flex-wrap gap-4">
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
      </div>
    </div>
  );
};

export default UsersPage;