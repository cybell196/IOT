import { TbAirConditioning } from "react-icons/tb";
import { Switch, VisuallyHidden, useSwitch } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { initWebSocket, sendWebSocketMessage, addWebSocketListener } from "../webSocketControl"; // Sử dụng file WebSocket tách riêng
import { getButtonState, updateButtonState } from "../api"; // Sử dụng API đã tách

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
  const [isACOn, setIsACOn] = useState(false); // Trạng thái bật tắt điều hòa

  useEffect(() => {
    // Lấy trạng thái từ server khi trang được load
    getButtonState()
      .then(data => {
        setIsACOn(data.button3Active); // Lấy trạng thái điều hòa (button 3)
      })
      .catch(error => {
        console.error("Lỗi khi lấy trạng thái từ server:", error);
      });
    
    // Khởi tạo kết nối WebSocket
    initWebSocket();

    // Thêm listener để nhận phản hồi từ server
    addWebSocketListener((data) => {
      if (data.type === "LED_CONTROL") {
        if (data.command === "LED3_ON") {
          setIsACOn(true); // Điều hòa đã bật
          setLoading(false);
        } else if (data.command === "LED3_OFF") {
          setIsACOn(false); // Điều hòa đã tắt
          setLoading(false);
        }
        
      }
    });
  }, []);

  const handleClick = () => {
    setLoading(true); // Bật trạng thái loading khi nhấn nút

    // Tạo JSON message tùy theo trạng thái điều hòa
    const message = {
      type: "LED_CONTROL",
      command: isACOn ? "LED3_OFF" : "LED3_ON",
    };

    // Gửi message tới server qua WebSocket
    sendWebSocketMessage(message);

    // Cập nhật trạng thái điều hòa lên server (MySQL)
    updateButtonState({ button3Active: !isACOn })
      .then(response => {
        console.log("Trạng thái điều hòa đã được lưu:", response);
      })
      .catch(error => {
        console.error("Lỗi khi lưu trạng thái điều hòa:", error);
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
              isACOn ? "bg-green-500 hover:bg-red-700" : "bg-slate-400 hover:bg-green-500",
              loading ? "animate-ping" : "", // Hiển thị animation loading khi đợi phản hồi
            ],
          })}
          onClick={handleClick} // Gọi hàm handleClick khi nhấn nút
        >
          {isACOn ? (
            <TbAirConditioning className="text-yellow-300 w-full h-full spin" />
          ) : (
            <TbAirConditioning className="w-full h-full text-white" />
          )}
        </div>
      </Component>
      <p className="text-white select-none font-bold mx-4 pr-2">
        Điều hòa: {isACOn ? "bật" : "tắt"} {loading && "(đang xử lý...)"}
      </p>
    </div>
  );
};

export default function DieuHoa() {
  return <ThemeSwitch />;
}
