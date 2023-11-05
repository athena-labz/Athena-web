import * as React from "react";

import { createContext, useState, useContext, useEffect } from "react";
import {
  taskListSample,
  userListSample,
  taskContentSample,
  userDataSample,
  submissionHistorySample,
} from "../assets/samples";

import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 1000,
});

export type BackEndContext = {
  getUserInformation: (token: string) => Promise<UserData>;
  getUserTasks: (
    token: string,
    organizationId: string,
    page: number,
    count: number
  ) => Promise<TaskListData>;
  signIn: (stakeAddress: string, signature: string) => Promise<string>;
  signUp: (
    userType: "student" | "teacher" | "organizer",
    email: string,
    stakeAddress: string,
    signature: string
  ) => Promise<void>;
  createOrganization: (
    token: string,
    type: "groups" | "individual",
    idenitifer: string,
    name: string,
    description: string,
    studentsPassword: string,
    teachersPassword: string,
    areas: string[]
  ) => Promise<void>;
  getOrganization: (organizationId: string) => Promise<OrganizationData>;
  getOrganizationTasks: (
    organizationId: string,
    page: number,
    count: number
  ) => Promise<TaskListData>;
  getUserOrganizations: (
    token: string,
    page: number,
    count: number
  ) => Promise<OrganizationListData>;
  joinOrganization: (
    token: string,
    organizationId: string,
    area: string | null,
    password: string
  ) => Promise<void>;
  createGroup: (
    token: string,
    organizationId: string,
    groupId: string,
    name: string,
    members: string[]
  ) => Promise<void>;
  getUserGroups: (
    token: string,
    organizationId: string,
    page: number,
    count: number
  ) => Promise<GroupMembersipListData>;
  acceptGroup: (
    token: string,
    organizationId: string,
    groupId: string
  ) => Promise<void>;
  rejectGroup: (
    token: string,
    organizationId: string,
    groupId: string
  ) => Promise<void>;
  leaveGroup: (
    token: string,
    organizationId: string,
    groupId: string
  ) => Promise<void>;
  createTask: (
    token: string,
    organizationId: string,
    taskId: string,
    name: string,
    description: string,
    rewards: { [email: string] : number },
    deadline: Date
  ) => Promise<void>;
  getTask: (organizationId: string, taskId: string) => Promise<TaskData>;
  approveStartTask: (organizationId: string, taskId: string) => Promise<void>;
  rejectStartTask: (organizationId: string, taskId: string) => Promise<void>;
  submitTask: (
    organizationId: string,
    taskId: string,
    name: string,
    description: string
  ) => Promise<void>;
  submissionApproveTask: (
    organizationId: string,
    taskId: string
  ) => Promise<void>;
  submissionRejectTask: (
    organizationId: string,
    taskId: string,
    description: string
  ) => Promise<void>;
  submissionReviewTask: (
    organizationId: string,
    taskId: string,
    description: string
  ) => Promise<void>;
};

type BackEndProviderProps = {
  children: JSX.Element;
};

export const BackEnd = createContext<BackEndContext | null>(null);

