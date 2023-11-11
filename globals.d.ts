// globals.d.ts

type UserType = "student" | "teacher" | "organizer" | "supervisor";

type ExternalUserData = {
  userType: UserType;
  email: string;
  stakeAddress: string;
};

type UserData = {
  userType: UserType;
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

type GroupMembersipStatus = "Leader" | "Invite" | "Member" | "Rejected";

type GroupMembersipData = {
  status: GroupMembersipStatus;
  group: {
    identifier: string;
    name: string;
  };
  date: Date
}

type TaskStatus = "Awaiting" | "Progress" | "Approved" | "Rejected";

type TaskData = {
  identifier: string;
  name: string;
  description: string;
  deadline: Date;
  status: TaskStatus;
  date: Date;
};

type TaskActionData = {
  name: string;
  description: string;
  isSubmission: boolean;
  isReview: boolean;
  date: Date;
}

type NFTData = {
  nftId: string;
  name: string;
  image: string;
};

type ListResponse<T> = {
  currentPage: number;
  maxPage: number;
  elements: T[];
};

type NFTListData = ListResponse<NFTData>;
type TaskListData = ListResponse<TaskData>;
type TaskActionListData = ListResponse<TaskActionData>;

type OrganizationListData = ListResponse<OrganizationData>;
type GroupMembersipListData = ListResponse<GroupMembersipData>;
type UserListData = ListResponse<ExternalUserData>;


type StudentReward = {
  email: string;
  rewards: number;
};
