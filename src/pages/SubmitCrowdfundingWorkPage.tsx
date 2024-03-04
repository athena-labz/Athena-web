import { useEffect, useState } from "react";

import { useBackEnd } from "../contexts/BackEndProvider";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";
import { toast } from "react-toastify";

type SubmitCrowdfundingWorkPageProps = {
  organizationId: string;
  taskId: string;
};

const SubmitCrowdfundingWorkPage = ({ organizationId, taskId }: SubmitCrowdfundingWorkPageProps) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const { user } = useUser()!;
  const backEnd = useBackEnd()!;
  const navigate = useNavigate();

  const submitCrowdfundingWork = async () => {
    if (user === null) {
      toast.error("User tried to submit work while signed out");
      return;
    }

    try {
      await backEnd.submitTask(
        user.token,
        organizationId,
        taskId,
        name,
        description
      );

      toast.success("Successfully submited work!");

      navigate(`/organization/${organizationId}/crowdfunding/${taskId}`);
    } catch (error: any) {
      if (error?.response?.data?.detail) {
        toast.error(`Server error: ${error.response.data.detail}`);
      } else {
        console.error(error);
        toast.error("Server error while trying to submit work");
      }
    }
  };

  return (
    <div className="p-8 w-full inline-block">
      <div className="p-4 mb-8">
        <h1 className="text-4xl text-slate-600 font-semibold">Submit work</h1>
      </div>
      <div className="text-lg md:text-xl font-semibold w-full flex flex-col gap-8 bg-white rounded-lg p-8">
        <div className="flex flex-col gap-2 w-full">
          <span>Give it a name to remember this submission later.</span>
          <input
            className="p-4 bg-opposite-pale border-400 border-2 text-black rounded-lg"
            placeholder="Build flag for team"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <span>Describe the work you did and include any links necessary.</span>
          <textarea
            className="w-full h-40 p-4 bg-opposite-paleborder-400 border-2 text-black rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder=""
          />
        </div>

        <div className="w-full flex justify-end gap-4">
          <div
            onClick={() => navigate(`/organization/${organizationId}/crowdfunding/${taskId}`)}
            className="p-4 px-8 mb-4 hover:cursor-pointer flex flex-row gap-2 items-center border-dark-blue border-2 rounded-lg"
          >
            <span className="text-dark-blue text-2xl font-bold">Back</span>
          </div>
          <div
            onClick={submitCrowdfundingWork}
            className="p-4 px-8 mb-4 hover:cursor-pointer flex flex-row gap-2 items-center bg-dark-blue rounded-lg"
          >
            <span className="text-white text-2xl font-bold">Submit work</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitCrowdfundingWorkPage;
