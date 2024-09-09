import React from "react";
const columns = [
  {name: "ID", uid: "id", sortable: true},
  {name: "Nhiệt Độ", uid: "nhietdo", sortable: true},
  {name: "Độ Ẩm", uid: "doam", sortable: true},
  {name: "Ánh Sáng", uid: "anhsang", sortable: true},
  {name: "Thời Gian", uid: "time", sortable: true},
];

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate() {
  const now = new Date();
  const randomDate = new Date(now.getTime() - Math.floor(Math.random() * 10000000000));
  return randomDate.toLocaleString('en-GB', { hour12: false });
}

const users = Array.from({ length: 300 }, (_, index) => ({
  id: index + 1,
  nhietdo: `${getRandomNumber(10, 100)}°C`,
  doam: `${getRandomNumber(10, 100)}%`,
  anhsang: `${getRandomNumber(10, 100)} Lux`,
  time: getRandomDate(),
}));

export {columns, users};
