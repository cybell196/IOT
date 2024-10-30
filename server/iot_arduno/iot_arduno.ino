#include <WiFi.h>
#include <AsyncMqttClient.h>
#include <DHT.h>
#include <Ticker.h>

// Cấu hình WiFi và MQTT
const char* ssid = "Cybell196";
const char* password = "khongcomatkhau";
const char* mqtt_server = "172.20.10.2";

const int mqtt_port = 2003;
const char* mqtt_username = "nguyenanhkiet";   // Thêm username MQTT
const char* mqtt_password = "b21dccn471";   // Thêm password MQTT
const char* topic = "sensor/data";
const char* ledControlTopic = "led/control";  // Chủ đề điều khiển LED
const char* ledStatusTopic = "led/status";    // Chủ đề trạng thái LED

// Cấu hình chân kết nối cảm biến và LED
#define DHTPIN 5       // Chân tín hiệu DHT11 (GPIO 5 - D5)
#define DHTTYPE DHT11  // Kiểu cảm biến là DHT11
#define LDR_AO 34      // Chân tín hiệu analog cảm biến ánh sáng (AO) (GPIO 34)
#define LED1_PIN 2     // Chân điều khiển LED 1 (GPIO 2)
#define LED2_PIN 4     // Chân điều khiển LED 2 (GPIO 4)
#define LED3_PIN 16    // Chân điều khiển LED 3 (GPIO 16)
#define LED_D17 17     // Chân điều khiển LED bật/tắt khi độ bụi > 70 (GPIO 17)

// Khởi tạo cảm biến DHT, MQTT client và Ticker
DHT dht(DHTPIN, DHTTYPE);
AsyncMqttClient mqttClient;
Ticker mqttTicker;
Ticker blinkTicker;  // Thêm ticker cho việc nháy đèn
bool blinking = false;

// Hàm kết nối WiFi
void connectToWiFi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

// Hàm nháy đèn
void blinkLedD17() {
  static bool ledState = false;
  ledState = !ledState;  // Đổi trạng thái của đèn
  digitalWrite(LED_D17, ledState ? HIGH : LOW);
}

// Hàm dừng nháy đèn
void stopBlinkingD17() {
  blinkTicker.detach();  // Dừng nháy đèn
  digitalWrite(LED_D17, LOW);  // Đảm bảo đèn tắt
  blinking = false;
}



// Hàm kết nối MQTT
void connectToMQTT() {
  Serial.println("Đang kết nối tới MQTT broker...");
  mqttClient.setCredentials(mqtt_username, mqtt_password);  // Thêm xác thực MQTT
  mqttClient.connect();
}

// Hàm quy đổi giá trị ADC ra Lux cho cảm biến quang trở CDS
float convertToLux(int lightLevel) {
  float voltage = (lightLevel / 4095.0) * 3.3;  // Điều chỉnh cho điện áp nguồn 3.3V
  float lux;
  if (voltage < 0.1) {
    lux = 800; // Giá trị Lux tối đa khi điện áp gần bằng 0 (tối đa ánh sáng)
  } else {
    lux = 1000 / voltage;  // Hệ số quy đổi có thể cần điều chỉnh
  }
  lux /= 4;
  return lux * 0.1;
}

// Hàm trả về giá trị độ bụi ngẫu nhiên từ 0 đến 100
float randomDustLevel() {
  return random(0, 101);  // random trả về giá trị từ 0 đến 100 (số nguyên)
}

void sendBlinkStatus(const char* status) {
  String statusMessage = "{\"type\": \"LED_CONTROL\", \"status\": \"";
  statusMessage += status;
  statusMessage += "\"}";
  mqttClient.publish(ledStatusTopic, 0, false, statusMessage.c_str());
}

// Hàm gửi dữ liệu tới MQTT
void sendMessage() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int lightLevel = analogRead(LDR_AO);  // Đọc giá trị analog từ AO
  float lux = convertToLux(lightLevel);  // Quy đổi giá trị ánh sáng ra Lux

  // Tính toán độ bụi dựa trên ánh sáng (lux)
  float do_bui = randomDustLevel(); 

  
  // Kiểm tra nếu độ bụi > 60, nháy đèn
  if (do_bui >= 70 && !blinking) {
    blinkTicker.attach(0.5, blinkLedD17);  // Nháy đèn với chu kỳ 1 giây
    blinking = true;
    sendLedStatus("WARNING_ON");  // Gửi thông báo khi bắt đầu nháy đèn
    sendLedStatus("WARNING_LED_ON");
  } else if (do_bui < 70 && blinking) {
      stopBlinkingD17();  // Dừng nháy đèn nếu độ bụi <= 60
      sendLedStatus("WARNING_LED_OFF");
  }


  if (isnan(temperature) || isnan(humidity)) {
    return;
  }

  // Xây dựng payload với giá trị độ bụi (dobui)
  String payload = "{\"nhietdo\": ";
  payload += temperature;
  payload += ", \"doam\": ";
  payload += humidity;
  payload += ", \"anhsang\": ";
  payload += lux;
  payload += ", \"dobui\": ";
  payload += do_bui;  // Thêm giá trị độ bụi vào payload
  payload += "}";

  mqttClient.publish(topic, 0, false, payload.c_str());
}

