import React from "react";
const columns = [
  {name: "ID", uid: "id", sortable: true},
  {name: "Thiết Bị", uid: "device", sortable: true},
  {name: "Hành Động", uid: "status", sortable: true},
  {name: "Thời Gian", uid: "time", sortable: true},
];

const statusOptions = [
  {name: "Bật", uid: "bật"},
  {name: "Tắt", uid: "tắt"},
];

function getRandomDate() {
  const now = new Date();
  const randomDate = new Date(now.getTime() - Math.floor(Math.random() * 10000000000));
  return randomDate.toLocaleString('en-GB', { hour12: false });
}

function getRandomStatus() {
  const statusOptions = ["bật", "tắt"];
  const randomIndex = Math.floor(Math.random() * statusOptions.length);
  return statusOptions[randomIndex];
}

function getRandomDevice() {
  const deviceOptions = ["Điều hòa", "Quạt", "Đèn 1", "Đèn 2", "TV", "Tủ lạnh", "Máy giặt", "Máy sấy"];
  const randomIndex = Math.floor(Math.random() * deviceOptions.length);
  return deviceOptions[randomIndex];
}

const users = Array.from({ length: 300 }, (_, index) => ({
  id: index + 1,
  device: getRandomDevice(),
  status: getRandomStatus(),
  time: getRandomDate(),
}));

export {columns, users, statusOptions};
