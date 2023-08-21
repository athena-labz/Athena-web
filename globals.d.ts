// globals.d.ts

type UserData = {
  username: string;
  email: string;
  name: string;
  role: string;
  stakeAddress: string;
}

type TaskData = {
  projectId: string;
  name: string;
  description: string;
  status: string;
  date: string;
}

type TaskStatus = "Awaiting" | "Progress" | "Review" | "Approved" | "Rejected";

type SubmissionEvent = {
  title: string;
  type: "submission" | "approval" | "rejection" | "revision";
  content: string;
  date: string;
};
