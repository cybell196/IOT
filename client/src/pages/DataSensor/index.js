
import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import axios from 'axios';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Pagination,
    Select, SelectItem,
} from '@nextui-org/react';

import { columns, users } from './data';
import { capitalize } from './utils';
import { FaAngleDown, FaSearch, FaRegClock, FaTemperatureLow,  } from 'react-icons/fa';
import { WiHumidity } from "react-icons/wi";
import { CiLight } from "react-icons/ci";
import { fetchData } from './api';
import { FaClock } from 'react-icons/fa6';


const INITIAL_VISIBLE_COLUMNS = ['nhiet_do', 'do_am', 'anh_sang', 'do_bui', 'thoi_gian'];

export default function App() {
    const [filterValue, setFilterValue] = React.useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("");

    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: 'id',
        direction: 'ascending',
    });
    
    // ----------------- Fetch data -----------------
    const [users, setUsers] = React.useState([]); // new state for users
    const [searchField, setSearchField] = React.useState(''); // new state for searchField
    // const [searchTerm, setSearchTerm] = React.useState(''); // new state for searchTerm
    
     
    useEffect(() => {
        fetchData();
      }, [searchTerm]);

      const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3002/api/data-sensor', {
                params: {
                    searchTerm,
                    filter: selectedFilter,
                },
            });
            const data = response.data;
            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                console.error('fetchData did not return an array:', data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    // const debouncedFetchData = useCallback(
    //     debounce(() => {
    //         fetchData();
    //     }, 2000), // Delay in milliseconds
    //     [],
    // );

    // ----------------------------------------------

    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === 'all') return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    // const filteredItems = React.useMemo(() => {
    //     let filteredUsers = [...users];

    //     if (hasSearchFilter) {
    //         filteredUsers = filteredUsers.filter((user) =>
    //             user.thoi_gian && typeof user.thoi_gian === 'string' && filterValue && typeof filterValue === 'string'
    //                 ? user.thoi_gian.toLowerCase().includes(filterValue.toLowerCase())
    //                 : false,
    //         );
    //     }

    //     if (statusFilter !== 'all') {
    //         filteredUsers = filteredUsers.filter((user) => Array.from(statusFilter).includes(user.status));
    //     }

    //     return filteredUsers;
    // }, [users, filterValue, statusFilter]);

    const pages = Math.ceil(users.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return users.slice(start, end);
    }, [page, users, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
    return [...users].sort((a, b) => {
        const columnToSort = sortDescriptor.column === 'thoi_gian' ? 'id' : sortDescriptor.column;
        const first = a[columnToSort];
        const second = b[columnToSort];
        const cmp = first < second ? -1 : first > second ? 1 : 0;

        return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
}, [sortDescriptor, users]);

    const paginatedItems = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return sortedItems.slice(start, end); // Phân trang dữ liệu đã sắp xếp
    }, [page, sortedItems, rowsPerPage]);

    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case 'role':
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{cellValue}</p>
                        <p className="text-bold text-tiny capitalize text-default-400">{user.team}</p>
                    </div>
                );

            default:
                return cellValue;
        }
    }, []);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    

    const onSearchChange = useCallback((event) => {
        const value = event?.target?.value || '';
        setSearchTerm(value);
        console.log('Updated searchTerm:', value);
        fetchData();
        setPage(1);
    }, []);
   

    const onClear = useCallback(() => {
        setSearchTerm('');
        setPage(1);
    }, []);

    
    const handleSearchByChange = useCallback((event) => {
        const value = event?.target?.value || '';
        setSelectedFilter(value);
        console.log('Updated selectedFilter:', value);
    }, []);
    
    

    const topContent = React.useMemo(() => {
        return (
            <div className=" grid grid-cols-4 gap-4 mb-2">
                <div className="flex items-end gap-3 col-span-1">
                    <span className="text-white text-2xl font-bold">Tổng cộng {users.length} kết quả</span>
                    <div className="flex justify-between items-center ml-12"></div>
                </div>
                <div className="flex gap-12 w-full col-span-3">
                    <div className="w-full">
                        <div className="w-full flex items-center justify-center"></div>
                        <div className="w-full grid grid-cols-3">
                            <label className="flex items-center justify-end text-default-400 text-2xl">
                                Tìm kiếm theo:
                                <select
                                    className="bg-transparent outline-none text-yellow-500 text-2xl font-bold"
                                    value={selectedFilter}
                                    onChange={handleSearchByChange}
                                >
                                    <option className="bg-gray-800 text-white hover:bg-gray-700" value="thoi_gian">Thời gian</option>
                                    <option className="bg-gray-800 text-white hover:bg-gray-700" value="nhiet_do">Nhiệt độ</option>
                                    <option className="bg-gray-800 text-white hover:bg-gray-700" value="do_am">Độ ẩm</option>
                                    <option className="bg-gray-800 text-white hover:bg-gray-700" value="anh_sang">Ánh sáng</option>
                                    <option className="bg-gray-800 text-white hover:bg-gray-700" value="do_bui">Độ bụi</option>
                                </select>
                            </label>
                            <div className="w-full col-start-2 col-end-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        color="warning"
                                        size="lg"
                                        placeholder="Tìm kiếm"
                                        value={searchTerm}
                                        onChange={onSearchChange}
                                        className="px-6 text-orange-500 text-2xl font-bold w-full p-2 rounded-xl bg-slate-950 bg-opacity-50"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={onClear}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-950 bg-white rounded-full text-2xl font-bold px-1"
                                        >
                                            &times;
                                        </button>
                                    )}
                                </div>
                            </div>
                            <Dropdown>
                                <DropdownTrigger className="text-white bg-orange-400 text-xl font-bold mt-auto ml-auto p-6 w-2/3">
                                    <Button variant="flat">
                                        Cột <FaAngleDown />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Table Columns"
                                    closeOnSelect={false}
                                    selectedKeys={visibleColumns}
                                    selectionMode="multiple"
                                    onSelectionChange={setVisibleColumns}
                                >
                                    {columns.map((column) => (
                                        <DropdownItem key={column.uid} className="capitalize">
                                            {capitalize(column.name)}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, [users.length, selectedFilter, searchTerm, onClear, onSearchChange, handleSearchByChange]);
    
    const bottomContent = React.useMemo(() => {
        return pages > 0 ? (
            <div className="flex w-full justify-between items-center">
                <span className="w-[30%] ">
                    <label className="flex items-center text-default-400 text-2xl">
                        Page Size:
                        <select
                            className="bg-transparent outline-none text-red-700 text-2xl font-bold"
                            onChange={onRowsPerPageChange}
                        >
                            <option className="bg-gray-800 text-white hover:bg-gray-700" value="10">10</option>
                            <option className="bg-gray-800 text-white hover:bg-gray-700" value="15">15</option>
                            <option className="bg-gray-800 text-white hover:bg-gray-700" value="20">20</option>
                        </select>
                    </label>
                </span>
                <Pagination
                    showControls
                    isCompact
                    dotsJump={10} // Khoảng cách nhảy khi nhấn vào nút "..."
                    color="warning"
                    showShadow
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                    classNames={{
                        item: 'w-12 h-12 text-2xl text-white rounded-xl bg-slate-950 bg-opacity-50',
                        cursor: 'text-yellow-500 font-bold w-12 h-12 text-3xl bg-slate-950 bg-opacity-90 rounded-xl',
                        prev: 'w-12 h-12 text-3xl text-white rounded-xl bg-slate-950 bg-opacity-50',
                        next: 'w-12 h-12 text-3xl text-white rounded-xl bg-slate-950 bg-opacity-50',
                    }}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2"></div>
            </div>
        ) : null;
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    return (
        <Table
            aria-label="Example table with custom cells, pagination and sorting"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            selectedKeys={selectedKeys}
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
            classNames={{
                wrapper: 'bg-slate-950 bg-opacity-50 overflow-auto max-h-[480px]',
                table: 'text-white bg-slate-950 bg-opacity-30 rounded-lg mt-4',

                tbody: 'bg-slate-950 bg-opacity-50 rounded-lg',
                tr: 'hover:bg-yellow-600',
                td: 'px-8 py-4 text-2xl font-bold text-center',
                th: 'text-2xl px-8 py-4 text-yellow-200 text-center bg-slate-950 bg-opacity-90',
            }}
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === 'actions' ? 'center' : 'start'}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={'No users found'} items={paginatedItems}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
