import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { Connector } from "./Connector";

const whitelistedWallets = ["eternl", "nami"];

type HeaderProps = {};

const Header = ({}: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-dark-main border-b-2 border-[#A7ADB41A] text-white text-sm p-4 flex justify-between items-center">
      <div className="flex items-center">
        {/* Content for the left field */}
        <img
          className="h-8 md:h-16 hover:cursor-pointer"
          src="assets/logo.png"
          onClick={() => navigate("/")}
        />
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        {/* Content for the center field */}
      </div>
      <div className="flex items-center">
        {/* Content for the right field */}
        <Connector whitelistedWallets={whitelistedWallets} />
      </div>
    </header>
  );
};

export default Header;
