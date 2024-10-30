import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaUserAlt, FaBell } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
// import { Image, Button } from '@nextui-org/react';
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar} from "@nextui-org/react";

// Sử dụng useLocation từ react-router-dom

function Header() {
    const location = useLocation(); // Lấy đường dẫn hiện tại
    const pathName = location.pathname; // Lấy tên đường dẫn

    // Tùy chỉnh tên trang dựa trên đường dẫn
    const getPageTitle = (path) => {
        switch (path) {
            case '/profile':
                return 'Profile';
            case '/data-sensor':
                return 'Data Sensor';
            case '/action-history':
                return 'Action History';
            case '/home-new':
                return 'Dashboard New';
            default:
                return 'Dashboard';
        }
    };

    const pageTitle = getPageTitle(pathName); // Lấy tên trang từ đường dẫn
    return (
        <div className="grid grid-cols-8 w-full h-32">
            <div className="col-span-2">
                <div className="flex items-start pt-8">
                    <p className="text-slate-400 text-3xl whitespace-nowrap">Pages /</p>
                    <p className="text-white text-3xl ml-2"> {pageTitle}</p>
                </div>
                <p className="text-white text-3xl font-bold mt-1">{pageTitle}</p>
            </div>

            <div className="col-end-9 col-span-4 flex items-center justify-end pr-16">
                <a href="#" className="flex items-center mx-4">
                    {/* <Image src="/avt.jpg" alt="Avatar" width="40" radius="full" className="my-12 ml-44  col-span-1" /> */}
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                src="/avt.jpg"
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">Signed in as</p>
                                <p className="font-semibold">kietna.b21dccn471@stu.ptit.edu.vn</p>
                            </DropdownItem>
                            <DropdownItem key="dashboard">Dashboard</DropdownItem>
                            <DropdownItem key="data-sensor">Data Sensor</DropdownItem>
                            <DropdownItem key="action-history">Action History</DropdownItem>
                            <DropdownItem key="profile">Profile</DropdownItem>
                            <DropdownItem key="logout" color="danger">
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </a>

                <a href="#" className="flex items-center mx-4">
                    <IoSettingsSharp className="text-white text-3xl font-bold" />
                </a>

                <a href="#" className="flex items-center mx-4">
                    <FaBell className="text-white text-3xl font-bold" />
                </a>
            </div>
        </div>
    );
}

export default Header;
