import * as React from "react";

import { createContext, useState, useContext, useEffect } from "react";
import {
  taskListSample,
  userListSample,
  taskContentSample,
  userDataSample,
  submissionHistorySample,
} from "../assets/samples";

import { v4 as uuidv4 } from "uuid";

type BackEndContext = {
  getUserInformation: (username: string) => Promise<UserData>;
  getUserRole: (username: string) => Promise<string>;
  getTaskInformation: (taskId: string) => Promise<TaskData>;
  getTaskList: (
    organizationId: string,
    page: number,
    count: number
  ) => Promise<TaskListData>;
  getUserList: (
    organizationId: string,
    page: number,
    count: number
  ) => Promise<UserListData>;
  getTaskListAssignedUser: (
    username: string,
    organizationId: string,
    page: number,
    count: number
  ) => Promise<TaskListData>;
  getTaskSubmissionHistory: (taskId: string) => Promise<SubmissionEventData[]>;
  createTask: (
    user: UserData,
    signature: string,
    name: string,
    description: string,
    daysToComplete: number,
    userRewards: number,
    studentRewards: StudentReward[]
  ) => Promise<void>;
  signIn: (
    stakeAddress: string,
    signatureKey: string,
    signaturePayload: string
  ) => Promise<UserData>;
  signUp: (
    stakeAddress: string,
    signatureKey: string,
    signaturePayload: string,
    username: string,
    email: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  registerInOrganization: (
    organizationId: string,
    role: string
  ) => Promise<void>;
};

type BackEndProviderProps = {
  children: JSX.Element;
};

export const BackEnd = createContext<BackEndContext | null>(null);

export const BackEndProvider = ({ children }: BackEndProviderProps) => {
  const waitForDelay = (delay: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, delay);
    });
  };

  const getUserInformation = async (username: string) => {
    await waitForDelay(500);

    return userDataSample;
  };

  const getUserRole = async (username: string) => {
    await waitForDelay(500);

    return "coach";
  };

  const getTaskInformation = async (taskId: string) => {
    await waitForDelay(500);

    const tasksString = localStorage.getItem("@tasks");
    const tasks: TaskData[] =
      tasksString === null ? [] : JSON.parse(tasksString);

    const specificTask = tasks.reduce((acc, task) =>
      task.projectId === taskId ? task : acc
    );

    return specificTask;
  };

  const getTaskList = async (
    organizationId: string,
    page: number,
    count: number
  ) => {
    await waitForDelay(500);

    const fullTasksString = localStorage.getItem("@tasks");
    const fullTasks =
      fullTasksString === null ? [] : JSON.parse(fullTasksString);

    const tasks = fullTasks.slice((page - 1) * count, page * count);
    if (tasks.length === 0) {
      console.error("Tried to get tasks for page that does not exist");

      return {
        elements: [],
        currentPage: page,
        maxPage: ~~((tasks.length - 1) / count) + 1,
      };
    }

    return {
      elements: tasks as TaskData[],
      currentPage: page,
      maxPage: ~~((tasks.length - 1) / count) + 1,
    };
  };

  const createTask = async (
    user: UserData,
    signature: string,
    name: string,
    description: string,
    daysToComplete: number,
    userRewards: number,
    studentRewards: StudentReward[]
  ) => {
    await waitForDelay(500);

    const tasksString = localStorage.getItem("@tasks");
    const tasks = tasksString === null ? [] : JSON.parse(tasksString);

    localStorage.setItem(
      "@tasks",
      JSON.stringify([
        ...tasks,
        {
          projectId: uuidv4(),
          name: name,
          description: description,
          status: "Awaiting",
          date: new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }).format(new Date()),
          userAssigned: {
            username: user.username,
            email: user.email,
          },
        },
      ])
    );
  };

  const getUserList = async (
    organizationId: string,
    page: number,
    count: number
  ) => {
    await waitForDelay(500);

    const users = userListSample.slice((page - 1) * count, page * count);
    if (users.length === 0) {
      console.error("Tried to get users for page that does not exist");

      return {
        elements: [],
        currentPage: page,
        maxPage: ~~((users.length - 1) / count) + 1,
      };
    }

    return {
      elements: users,
      currentPage: page,
      maxPage: ~~((users.length - 1) / count) + 1,
    };
  };

  const getTaskListAssignedUser = async (
    username: string,
    organizationId: string,
    page: number,
    count: number
  ) => {
    await waitForDelay(500);

    const tasks = taskListSample.slice((page - 1) * count, page * count);
    if (tasks.length === 0) {
      console.error("Tried to get tasks for page that does not exist");

      return {
        elements: [],
        currentPage: page,
        maxPage: ~~((tasks.length - 1) / count) + 1,
      };
    }

    return {
      elements: tasks as TaskData[],
      currentPage: page,
      maxPage: ~~((tasks.length - 1) / count) + 1,
    };
  };

  const getTaskSubmissionHistory = async (taskId: string) => {
    await waitForDelay(500);

    return submissionHistorySample as SubmissionEventData[];
  };

  const signIn = async (stakeAddress: string, signedMessage: string) => {
    await waitForDelay(500);

    // Should sign the message "Signing in at Athena at <time> with code <uuid>"
    // Backend will make sure code is unique and time is within the limits

    return userDataSample;
  };

  const signUp = async (
    stakeAddress: string,
    signatureKey: string,
    signaturePayload: string,
    username: string,
    email: string,
    firstName: string,
    lastName: string
  ) => {
    await waitForDelay(500);

    // Should sign the message "Signing up at Athena at <time> with code <uuid>"
    // Backend will make sure code is unique and time is within the limits

    return;
  };

  const registerInOrganization = async (
    organizationId: string,
    role: string
  ) => {
    await waitForDelay(500);

    return;
  };

  return (
    <BackEnd.Provider
      value={{
        getUserInformation,
        getUserRole,
        getTaskInformation,
        getTaskList,
        createTask,
        getUserList,
        getTaskListAssignedUser,
        getTaskSubmissionHistory,
        signIn,
        signUp,
        registerInOrganization,
      }}
    >
      {children}
    </BackEnd.Provider>
  );
};

export const useBackEnd = () => useContext(BackEnd);
