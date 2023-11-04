import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Header from "../components/Header";

const Home = () => {
  const navigate = useNavigate();

  // return (
  //   <div className="bg-white flex flex-col w-full min-h-screen overflow-auto">
  //     <Header />

  //     {/* Background + Overlay */}
  //     <div className="relative h-screen">
  //       <div className="z-10 absolute inset-0 bg-black opacity-75" />
  //       <div className="z-0 absolute inset-0 bg-[url('./assets/background.jpg')] bg-cover bg-no-repeat h-screen" />
  //       <div className="z-20 p-8 mt-48 w-full h-full inline-block">
  //         <div className="pointer-events-auto flex flex-col gap-16 p-8 w-screen justify-center items-center">
  //           <div className="flex flex-col gap-4">
  //             <span className="text-white text-5xl md:text-7xl font-extrabold">
  //               Provide reliable services made easy
  //             </span>
  //             <span className="text-main-blue text-xl md:text-3xl font-extrabold">
  //               Building trust among peers through blockchain technology.
  //             </span>
  //           </div>
  //           <div className="flex flex-wrap justify-center items-center gap-6">
  //             <button
  //               className="bg-white py-4 w-72 rounded-lg text-dark-blue text-2xl font-bold"
  //               onClick={() => navigate("/organization/beep")}
  //             >
  //               Enter organization
  //             </button>
  //             <button
  //               className="bg-dark-blue py-4 w-72 rounded-lg text-white text-2xl font-bold"
  //               onClick={() => navigate("/organization/create")}
  //             >
  //               Create organization
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Content Section */}
  //     <div className="">
  //       <p>Your content here...</p>
  //       {/* Continue with other content */}
  //     </div>
  //   </div>
  // );

  return (
    <div className="bg-white flex flex-col w-full min-h-screen">
      <div className="bg-center bg-cover h-screen bg-[url('./assets/background.jpg')]">
        <div className="relative h-full">
          <div className="z-10 absolute h-screen inset-0 bg-black opacity-75"></div>
          <div className="z-20 relative h-full">
            <Header />
            <div className="p-8 mt-48 w-full h-full inline-block overflow-auto">
              <div className="pointer-events-auto flex flex-col gap-16 p-8 justify-center items-center">
                <div className="flex flex-col gap-4">
                  <span className="text-white text-5xl md:text-7xl font-extrabold">
                    Provide reliable services made easy
                  </span>
                  <span className="text-main-blue text-xl md:text-3xl font-extrabold">
                    Building trust among peers through blockchain technology.
                  </span>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-6">
                  <button
                    className="bg-white py-4 w-72 rounded-lg text-dark-blue text-2xl font-bold"
                    onClick={() => navigate("/organization/select")}
                  >
                    Enter organization
                  </button>
                  <button
                    className="bg-dark-blue py-4 w-72 rounded-lg text-white text-2xl font-bold"
                    onClick={() => navigate("/organization/create")}
                  >
                    Create organization
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full mt-16">
        <div className="flex flex-col w-full justify-center">
          <span className="text-slate-600 text-5xl font-extrabold text-center">
            Prizes and <span className="text-secundary-blue">Awards</span>
          </span>
          <div className="mt-8 flex w-full gap-8 justify-center">
            <a
              href="https://cardstarter.medium.com/hack-cardano-hosted-by-cardstarter-3cbce164d228"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex flex-col w-72 gap-4 p-8 border-2 border-dotted border-secundary-blue rounded-lg">
                <img
                  className="h-40 hover:cursor-pointer"
                  src="https://miro.medium.com/max/1200/1*wFuUMFQBQ4zXoWgXzh62Tg.png"
                />

                <span className="text-xl text-center text-secundary-blue font-extrabold">
                  Hackathon Plutus Pioneers Program
                </span>
                <span className="text-slate-500 text-center">
                  Second Cohort, October 2021; Achieving Final Roster; Achieved
                  qualification within the top five; Digiservices is part of
                  Athena team
                </span>
              </div>
            </a>

            <a
              href="https://cardano.ideascale.com/c/idea/61933"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex flex-col w-72 h-full gap-4 p-8 border-2 border-dotted border-secundary-blue rounded-lg">
                <img
                  className="h-40 hover:cursor-pointer"
                  src="https://cdn.discordapp.com/attachments/864335296623280188/974657201048285184/Fund8_Results.png"
                />
                <span className="text-xl text-center text-secundary-blue font-extrabold">
                  Project Catalyst, Fund 8 Funded
                </span>
                <span className="text-slate-500 text-center">
                  Crowdfunding with inbuilt mediation, May 2022
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full mt-16">
        <div className="flex flex-col w-full justify-center">
          <span className="text-slate-600 text-5xl font-extrabold text-center">
            Know the Team
          </span>
          <div className="mt-8 flex w-full gap-8 justify-center">
            <a
              href="https://cardstarter.medium.com/hack-cardano-hosted-by-cardstarter-3cbce164d228"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex flex-col w-72 gap-4 p-8 border-2 border-dotted border-secundary-blue rounded-lg">
                <img
                  className="h-40 hover:cursor-pointer"
                  src="https://miro.medium.com/max/1200/1*wFuUMFQBQ4zXoWgXzh62Tg.png"
                />

                <span className="text-xl text-center text-secundary-blue font-extrabold">
                  Hackathon Plutus Pioneers Program
                </span>
                <span className="text-slate-500 text-center">
                  Second Cohort, October 2021; Achieving Final Roster; Achieved
                  qualification within the top five; Digiservices is part of
                  Athena team
                </span>
              </div>
            </a>

            <a
              href="https://cardano.ideascale.com/c/idea/61933"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex flex-col w-72 h-full gap-4 p-8 border-2 border-dotted border-secundary-blue rounded-lg">
                <img
                  className="h-40 hover:cursor-pointer"
                  src="https://cdn.discordapp.com/attachments/864335296623280188/974657201048285184/Fund8_Results.png"
                />
                <span className="text-xl text-center text-secundary-blue font-extrabold">
                  Project Catalyst, Fund 8 Funded
                </span>
                <span className="text-slate-500 text-center">
                  Crowdfunding with inbuilt mediation, May 2022
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
