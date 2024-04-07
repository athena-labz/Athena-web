import { useNavigate } from "react-router-dom";
import { UserCard } from "../components/UserCard";
import { useBackEnd } from "../contexts/BackEndProvider";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LoadingIcon } from "../components/LoadingIcon";

type UsersPageProps = {
  organizationId: string;
};

const UsersPage = ({ organizationId }: UsersPageProps) => {
  const [usersList, setUsersList] = useState<UserListData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const backEnd = useBackEnd()!;

  useEffect(() => {
    loadUsers(currentPage);
  }, [currentPage]);

  const loadUsers = async (page: number) => {
    try {
      const usersList = await backEnd.getOrganizationUsers(
        organizationId,
        page,
        9
      );

      setUsersList(usersList);
    } catch (error: any) {
      if (error?.response?.data?.detail) {
        toast.error(`Server error: ${error.response.data.detail}`);
      } else {
        toast.error("Server error while trying to get organization tasks");
      }
    }
  };

  return (
    <div className="p-8 inline-block">
      <div className="p-4 mb-8">
        <h1 className="text-4xl text-slate-600 font-semibold">Users</h1>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap gap-4">
          {usersList === null && (
            <div className="flex w-full justify-center items-center">
              <LoadingIcon className="text-blue-500 w-24 h-24" />
            </div>
          )}

          {usersList && usersList.elements.length === 0 && (
            <div className="p-4 text-lg text-slate-400">
              <span>No users registered yet.</span>
            </div>
          )}

          {usersList && usersList.elements.length > 0 && (
            <div className="flex flex-col">
              <div className="flex flex-wrap gap-4">
                {usersList.elements.map(({ email, stakeAddress, userType }) => (
                  <UserCard
                    email={email}
                    stakeAddress={stakeAddress}
                    userType={userType}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {usersList && usersList.elements.length > 0 && (
          <div className="flex flex-row justify-center">
            <div className="flex items-center">
              <img
                onClick={() =>
                  currentPage > 1 ? setCurrentPage(currentPage - 1) : null
                }
                className={`${currentPage === 1 ? "opacity-75" : ""
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
                  currentPage < usersList.maxPage
                    ? setCurrentPage(currentPage + 1)
                    : null
                }
                className={`${currentPage === usersList.maxPage ? "opacity-75" : ""
                  } h-16 p-2 rounded-full transition delay-100 hover:bg-slate-200 hover:cursor-pointer`}
                src="/assets/right.svg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
