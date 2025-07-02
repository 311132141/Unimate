#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>

// Network configuration
const char *ssid = "BlackGorilla";                             // WiFi SSID
const char *password = "77777778";                             // WiFi password
const char *serverUrl = "http://192.168.20.22:8000/api/scan/"; // Backend server IP
const char *kioskId = "kiosk-1";                               // Unique ID for this kiosk

// SDA/SS pin = D8 (GPIO15), RST pin = D3 (GPIO0)
static constexpr uint8_t SS_PIN = D8;
static constexpr uint8_t RST_PIN = D3;

MFRC522 rfid(SS_PIN, RST_PIN);
WiFiClient client;

// Variables to track card reading
String lastCardId = "";
unsigned long lastScanTime = 0;
const unsigned long scanCooldown = 3000; // 3 seconds cooldown between scans

void setup()
{
  Serial.begin(115200);
  while (!Serial)
    ;
  Serial.println(F("\nStarting RFID Scanner with WiFi..."));

  // Connect to WiFi
  connectToWiFi();

  // Initialize SPI and RFID
  SPI.begin();
  rfid.PCD_Init();
  Serial.println(F("RFID reader ready – present a tag"));
}

void loop()
{
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println(F("WiFi disconnected. Reconnecting..."));
    connectToWiFi();
  }

  // Look for a new card
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial())
    return;

  // Convert UID to string
  String cardId = "";
  for (byte i = 0; i < rfid.uid.size; i++)
  {
    char buf[3];
    sprintf(buf, "%02X", rfid.uid.uidByte[i]);
    cardId += buf;
  }

  // Check cooldown
  unsigned long currentTime = millis();
  if (cardId == lastCardId && (currentTime - lastScanTime) < scanCooldown)
  {
    Serial.println(F("Same card scanned too quickly. Ignoring."));
    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
    return;
  }

  // Update last scan variables
  lastCardId = cardId;
  lastScanTime = currentTime;

  // Print UID
  Serial.print(F("Tag UID: "));
  Serial.println(cardId);

  // Send to server
  sendCardToServer(cardId);

  // Halt PICC and stop encryption on PCD
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}

void connectToWiFi()
{
  Serial.print(F("Connecting to WiFi: "));
  Serial.print(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30)
  {
    delay(500);
    Serial.print(F("."));
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println(F("\nWiFi Connected!"));
    Serial.print(F("IP Address: "));
    Serial.println(WiFi.localIP());
  }
  else
  {
    Serial.println(F("\nFailed to connect to WiFi!"));
  }
}

void sendCardToServer(String cardId)
{
  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println(F("WiFi not connected. Cannot send card ID."));
    return;
  }

  HTTPClient http;

  // Start HTTP connection
  http.begin(client, serverUrl);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(10000); // 10 second timeout

  // Create JSON payload - backend only expects rfid_uid
  StaticJsonDocument<200> doc;
  doc["rfid_uid"] = cardId;

  String requestBody;
  serializeJson(doc, requestBody);

  // Send the request
  Serial.print(F("Sending to server: "));
  Serial.println(requestBody);

  int httpResponseCode = http.POST(requestBody);

  if (httpResponseCode > 0)
  {
    String response = http.getString();
    Serial.print(F("HTTP Response code: "));
    Serial.println(httpResponseCode);

    if (httpResponseCode == 200)
    {
      Serial.println(F("✓ RFID Card Authenticated Successfully!"));
      Serial.println(F("✓ User logged in and JWT tokens received"));

      // Try to parse the response to get user info
      StaticJsonDocument<1024> responseDoc;
      DeserializationError error = deserializeJson(responseDoc, response);

      if (!error)
      {
        if (responseDoc.containsKey("user"))
        {
          String username = responseDoc["user"]["username"];
          int userId = responseDoc["user"]["id"];
          Serial.print(F("✓ Welcome, "));
          Serial.print(username);
          Serial.print(F(" (ID: "));
          Serial.print(userId);
          Serial.println(F(")"));

          // Count events if available
          if (responseDoc["user"].containsKey("events"))
          {
            int eventCount = responseDoc["user"]["events"].size();
            Serial.print(F("✓ Found "));
            Serial.print(eventCount);
            Serial.println(F(" events"));
          }
        }
      }
      else
      {
        Serial.println(F("Could not parse response JSON"));
      }
    }
    else if (httpResponseCode == 404)
    {
      Serial.println(F("✗ Invalid RFID card - not registered in system"));
    }
    else if (httpResponseCode == 400)
    {
      Serial.println(F("✗ Bad request - RFID UID missing or invalid"));
    }
    else
    {
      Serial.println(F("✗ Server error or unexpected response"));
    }

    // Print response for debugging
    Serial.print(F("Response: "));
    Serial.println(response);
  }
  else
  {
    Serial.print(F("Error sending HTTP request. Error code: "));
    Serial.println(httpResponseCode);
  }

  http.end();
}