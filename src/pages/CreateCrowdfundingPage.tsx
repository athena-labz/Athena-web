import { useEffect, useState } from "react";

import { useBackEnd } from "../contexts/BackEndProvider";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";
import { toast } from "react-toastify";

import { v4 as uuidv4 } from "uuid";

const addDays = (date: Date, days: number) => {
  var result = date;
  result.setDate(result.getDate() + days);

  return result;
};

const addDaysToCurrentDate = (daysToAdd: number): string => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + daysToAdd);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(currentDate);
};

type CreateCrowdfundingPageProps = {
  organizationId: string;
};

const CreateCrowdfundingPage = ({ organizationId }: CreateCrowdfundingPageProps) => {
  const [name, setName] = useState<string>("");
  const [description1, setDescription1] = useState<string>("");
  const [description2, setDescription2] = useState<string>("");
  const [description3, setDescription3] = useState<string>("");
  const [description4, setDescription4] = useState<string>("");
  const [daysToCompletion, setDaysToCompletion] = useState<number>(30);
  const [expectedDeadline, setExpectedDeadline] = useState<string>("");

  const [userRewards, setUserRewards] = useState<number>(0);
  const [studentsRewards, setStudentsRewards] = useState<StudentReward[]>([]);

  const { user } = useUser()!;
  const backEnd = useBackEnd()!;
  const navigate = useNavigate();

  const updateStudentEmail = (index: number, email: string) => {
    const studentsRewardsCopy = [...studentsRewards];
    let specificStudentRewardCopy: StudentReward = {
      ...studentsRewardsCopy[index],
    };

    specificStudentRewardCopy.email = email;

    studentsRewardsCopy[index] = specificStudentRewardCopy;

    setStudentsRewards(studentsRewardsCopy);
  };

  const updateStudentRewards = (index: number, rewards: number) => {
    const studentsRewardsCopy = [...studentsRewards];
    let specificStudentRewardCopy: StudentReward = {
      ...studentsRewardsCopy[index],
    };

    specificStudentRewardCopy.rewards = rewards;

    studentsRewardsCopy[index] = specificStudentRewardCopy;

    setStudentsRewards(studentsRewardsCopy);
  };

  const addStudent = () => {
    setStudentsRewards([...studentsRewards, { email: "", rewards: 0 }]);
  };

  const removeStudent = (index: number) => {
    const studentsRewardsCopy = [...studentsRewards];
    studentsRewardsCopy.splice(index, 1);

    setStudentsRewards(studentsRewardsCopy);
  };

  useEffect(() => {
    setExpectedDeadline(addDaysToCurrentDate(daysToCompletion));
  }, [daysToCompletion]);

  const submitTask = async () => {
    if (user === null) {
      toast.error("User tried to create task while signed out");
      return;
    }

    let rewards: { [email: string]: number } = {};

    rewards[user.email] = userRewards;
    for (let i = 0; i < studentsRewards.length; i++) {
      rewards[studentsRewards[i].email] = studentsRewards[i].rewards;
    }

    try {
      await backEnd.createCrowdfundingTask(
        user.token,
        organizationId,
        uuidv4(),
        name,
        [description1, description2, description3, description4].join("\n"),
        addDays(new Date(), daysToCompletion)
      );

      navigate(`/organization/${organizationId}/crowdfunding`);
    } catch (error: any) {
      if (error?.response?.data?.detail) {
        toast.error(`Server error: ${error.response.data.detail}`);
      } else {
        console.error(error);
        toast.error("Server error while trying to create task");
      }
    }
  };

  return (
    <div className="p-8 w-full inline-block">
      <div className="p-4 mb-8">
        <h1 className="text-4xl text-slate-600 font-semibold">Create Task</h1>
      </div>
      <div className="text-lg md:text-xl font-semibold w-full flex flex-col gap-8 bg-white rounded-lg p-8">
        <div className="flex gap-2 w-full">
          <span className="text-slate-400">
            The following description fields will serve for a multi-disciplinary
            knowledge-base assessment. Please remember that project assessment
            relies largely on your skills in unicity and specificity design.
          </span>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <span>
            Write a name which summarises what you are proposing to do.
          </span>
          <input
            className="p-4 bg-opposite-pale border-400 border-2 text-black rounded-lg"
            placeholder="Build flag for team"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <span>Describe briefily what your task is about.</span>
          <textarea
            className="w-full h-40 p-4 bg-opposite-paleborder-400 border-2 text-black rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description1}
            onChange={(e) => setDescription1(e.target.value)}
            placeholder=""
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <span>
            In relation to your proposal which strategies allow a team-work
            development ?
          </span>
          <textarea
            className="w-full h-40 p-4 bg-opposite-paleborder-400 border-2 text-black rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description2}
            onChange={(e) => setDescription2(e.target.value)}
            placeholder=""
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <span>
            Please highlight one or more creative features of your project.
            (Please remember that creativity can occur at every execution phase
            of the project)
          </span>
          <textarea
            className="w-full h-40 p-4 bg-opposite-paleborder-400 border-2 text-black rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description3}
            onChange={(e) => setDescription3(e.target.value)}
            placeholder=""
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <span>
            Describe the project fundamental phases which lead ideas into
            actions.
          </span>
          <textarea
            className="w-full h-40 p-4 bg-opposite-paleborder-400 border-2 text-black rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description4}
            onChange={(e) => setDescription4(e.target.value)}
            placeholder=""
          />
        </div>

        <div className="flex flex-col gap-2">
          <span>How many days (max) will you need to complete it?</span>
          <div className="w-full flex flex-row justify-left items-center gap-4">
            <input
              className="p-4 w-28 bg-opposite-pale border-400 border-2 text-black rounded-lg"
              min={0}
              onKeyDown={(event) => {
                if (event.key === "." || event.key === ",") {
                  event.preventDefault();
                }
              }}
              type="number"
              value={daysToCompletion}
              onChange={(e) => setDaysToCompletion(Number(e.target.value))}
            />
            <span className="text-slate-400">
              If approved today, deadline would be <i>{expectedDeadline}</i>
            </span>
          </div>
        </div>

        <div className="w-full flex justify-end gap-4">
          <div
            onClick={() => navigate(`/organization/${organizationId}/crowdfunding`)}
            className="p-4 px-8 mb-4 hover:cursor-pointer flex flex-row gap-2 items-center border-dark-blue border-2 rounded-lg"
          >
            <span className="text-dark-blue text-2xl font-bold">Back</span>
          </div>
          <div
            onClick={submitTask}
            className="p-4 px-8 mb-4 hover:cursor-pointer flex flex-row gap-2 items-center bg-dark-blue rounded-lg"
          >
            <span className="text-white text-2xl font-bold">Create task</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCrowdfundingPage;
