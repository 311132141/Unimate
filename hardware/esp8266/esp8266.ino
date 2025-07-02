/*
 * UNIMATE - RFID Card Scanner for Wemos D1 (ESP8266)
 * 
 * This sketch reads RFID cards using the MFRC522 module and sends the ID to the UNIMATE server.
 * When a card is scanned, an HTTP POST request is sent to the server's /api/scan/ endpoint.
 * 
 * Wiring for Wemos D1:
 * MFRC522 -> Wemos D1:
 * SDA (SS) -> D8 (GPIO15)
 * SCK -> D5 (GPIO14)
 * MOSI -> D7 (GPIO13)
 * MISO -> D6 (GPIO12)
 * GND -> GND
 * RST -> D3 (GPIO0)
 * 3.3V -> 3.3V
 * 
 * LEDs:
 * Green LED -> D1 (GPIO5) (with 220 ohm resistor to GND)
 * Red LED -> D2 (GPIO4) (with 220 ohm resistor to GND)
 */

#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>

// Network configuration
const char* ssid = "BlackGorilla";       // WiFi SSID
const char* password = "77777778";   // WiFi password
const char* serverUrl = "http://192.168.4.1:8000/api/scan/"; // Change to your server IP
const char* kioskId = "kiosk-1";         // Unique ID for this kiosk

// MFRC522 pins for Wemos D1
#define SS_PIN  D8  // GPIO15
#define RST_PIN D3  // GPIO0

// LED pins for Wemos D1
#define GREEN_LED D1  // GPIO5
#define RED_LED   D2  // GPIO4

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
  Serial.println();
  Serial.println(F("Starting Simple RFID Scanner on Wemos D1..."));
  
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
  
  Serial.println();
  Serial.println("Ready to scan RFID cards!");
  Serial.println("=========================");
}

void loop() {
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
    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
    return;
  }
  
  // Update last scan variables
  lastCardId = cardId;
  lastScanTime = currentTime;
  
  // Print card info
  Serial.println();
  Serial.println("*** Card Detected! ***");
  Serial.print("Card UID: ");
  Serial.println(cardId);
  Serial.print("Card Type: ");
  MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
  Serial.println(rfid.PICC_GetTypeName(piccType));
  Serial.println("*********************");
  
  // Success feedback - green LED
  digitalWrite(GREEN_LED, HIGH);
  delay(1000);
  digitalWrite(GREEN_LED, LOW);
  
  // Halt PICC and stop encryption
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}

void connectToWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.print(ssid);
  digitalWrite(RED_LED, HIGH); // Red LED on while connecting
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("WiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Signal Strength (RSSI): ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
    digitalWrite(RED_LED, LOW);
    // Quick blink on success
    blinkLED(GREEN_LED, 3, 100);
  } else {
    Serial.println();
    Serial.println("Failed to connect to WiFi!");
    // Error blink
    blinkLED(RED_LED, 5, 200);
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