export const BackEndProvider = ({ children }: BackEndProviderProps) => {
  const getUserInformation = async (token: string) => {
    const response = await api.get("/users/me", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return {
      userType: response.data.type,
      email: response.data.email,
      stakeAddress: response.data.stake_address,
      token: token,
    };
  };

  const getUserTasks = async (
    token: string,
    organizationId: string,
    page: number,
    count: number
  ) => {
    const response = await api.get(
      `/users/me/organization/${organizationId}/tasks?page=${page}&count=${count}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    return {
      currentPage: response.data.currentPage,
      maxPage: response.data.max_page,
      elements: response.data.tasks.map((task: any) => {
        let status = "Awaiting";
        if (task.is_approved_completed) {
          status = "Approved";
        } else if (task.is_rejected_completed || task.is_rejected_start) {
          status = "Rejected";
        } else if (task.is_approved_start) {
          status = "Progress";
        }

        return {
          ...task,
          deadline: new Date(task.deadline),
          status: status,
        };
      }),
    };
  };

  const signIn = async (stakeAddress: string, signature: string) => {
    const form = new FormData();
    form.append("username", stakeAddress);
    form.append("password", signature);

    const response = await api.post("/token", form);

    return response.data["access_token"];
  };

  const signUp = async (
    userType: "student" | "teacher" | "organizer",
    email: string,
    stakeAddress: string,
    signature: string
  ) => {
    const response = await api.post("/users/register", {
      user_type: userType,
      email: email,
      stake_address: stakeAddress,
      signature: signature,
    });

    return;
  };

  const createOrganization = async (
    token: string,
    type: "groups" | "individual",
    idenitifer: string,
    name: string,
    description: string,
    studentsPassword: string,
    teachersPassword: string,
    areas: string[]
  ) => {
    await api.post(
      "/organization/create",
      {
        organization_type: type,
        identifier: idenitifer,
        name: name,
        description: description,
        students_password: studentsPassword,
        teachers_password: teachersPassword,
        areas: areas,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
  };

  const getOrganization = async (organizationId: string) => {
    const response = await api.get(`/organization/${organizationId}`);

    return {
      ...response.data,
      creationDate: new Date(response.data.creation_date),
    };
  };

  const getOrganizationTasks = async (
    organizationId: string,
    page: number,
    count: number
  ) => {
    const response = await api.get(
      `/organization/${organizationId}/tasks?page=${page}&count=${count}`
    );

    return {
      currentPage: response.data.currentPage,
      maxPage: response.data.max_page,
      elements: response.data.tasks.map((task: any) => {
        let status = "Awaiting";
        if (task.is_approved_completed) {
          status = "Approved";
        } else if (task.is_rejected_completed || task.is_rejected_start) {
          status = "Rejected";
        } else if (task.is_approved_start) {
          status = "Progress";
        }

        return {
          ...task,
          deadline: new Date(task.deadline),
          status: status,
        };
      }),
    };
  };

  const getUserOrganizations = async (
    token: string,
    page: number,
    count: number
  ) => {
    const response = await api.get(
      `/users/me/organizations?page=${page}&count=${count}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    return {
      currentPage: response.data.currentPage,
      maxPage: response.data.max_page,
      elements: response.data.organizations.map((organization: any) => {
        return {
          ...organization,
          creationDate: new Date(organization.creation_date),
        };
      }),
    };
  };

  const joinOrganization = async (
    token: string,
    organizationId: string,
    area: string | null,
    password: string
  ) => {
    await api.post(
      `/organization/${organizationId}/join`,
      {
        password: password,
        area: area,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    return;
  };

  const createGroup = async (
    token: string,
    organizationId: string,
    identifier: string,
    name: string,
    members: string[]
  ) => {
    await api.post(
      `/organization/${organizationId}/group/create`,
      {
        identifier: identifier,
        name: name,
        members: members,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    return;
  };

  const getUserGroups = async (
    token: string,
    organizationId: string,
    page: number,
    count: number
  ) => {
    const response = await api.get(
      `/users/me/organization/${organizationId}/groups?page=${page}&count=${count}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    return {
      currentPage: response.data.currentPage,
      maxPage: response.data.max_page,
      elements: response.data.groups.map((group: any) => {
        let status = "Invite";
        if (group.leader) {
          status = "Leader";
        } else if (group.accepted) {
          status = "Member";
        } else if (group.rejected) {
          status = "Rejected";
        }

        return {
          ...group,
          status: status,
          date: new Date(group.invite_date),
        };
      }),
    };
  };

  const acceptGroup = async (
    token: string,
    organizationId: string,
    groupId: string
  ) => {
    await api.post(
      `/organization/${organizationId}/group/${groupId}/accept`,
      {},
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    return;
  };

  const rejectGroup = async (
    token: string,
    organizationId: string,
    groupId: string
  ) => {
    await api.post(
      `/organization/${organizationId}/group/${groupId}/reject`,
      {},
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    return;
  };

  const leaveGroup = async (
    token: string,
    organizationId: string,
    groupId: string
  ) => {
    await api.post(
      `/organization/${organizationId}/group/${groupId}/leave`,
      {},
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    return;
  };

  const createTask = async (
    token: string,
    organizationId: string,
    taskId: string,
    name: string,
    description: string,
    rewards: { [email: string] : number },
    deadline: Date
  ) => {
    await api.post(
      `/organization/${organizationId}/group/task/create`,
      {
        identifier: taskId,
        name: name,
        description: description,
        rewards: rewards,
        deadline: deadline.toISOString(),
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    return;
  };

  const getTask = async (organizationId: string, taskId: string) => {
    const response = await api.get(
      `/organization/${organizationId}/task/${taskId}`
    );

    let status = "Awaiting";
    if (response.data.is_approved_completed) {
      status = "Approved";
    } else if (
      response.data.is_rejected_completed ||
      response.data.is_rejected_start
    ) {
      status = "Rejected";
    } else if (response.data.is_approved_start) {
      status = "Progress";
    }

    return {
      ...response.data,
      deadline: new Date(response.data.deadline),
      status: status,
    };
  };

  const approveStartTask = async (organizationId: string, taskId: string) => {
    await api.post(
      `/organization/${organizationId}/task/${taskId}/start/approve`
    );

    return;
  };

  const rejectStartTask = async (organizationId: string, taskId: string) => {
    await api.post(
      `/organization/${organizationId}/task/${taskId}/start/reject`
    );

    return;
  };

  const submitTask = async (
    organizationId: string,
    taskId: string,
    name: string,
    description: string
  ) => {
    await api.post(
      `/organization/${organizationId}/task/${taskId}/start/reject`,
      {
        name: name,
        description: description,
      }
    );

    return;
  };

  const submissionApproveTask = async (
    organizationId: string,
    taskId: string
  ) => {
    await api.post(
      `/organization/${organizationId}/task/${taskId}/submission/approve`
    );

    return;
  };

  const submissionRejectTask = async (
    organizationId: string,
    taskId: string,
    description: string
  ) => {
    await api.post(
      `/organization/${organizationId}/task/${taskId}/submission/reject`,
      {
        description: description,
      }
    );

    return;
  };

  const submissionReviewTask = async (
    organizationId: string,
    taskId: string,
    description: string
  ) => {
    await api.post(
      `/organization/${organizationId}/task/${taskId}/submission/review`,
      {
        description: description,
      }
    );

    return;
  };

  return (
    <BackEnd.Provider
      value={{
        getUserInformation,
        getUserTasks,
        signIn,
        signUp,
        createOrganization,
        getOrganization,
        getOrganizationTasks,
        getUserOrganizations,
        joinOrganization,
        createGroup,
        getUserGroups,
        acceptGroup,
        rejectGroup,
        leaveGroup,
        createTask,
        getTask,
        approveStartTask,
        rejectStartTask,
        submitTask,
        submissionApproveTask,
        submissionRejectTask,
        submissionReviewTask,
      }}
    >
      {children}
    </BackEnd.Provider>
  );
};

export const useBackEnd = () => useContext(BackEnd);
