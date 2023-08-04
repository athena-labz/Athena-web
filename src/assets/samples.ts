import { FundingEvent, SubmissionEvent } from "../components/FundingContainer";

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

export const fundingHistorySample: FundingEvent[] = [
  {
    username: "alice_theone",
    email: "alice@email.com",
    amount: BigInt(10_000_000),
  },
  {
    username: "bobTheBuilder",
    email: "bob@email.com",
    amount: BigInt(25_000_000),
  },
  {
    username: "barneyWas_right",
    email: "barney@email.com",
    amount: BigInt(7_512_345),
  },
  {
    username: "then_therewasNone",
    email: "agatha@email.com",
    amount: BigInt(10_000_000),
  },
  {
    username: "then_therewasNone",
    email: "agatha@email.com",
    amount: BigInt(10_000_000),
  },
  {
    username: "then_therewasNone",
    email: "agatha@email.com",
    amount: BigInt(10_000_000),
  },
  {
    username: "then_therewasNone",
    email: "agatha@email.com",
    amount: BigInt(10_000_000),
  },
  {
    username: "then_therewasNone",
    email: "agatha@email.com",
    amount: BigInt(10_000_000),
  },
];
