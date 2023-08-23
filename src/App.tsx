import React from "react";

import { Routes, Route, Navigate, useParams } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";

import CreateOrganization from "./pages/CreateOrganization";
import UsersPage from "./pages/UsersPage";
import NotFoundPage from "./pages/NotFoundPage";

import OrganizationPage from "./pages/OrganizationPage";
import SpecificTaskPage from "./pages/SpecficTaskPage";
import TasksPage from "./pages/TasksPage";
import ProfilePage from "./pages/ProfilePage";

import { WalletProvider } from "./contexts/WalletProvider";
import { BackEndProvider } from "./contexts/BackEndProvider";
import { UserProvider } from "./contexts/UserProvider";

const RedirectToTasks = () => {
  const { organization } = useParams<{ organization: string }>();

  return <Navigate to={`/organization/${organization}/tasks`} replace />;
};

type SpecificTaskRedirectParams = { taskId: string };

const SpecificTaskRedirect = () => {
  const { taskId } = useParams<SpecificTaskRedirectParams>();

  if (!taskId) {
    return <RedirectToTasks />;
  }

  return (
    <OrganizationPage currentSelection="tasks">
      <SpecificTaskPage taskId={taskId} />
    </OrganizationPage>
  );
};

type ProfileRedirectParams = {
  organization: string;
  username: string;
};

const ProfileRedirect = () => {
  const { organization, username } = useParams<ProfileRedirectParams>();

  // Replace console.error with react toastify

  if (!organization) {
    console.error("Username not defined in Profile page");

    return <Navigate to="/" replace />;
  }

  if (!username) {
    console.error("Username not defined in Profile page");

    return <Navigate to={`/organization/${organization}`} replace />;
  }

  return (
    <OrganizationPage currentSelection="profile">
      <ProfilePage organization={organization} username={username} />
    </OrganizationPage>
  );
};

function App() {
  return (
    <BackEndProvider>
      <WalletProvider networkMode="testnet">
        <UserProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/organization/create"
              element={
                <ProtectedRoute>
                  <CreateOrganization />
                </ProtectedRoute>
              }
            />

            <>
              <Route
                path="/organization/:organization"
                element={
                  <ProtectedRoute>
                    <RedirectToTasks />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/organization/:organization/tasks"
                element={
                  <ProtectedRoute>
                    <OrganizationPage currentSelection="tasks">
                      <TasksPage />
                    </OrganizationPage>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/organization/:organization/tasks/:taskId"
                element={
                  <ProtectedRoute>
                    <SpecificTaskRedirect />
                  </ProtectedRoute>
                }
              />
            </>

            <>
              <Route
                path="/organization/:organization/users"
                element={
                  <ProtectedRoute>
                    <OrganizationPage currentSelection="users">
                      <UsersPage />
                    </OrganizationPage>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/organization/:organization/users/:username"
                element={
                  <ProtectedRoute>
                    <ProfileRedirect />
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
