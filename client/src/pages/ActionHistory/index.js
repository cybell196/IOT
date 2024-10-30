import React from 'react';
import { debounce } from 'lodash';
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
    Chip,
    User,
    Pagination,
    ScrollShadow,
} from '@nextui-org/react';

import { FaAngleDown, FaSearch } from 'react-icons/fa';

import { columns, users, statusOptions } from './data';
import { capitalize } from './utils';
import { fetchData, fetchTodaysActionsCount } from './api';

const statusColorMap = {
    Bật: 'success',
    Tắt: 'danger',
};

const INITIAL_VISIBLE_COLUMNS = ['id', 'thiet_bi', 'hanh_dong', 'thoi_gian'];

export default function App() {
    const [filterValue, setFilterValue] = React.useState('');
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: 'id',
        direction: 'ascending',
    });
    
    // số lần bật tắt trong ngày hôm nay
    const [actionCounts, setActionCounts] = React.useState({totalOn: 0, totalOff: 0});
    const fetchActionCounts = () => {
        fetchTodaysActionsCount()
            .then((response) => {
                if (response && typeof response === 'object') {
                    // Cập nhật số lần bật và tắt từ response
                    setActionCounts({
                        totalOn: response.totalOn || 0,
                        totalOff: response.totalOff || 0,
                    });
                    console.log('Cập nhật số lần bật và tắt:', response); // Log dữ liệu mới
                } else {
                    console.error('fetchTodaysActionsCount không trả về một đối tượng:', response);
                }
            })
            .catch((error) => {
                console.error('fetchTodaysActionsCount thất bại:', error);
            });
    };

    // ----------------- Fetch data -----------------
    const [users, setUsers] = React.useState([]); // new state for users
    const fetchUsers = (value = '') => {
    fetchData(value)
        .then((response) => {
            if (Array.isArray(response)) {
                setUsers(response);
                // setActionCounts(response.actionCounts);
                console.log('Updated users:', response); // Log new data
            } else {
                console.error('fetchData did not return an array:', response);
            }
        })
        .catch((error) => {
            console.error('fetchData failed:', error);
        });
};

    React.useEffect(() => {
        fetchUsers();
        // fetchActionCounts();
    }, []);
    // ----------------------------------------------
    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === 'all') return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.thoi_gian.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        if (statusFilter !== 'all' && Array.from(statusFilter).length !== statusOptions.length) {
            filteredUsers = filteredUsers.filter((user) => Array.from(statusFilter).includes(user.hanh_dong));
        }
        return filteredUsers;
    }, [users, filterValue, statusFilter]);

    const debouncedFetchData = React.useCallback(
        debounce((value) => {
            fetchUsers(value);
        }, 300), // Delay in milliseconds
        [],
    );

    const onSearchChange = React.useCallback((value) => {
        setFilterValue(value);
        setPage(1);
        debouncedFetchData(value);
    }, []);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

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
            case 'status':
                return (
                    <Chip
                        className="capitalize text-2xl font-bold p-2"
                        color={statusColorMap[user.hanh_dong]}
                        size="lg"
                        variant="flat"
                    >
                        {cellValue}
                    </Chip>
                );

            default:
                return cellValue;
        }
    }, []);


    const onClear = React.useCallback(() => {
        setFilterValue('');
        setPage(1);
    }, []);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className=" grid grid-cols-3 gap-4 mb-2">
                <div className="flex items-end gap-3 col-span-1">
                    <span className="text-white text-2xl font-bold">Tổng cộng {filteredItems.length} kết quả</span>
                    <div className="flex justify-between items-center ml-12">
                        
                    </div>
                </div>
                <div className="flex gap-12 w-full col-span-2">
                    <div className="w-full">
                        <div className="w-full flex items-center justify-center"></div>
                        <div className="w-full grid grid-cols-3">
                            <div className="w-full col-start-2 col-end-3">
                                <span className="ml-2 text-white text-2xl font-bold">Tìm kiếm theo thời gian</span>
                                <Input
                                    color="warning"
                                    size="lg"
                                    isClearable
                                    placeholder="Nhập thời gian"
                                    value={filterValue}
                                    onClear={() => onClear()}
                                    onValueChange={onSearchChange}
                                    classNames={{
                                        inputWrapper: 'px-6',
                                        input: 'text-slate-950 text-2xl font-bold',
                                    }}
                                />
                            </div>
                            <Dropdown>
                                <DropdownTrigger className="text-white bg-orange-400 text-xl font-bold mt-auto ml-auto p-6 w-2/3">
                                    <Button variant="flat">
                                        Trạng thái <FaAngleDown />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Table Columns"
                                    closeOnSelect={false}
                                    selectedKeys={statusFilter}
                                    selectionMode="multiple"
                                    onSelectionChange={setStatusFilter}
                                >
                                    {statusOptions.map((status) => (
                                        <DropdownItem key={status.uid} className="capitalize">
                                            {capitalize(status.name)}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, [filterValue, statusFilter, users.length, onSearchChange, hasSearchFilter]);

    const bottomContent = React.useMemo(() => {
        return pages > 0 ? (
            <div className="flex w-full justify-between items-center">
                
                <span className="w-[30%] text-small text-default-400">
                   {/* <p className="text-white text-2xl font-bold">Số lần Bật trong ngày hôm nay: {actionCounts.totalOn || 0}</p>
                    <p className="text-white text-2xl font-bold">Số lần Tắt trong ngày hôm nay: {actionCounts.totalOff || 0}</p> */}
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
                    loop
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

                tbody: 'bg-slate-950 bg-opacity-50 rounded-lg ',
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
            {/* <ScrollShadow className="h-[400px]"> */}
            <TableBody emptyContent={'No users found'} items={paginatedItems}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
            {/* </ScrollShadow> */}
        </Table>
    );
}
