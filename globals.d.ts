// globals.d.ts

type UserData = {
  userType: "student" | "teacher" | "organizer";
  email: string;
  stakeAddress: string;
  token: string;
};

type OrganizationData = {
  identifier: string;
  type: "groups" | "individual";
  name: string;
  description: string;
  areas: string[];
  creationDate: Date;
};

type TaskStatus = "Awaiting" | "Progress" | "Approved" | "Rejected";

type TaskData = {
  identifier: string;
  name: string;
  description: string;
  deadline: Date;
  status: TaskStatus;
  date: string;
};

type NFTData = {
  nftId: string;
  name: string;
  image: string;
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

type NFTListData = ListResponse<NFTData>;
type TaskListData = ListResponse<TaskData>;
type OrganizationListData = ListResponse<OrganizationData>;
type UserListData = ListResponse<UserOrganizationData>;

type StudentReward = {
  email: string;
  rewards: number;
};
