import { useState, useEffect } from "react";
import { FaLightbulb } from "react-icons/fa6";
import { Switch, VisuallyHidden, useSwitch } from "@nextui-org/react";
import { initWebSocket, sendWebSocketMessage, addWebSocketListener } from "../webSocketControl"; // Import các hàm từ file WebSocket
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
  const [isLightOnNew, setIsLightOnNew] = useState(false); // Trạng thái bật tắt đèn
  const [isDisabled, setIsDisabled] = useState(false); // Trạng thái vô hiệu hóa button
   
  useEffect(() => {
    // Lấy trạng thái từ server khi trang được load
    getButtonState()
      .then(data => {
        setIsLightOnNew(data.button4Active); // Lấy trạng thái bóng đèn (button 1)
      })
      .catch(error => {
        console.error("Lỗi khi lấy trạng thái từ server:", error);
      });
    
    // Khởi tạo kết nối WebSocket một lần
    initWebSocket();

    // Thêm listener để nhận phản hồi từ server
    addWebSocketListener((data) => {
      if (data.type === "LED_CONTROL") {
        if (data.command === "WARNING_LED_ON") {
          setIsLightOnNew(true); // Đèn đã bật
          setLoading(false);
        } else if (data.command === "WARNING_LED_OFF") {
          setIsLightOnNew(false); // Đèn đã tắt
          setLoading(false);
        } else if (data.command === "LED1_DISABLE_ON") {
          setIsDisabled(true); // Vô hiệu hóa nút
        } else if (data.command === "LED1_DISABLE_OFF") {
          setIsDisabled(false); // Hủy vô hiệu hóa nút
        }
      }
    });
  }, []);

  const handleClick = () => {
    if (!isDisabled) {
      setLoading(true); // Bật trạng thái loading khi nhấn nút

      // Tạo JSON message tùy theo trạng thái đèn
      const message = {
        type: "LED_CONTROL",
        command: isLightOnNew ? "WARNING_LED_OFF" : "WARNING_LED_ON"
      };

      // Gửi message tới server qua WebSocket
      sendWebSocketMessage(message);

      // Cập nhật trạng thái bóng đèn lên server (MySQL)
      updateButtonState({ button4Active: !isLightOnNew })
        .then(response => {
          console.log("Trạng thái bóng đèn đã được lưu:", response);
        })
        .catch(error => {
          console.error("Lỗi khi lưu trạng thái bóng đèn:", error);
        });
    }
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
              "rounded-2xl ",
              isLightOnNew ? "bg-green-500 hover:bg-red-700" : "bg-slate-400 hover:bg-green-500",
              loading ? "animate-ping" : "", // Hiển thị animation loading khi đợi phản hồi
              isDisabled ? "pointer-events-none opacity-50 cursor-not-allowed " : "" // Vô hiệu hóa nếu isDisabled
            ],
          })} 
          onClick={!isDisabled && !loading ? handleClick : null} // Chỉ cho phép nhấn nếu không bị vô hiệu hóa
        >
          {isLightOnNew ? (
            <FaLightbulb className="w-full h-full text-yellow-300 spin" />
          ) : (
            <FaLightbulb className="w-full h-full text-white" />
          )}
        </div>
      </Component>
      <p className="text-white select-none font-bold mx-4 pr-2">
          Bóng đèn: {isLightOnNew ? "bật" : "tắt"} {loading && "(đang xử lý...)"}
        </p>
      
    </div>
  );
};

export default function BongDen() {
  return <ThemeSwitch />;
}
