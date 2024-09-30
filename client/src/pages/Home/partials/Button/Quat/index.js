import { FaFan } from "react-icons/fa";
import { Switch, VisuallyHidden, useSwitch } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { initWebSocket, sendWebSocketMessage, addWebSocketListener } from "../webSocketControl"; // Sử dụng file WebSocket tách riêng
import { getButtonState, updateButtonState } from "../api";

const ThemeSwitch = (props) => {
  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch(props);

  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [isFanOn, setIsFanOn] = useState(false); // Trạng thái bật tắt quạt

  useEffect(() => {
    // Lấy trạng thái từ server khi trang được load
    getButtonState()
      .then(data => {
        setIsFanOn(data.button2Active); // Lấy trạng thái quạt (button 2)
      })
      .catch(error => {
        console.error("Lỗi khi lấy trạng thái từ server:", error);
      });
    
    // Khởi tạo kết nối WebSocket
    initWebSocket();

    // Thêm listener để nhận phản hồi từ server
    addWebSocketListener((data) => {
      if (data.type === "LED_CONTROL") {
        if (data.command === "LED2_ON") {
          setIsFanOn(true); // Quạt đã bật
          setLoading(false); // Tắt trạng thái loading
        } else if (data.command === "LED2_OFF") {
          setIsFanOn(false); // Quạt đã tắt
          setLoading(false); // Tắt trạng thái loading
        }
        
      }
    });
  }, []);

  const handleClick = () => {
    setLoading(true); // Bật trạng thái loading khi nhấn nút

    // Tạo JSON message tùy theo trạng thái quạt
    const message = {
      type: "LED_CONTROL",
      command: isFanOn ? "LED2_OFF" : "LED2_ON",
    };

    // Gửi message tới server qua WebSocket
    sendWebSocketMessage(message);

    // Cập nhật trạng thái quạt lên server (MySQL)
    updateButtonState({ button2Active: !isFanOn })
      .then(response => {
        console.log("Trạng thái quạt đã được lưu:", response);
      })
      .catch(error => {
        console.error("Lỗi khi lưu trạng thái quạt:", error);
      });
  };

  return (
    <div className="flex items-center justify-start row-span-1">
      <Component {...getBaseProps()}>
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <div
          {...getWrapperProps()}
          className={slots.wrapper({
            class: [
              "w-24 h-24 p-4",
              "flex items-center justify-center",
              "rounded-2xl bg-white hover:bg-slate-200",
              isFanOn ? "bg-green-500 hover:bg-red-700" : "bg-primary hover:bg-green-500",
              loading ? "animate-ping" : "", // Hiển thị animation loading khi đợi phản hồi
            ],
          })}
          onClick={handleClick} // Gọi hàm handleClick khi nhấn nút
        >
          {isFanOn ? (
            <FaFan className="text-yellow-300 w-full h-full spin" />
          ) : (
            <FaFan className="w-full h-full text-white" />
          )}
        </div>
      </Component>
      <p className="text-white select-none font-bold mx-4 pr-2">
        Quạt: {isFanOn ? "bật" : "tắt"} {loading && "(đang xử lý...)"}
      </p>
    </div>
  );
};

export default function Quat() {
  return <ThemeSwitch />;
}
