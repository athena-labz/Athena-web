import { useEffect, useState } from "react";

import { Avatar } from "../components/User";
import { LoadingIcon } from "../components/LoadingIcon";

import { useBackEnd } from "../contexts/BackEndProvider";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";
import { toast } from "react-toastify";

type FundTaskPageProps = {
  organizationId: string;
  taskId: string;
};

const FundTaskPage = ({ organizationId, taskId }: FundTaskPageProps) => {
  const [amount, setAmount] = useState<number>(0);
  const [userBalance, setUserBalance] = useState<BalanceData | null>(null);

  const { user } = useUser()!;
  const backEnd = useBackEnd()!;
  const navigate = useNavigate();

  useEffect(() => {
    updateUserBalance();
  }, [])

  const updateUserBalance = async () => {
    if (user === null) {
      toast.error("Tried to access profile with user signed out");
      return;
    }

    setUserBalance(null);

    try {
      const balance = await backEnd.getBalance(user.token, organizationId);
      setUserBalance(balance);
    } catch (error: any) {
      if (error?.response?.data?.detail) {
        toast.error(`Server error: ${error.response.data.detail}`);
      } else {
        console.error(error);
        toast.error("Server error while trying to get user balance");
      }
    }
  };

  const fundTask = async () => {
    if (user === null) {
      toast.error("User tried to submit work while signed out");
      return;
    }

    if (amount <= 0) {
      toast.error("Amount must be greater than zero!")
      return
    }

    try {
      await backEnd.fundTask(user.token, organizationId, taskId, amount)

      toast.success("Successfully funded task!");
      navigate(`/organization/${organizationId}/crowdfunding/${taskId}`);
    } catch (error: any) {
      if (error?.response?.data?.detail) {
        toast.error(`Server error: ${error.response.data.detail}`);
      } else {
        console.error(error);
        toast.error("Server error while trying to fund task");
      }
    }
  };

  return (
    <div className="p-8 w-full inline-block">
      <div className="p-4 mb-8">
        <h1 className="text-4xl text-slate-600 font-semibold">Fund task</h1>
      </div>
      <div className="text-lg md:text-xl font-semibold w-full flex flex-col gap-8 bg-white rounded-lg p-8">
        <div className="flex flex-col gap-2">
          <span>How much do you want to give in case the task is successful?</span>
          <div className="flex flex-col">
            { userBalance && (
              <span className="text-slate-500 text-sm">You have {userBalance.available} tokens available</span>
            ) }
            <input
              className="p-4 bg-opposite-paleborder-400 border-2 text-black rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              type="number"
            />
          </div>
        </div>

        <div className="w-full flex justify-end gap-4">
          <div
            onClick={() =>
              navigate(`/organization/${organizationId}/crowdfunding/${taskId}`)
            }
            className="p-4 px-8 mb-4 hover:cursor-pointer flex flex-row gap-2 items-center border-dark-blue border-2 rounded-lg"
          >
            <span className="text-dark-blue text-2xl font-bold">Back</span>
          </div>
          <div
            onClick={fundTask}
            className="p-4 px-8 mb-4 hover:cursor-pointer flex flex-row gap-2 items-center bg-dark-blue rounded-lg"
          >
            <span className="text-white text-2xl font-bold">Submit</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundTaskPage;
