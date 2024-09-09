import React from "react";
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
} from "@nextui-org/react";
import {columns, users} from "./data";
import {capitalize} from "./utils";
import { FaAngleDown, FaSearch } from "react-icons/fa";

const INITIAL_VISIBLE_COLUMNS = ["id", "nhietdo", "doam", "anhsang", "time"];

export default function App() {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "id",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.time.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all") {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
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
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {

      case "role":
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

  

  

  // const onRowsPerPageChange = React.useCallback((e) => {
  //   setRowsPerPage(Number(e.target.value));
  //   setPage(1);
  // }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(()=>{
    setFilterValue("")
    setPage(1)
  },[])

  const topContent = React.useMemo(() => {
    return (
        <div className=" grid grid-cols-3 gap-4 mb-2">
            <div className="flex items-end gap-3 col-span-1">
                <span className="text-white text-2xl font-bold">Tổng cộng {users.length} kết quả</span>
            </div>
            <div className="flex gap-12 w-full col-span-2">
                <div className="w-full">
                    <div className="w-full flex items-center justify-center">
                        
                    </div>
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
                                    inputWrapper: "px-6",
                                    input: "text-slate-950 text-2xl font-bold",
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
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    users.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
      return pages > 0 ? (
          <div className="flex w-full justify-center">
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
              wrapper: 'bg-slate-950 bg-opacity-50',
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
          <TableBody emptyContent={'No users found'} items={sortedItems}>
              {(item) => (
                  <TableRow key={item.id}>
                      {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                  </TableRow>
              )}
          </TableBody>
      </Table>
  );
}