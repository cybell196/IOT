const { format } = require('date-fns');
const mqtt = require("mqtt");
const mqttBrokerUrl = "mqtt://localhost:2003"; // Địa chỉ MQTT broker của bạn
const options = {
  username: "nguyenanhkiet",  // Thêm username MQTT
  password: "b21dccn471"   // Thêm password MQTT
};
const mqttClient = mqtt.connect(mqttBrokerUrl, options);
 
const connection = require("./db"); // Kết nối MySQL
const { sendDataToDataClients, sendDataToControlClients } = require("./webSocketHandler"); // Gửi dữ liệu tới client qua WebSocket

// Hàm để bắt đầu subscribe
exports.subDataSensor = () => {
  mqttClient.on("connect", () => {
    console.log("Đã kết nối tới MQTT broker");

    // Subscribe vào topic 'sensor/data' để nhận dữ liệu cảm biến
    mqttClient.subscribe("sensor/data", (err) => {
      if (!err) {
        console.log("Đã subscribe vào topic sensor/data");
      }
    });

    // Subscribe vào topic 'led/status' để nhận phản hồi bật/tắt thiết bị
    mqttClient.subscribe("led/status", (err) => {
      if (!err) {
        console.log("Đã subscribe vào topic led/status");
      }
    });
  });

  mqttClient.on("message", (topic, message) => {
    console.log(`Nhận tin nhắn từ ${topic}: ${message.toString()}`);

    try {
      const thoiGianHienTai = new Date();
      const formattedTime = format(thoiGianHienTai, 'yyyy-MM-dd HH:mm:ss');

      // Xử lý topic 'sensor/data' - Dữ liệu cảm biến
      if (topic === "sensor/data") {
        const data = JSON.parse(message.toString().trim());
        const mess = {
          type: "LED_CONTROL",
          command: "LED1_OFF"
        }
        // Kiểm tra nếu giá trị dobui lớn hơn 80 thì nháy đèn
        if (data.dobui > 80) {
          const message = {
            type: "LED_CONTROL",
            command: "LED1_DISABLE_ON"
          }
          sendDataToControlClients(message);
          sendDataToControlClients(mess);
          
        }else{
          const message = {
            type: "LED_CONTROL",
            command: "LED1_DISABLE_OFF"
          }
          sendDataToControlClients(message);

        }
        // Kiểm tra nếu giá trị dobui lớn hơn 200 thì gửi lệnh bật quạt
        // if (data.anhsang > 200) {
          
        //   mqttClient.publish("led/control", "LED1_ON");  // Gửi lệnh bật quạt tới topic led/control
        //   console.log("ánh sáng lớn hơn 200, tự động bật đèn (LED1_ON)");
        // }

        const query =
          "INSERT INTO DataSensor (nhiet_do, do_am, anh_sang, do_bui, thoi_gian) VALUES (?, ?, ?, ?, ?)";
        const values = [data.nhietdo, data.doam, data.anhsang, data.dobui, formattedTime];
        connection.query(query, values, (err, result) => {
          if (err) {
            console.error("Lỗi khi lưu dữ liệu vào MySQL:", err);
          } else {
            console.log("Dữ liệu đã được lưu vào MySQL:", result);

            // Gửi dữ liệu tới client qua WebSocket trên endpoint /data
            const newData = {
              type: "SENSOR_DATA",
              nhietdo: data.nhietdo,
              doam: data.doam,
              anhsang: data.anhsang,
              dobui: data.dobui,
              thoi_gian: formattedTime,
            };

            sendDataToDataClients(newData); // Gửi dữ liệu tới client kết nối tới /data
          }
        });
      }

      // Xử lý topic 'led/status' - Điều khiển thiết bị
      if (topic === "led/status") {
        const data = JSON.parse(message.toString().trim());

        if (data.type === "LED_CONTROL" && data.command) {
          
          let thiet_bi = "";
          let hanh_dong = "";

          switch (data.command) {
            case "LED1_ON":
              thiet_bi = "Bóng đèn";
              hanh_dong = "Bật";
              break;
            case "LED1_OFF":
              thiet_bi = "Bóng đèn";
              hanh_dong = "Tắt";
              break;
            case "LED2_ON":
              thiet_bi = "Quạt";
              hanh_dong = "Bật";
              break;
            case "LED2_OFF":
              thiet_bi = "Quạt";
              hanh_dong = "Tắt";
              break;
            case "LED3_ON":
              thiet_bi = "Điều hòa";
              hanh_dong = "Bật";
              break;
            case "LED3_OFF":
              thiet_bi = "Điều hòa";
              hanh_dong = "Tắt";
              break;
            default:
              console.log("Lệnh không hợp lệ");
              return;
          }

          // Lưu vào MySQL
          const query =
            "INSERT INTO actionhistory (thiet_bi, hanh_dong, thoi_gian) VALUES (?, ?, ?)";
          const values = [thiet_bi, hanh_dong, formattedTime];
          connection.query(query, values, (err, result) => {
            if (err) {
              console.error("Lỗi khi lưu dữ liệu vào MySQL:", err);
            } else {
              console.log("Dữ liệu hành động đã được lưu vào MySQL:", result);
              sendDataToControlClients(data); // Gửi phản hồi về client kết nối tới /control
            }
          });
        }
      }
    } catch (error) {
      console.error("Lỗi khi xử lý dữ liệu MQTT:", error);
    }
  });
};

// Xuất mqttClient để sử dụng trong file khác
exports.mqttClient = mqttClient;
