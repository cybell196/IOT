import {Button} from "@nextui-org/react";
import config from "~/config";
import { useState } from 'react';
import Menu, { MenuItem } from "./Menu";
import { Link } from "react-router-dom";



function Sidebar() {
  const [activeButton, setActiveButton] = useState(null);

  const handleClick = (buttonName) => {
    setActiveButton(buttonName);
  };
  

  return (
      <div className=" w-4/5 h-full">
          <div className=" flex items-center justify-center mt-10 ">
              <img src="/dogs.png" alt="Logo" className="w-32 h-auto" />
              <div>
                  <h1 className="text-start text-4xl text-white font-bold">NA.Kiệt</h1>
                  <h1 className="text-start text-4xl text-white font-bold">Website</h1>
              </div>
          </div>

          <div
              style={{
                  background:
                      'linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, rgb(224, 225, 226) 47.22%, rgba(224, 225, 226, 0.157) 94.44%)',
              }}
              className="bg-white h-1 w-full mt-4"
          ></div>

          <div className="">
              <nav className="w-full mt-8">
                  <ul className="w-full grid grid-row-4 gap-5">
                      <li className="flex items-center justify-center w-full row-span-1 rounded-3xl">
                          <Link to={config.routes.home} className="w-full">
                              <Button
                                  type="button"
                                  color="none"
                                  radius="md"
                                  className={`flex items-center justify-start text-white shadow-lg w-full h-20 ${activeButton === 'Dashboard' ? 'bg-gradient-to-tr from-slate-700 to-slate-300' : ''}`}
                                  onClick={() => handleClick('Dashboard')}
                              >
                                  <p className="text-3xl text-start font-bold mx-4">Dashboard</p>
                              </Button>
                          </Link>
                      </li>

                      <li className="flex items-center justify-center w-full row-span-1 rounded-3xl">
                          <Link to={config.routes.datasensor} className="w-full">
                              <Button
                                  type="button"
                                  color="none"
                                  radius="md"
                                  className={`flex items-center justify-start text-white shadow-lg w-full h-20 ${activeButton === 'DataSensor' ? 'bg-gradient-to-tr from-slate-700 to-slate-300' : ''}`}
                                  onClick={() => handleClick('DataSensor')}
                              >
                                  <p className="text-3xl text-start font-bold mx-4">Data Sensor</p>
                              </Button>
                          </Link>
                      </li>

                      <li className="flex items-center justify-center w-full row-span-1 rounded-3xl">
                          <Link to={config.routes.actionhistory} className="w-full">
                              <Button
                                  type="button"
                                  color="none"
                                  radius="md"
                                  className={`flex items-center justify-start text-white shadow-lg w-full h-20 ${activeButton === 'ActionHistory' ? 'bg-gradient-to-tr from-slate-700 to-slate-300' : ''}`}
                                  onClick={() => handleClick('ActionHistory')}
                              >
                                  <p className="text-3xl text-start font-bold mx-4">Action History</p>
                              </Button>
                          </Link>
                      </li>

                      <li className="flex items-center justify-center w-full row-span-1 rounded-3xl">
                          <Link to={config.routes.profile} className="w-full">
                              <Button
                                  type="button"
                                  color="none"
                                  radius="md"
                                  className={`flex items-center justify-start text-white shadow-lg w-full h-20 ${activeButton === 'Profile' ? 'bg-gradient-to-tr from-slate-700 to-slate-300' : ''}`}
                                  onClick={() => handleClick('Profile')}
                              >
                                  <p className="text-3xl text-start font-bold mx-4">Profile</p>
                              </Button>
                          </Link>
                      </li>
                  </ul>
              </nav>
          </div>
      </div>
  );
}

export default Sidebar;