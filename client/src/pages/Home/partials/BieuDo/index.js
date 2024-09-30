import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { fetchAllData } from "./api"; // Import API
import { connectWebSocket } from "../webSocket"; // Import WebSocket
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
      // {
      //   label: "Độ bụi (µg/m³)",
      //   data: [],
      //   borderColor: "gray",
      //   backgroundColor: "rgba(134, 134, 134, 0.5)",
      //   yAxisID: "y1",
      // },
    ],
  });

  // Hàm để cập nhật dữ liệu cho biểu đồ với tối đa 8 giá trị
  const updateChartData = (newData) => {
    setChartData((prevData) => {
      const maxDataPoints = 8;

      const newLabels = [...prevData.labels, newData.thoi_gian].slice(-maxDataPoints);
      const newNhietDoData = [...prevData.datasets[0].data, newData.nhietdo].slice(-maxDataPoints);
      const newDoAmData = [...prevData.datasets[1].data, newData.doam].slice(-maxDataPoints);
      const newAnhSangData = [...prevData.datasets[2].data, newData.anhsang].slice(-maxDataPoints);
      // const newDoBuiData = [...prevData.datasets[3].data, newData.dobui].slice(-maxDataPoints);
      return {
        labels: newLabels,
        datasets: [
          { ...prevData.datasets[0], data: newNhietDoData },
          { ...prevData.datasets[1], data: newDoAmData },
          { ...prevData.datasets[2], data: newAnhSangData },
          // { ...prevData.datasets[3], data: newDoBuiData },
        ],
      };
    });
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const data = await fetchAllData();
      if (data.length > 0) {
        const labels = data.map((item) => item.thoi_gian);
        const nhietDoData = data.map((item) => item.nhiet_do);
        const doAmData = data.map((item) => item.do_am);
        const anhSangData = data.map((item) => item.anh_sang);
        // const doBuiData = data.map((item) => item.do_bui);

        setChartData({
          labels,
          datasets: [
            { ...chartData.datasets[0], data: nhietDoData },
            { ...chartData.datasets[1], data: doAmData },
            { ...chartData.datasets[2], data: anhSangData },
            // { ...chartData.datasets[3], data: doBuiData },
          ],
        });
      }
    };

    loadInitialData();

    const ws = connectWebSocket(updateChartData); // Kết nối WebSocket chung
    return () => ws && ws.close();
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
        // text: "Biểu đồ Nhiệt độ, Độ ẩm, Ánh sáng và Độ bụi",
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
          // text: "Nhiệt độ (°C),Độ ẩm (%) & Độ bụi (µg/m³)",
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
