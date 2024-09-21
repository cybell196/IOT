import React from "react";
const columns = [
  {name: "ID", uid: "id", sortable: true},
  {name: "Thiết Bị", uid: "thiet_bi", sortable: true},
  {name: "Hành Động", uid: "hanh_dong", sortable: true},
  {name: "Thời Gian", uid: "thoi_gian", sortable: true},
];

const statusOptions = [
  {name: "Bật", uid: "Bật"},
  {name: "Tắt", uid: "Tắt"},
];

let users = [];

export {columns, users, statusOptions};
