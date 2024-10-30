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
        label: "Độ bụi (µg/m³)",
        data: [],
        borderColor: "gray",
        backgroundColor: "rgba(134, 134, 134, 0.5)",
        yAxisID: "y",
      },
    ],
  });

  // Hàm để cập nhật dữ liệu cho biểu đồ với tối đa 8 giá trị
  const updateChartData = (newData) => {
    setChartData((prevData) => {
      const maxDataPoints = 8;

      const newLabels = [...prevData.labels, newData.thoi_gian].slice(-maxDataPoints);
      const newDoBuiData = [...prevData.datasets[0].data, newData.dobui].slice(-maxDataPoints);
      return {
        labels: newLabels,
        datasets: [
          { ...prevData.datasets[0], data: newDoBuiData },
        ],
      };
    });
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const data = await fetchAllData();
      if (data.length > 0) {
        const labels = data.map((item) => item.thoi_gian);
        const doBuiData = data.map((item) => item.do_bui);

        setChartData({
          labels,
          datasets: [
            { ...chartData.datasets[0], data: doBuiData },
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
        text: "Biểu đồ Độ bụi (µg/m³)",
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
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Độ bụi (µg/m³)",
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
