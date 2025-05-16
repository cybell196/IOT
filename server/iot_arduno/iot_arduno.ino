#define BLYNK_TEMPLATE_ID "TMPL6eIZH-5dt"
#define BLYNK_TEMPLATE_NAME "esppro"
#define BLYNK_AUTH_TOKEN "L_xFw2x5YP8AfIB9-1fKWdbbG1G0Dud6"
#include <WiFi.h>
#include <BlynkSimpleEsp32.h>
#include <DHT.h>

#define DHTPIN 4          // Pin kết nối cảm biến DHT11
#define DHTTYPE DHT11     // Loại cảm biến DHT11
DHT dht(DHTPIN, DHTTYPE); // Khởi tạo đối tượng DHT

#define PUMP_PIN 14       // Pin điều khiển bật/tắt máy bơm
#define RPWM 27           // Pin điều khiển quay phải
#define LPWM 25           // Pin điều khiển quay trái

char ssid[] = "Cybell196";
char pass[] = "khongcomatkhau";

BlynkTimer timer;

// Hàm đọc nhiệt độ và độ ẩm, gửi lên Blynk
void sendSensorData() {
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Lỗi đọc cảm biến!");
    return;
  }

  // Gửi dữ liệu nhiệt độ và độ ẩm lên Blynk
  Blynk.virtualWrite(V1, temperature);  // V1 cho nhiệt độ
  Blynk.virtualWrite(V2, humidity);     // V2 cho độ ẩm

  Serial.print("Nhiệt độ: ");
  Serial.print(temperature);
  Serial.print(" °C, Độ ẩm: ");
  Serial.print(humidity);
  Serial.println(" %");
}

// Điều khiển quay phải của máy bơm (V3 là Button)
BLYNK_WRITE(V3) {
  int rightState = param.asInt();  // Lấy trạng thái của Button (0 hoặc 1)
  if (rightState) {
    digitalWrite(PUMP_PIN, HIGH);  // Bật máy bơm
    analogWrite(RPWM, 50);  // Quay phải
    analogWrite(LPWM, 0);    // Ngừng quay trái
    Serial.println("Máy bơm quay phải.");
  } else {
    digitalWrite(PUMP_PIN, LOW);   // Tắt máy bơm
    analogWrite(RPWM, 0);          // Ngừng quay
    Serial.println("Tắt máy bơm.");
  }
}

// Điều khiển quay trái của máy bơm (V4 là Button)
BLYNK_WRITE(V0) {
  int leftState = param.asInt();  // Lấy trạng thái của Button (0 hoặc 1)
  if (leftState) {
    digitalWrite(PUMP_PIN, HIGH);  // Bật máy bơm
    analogWrite(LPWM, 50);  // Quay trái
    analogWrite(RPWM, 0);    // Ngừng quay phải
    Serial.println("Máy bơm quay trái.");
  } else {
    digitalWrite(PUMP_PIN, LOW);   // Tắt máy bơm
    analogWrite(LPWM, 0);          // Ngừng quay
    Serial.println("Tắt máy bơm.");
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();

  pinMode(PUMP_PIN, OUTPUT);
  pinMode(RPWM, OUTPUT);
  pinMode(LPWM, OUTPUT);
  
  analogWrite(RPWM, 0);  // Mặc định không quay
  analogWrite(LPWM, 0);

  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);

  timer.setInterval(10000L, sendSensorData);
}

void loop() {
  Blynk.run();
  timer.run();
}
