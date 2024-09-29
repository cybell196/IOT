import {Button} from "@nextui-org/react";
import config from "~/config";
import { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { MdOutlineDashboard, MdOutlineAddReaction } from "react-icons/md";
import { FaDatabase } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

// bg-gradient-to-tr from-slate-700 to-slate-300


function Sidebar() {
    const location = useLocation();
    

    const isActive = (route) => {
      return location.pathname === route;
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
                                  startContent={<MdOutlineDashboard className="text-3xl ml-4"/>}
                                  className={`flex items-center justify-start text-white shadow-lg w-full h-20 hover:bg-gradient-to-tr hover:from-slate-700 hover:to-slate-300 ${
                                      isActive(config.routes.home)
                                          ? 'bg-gradient-to-tr from-slate-700 to-slate-300'
                                          : ''
                                  }`}
                              >
                                  <p className="text-3xl text-start font-bold flex items-center">Dashboard</p>
                              </Button>
                          </Link>
                      </li>

                      <li className="flex items-center justify-center w-full row-span-1 rounded-3xl">
                          <Link to={config.routes.datasensor} className="w-full">
                              <Button
                                  type="button"
                                  color="none"
                                  radius="md"
                                  startContent={<FaDatabase className="text-3xl ml-4"/>}
                                  className={`flex items-center justify-start text-white shadow-lg w-full h-20 hover:bg-gradient-to-tr hover:from-slate-700 hover:to-slate-300 ${
                                      isActive(config.routes.datasensor)
                                          ? 'bg-gradient-to-tr from-slate-700 to-slate-300'
                                          : ''
                                  }`}
                              >
                                  <p className="text-3xl text-start font-bold">Data Sensor</p>
                              </Button>
                          </Link>
                      </li>

                      <li className="flex items-center justify-center w-full row-span-1 rounded-3xl">
                          <Link to={config.routes.actionhistory} className="w-full">
                              <Button
                                  type="button"
                                  color="none"
                                  radius="md"
                                  startContent={<MdOutlineAddReaction className="text-3xl ml-4"/>}
                                  className={`flex items-center justify-start text-white shadow-lg w-full h-20 hover:bg-gradient-to-tr hover:from-slate-700 hover:to-slate-300 ${
                                      isActive(config.routes.actionhistory)
                                          ? 'bg-gradient-to-tr from-slate-700 to-slate-300'
                                          : ''
                                  }`}
                              >
                                  <p className="text-3xl text-start font-bold">Action History</p>
                              </Button>
                          </Link>
                      </li>

                      <li className="flex items-center justify-center w-full row-span-1 rounded-3xl">
                          <Link to={config.routes.profile} className="w-full">
                              <Button
                                  type="button"
                                  color="none" 
                                  radius="md"
                                  startContent={<CgProfile className="text-3xl ml-4"/>}
                                  className={`flex items-center justify-start text-white shadow-lg w-full h-20 hover:bg-gradient-to-tr hover:from-slate-700 hover:to-slate-300 ${
                                      isActive(config.routes.profile)
                                          ? 'bg-gradient-to-tr from-slate-700 to-slate-300'
                                          : ''
                                  }`}
                              >
                                  <p className="text-3xl text-start font-bold">Profile</p>
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