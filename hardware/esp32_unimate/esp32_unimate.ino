#include <SPI.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <HTTPClient.h>

// WiFi credentials
const char *WIFI_SSID = "UNIMATE-demo";
const char *WIFI_PASS = "Unimate2025!";
const char *SERVER_IP = "192.168.4.1";

// RFID pins
#define RST_PIN 22
#define SS_PIN 21

MFRC522 mfrc522(SS_PIN, RST_PIN);

void setup()
{
    Serial.begin(115200);

    // Initialize SPI bus
    SPI.begin();

    // Initialize MFRC522
    mfrc522.PCD_Init();

    // Connect to WiFi
    WiFi.begin(WIFI_SSID, WIFI_PASS);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nConnected to WiFi");
}

void loop()
{
    // Look for new cards
    if (!mfrc522.PICC_IsNewCardPresent())
    {
        return;
    }

    // Select one of the cards
    if (!mfrc522.PICC_ReadCardSerial())
    {
        return;
    }

    // Get card UID
    String uid = "";
    for (byte i = 0; i < mfrc522.uid.size; i++)
    {
        uid += String(mfrc522.uid.uidByte[i], HEX);
    }
    uid.toUpperCase();

    // Send UID to server
    if (WiFi.status() == WL_CONNECTED)
    {
        HTTPClient http;
        String url = "http://" + String(SERVER_IP) + ":8000/api/scan/";

        http.begin(url);
        http.addHeader("Content-Type", "application/json");

        String jsonData = "{\"rfid_uid\":\"" + uid + "\"}";
        int httpCode = http.POST(jsonData);

        if (httpCode > 0)
        {
            String response = http.getString();
            Serial.println("Response: " + response);
        }
        else
        {
            Serial.println("Error on HTTP request");
        }

        http.end();
    }

    // Halt PICC
    mfrc522.PICC_HaltA();
    // Stop encryption on PCD
    mfrc522.PCD_StopCrypto1();

    // Wait before next scan
    delay(1000);
}