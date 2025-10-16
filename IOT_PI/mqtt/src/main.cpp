#include <Arduino.h>
#include "DHT.h"
#include <WiFi.h>
#include <PubSubClient.h>
#include "time.h"

// Cấu hình DHT11
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Cấu hình Photodiode
#define PHOTO_PIN 34
#define PHOTO_DO 15 

// Cấu hình đèn LED
#define LED1_PIN 32
#define LED2_PIN 33
#define LED3_PIN 25

// Cấu hình WiFi
const char* ssid = "dep";
const char* password = "06090412";

// Cấu hình MQTT
const char* mqtt_server = "192.168.244.90";   // IP máy chạy Mosquitto
const int mqtt_port = 1883;
const char* mqtt_user = "user1";             // user trong passwd
const char* mqtt_pass = "123456";

// Cấu hình NTP
const char* ntpServer = "162.159.200.1";
const long  gmtOffset_sec = 7 * 3600;  // GMT+7 cho Việt Nam
const int   daylightOffset_sec = 0;

WiFiClient espClient;
PubSubClient client(espClient);

String getDate(){
  struct tm timeInfo;
  if (!getLocalTime(&timeInfo)) {
    return "1970-01-01";  // fallback
  }
  char buffer[11];
  strftime(buffer, sizeof(buffer), "%Y-%m-%d", &timeInfo);
  return String(buffer);
}

void publishState(String device, String state) {
  String payload = "{";
  payload += "\"fan\":\"" + (device=="fan" ? state : ((digitalRead(LED1_PIN) == LOW) ? "ON" : "OFF")) + "\",";
  payload += "\"aircon\":\"" + (device=="aircon" ? state : ((digitalRead(LED2_PIN) == LOW) ? "ON" : "OFF")) + "\",";
  payload += "\"light\":\"" + (device=="light" ? state : ((digitalRead(LED3_PIN) == LOW) ? "ON" : "OFF")) + "\"";
  payload += "}";
  
  client.publish("sensors/state", payload.c_str()); // gửi trạng thái hiện tại
}

String getTime(){
  struct tm timeInfo;
  if (!getLocalTime(&timeInfo)) {
    return "00:00:00";
  }
  char buffer[9];
  strftime(buffer, sizeof(buffer), "%H:%M:%S", &timeInfo);
  return String(buffer);
}

float adcToLux(int adcValue) {
  if (adcValue <= 0) {
    // Tránh chia cho 0 và giá trị ADC không hợp lệ
    // Có thể trả về một giá trị rất lớn để biểu thị ánh sáng cực mạnh
    return 50000; // Hoặc một giá trị max bạn muốn
  }
  
  // Áp dụng công thức tổng hợp
  // Lux = (500000 * (4095 - adcValue)) / (FIXED_RESISTOR * adcValue)
  // Rút gọn khi FIXED_RESISTOR = 10000
  // Lux = (50 * (4095 - adcValue)) / adcValue
  
  float lux = (50.0 * (4095.0 - adcValue)) / adcValue;
  
  return lux;
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.print("Topic received: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  Serial.println(message);
  message.trim();

  if (message == "fan" || message == "aircon" || message == "light") {
    int pin;
    if (message == "fan") pin = LED1_PIN;
    else if (message == "aircon") pin = LED2_PIN;
    else pin = LED3_PIN;

    digitalWrite(pin, !digitalRead(pin)); 

    String status = (digitalRead(pin) == LOW) ? "ON" : "OFF";
    publishState(message, status);
    
    String payloadStr = "{";
    payloadStr += "\"time\":\"" + getDate() + " " + getTime() + "\",";
    payloadStr += "\"action\":\"" + status + "\",";
    payloadStr += "\"device\":\"" + message + "\"";
    payloadStr += "}";

    Serial.println("Publish led: " + payloadStr);
    client.publish("led/ack", payloadStr.c_str());
  }
}


void reconnect() {
  while (!client.connected()) {
    Serial.print("Đang kết nối lại MQTT...");
    if (client.connect("ESP32Client", mqtt_user, mqtt_pass)) {
      Serial.println("Đã kết nối");
      client.subscribe("led/control");
      client.subscribe("sensors/telemetry");
      client.subscribe("led/ack");
      client.subscribe("sensors/state");
    } else {
      Serial.print("Kết nối thất bại, rc=");
      Serial.print(client.state());
      Serial.println(" Thử lại sau 5 giây");
      delay(5000);
    }
  }
}

void setup(){
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.print("Đang kết nối WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.print("DNS: ");
  Serial.println(WiFi.dnsIP());
    // Khởi động NTP
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  struct tm timeinfo;
  while (!getLocalTime(&timeinfo)) {
    Serial.println("Đang chờ NTP...");
    delay(1000);
  }

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
  pinMode(LED3_PIN, OUTPUT);

  digitalWrite(LED1_PIN, HIGH);
  digitalWrite(LED2_PIN, HIGH);
  digitalWrite(LED3_PIN, HIGH);

  publishState("fan", digitalRead(LED1_PIN) == LOW ? "ON" : "OFF");
  dht.begin();
}

unsigned long lastMsg = 0;
const long interval = 2000;

void loop(){
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  //Đọc thành phần
  unsigned long currentMillis = millis();
  if (currentMillis - lastMsg >= interval) {
    lastMsg = currentMillis;
    float h = dht.readHumidity();
    float t = dht.readTemperature();
    int lightvalue = analogRead(PHOTO_PIN);

    if (isnan(h) || isnan(t)) {
      Serial.println("Không đọc được dữ liệu từ DHT11!");
      return;
    } else {
      Serial.println("Độ ẩm: " + String(h)+"%");
      Serial.println("Nhiệt độ: " + String(t)+"°C");
      Serial.println("Cường độ ánh sáng: " + String(lightvalue));
      Serial.println("Trạng thái đèn: " + String(digitalRead(PHOTO_DO)));
      // Tạo JSON string
      String payload = "{";
      payload += "\"time\":\"" + getDate() + " " + getTime() + "\",";
      payload += "\"temperature\":" + String(t, 1) + ",";
      payload += "\"humidity\":" + String(h, 1) + ",";
      payload += "\"light\":" + String(adcToLux(lightvalue), 1);
      payload += "}";
      // In ra Serial
      Serial.println("Publish: " + payload);

      // Gửi lên MQTT broker
      client.publish("sensors/telemetry", payload.c_str());

      Serial.println("-----------------------");
    }
  }
}
