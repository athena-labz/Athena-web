import { useEffect, useState } from "react";

import { Avatar } from "../components/User";
import { LoadingIcon } from "../components/LoadingIcon";

import { useBackEnd } from "../contexts/BackEndProvider";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";
import { toast } from "react-toastify";

type ReviewWorkPageProps = {
  organizationId: string;
  taskId: string;
};

const ReviewWorkPage = ({ organizationId, taskId }: ReviewWorkPageProps) => {
  const [description, setDescription] = useState<string>("");
  const [action, setAction] = useState<"approve" | "reject" | "review">(
    "approve"
  );

  const { user } = useUser()!;
  const backEnd = useBackEnd()!;
  const navigate = useNavigate();

  const reviewWork = async () => {
    if (user === null) {
      toast.error("User tried to submit work while signed out");
      return;
    }

    try {
      if (action === "review") {
        await backEnd.submissionReviewTask(
          user.token,
          organizationId,
          taskId,
          description
        );
      } else if (action === "approve") {
        await backEnd.submissionApproveTask(
          user.token,
          organizationId,
          taskId,
          description
        );
      } else {
        await backEnd.submissionRejectTask(
          user.token,
          organizationId,
          taskId,
          description
        );
      }

      toast.success("Successfully reviewed work!");

      navigate(`/organization/${organizationId}/tasks/${taskId}`);
    } catch (error: any) {
      if (error?.response?.data?.detail) {
        toast.error(`Server error: ${error.response.data.detail}`);
      } else {
        console.error(error);
        toast.error("Server error while trying to review work");
      }
    }
  };

  return (
    <div className="p-8 w-full inline-block">
      <div className="p-4 mb-8">
        <h1 className="text-4xl text-slate-600 font-semibold">Review work</h1>
      </div>
      <div className="text-lg md:text-xl font-semibold w-full flex flex-col gap-8 bg-white rounded-lg p-8">
        <div className="flex flex-col gap-2">
          <span>What is your decision?</span>
          <select
            name="decision"
            value={action}
            onChange={(event) => setAction(event.target.value as any)}
            className="p-4 bg-opposite-pale border-2 text-slate-600 rounded-lg"
          >
            <option value="approve">Approve</option>
            <option value="review">Ask for changes</option>
            <option value="reject">Reject</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <span>
            What are the reasons for your decision? What needs to change if
            anything?
          </span>
          <textarea
            className="w-full h-40 p-4 bg-opposite-paleborder-400 border-2 text-black rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder=""
          />
        </div>

        <div className="w-full flex justify-end gap-4">
          <div
            onClick={() =>
              navigate(`/organization/${organizationId}/tasks/${taskId}`)
            }
            className="p-4 px-8 mb-4 hover:cursor-pointer flex flex-row gap-2 items-center border-dark-blue border-2 rounded-lg"
          >
            <span className="text-dark-blue text-2xl font-bold">Back</span>
          </div>
          <div
            onClick={reviewWork}
            className="p-4 px-8 mb-4 hover:cursor-pointer flex flex-row gap-2 items-center bg-dark-blue rounded-lg"
          >
            <span className="text-white text-2xl font-bold">Submit</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewWorkPage;
