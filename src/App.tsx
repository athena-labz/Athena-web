import React from "react";

import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

import CreateOrganization from "./pages/CreateOrganization";
import OrganizationPage from "./pages/OrganizationPage";

import NotFoundPage from "./pages/NotFoundPage";

import { WalletProvider } from "./contexts/WalletProvider";

function App() {
  return (
    <WalletProvider networkMode="testnet">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-organization" element={<CreateOrganization />} />
        <Route path="/organization/:organizationId" element={<OrganizationPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </WalletProvider>
  );
}

export default App;
