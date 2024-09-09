import {
FaUserAlt,
FaBell 
} from "react-icons/fa";
import { IoSettingsSharp  } from "react-icons/io5";
function Header({ currentPage }) {
  return (
    
    <div className="grid grid-cols-8 w-full h-32">
      
      <div className="col-span-1">
        <div className="flex items-start pt-8">
          <p className="text-slate-400 text-3xl whitespace-nowrap">Pages /</p>
          <p className="text-white text-3xl ml-2"> {currentPage}</p>
        </div>
        <p className="text-white text-3xl font-bold mt-1">{currentPage}</p>
      </div>
      
      <div className="col-end-9 col-span-4 flex items-center justify-end pr-16">
        <a href="#" className="flex items-center mx-4">
          <FaUserAlt className="text-white text-3xl font-bold"/>
          <p href="#" className="text-white text-3xl font-bold ml-4">Sign in</p>
        </a>

        <a href="#" className="flex items-center mx-4">
          <IoSettingsSharp className="text-white text-3xl font-bold"/>
        </a>

        <a href="#" className="flex items-center mx-4">
          <FaBell className="text-white text-3xl font-bold"/>
        </a>
      </div>

    </div>

  );
}

export default Header;