// Hàm gửi trạng thái LED tới MQTT sau khi LED được bật/tắt
void sendLedStatus(const char* command) {
  String statusMessage = "{\"type\": \"LED_CONTROL\", \"command\": \"";
  statusMessage += command;
  statusMessage += "\"}";

  mqttClient.publish(ledStatusTopic, 0, false, statusMessage.c_str());
}

// Hàm xử lý lệnh điều khiển LED từ MQTT
void onMqttMessage(char* topic, char* payload, AsyncMqttClientMessageProperties properties, unsigned int length, unsigned int index, unsigned int total) {
  String message;
  for (int i = 0; i < length; i++) {
    message += payload[i];
  }
  
  if (String(topic) == ledControlTopic) {
    if (message == "LED1_ON") {
      digitalWrite(LED1_PIN, HIGH); // Bật LED 1
      sendLedStatus("LED1_ON");     // Gửi trạng thái LED 1 bật
    } else if (message == "LED1_OFF") {
      digitalWrite(LED1_PIN, LOW);  // Tắt LED 1
      sendLedStatus("LED1_OFF");    // Gửi trạng thái LED 1 tắt
    } else if (message == "LED2_ON") {
      digitalWrite(LED2_PIN, HIGH); // Bật LED 2
      sendLedStatus("LED2_ON");     // Gửi trạng thái LED 2 bật
    } else if (message == "LED2_OFF") {
      digitalWrite(LED2_PIN, LOW);  // Tắt LED 2
      sendLedStatus("LED2_OFF");    // Gửi trạng thái LED 2 tắt
    } else if (message == "LED3_ON") {
      digitalWrite(LED3_PIN, HIGH); // Bật LED 3
      sendLedStatus("LED3_ON");     // Gửi trạng thái LED 3 bật
    } else if (message == "LED3_OFF") {
      digitalWrite(LED3_PIN, LOW);  // Tắt LED 3
      sendLedStatus("LED3_OFF");    // Gửi trạng thái LED 3 tắt
    }else if(message == "WARNING_LED_ON"){
      digitalWrite(LED_D17, HIGH);
      sendLedStatus("WARNING_LED_ON"); 
    }else if(message == "WARNING_LED_OFF"){
      digitalWrite(LED_D17, LOW);
      stopBlinkingD17();
      sendLedStatus("WARNING_LED_OFF");
    }
  }
}

void setup() {
  // Cấu hình chân LED
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
  pinMode(LED3_PIN, OUTPUT);
  pinMode(LED_D17, OUTPUT);  // Cấu hình chân D17
  digitalWrite(LED1_PIN, LOW); // Đảm bảo LED 1 tắt khi khởi động
  digitalWrite(LED2_PIN, LOW); // Đảm bảo LED 2 tắt khi khởi động
  digitalWrite(LED3_PIN, LOW); // Đảm bảo LED 3 tắt khi khởi động
  digitalWrite(LED_D17, LOW);  // Đảm bảo LED D17 tắt khi khởi động
  // Khởi động cảm biến DHT
  dht.begin();

  // Kết nối WiFi
  connectToWiFi();

  // Cấu hình MQTT client
  mqttClient.onConnect([](bool sessionPresent) {
    Serial.println("Kết nối MQTT thành công!");
    mqttTicker.attach(2, sendMessage); // Gửi tin nhắn mỗi 5 giây
    mqttClient.subscribe(ledControlTopic, 0); // Đăng ký nhận lệnh điều khiển LED
  });

  mqttClient.onDisconnect([](AsyncMqttClientDisconnectReason reason) {
    Serial.print("Mất kết nối MQTT. Mã lỗi: ");
    Serial.println(static_cast<uint8_t>(reason));
    mqttTicker.detach();  // Dừng gửi tin nhắn khi mất kết nối
  });

  mqttClient.onMessage(onMqttMessage); // Xử lý tin nhắn MQTT

  mqttClient.setServer(mqtt_server, mqtt_port);

  // Kết nối MQTT
  connectToMQTT();
}

void loop() {
  // Không cần gì trong loop vì sử dụng Ticker và callback MQTT
}
