import { useEffect, useState } from "react";

import { Avatar } from "../components/User";
import { LoadingIcon } from "../components/LoadingIcon";

import { useBackEnd } from "../contexts/BackEndProvider";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";

const addDaysToCurrentDate = (daysToAdd: number): string => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + daysToAdd);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(currentDate);
};

type CreateTaskPageProps = {
  organization: string;
};

// Name
// Description
// Date of completion
// Rewards for everyone

const CreateTaskPage = ({ organization }: CreateTaskPageProps) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
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
      return Promise.reject("User not signed in");
    }

    // backEnd.createTask(
    //   user,
    //   "signature",
    //   name,
    //   description,
    //   daysToCompletion,
    //   userRewards,
    //   studentsRewards
    // );
  };

  return (
    <div className="p-8 w-full inline-block">
      <div className="p-4 mb-8">
        <h1 className="text-4xl text-slate-600 font-semibold">Create Task</h1>
      </div>
      <div className="text-lg md:text-xl font-semibold w-full flex flex-col gap-8 bg-white rounded-lg p-8">
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
          <span>
            Describe in more detail what you will do and specify the
            deliverables.
          </span>
          <textarea
            className="w-full h-40 p-4 bg-opposite-paleborder-400 border-2 text-black rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={"I will do..."}
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

        <div className="flex flex-col gap-2 w-full">
          <span>How much in rewards will each one receive?</span>

          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-4">
              <span className="p-4 w-96 rounded-lg bg-slate-200 border-slate-200 border-2 text-slate-400">
                You
              </span>
              <input
                className="p-4 w-36 bg-opposite-pale border-400 border-2 text-black rounded-lg"
                min={0}
                type="number"
                value={userRewards}
                onChange={(e) => setUserRewards(Number(e.target.value))}
              />
            </div>

            {studentsRewards.map(({ email, rewards }, index) => (
              <div className="flex flex-row items-center gap-4">
                <input
                  className="p-4 w-96 rounded-lg border-slate-200 border-2"
                  placeholder="Student email"
                  value={email}
                  onChange={(e) => updateStudentEmail(index, e.target.value)}
                />
                <input
                  className="p-4 w-36 bg-opposite-pale border-400 border-2 text-black rounded-lg"
                  min={0}
                  type="number"
                  value={rewards}
                  onChange={(e) =>
                    updateStudentRewards(index, Number(e.target.value))
                  }
                />
                <img
                  className="h-12 hover:cursor-pointer"
                  onClick={() => removeStudent(index)}
                  src="/assets/remove_circle.svg"
                />
              </div>
            ))}

            <div className="flex justify-left">
              <div
                onClick={() => addStudent()}
                className="p-4 hover:cursor-pointer flex flex-row gap-2 items-center bg-slate-600 rounded-lg"
              >
                <img className="h-6" src="/assets/add_circle.svg" />
                <span className="text-white text-base font-bold">
                  Add student
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-end gap-4">
          <div
            onClick={() => navigate(`/organization/${organization}/tasks`)}
            className="p-4 px-8 mb-4 hover:cursor-pointer flex flex-row gap-2 items-center border-dark-blue border-2 rounded-lg"
          >
            <span className="text-dark-blue text-2xl font-bold">Back</span>
          </div>
          <div
            onClick={() => {
              submitTask();
              navigate(`/organization/${organization}/tasks`)
            }}
            className="p-4 px-8 mb-4 hover:cursor-pointer flex flex-row gap-2 items-center bg-dark-blue rounded-lg"
          >
            <span className="text-white text-2xl font-bold">Create task</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskPage;
