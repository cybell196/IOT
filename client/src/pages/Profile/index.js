import React from 'react';
import {Image, Button} from "@nextui-org/react";
import { FaGithub } from "react-icons/fa";
import { FaRegFilePdf } from "react-icons/fa6";
import { SiPostman } from "react-icons/si";

function ProfileCard() {
  return (
      <>
      <div className="mx-auto grid grid-cols-5 bg-slate-200 bg-opacity-30 rounded-3xl w-full">
          <Image src="/avt.jpg" alt="Avatar" width="200" radius="full" className="my-12 ml-44  col-span-1" />

          <div className="col-span-4 mt-24 ml-44 flex items-center">
              <div className="mb-auto">
                  <span className="text-5xl font-bold text-white block mb-4">Nguyễn Anh Kiệt</span>
                  <span className="text-3xl text-white block mb-4">Mã sinh viên: B21DCCN471</span>
                  <span className="text-3xl text-white block">Số điện thoại: 0392514756</span>

                  <div className="mt-8 grid grid-cols-3 gap-2">
                      <div className="">
                          <a href="https://github.com/cybell196/IOT" target="_blank" rel="noopener noreferrer">
                              <Button
                                  className="bg-slate-950 text-white text-2xl"
                                  radius="sm"
                                  size="lg"
                                  startContent={<FaGithub />}
                                  fullWidth
                              >
                                  GitHub
                              </Button>
                          </a>
                      </div>

                      <div className="">
                          <a href="/Báo cáo IOT.pdf" target='_blank'>
                              <Button
                                  color="success"
                                  className="bg-red-400 text-white text-2xl"
                                  radius="sm"
                                  size="lg"
                                  startContent={<FaRegFilePdf />}
                                  fullWidth
                              >
                                  PDF
                              </Button>
                          </a>
                      </div>

                      <div className="">
                          <a href="http://localhost:3002/api-docs" target='_blank'>
                              <Button
                                  color="success"
                                  className="bg-orange-400 text-white text-2xl"
                                  radius="sm"
                                  size="lg"
                                  startContent={<SiPostman />}
                                  fullWidth
                              >
                                  API Doc
                              </Button>
                          </a>
                      </div>
                  </div>
              </div>
              {/* <Image src="/0909.gif" alt="khabanh" className='ml-28'/> */}
          </div>
          
      </div>
      <div>
        
      </div>

      </>
  );
}

export default ProfileCard;