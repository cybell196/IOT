import { FaLightbulb } from "react-icons/fa6";
import { Switch, VisuallyHidden, useSwitch } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { initWebSocket, sendWebSocketMessage, addWebSocketListener } from "../webSocketControl"; // Import các hàm từ file WebSocket

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
  const [isLightOn, setIsLightOn] = useState(false); // Trạng thái bật tắt đèn

  useEffect(() => {
    // Khởi tạo kết nối WebSocket một lần
    initWebSocket();

    // Thêm listener để nhận phản hồi từ server
    addWebSocketListener((data) => {
      if (data.type === "LED_CONTROL") {
        if (data.command === "LED1_ON") {
          setIsLightOn(true); // Đèn đã bật
          setLoading(false);
        } else if (data.command === "LED1_OFF") {
          setIsLightOn(false); // Đèn đã tắt
          setLoading(false);
        }
        
      }
    });

  }, []);

  const handleClick = () => {
    setLoading(true); // Bật trạng thái loading khi nhấn nút

    // Tạo JSON message tùy theo trạng thái đèn
    const message = {
      type: "LED_CONTROL",
      command: isLightOn ? "LED1_OFF" : "LED1_ON"
    };

    // Gửi message tới server qua WebSocket
    sendWebSocketMessage(message);
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
              loading ? "animate-spin" : "", // Hiển thị animation loading khi đợi phản hồi
            ],
          })}
          onClick={handleClick} // Gọi hàm handleClick khi nhấn nút
        >
          {isLightOn ? (
            <FaLightbulb className="text-yellow-300 w-full h-full" />
          ) : (
            <FaLightbulb className="w-full h-full" />
          )}
        </div>
      </Component>
      <p className="text-white select-none font-bold mx-4 pr-2">
        Bóng đèn: {isLightOn ? "bật" : "tắt"} {loading && "(đang xử lý...)"}
      </p>
    </div>
  );
};

export default function BongDen() {
  return <ThemeSwitch />;
}
