// globals.d.ts

type UserData = {
  username: string;
  email: string;
  isEmailConfirmed: boolean;
  firstName: string;
  lastName: string;
  stakeAddress: string;
};

type TaskStatus = "Awaiting" | "Progress" | "Review" | "Approved" | "Rejected";

type TaskData = {
  projectId: string;
  name: string;
  description: string;
  status: TaskStatus;
  date: string;
  userAssigned?: {
    username: string;
    email: string;
  };
};

type SubmissionEventData = {
  title: string;
  type: "submission" | "approval" | "rejection" | "revision";
  content: string;
  date: string;
};

type ListResponse<T> = {
  currentPage: number;
  maxPage: number;
  elements: T[];
};

type TaskListData = ListResponse<TaskData>;
type UserListData = ListResponse<UserOrganizationData>;

type StudentReward = {
  email: string;
  rewards: number;
};