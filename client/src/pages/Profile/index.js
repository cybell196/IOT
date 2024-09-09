import React from 'react';
import {Image} from "@nextui-org/react";

function ProfileCard() {
  return (
      <div className="mx-auto grid grid-cols-5 bg-slate-200 bg-opacity-10 rounded-3xl w-full">
          <Image 
            src="/emotewater.webp" 
            alt="Avatar" 
            width="200" 
            radius="full"
            className="my-12 ml-44  col-span-1" 
          />

          <div className="col-span-4 mt-16 ml-44 flex items-center">
              <div className="mb-auto">
                  <span className="text-5xl font-bold text-white mb-3">Nguyễn Anh Kiệt</span>
                  <p className='text-4xl font-bold text-white'>Mã sinh viên: B21DCCN471</p>
                  <span>Số điện thoại: 0392514756</span>
              </div>

              {/* <div>
                  <a href="#">GitHub</a>
              </div>
              <div>
                  <a href="#">Download PDF</a>
              </div>
              <div>
                  <a href="#">API Doc</a>
              </div> */}
          </div>
      </div>
  );
}

export default ProfileCard;