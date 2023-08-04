import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { Connector } from "./Connector";

const whitelistedWallets = ["eternl", "nami"];

type HeaderProps = {
  border?: boolean;
};

const Header = ({ border = false }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header
      className={`fixed ${
        border ? "border-b-2 border-b-slate-200" : ""
      } top-0 h-20 p-4 w-full z-10 text-white text-sm flex justify-between items-center`}
    >
      <div className="flex items-center">
        {/* Content for the left field */}
        <img
          className="h-8 md:h-12 hover:cursor-pointer"
          src="/assets/logo.png"
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
