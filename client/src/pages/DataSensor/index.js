import React from 'react';
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
} from '@nextui-org/react';

import { columns, users } from './data';
import { capitalize } from './utils';
import { FaAngleDown, FaSearch } from 'react-icons/fa';
import { fetchData } from './api';

const INITIAL_VISIBLE_COLUMNS = ['nhiet_do', 'do_am', 'anh_sang', 'thoi_gian'];

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
    
    // ----------------- Fetch data -----------------
    const [users, setUsers] = React.useState([]); // new state for users
    React.useEffect(() => {
        fetchData()
            .then((data) => {
                if (Array.isArray(data)) {
                    setUsers(data);
                    console.log('Updated users:', data); // Log new data
                } else {
                    console.error('fetchData did not return an array:', data);
                }
            })
            .catch((error) => {
                console.error('fetchData failed:', error);
            });
    }, []);
    // ----------------------------------------------
    
    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === 'all') return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    // Lọc dữ liệu
    // const handleFilter = () => {
    //   let filteredUsers = [...users];

    //   // Thực hiện lọc theo lựa chọn
    //   if (filterType && filterCondition && filterStatValue) {
    //     filteredUsers = filteredUsers.filter((user) => {
    //       const valueToCompare = user[filterType]; // Lấy giá trị từ user tương ứng với loại lọc (nhiệt độ, độ ẩm, ánh sáng)

    //       if (filterCondition === 'greater') {
    //         return valueToCompare >= parseFloat(filterStatValue);
    //       } else if (filterCondition === 'less') {
    //         return valueToCompare <= parseFloat(filterStatValue);
    //       }

    //       return true;
    //     });
    //   }

    //   // Cập nhật danh sách sau khi lọc
    //   setFilteredStatItems(filteredStatItems);
    // };
    // ----------------- Filter data -----------------

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];
        
        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.thoi_gian && typeof user.thoi_gian === 'string' && filterValue && typeof filterValue === 'string'
                    ? user.thoi_gian.toLowerCase().includes(filterValue.toLowerCase())
                    : false,
            );
        }

        if (statusFilter !== 'all') {
            filteredUsers = filteredUsers.filter((user) => Array.from(statusFilter).includes(user.status));
        }

        return filteredUsers;
    }, [users, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === 'descending' ? -cmp : cmp;
        });
    }, [sortDescriptor, filteredItems]);

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

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue('');
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue('');
        setPage(1);
    }, []);

    

    const topContent = React.useMemo(() => {
        return (
            <div className=" grid grid-cols-3 gap-4 mb-2">
                <div className="flex items-end gap-3 col-span-1">
                    <span className="text-white text-2xl font-bold">Tổng cộng {filteredItems.length} kết quả</span>
                    <div className="flex justify-between items-center ml-12">
                        <label className="flex items-center text-default-400 text-lg">
                            Page Size:
                            <select
                                className="bg-transparent outline-none text-yellow-400 text-small font-bold"
                                onChange={onRowsPerPageChange}
                            >
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                            </select>
                        </label>
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
                                    placeholder="dd/mm/yyyy, hh:mm:ss"
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
    }, [filterValue, statusFilter, visibleColumns, users.length, onSearchChange, hasSearchFilter]);

    const bottomContent = React.useMemo(() => {
        return pages > 0 ? (
            <div className="flex w-full justify-center">
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
