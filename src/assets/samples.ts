export const submissionHistorySample: SubmissionEvent[] = [
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

export const taskListSample = [
  {
    projectId: "de1c0125-e1e4-4442-a132-57ba9b1e1b64",
    name: "Project 1",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse 
    dapibus lacinia est eu hendrerit. Etiam quis fringilla velit, eget porta
    mauris. Quisque sit amet leo dictum, lacinia nisi quis, finibus metus.
    Nulla eget consectetur dolor. Mauris fringilla, nisl sit amet lacinia
    tristique, ex tortor porttitor augue, eu ultricies nulla nibh sed mi.
    Pellentesque lobortis pellentesque nisl, a semper elit facilisis congue.
    Nulla mattis fermentum massa, vitae interdum lorem accumsan sit amet.
    Maecenas tempus nisl eget felis vehicula, quis fermentum mi cursus.`,
    status: "Progress",
    date: "Jun 2, 2023",
  },
  {
    projectId: "de1c0125-e1e4-4442-a132-57ba9b1e1b64",
    name: "Project 1",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse 
    dapibus lacinia est eu hendrerit. Etiam quis fringilla velit, eget porta
    mauris. Quisque sit amet leo dictum, lacinia nisi quis, finibus metus.
    Nulla eget consectetur dolor. Mauris fringilla, nisl sit amet lacinia
    tristique, ex tortor porttitor augue, eu ultricies nulla nibh sed mi.
    Pellentesque lobortis pellentesque nisl, a semper elit facilisis congue.
    Nulla mattis fermentum massa, vitae interdum lorem accumsan sit amet.
    Maecenas tempus nisl eget felis vehicula, quis fermentum mi cursus.`,
    status: "Progress",
    date: "Jun 2, 2023",
  },
  {
    projectId: "de1c0125-e1e4-4442-a132-57ba9b1e1b64",
    name: "Project 1",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse 
    dapibus lacinia est eu hendrerit. Etiam quis fringilla velit, eget porta
    mauris. Quisque sit amet leo dictum, lacinia nisi quis, finibus metus.
    Nulla eget consectetur dolor. Mauris fringilla, nisl sit amet lacinia
    tristique, ex tortor porttitor augue, eu ultricies nulla nibh sed mi.
    Pellentesque lobortis pellentesque nisl, a semper elit facilisis congue.
    Nulla mattis fermentum massa, vitae interdum lorem accumsan sit amet.
    Maecenas tempus nisl eget felis vehicula, quis fermentum mi cursus.`,
    status: "Progress",
    date: "Jun 2, 2023",
  },
  {
    projectId: "de1c0125-e1e4-4442-a132-57ba9b1e1b64",
    name: "Project 1",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse 
    dapibus lacinia est eu hendrerit. Etiam quis fringilla velit, eget porta
    mauris. Quisque sit amet leo dictum, lacinia nisi quis, finibus metus.
    Nulla eget consectetur dolor. Mauris fringilla, nisl sit amet lacinia
    tristique, ex tortor porttitor augue, eu ultricies nulla nibh sed mi.
    Pellentesque lobortis pellentesque nisl, a semper elit facilisis congue.
    Nulla mattis fermentum massa, vitae interdum lorem accumsan sit amet.
    Maecenas tempus nisl eget felis vehicula, quis fermentum mi cursus.`,
    status: "Progress",
    date: "Jun 2, 2023",
  },
];

export const taskContentSample = {
  name: "Task Name",
  taskStatus: "Progress",
  description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
  dapibus lacinia est eu hendrerit. Etiam quis fringilla velit, eget porta
  mauris. Quisque sit amet leo dictum, lacinia nisi quis, finibus metus.
  Nulla eget consectetur dolor. Mauris fringilla, nisl sit amet lacinia
  tristique, ex tortor porttitor augue, eu ultricies nulla nibh sed mi.
  Pellentesque lobortis pellentesque nisl, a semper elit facilisis congue.
  Nulla mattis fermentum massa, vitae interdum lorem accumsan sit amet.
  Maecenas tempus nisl eget felis vehicula, quis fermentum mi cursus.`,
  date: "Jan 3, 2023",
  submissionHistory: submissionHistorySample,
  userAssigned: {
    username: "alice_theone",
    email: "alice@email.com",
  },
};

export const userDataSample = {
  username: "alice_theone",
  name: "Alice Bjourne",
  email: "alice@email.com",
  role: "coach",
  stakeAddress:
    "stake_test1upmpu3pjqgjx4amy8ulv4fxpy26cmh553yhxhjhqurz9y7qrymfne",
};
