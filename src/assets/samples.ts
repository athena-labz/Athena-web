export const submissionHistorySample = [
  {
    title: "First attempt",
    type: "submission",
    content: "",
    date: "Jan 5, 2023",
  },
  {
    title: "Task needs improvement",
    type: "revision",
    content: "",
    date: "Jan 5, 2023",
  },
  {
    title: "Reviewed attempt",
    type: "submission",
    content: "",
    date: "Jan 5, 2023",
  },
  {
    title: "Rejected",
    type: "rejection",
    content: "",
    date: "Jan 5, 2023",
  },
  {
    title: "Final attempt",
    type: "submission",
    content: "",
    date: "Jan 5, 2023",
  },
  {
    title: "Approved",
    type: "approval",
    content: "",
    date: "Jan 5, 2023",
  },
];

export const taskContentSample = {
  projectId: "1ec0781c-c748-4c79-9120-aea6b390052c",
  name: "Project 1",
  status: "Progress",
  userAssigned: {
    username: "alice_theone",
    email: "alice@email.com",
  },
  description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
  dapibus lacinia est eu hendrerit. Etiam quis fringilla velit, eget porta
  mauris. Quisque sit amet leo dictum, lacinia nisi quis, finibus metus.
  Nulla eget consectetur dolor. Mauris fringilla, nisl sit amet lacinia
  tristique, ex tortor porttitor augue, eu ultricies nulla nibh sed mi.
  Pellentesque lobortis pellentesque nisl, a semper elit facilisis congue.
  Nulla mattis fermentum massa, vitae interdum lorem accumsan sit amet.
  Maecenas tempus nisl eget felis vehicula, quis fermentum mi cursus.`,
  date: "Jan 3, 2023",
};

export const taskListSample = [...Array(50).keys()].map(
  () => taskContentSample
);

export const userDataSample = {
  username: "alice_theone",
  firstName: "Alice",
  lastName: "Bjourne",
  email: "alice@email.com",
  isEmailConfirmed: true,
  stakeAddress:
    "stake_test1upmpu3pjqgjx4amy8ulv4fxpy26cmh553yhxhjhqurz9y7qrymfne",
};

export const userListSample = [...Array(50).keys()].map(() => userDataSample);
