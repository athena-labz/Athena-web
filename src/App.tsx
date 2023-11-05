import React from "react";

import { Routes, Route, Navigate, useParams } from "react-router-dom";

import { ToastContainer } from "react-toastify";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";

import CreateOrganization from "./pages/CreateOrganization";
import UsersPage from "./pages/UsersPage";
import NotFoundPage from "./pages/NotFoundPage";

import OrganizationSelect from "./pages/OrganizationSelect";
import OrganizationPage from "./pages/OrganizationPage";
import SpecificTaskPage from "./pages/SpecficTaskPage";
import TasksPage from "./pages/TasksPage";
import ProfilePage from "./pages/ProfilePage";

import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

import { WalletProvider } from "./contexts/WalletProvider";
import { BackEndProvider } from "./contexts/BackEndProvider";
import { UserProvider } from "./contexts/UserProvider";

import "react-toastify/dist/ReactToastify.css";
import CreateTaskPage from "./pages/CreateTaskPage";
import OrganizationJoin from "./pages/OrganizationJoin";
import GroupCreatePage from "./pages/GroupCreatePage";

const RedirectToTasks = () => {
  const { organizationId } = useParams<{ organizationId: string }>();

  return <Navigate to={`/organization/${organizationId}/tasks`} replace />;
};

type SpecificTaskRedirectParams = { organizationId: string; taskId: string };

const SpecificTaskRedirect = () => {
  const { organizationId, taskId } = useParams<SpecificTaskRedirectParams>();

  if (!organizationId) return <NotFoundPage />;

  if (!taskId) {
    return <RedirectToTasks />;
  }

  return (
    <OrganizationPage currentSelection="tasks">
      <SpecificTaskPage organizationId={organizationId} taskId={taskId} />
    </OrganizationPage>
  );
};

type CreateTaskRedirectParams = { organizationId: string };

const CreateTaskRedirect = () => {
  const { organizationId } = useParams<CreateTaskRedirectParams>();

  if (!organizationId) return <NotFoundPage />;

  return (
    <OrganizationPage currentSelection="tasks">
      <CreateTaskPage organizationId={organizationId} />
    </OrganizationPage>
  );
};

type TasksRedirectParams = { organizationId: string };

const TasksRedirect = () => {
  const { organizationId } = useParams<TasksRedirectParams>();

  if (!organizationId) return <NotFoundPage />;

  return (
    <OrganizationPage currentSelection="tasks">
      <TasksPage organizationId={organizationId} />
    </OrganizationPage>
  );
};

type ProfileRedirectParams = {
  organizationId: string;
};

const ProfileRedirect = () => {
  const { organizationId } = useParams<ProfileRedirectParams>();

  // Replace console.error with react toastify

  if (!organizationId) {
    console.error("Username not defined in Profile page");

    return <Navigate to="/" replace />;
  }

  return (
    <OrganizationPage currentSelection="profile">
      <ProfilePage organization={organizationId} />
    </OrganizationPage>
  );
};

type GroupCreateParams = {
  organizationId: string;
};

const GroupCreateRedirect = () => {
  const { organizationId } = useParams<GroupCreateParams>();

  if (!organizationId) {
    console.error("Organization not defined in create group page");

    return <Navigate to="/" replace />;
  }

  return (
    <OrganizationPage currentSelection="profile">
      <GroupCreatePage organizationId={organizationId} />
    </OrganizationPage>
  );
};

function App() {
  return (
    <BackEndProvider>
      <WalletProvider networkMode="testnet">
        <UserProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            <Route
              path="/organization/create"
              element={
                <ProtectedRoute>
                  <CreateOrganization />
                </ProtectedRoute>
              }
            />

            <Route
              path="/organization/select"
              element={
                <ProtectedRoute>
                  <OrganizationSelect />
                </ProtectedRoute>
              }
            />

            <Route
              path="/organization/join"
              element={
                <ProtectedRoute>
                  <OrganizationJoin />
                </ProtectedRoute>
              }
            />

            <>
              <Route
                path="/organization/:organizationId"
                element={
                  <ProtectedRoute>
                    <RedirectToTasks />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/organization/:organizationId/tasks"
                element={
                  <ProtectedRoute>
                    <TasksRedirect />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/organization/:organizationId/tasks/create"
                element={
                  <ProtectedRoute>
                    <CreateTaskRedirect />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/organization/:organizationId/tasks/:taskId"
                element={
                  <ProtectedRoute>
                    <SpecificTaskRedirect />
                  </ProtectedRoute>
                }
              />
            </>

            <>
              <Route
                path="/organization/:organizationId/users"
                element={
                  <ProtectedRoute>
                    <OrganizationPage currentSelection="users">
                      <UsersPage />
                    </OrganizationPage>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/organization/:organizationId/profile"
                element={
                  <ProtectedRoute>
                    <ProfileRedirect />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/organization/:organizationId/group/create"
                element={
                  <ProtectedRoute>
                    <GroupCreateRedirect />
                  </ProtectedRoute>
                }
              />
            </>

            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
        </UserProvider>
      </WalletProvider>
    </BackEndProvider>
  );
}

export default App;
