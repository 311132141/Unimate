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
const char *ssid = "John's Galaxy S22+"; // WiFi SSID
const char *password = "77777778";       // WiFi password
// Point to our standalone server running on the local machine
const char *serverUrl = "http://192.168.20.22:8000/api/scan/"; // Confirmed working IP address
const char *kioskId = "test-kiosk-1";                          // Test kiosk ID

// MFRC522 pins
#define SS_PIN 5 // SDA
#define RST_PIN 22

// LED pins
#define GREEN_LED 2
#define RED_LED 4

// Create MFRC522 instance
MFRC522 rfid(SS_PIN, RST_PIN);

// Variables to track card reading
String lastCardId = "";
unsigned long lastScanTime = 0;
const unsigned long scanCooldown = 5000; // 5 seconds cooldown between scans

// Test mode variables - set to true for automatic testing
bool testMode = true; // ENABLED for testing
unsigned long lastTestTime = 0;
const unsigned long testInterval = 5000; // Send test scan every 5 seconds

// Valid test card IDs
const char *TEST_CARDS[] = {
    "5A653600",   // Your actual RFID card
    "04B5C6D7E8", // Bob's card
    "0499AA11BB"  // Carol's card
};
const int NUM_TEST_CARDS = 3;
int currentTestCard = 0;

void setup()
{
    // Initialize serial
    Serial.begin(115200);
    while (!Serial)
        ; // Wait for serial port to connect

    // Initialize SPI
    SPI.begin();

    // Initialize MFRC522
    rfid.PCD_Init();
    Serial.println(F("RFID reader initialized"));

    // Configure LED pins
    pinMode(GREEN_LED, OUTPUT);
    pinMode(RED_LED, OUTPUT);

    // Initial LED state
    digitalWrite(GREEN_LED, LOW);
    digitalWrite(RED_LED, LOW);

    // Connect to WiFi
    connectToWiFi();

    if (testMode)
    {
        Serial.println("Test mode enabled - will send test scans every 5 seconds");
        Serial.println("Available test cards:");
        for (int i = 0; i < NUM_TEST_CARDS; i++)
        {
            Serial.print("  ");
            Serial.print(i + 1);
            Serial.print(". ");
            Serial.println(TEST_CARDS[i]);
        }
    }
}

void loop()
{
    // Check WiFi connection
    if (WiFi.status() != WL_CONNECTED)
    {
        Serial.println("WiFi disconnected. Reconnecting...");
        connectToWiFi();
    }

    // Test mode functionality
    if (testMode)
    {
        unsigned long currentTime = millis();

        // Check for manual test trigger (any serial input)
        if (Serial.available() > 0)
        {
            Serial.read(); // Clear the input
            sendTestScan();
        }

        // Automatic test scans
        if (currentTime - lastTestTime >= testInterval)
        {
            sendTestScan();
            lastTestTime = currentTime;
        }
    }

    // Normal RFID reading
    if (!testMode)
    {
        // Check if a new card is present
        if (!rfid.PICC_IsNewCardPresent())
        {
            delay(50); // Small delay to avoid tight loop
            return;
        }

        // Read the card serial
        if (!rfid.PICC_ReadCardSerial())
        {
            delay(50); // Small delay to avoid tight loop
            return;
        }

        // Convert ID to string
        String cardId = "";
        for (byte i = 0; i < rfid.uid.size; i++)
        {
            cardId.concat(String(rfid.uid.uidByte[i] < 0x10 ? "0" : ""));
            cardId.concat(String(rfid.uid.uidByte[i], HEX));
        }
        cardId.toUpperCase();

        // Check if enough time has passed since the last scan
        unsigned long currentTime = millis();
        if (cardId == lastCardId && (currentTime - lastScanTime) < scanCooldown)
        {
            Serial.println("Same card scanned too quickly. Ignoring.");
            // Blink red LED to indicate cooldown
            blinkLED(RED_LED, 3, 100);

            // Halt PICC and stop encryption before returning
            rfid.PICC_HaltA();
            rfid.PCD_StopCrypto1();

            delay(500); // Short delay to prevent immediate re-reading
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

        // Add a delay after successfully processing a card
        delay(1000);
    }
}

void sendTestScan()
{
    // Use the next test card in sequence
    String testCardId = TEST_CARDS[currentTestCard];
    currentTestCard = (currentTestCard + 1) % NUM_TEST_CARDS;

    Serial.println("Sending test scan:");
    Serial.print("Test Card ID: ");
    Serial.println(testCardId);

    // Send test card ID to server
    sendCardToServer(testCardId);
}

void connectToWiFi()
{
    Serial.print("Connecting to WiFi");
    digitalWrite(RED_LED, HIGH); // Red LED on while connecting

    // Begin connection
    WiFi.begin(ssid, password);

    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 20)
    {
        delay(500);
        Serial.print(".");
        attempts++;
    }

    if (WiFi.status() == WL_CONNECTED)
    {
        Serial.println();
        Serial.print("Connected to WiFi. IP: ");
        Serial.println(WiFi.localIP());
        digitalWrite(RED_LED, LOW);
        // Quick blink on success
        blinkLED(GREEN_LED, 3, 100);
    }
    else
    {
        Serial.println();
        Serial.println("Failed to connect to WiFi");
        // Error blink
        blinkLED(RED_LED, 5, 200);
    }
}

void sendCardToServer(String cardId)
{
    if (WiFi.status() == WL_CONNECTED)
    {
        HTTPClient http;

        // Start HTTP connection
        http.begin(serverUrl);
        http.addHeader("Content-Type", "application/json");
        http.setTimeout(5000); // 5 second timeout

        // Create JSON payload
        StaticJsonDocument<200> doc;
        doc["rfid_uid"] = cardId;
        doc["kiosk"] = kioskId;

        String requestBody;
        serializeJson(doc, requestBody);

        // Send the request
        Serial.println("Sending card ID to server...");
        Serial.print("URL: ");
        Serial.println(serverUrl);
        Serial.print("Payload: ");
        Serial.println(requestBody);

        int httpResponseCode = http.POST(requestBody);

        if (httpResponseCode > 0)
        {
            String response = http.getString();
            Serial.print("HTTP Response code: ");
            Serial.println(httpResponseCode);
            Serial.println(response);

            if (httpResponseCode == 200 || httpResponseCode == 204)
            {
                // Success, turn on green LED
                digitalWrite(GREEN_LED, HIGH);
                delay(1000);
                digitalWrite(GREEN_LED, LOW);
            }
            else
            {
                // Server error or invalid card
                digitalWrite(RED_LED, HIGH);
                delay(1000);
                digitalWrite(RED_LED, LOW);
            }
        }
        else
        {
            Serial.print("Error sending HTTP request. Error code: ");
            Serial.println(httpResponseCode);

            // Error, blink red LED
            blinkLED(RED_LED, 5, 100);
        }

        http.end();
    }
    else
    {
        Serial.println("WiFi not connected. Cannot send card ID.");
        blinkLED(RED_LED, 3, 300);
        // Try to reconnect
        connectToWiFi();
    }
}

void blinkLED(int pin, int times, int delayMs)
{
    for (int i = 0; i < times; i++)
    {
        digitalWrite(pin, HIGH);
        delay(delayMs);
        digitalWrite(pin, LOW);
        delay(delayMs);
    }
}