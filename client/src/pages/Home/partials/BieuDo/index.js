import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js'
  import { Chart, Line } from 'react-chartjs-2'
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )

function BieuDo() {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Nhiệt độ (°C)',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'red',
        backgroundColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Độ ẩm (%)',
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: false,
        borderColor: 'blue',
        backgroundColor: 'rgb(75, 75, 192)',
        tension: 0.1
      },
      {
        label: 'Ánh sáng (lux)',
        data: [280, 480, 400, 190, 386, 227, 190],
        fill: false,
        borderColor: 'yellow',
        backgroundColor: 'rgb(75, 75, 192)',
        tension: 0.1
      }
    ]
  };
  const options = {
    plugins: {
      title: {
        display: false,
        align: 'start',
        text: ''
      }
    },
    scales: {
      y: {
        ticks: {
          color: 'white' // Thay đổi màu số liệu trên trục y thành màu đỏ
        }
      },
      x: {
        ticks: {
          color: 'white' // Thay đổi màu số liệu trên trục x thành màu xanh
        }
      }
    }
  };
  return (
    <div>
      <Line data={data} options={options}/>
    </div>
  );
}

export default BieuDo;