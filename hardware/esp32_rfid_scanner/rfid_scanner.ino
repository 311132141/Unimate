/*
 * UNIMATE - RFID Card Scanner
 * 
 * This sketch reads RFID cards using the MFRC522 module and sends the ID to the UNIMATE server.
 * When a card is scanned, an HTTP POST request is sent to the server's /api/scan/ endpoint.
 * 
 * Wiring:
 * MFRC522 -> ESP32:
 * SDA (SS) -> GPIO 5
 * SCK -> GPIO 18
 * MOSI -> GPIO 23
 * MISO -> GPIO 19
 * GND -> GND
 * RST -> GPIO 22
 * 3.3V -> 3.3V
 * 
 * LEDs:
 * Green LED -> GPIO 2 (with 220 ohm resistor to GND)
 * Red LED -> GPIO 4 (with 220 ohm resistor to GND)
 */

#include <SPI.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Network configuration
const char* ssid = "UNIMATE-demo";       // WiFi SSID
const char* password = "Unimate2025!";   // WiFi password
const char* serverUrl = "http://192.168.4.1:8000/api/scan/"; // Change to your server IP
const char* kioskId = "kiosk-1";         // Unique ID for this kiosk

// MFRC522 pins
#define SS_PIN  5  // SDA
#define RST_PIN 22

// LED pins
#define GREEN_LED 2
#define RED_LED   4

// Create MFRC522 instance
MFRC522 rfid(SS_PIN, RST_PIN);

// Variables to track card reading
String lastCardId = "";
unsigned long lastScanTime = 0;
const unsigned long scanCooldown = 3000; // 3 seconds cooldown between scans

void setup() {
  // Initialize serial
  Serial.begin(115200);
  while (!Serial);    // Wait for serial port to connect
  
  // Initialize SPI
  SPI.begin();
  
  // Initialize MFRC522
  rfid.PCD_Init();
  Serial.println(F("RFID reader initialized"));
  
  // Show details of MFRC522 card reader
  rfid.PCD_DumpVersionToSerial();
  
  // Configure LED pins
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  
  // Initial LED state
  digitalWrite(GREEN_LED, LOW);
  digitalWrite(RED_LED, LOW);
  
  // Connect to WiFi
  connectToWiFi();
}

void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected. Reconnecting...");
    connectToWiFi();
  }
  
  // Check if a new card is present
  if (!rfid.PICC_IsNewCardPresent()) {
    return;
  }
  
  // Read the card serial
  if (!rfid.PICC_ReadCardSerial()) {
    return;
  }
  
  // Convert ID to string
  String cardId = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    cardId.concat(String(rfid.uid.uidByte[i] < 0x10 ? "0" : ""));
    cardId.concat(String(rfid.uid.uidByte[i], HEX));
  }
  cardId.toUpperCase();
  
  // Check if enough time has passed since the last scan
  unsigned long currentTime = millis();
  if (cardId == lastCardId && (currentTime - lastScanTime) < scanCooldown) {
    Serial.println("Same card scanned too quickly. Ignoring.");
    // Blink red LED to indicate cooldown
    blinkLED(RED_LED, 3, 100);
    return;
  }
  
  // Update last scan variables
  lastCardId = cardId;
  lastScanTime = currentTime;
  
  // Print card info
  Serial.println("Card detected:");
  Serial.print("UID: ");
  Serial.println(cardId);
  
  // Send card ID to server
  sendCardToServer(cardId);
  
  // Halt PICC and stop encryption
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}

void connectToWiFi() {
  Serial.print("Connecting to WiFi");
  digitalWrite(RED_LED, HIGH); // Red LED on while connecting
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.print("Connected to WiFi. IP: ");
    Serial.println(WiFi.localIP());
    digitalWrite(RED_LED, LOW);
    // Quick blink on success
    blinkLED(GREEN_LED, 3, 100);
  } else {
    Serial.println();
    Serial.println("Failed to connect to WiFi");
    // Error blink
    blinkLED(RED_LED, 5, 200);
  }
}

void sendCardToServer(String cardId) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    // Start HTTP connection
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON payload
    StaticJsonDocument<200> doc;
    doc["rfid_uid"] = cardId;
    doc["kiosk"] = kioskId;
    
    String requestBody;
    serializeJson(doc, requestBody);
    
    // Send the request
    Serial.println("Sending card ID to server...");
    int httpResponseCode = http.POST(requestBody);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      Serial.println(response);
      
      if (httpResponseCode == 200 || httpResponseCode == 204) {
        // Success, blink green LED
        digitalWrite(GREEN_LED, HIGH);
        delay(1000);
        digitalWrite(GREEN_LED, LOW);
      } else {
        // Server error or invalid card
        digitalWrite(RED_LED, HIGH);
        delay(1000);
        digitalWrite(RED_LED, LOW);
      }
    } else {
      Serial.print("Error sending HTTP request. Error code: ");
      Serial.println(httpResponseCode);
      // Error, blink red LED
      blinkLED(RED_LED, 5, 100);
    }
    
    http.end();
  } else {
    Serial.println("WiFi not connected. Cannot send card ID.");
    blinkLED(RED_LED, 3, 300);
  }
}

void blinkLED(int pin, int times, int delayMs) {
  for (int i = 0; i < times; i++) {
    digitalWrite(pin, HIGH);
    delay(delayMs);
    digitalWrite(pin, LOW);
    delay(delayMs);
  }
} 