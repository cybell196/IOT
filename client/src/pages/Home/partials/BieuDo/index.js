import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { fetchAllData } from "./api"; // Import API
import { connectWebSocket } from "./webSocket"; // Import WebSocket
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần biểu đồ
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Nhiệt độ (°C)",
        data: [],
        borderColor: "red",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y1",
      },
      {
        label: "Độ ẩm (%)",
        data: [],
        borderColor: "aquamarine",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        yAxisID: "y1",
      },
      {
        label: "Ánh sáng (lux)",
        data: [],
        borderColor: "yellow",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        yAxisID: "y2",
      },
    ],
  });

  // Hàm để cập nhật dữ liệu cho biểu đồ
  const updateChartData = (newData) => {
    setChartData((prevData) => ({
      labels: [...prevData.labels, newData.thoi_gian], // Cập nhật dữ liệu thời gian
      datasets: [
        {
          ...prevData.datasets[0],
          data: [...prevData.datasets[0].data, newData.nhietdo], // Cập nhật nhiệt độ
        },
        {
          ...prevData.datasets[1],
          data: [...prevData.datasets[1].data, newData.doam], // Cập nhật độ ẩm
        },
        {
          ...prevData.datasets[2],
          data: [...prevData.datasets[2].data, newData.anhsang], // Cập nhật ánh sáng
        },
      ],
    }));
  };

  // Load dữ liệu ban đầu từ API khi component được render
  useEffect(() => {
    const loadInitialData = async () => {
      const data = await fetchAllData();
      if (data.length > 0) {
        const labels = data.map((item) => item.thoi_gian); // Thời gian cho trục x
        const nhietDoData = data.map((item) => item.nhiet_do);
        const doAmData = data.map((item) => item.do_am);
        const anhSangData = data.map((item) => item.anh_sang);

        setChartData({
          labels, // Đưa thời gian vào trục x
          datasets: [
            {
              ...chartData.datasets[0],
              data: nhietDoData,
            },
            {
              ...chartData.datasets[1],
              data: doAmData,
            },
            {
              ...chartData.datasets[2],
              data: anhSangData,
            },
          ],
        });
      }
    };

    loadInitialData(); // Lấy dữ liệu ban đầu
  }, []);

  // Kết nối với WebSocket khi component render
  useEffect(() => {
    connectWebSocket((newData) => {
      updateChartData(newData); // Cập nhật dữ liệu mới từ WebSocket, bao gồm cả thời gian
    });
  }, []);

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Biểu đồ Nhiệt độ, Độ ẩm và Ánh sáng",
        color: "white",
        font: {
          size: 20,
        },
        padding: {
          bottom: 20,
          top: 20,
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Thời gian",
          color: "white",
        },
        ticks: {
          color: "white",
          display: false,
          maxRotation: 0, // Tắt chữ nghiêng
          minRotation: 0, // Đảm bảo chữ không bị xoay
          padding: 10,
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Nhiệt độ (°C) & Độ ẩm (%)",
          color: "white",
        },
        ticks: {
          color: "white",
        },
      },
      y2: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Ánh sáng (lux)",
          color: "white",
        },
        ticks: {
          color: "white",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
