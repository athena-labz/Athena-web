import * as React from "react";

import { createContext, useState, useContext, useEffect } from "react";

import axios from "axios";

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
    userType: UserType,
    email: string,
    stakeAddress: string,
    signature: string
  ) => Promise<void>;
  savePaymentAddress: (token: string, address: string) => Promise<void>;
  createOrganization: (
    token: string,
    type: "groups" | "individual",
    idenitifer: string,
    name: string,
    description: string,
    studentsPassword: string,
    teachersPassword: string,
    supervisorPassword: string,
    areas: string[]
  ) => Promise<void>;
  getOrganization: (organizationId: string) => Promise<OrganizationData>;
  getOrganizationAreas: (organizationId: string) => Promise<string[]>;
  getOrganizationTasks: (
    organizationId: string,
    page: number,
    count: number,
    type: 'all' | 'individual' | 'group'
  ) => Promise<TaskListData>;
  getOrganizationUsers: (
    organizationId: string,
    page: number,
    count: number
  ) => Promise<UserListData>;
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
    rewards: { [email: string]: number },
    deadline: Date
  ) => Promise<void>;
  createCrowdfundingTask: (
    token: string,
    organizationId: string,
    taskId: string,
    name: string,
    description: string,
    deadline: Date
  ) => Promise<void>;
  getTask: (organizationId: string, taskId: string) => Promise<TaskData>;
  getTaskMembers: (
    organizationId: string,
    taskId: string
  ) => Promise<ExternalUserData[]>;
  getTaskOwner: (
    organizationId: string,
    taskId: string
  ) => Promise<ExternalUserData>;
  getTaskActions: (
    organizationId: string,
    taskId: string,
    page: number,
    count: number
  ) => Promise<TaskActionListData>;
  approveStartTask: (
    token: string,
    organizationId: string,
    taskId: string
  ) => Promise<void>;
  rejectStartTask: (
    token: string,
    organizationId: string,
    taskId: string
  ) => Promise<void>;
  submitTask: (
    token: string,
    organizationId: string,
    taskId: string,
    name: string,
    description: string
  ) => Promise<void>;
  submissionApproveTask: (
    token: string,
    organizationId: string,
    taskId: string,
    description: string
  ) => Promise<void>;
  submissionRejectTask: (
    token: string,
    organizationId: string,
    taskId: string,
    description: string
  ) => Promise<void>;
  submissionReviewTask: (
    token: string,
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
    const response = await axios.get("/api/users/me", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return {
      userType: response.data.type,
      email: response.data.email,
      stakeAddress: response.data.stake_address,
      paymentAddress: response.data.payment_address,
      token: token,
    };
  };

  const getUserTasks = async (
    token: string,
    organizationId: string,
    page: number,
    count: number
  ) => {
    const response = await axios.get(
      `/api/users/me/organization/${organizationId}/tasks?page=${page}&count=${count}`,
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
          date: new Date(task.creation_date),
          status: status,
        };
      }),
    };
  };

  const signIn = async (stakeAddress: string, signature: string) => {
    const form = new FormData();
    form.append("username", stakeAddress);
    form.append("password", signature);

    const response = await axios.post("/api/token", form);

    return response.data["access_token"];
  };

  const signUp = async (
    userType: UserType,
    email: string,
    stakeAddress: string,
    signature: string
  ) => {
    const response = await axios.post("/api/users/register", {
      user_type: userType,
      email: email,
      stake_address: stakeAddress,
      signature: signature,
    });

    return;
  };

  const savePaymentAddress = async (
    token: string,
    address: string
  ) => {
    const response = await axios.post("/api/users/me/address/add", {
      address: address
    },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
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
    supervisorPassword: string,
    areas: string[]
  ) => {
    await axios.post(
      "/api/organization/create",
      {
        organization_type: type,
        identifier: idenitifer,
        name: name,
        description: description,
        students_password: studentsPassword,
        teachers_password: teachersPassword,
        supervisor_password: supervisorPassword,
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
    const response = await axios.get(`/api/organization/${organizationId}`);

    return {
      ...response.data,
      creationDate: new Date(response.data.creation_date),
    };
  };

  const getOrganizationAreas = async (organizationId: string) => {
    const response = await axios.get(`/api/organization/${organizationId}/areas`);

    return response.data;
  };

  const getOrganizationTasks = async (
    organizationId: string,
    page: number,
    count: number,
    type: 'all' | 'individual' | 'group'
  ) => {
    let extraParams: string;
    if (type === 'all') {
      extraParams = '';
    } else if (type === 'individual') {
      extraParams = '&individual=true';
    } else {
      extraParams = '&group=true';
    }

    const response = await axios.get(
      `/api/organization/${organizationId}/tasks?page=${page}&count=${count}${extraParams}`
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
          date: new Date(task.creation_date),
          status: status,
          type: task.is_individual ? 'individual' : 'group'
        };
      }),
    };
  };

  const getOrganizationUsers = async (
    organizationId: string,
    page: number,
    count: number
  ) => {
    const response = await axios.get(
      `/api/organization/${organizationId}/users?page=${page}&count=${count}`
    );

    return {
      currentPage: response.data.currentPage,
      maxPage: response.data.max_page,
      elements: response.data.users.map((user: any) => {
        return {
          ...user,
          userType: user.type,
          stakeAddress: user.stake_address,
        };
      }),
    };
  };

  const getUserOrganizations = async (
    token: string,
    page: number,
    count: number
  ) => {
    const response = await axios.get(
      `/api/users/me/organizations?page=${page}&count=${count}`,
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
    await axios.post(
      `/api/organization/${organizationId}/join`,
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
    await axios.post(
      `/api/organization/${organizationId}/group/create`,
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
    const response = await axios.get(
      `/api/users/me/organization/${organizationId}/groups?page=${page}&count=${count}`,
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
    await axios.post(
      `/api/organization/${organizationId}/group/${groupId}/accept`,
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
    await axios.post(
      `/api/organization/${organizationId}/group/${groupId}/reject`,
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
    await axios.post(
      `/api/organization/${organizationId}/group/${groupId}/leave`,
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
    rewards: { [email: string]: number },
    deadline: Date
  ) => {
    await axios.post(
      `/api/organization/${organizationId}/group/task/create`,
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

  const createCrowdfundingTask = async (
    token: string,
    organizationId: string,
    taskId: string,
    name: string,
    description: string,
    deadline: Date
  ) => {
    await axios.post(
      `/api/organization/${organizationId}/task/create`,
      {
        identifier: taskId,
        name: name,
        description: description,
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
    const response = await axios.get(
      `/api/organization/${organizationId}/task/${taskId}`
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
      date: new Date(response.data.creation_date),
      status: status,
    };
  };

  const getTaskMembers = async (organizationId: string, taskId: string) => {
    const response = await axios.get(
      `/api/organization/${organizationId}/task/${taskId}/members`
    );

    return response.data.map((user: any) => ({
      userType: user.type,
      email: user.email,
      stakeAddress: user.stake_address,
    }));
  };

  const getTaskOwner = async (organizationId: string, taskId: string) => {
    const response = await axios.get(
      `/api/api/organization/${organizationId}/task/${taskId}/owner`
    );

    return {
      userType: response.data.type,
      email: response.data.email,
      stakeAddress: response.data.stake_address,
    }
  };

  const getTaskActions = async (
    organizationId: string,
    taskId: string,
    page: number,
    count: number
  ) => {
    const response = await axios.get(
      `/api/organization/${organizationId}/task/${taskId}/actions?page=${page}&count=${count}`
    );

    return {
      currentPage: response.data.currentPage,
      maxPage: response.data.max_page,
      elements: response.data.actions.map((action: any) => {
        return {
          ...action,
          isSubmission: action.is_submission,
          isReview: action.is_review,
          date: new Date(action.action_date),
        };
      }),
    };
  };

  const approveStartTask = async (
    token: string,
    organizationId: string,
    taskId: string
  ) => {
    await axios.post(
      `/api/organization/${organizationId}/task/${taskId}/start/approve`,
      {},
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    return;
  };

  const rejectStartTask = async (
    token: string,
    organizationId: string,
    taskId: string
  ) => {
    await axios.post(
      `/api/organization/${organizationId}/task/${taskId}/start/reject`,
      {},
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    return;
  };

  const submitTask = async (
    token: string,
    organizationId: string,
    taskId: string,
    name: string,
    description: string
  ) => {
    await axios.post(
      `/api/organization/${organizationId}/task/${taskId}/submission`,
      {
        name: name,
        description: description,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    return;
  };

  const submissionApproveTask = async (
    token: string,
    organizationId: string,
    taskId: string,
    description: string
  ) => {
    await axios.post(
      `/api/organization/${organizationId}/task/${taskId}/submission/approve`,
      {
        description: description,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    return;
  };

  const submissionRejectTask = async (
    token: string,
    organizationId: string,
    taskId: string,
    description: string
  ) => {
    await axios.post(
      `/api/organization/${organizationId}/task/${taskId}/submission/reject`,
      {
        description: description,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    return;
  };

  const submissionReviewTask = async (
    token: string,
    organizationId: string,
    taskId: string,
    description: string
  ) => {
    await axios.post(
      `/api/organization/${organizationId}/task/${taskId}/submission/review`,
      {
        description: description,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
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
        savePaymentAddress,
        createOrganization,
        getOrganization,
        getOrganizationAreas,
        getOrganizationTasks,
        getOrganizationUsers,
        getUserOrganizations,
        joinOrganization,
        createGroup,
        getUserGroups,
        acceptGroup,
        rejectGroup,
        leaveGroup,
        createTask,
        createCrowdfundingTask,
        getTask,
        getTaskMembers,
        getTaskOwner,
        getTaskActions,
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
