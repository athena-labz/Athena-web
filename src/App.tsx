import React from "react";

import { Routes, Route, Navigate, useParams } from "react-router-dom";

import Home from "./pages/Home";

import CreateOrganization from "./pages/CreateOrganization";
import UsersPage from "./pages/UsersPage";
import NotFoundPage from "./pages/NotFoundPage";

import OrganizationPage from "./pages/OrganizationPage";
import SpecificTaskPage from "./pages/SpecficTaskPage";
import TasksPage from "./pages/TasksPage";
import ProfilePage from "./pages/ProfilePage";

import { WalletProvider } from "./contexts/WalletProvider";

const RedirectToTasks = () => {
  const { organization } = useParams<{ organization: string }>();

  return <Navigate to={`/organization/${organization}/tasks`} replace />;
};

type SpecificTaskRedirectParams = { taskId: string };

const SpecificTaskRedirect = () => {
  const { taskId } = useParams<SpecificTaskRedirectParams>();

  return (
    <OrganizationPage currentSelection="tasks">
      <SpecificTaskPage />
    </OrganizationPage>
  );
};

type ProfileRedirectParams = {
  taskId: string;
  username: string;
};

const ProfileRedirect = () => {
  const { taskId, username } = useParams<ProfileRedirectParams>();

  if (!username) {
    throw new Error("Username not defined in Profile page");
  }

  return (
    <OrganizationPage currentSelection="profile">
      <ProfilePage username={username} />
    </OrganizationPage>
  );
};

function App() {
  return (
    <WalletProvider networkMode="testnet">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/organization/create" element={<CreateOrganization />} />

        <>
          <Route
            path="/organization/:organization"
            element={<RedirectToTasks />}
          />

          <Route
            path="/organization/:organization/tasks"
            element={
              <OrganizationPage currentSelection="tasks">
                <TasksPage />
              </OrganizationPage>
            }
          />

          <Route
            path="/organization/:organization/tasks/:taskId"
            element={<SpecificTaskRedirect />}
          />
        </>

        <>
          <Route
            path="/organization/:organization/users"
            element={
              <OrganizationPage currentSelection="users">
                <UsersPage />
              </OrganizationPage>
            }
          />

          <Route
            path="/organization/:organization/users/:username"
            element={<ProfileRedirect />}
          />
        </>

        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </WalletProvider>
  );
}

export default App;
