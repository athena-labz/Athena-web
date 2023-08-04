import { ReactNode, useState } from "react";
import { UsernameCard } from "./User";

export type FundingEvent = {
  username: string;
  email: string;
  amount: bigint;
};

export type SubmissionEvent = {
  title: string;
  type: "submission" | "approval" | "rejection" | "revision";
  content: string;
  date: string;
};

export type FundingState =
  | "AvailableCreator"
  | "AvailableFunder"
  | "ProgressCreator"
  | "ProgressFunder"
  | "ReviewAdmin"
  | "ReviewUser"
  | "Approved"
  | "Rejected";

type FundingContainerProps = {
  fundingHistory: FundingEvent[];
  submissionHistory: SubmissionEvent[];
  totalFundingAmount: bigint;
  fundingState:
    | "AvailableCreator"
    | "AvailableFunder"
    | "ProgressCreator"
    | "ProgressFunder"
    | "ReviewAdmin"
    | "ReviewUser"
    | "Approved"
    | "Rejected";
};

type FundingStatusProps = {
  state: FundingState;
};

type ButtonContainerProps = {
  children: ReactNode;
  onClick: () => void;
};

type SelectorProps = {
  options: {
    name: string;
    element: ReactNode;
  }[];
};

const parseCurrencyAmount = (amount: bigint) => {
  return (Number(amount) / 1_000_000).toLocaleString();
};

const FundingStatus = ({ state }: FundingStatusProps) => (
  <div className="flex flex-row w-full justify-center">
    <span className="text-base text-slate-500">
      {state === "AvailableCreator" || state === "AvailableFunder"
        ? "Awaiting Funding"
        : state === "ProgressCreator" || state === "ProgressFunder"
        ? "Awaiting submission"
        : state === "ReviewAdmin" || state === "ReviewUser"
        ? "Awaiting review"
        : state === "Approved"
        ? "Approved by admins"
        : "Rejected by admins"}
    </span>
  </div>
);

const ButtonContainer = ({ children, onClick }: ButtonContainerProps) => (
  <div className="flex w-full h-full justify-center items-center">
    <button
      className="bg-dark-blue py-4 w-72 md:w-full rounded-lg text-white text-2xl font-bold"
      onClick={onClick}
    >
      {children}
    </button>
  </div>
);

const Selector = ({ options }: SelectorProps) => {
  const [optionSelected, setOptionSelected] = useState<number>(0);

  if (options.length < 1) throw new Error("Selector needs at least one option");

  return (
    <div className="flex flex-col gap-4">
      {options.length > 1 ? (
        <>
          <div className="flex flex-row gap-4 items-center justify-center">
            {options.map(({ name }, idx) => (
              <button
                className={`${
                  optionSelected === idx
                    ? "bg-dark-blue text-white"
                    : "bg-white text-dark-blue"
                } border-2 border-dark-blue  rounded-lg font-bold w-full py-1 text-lg`}
                onClick={() => setOptionSelected(idx)}
              >
                {name}
              </button>
            ))}
          </div>
          {options[optionSelected].element}
        </>
      ) : (
        options[optionSelected].element
      )}
    </div>
  );
};

export const FundingContainer = ({
  fundingHistory,
  totalFundingAmount,
  submissionHistory,
  fundingState,
}: FundingContainerProps) => {
  // 0. Funding available (creator) - history of previous funds
  // 1. Funding available (funder) - big button to fund and history
  //    of previous funds
  // 2. Funding completed (creator) - in progress message and button
  //    to mark task as completed and history of previous funds
  // 3. Funding completed (funder) - in progress message and history
  //    of previous funds
  // 3. Project under review (admin) - awaiting review message with button
  //    to review and history of previous funds
  // 4. Project under review (funder / creator) - awaiting review message
  //    and history of previous funds
  // 5. Project approved - approved message and history of commits and
  //    history of previous funds
  // 6. Project rejected - rejected message and history of commits and
  //    history of previous funds

  const FundingHistory = () => (
    <div className="flex flex-col gap-4 bg-white rounded-lg">
      <span className="text-2xl text-slate-600 font-semibold">
        Funding history
      </span>
      <div className="flex flex-col gap-2 h-32 overflow-y-scroll">
        {fundingHistory.map(({ email, username, amount }) => (
          <div className="flex flex-row justify-between items-center rounded-lg p-2 border-2 border-slate-200">
            <UsernameCard username={username} email={email} />
            <div className="flex flex-row gap-2 items-center text-slate-500 text-sm">
              <span>{parseCurrencyAmount(amount)} STEIN</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row w-full justify-end">
        <span className="text-sm text-slate-500">
          Total: {parseCurrencyAmount(totalFundingAmount)} STEIN
        </span>
      </div>
    </div>
  );

  const SubmissionHistory = () => (
    <div className="flex flex-col gap-4">
      <span className="text-2xl text-slate-600 font-semibold">
        Submission history
      </span>
      <div className="flex flex-col gap-2 h-32 overflow-y-scroll">
        {submissionHistory.map(({ title, content, type, date }) => (
          <div
            className={`flex flex-row justify-between items-center rounded-lg p-2 border-2 ${
              type === "submission"
                ? "border-main-blue"
                : type === "rejection"
                ? "border-rose-500"
                : type === "approval"
                ? "border-emerald-500"
                : "border-slate-200"
            } border-slate-200`}
          >
            <div className="flex items-center text-slate-500 text-sm">
              <span className="w-32 truncate">{title}</span>
            </div>
            <div className="flex items-center text-slate-500 text-sm">
              <span>{date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 w-full bg-white rounded-lg p-8">
      <FundingStatus state={fundingState} />
      <hr />
      <Selector
        options={[
          {
            name: "Funding",
            element: <FundingHistory />,
          },
          ...(["ReviewUser", "ReviewAdmin", "Approved", "Rejected"].includes(
            fundingState
          )
            ? [
                {
                  name: "Submission",
                  element: <SubmissionHistory />,
                },
              ]
            : []),
        ]}
      />
      <div className="mt-2">
        {fundingState === "AvailableCreator" ? (
          <></>
        ) : fundingState === "AvailableFunder" ? (
          <ButtonContainer onClick={() => {}}>Fund task</ButtonContainer>
        ) : fundingState === "ProgressCreator" ? (
          <ButtonContainer onClick={() => {}}>
            Mark as completed
          </ButtonContainer>
        ) : fundingState === "ProgressFunder" ? (
          <></>
        ) : fundingState === "ReviewAdmin" ? (
          <div className="flex flex-col gap-8">
            <ButtonContainer onClick={() => {}}>Review work</ButtonContainer>
          </div>
        ) : fundingState === "ReviewUser" ? (
          <></>
        ) : fundingState === "Approved" ? (
          <></>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
