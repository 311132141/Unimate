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
// Update with IP address that is stable and definitely working
// If using 192.168.20.22 isn't working, try using the local WiFi IP address of your computer
const char *serverUrl = "http://192.168.20.22:8000/api/scan/";
const char *kioskId = "test-kiosk-1"; // Test kiosk ID

// Add backup server URL in case primary fails
const char *backupServerUrl = "http://localhost:8000/api/scan/";
bool useBackupServer = false;

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
const unsigned long scanCooldown = 10000; // Increase to 10 seconds cooldown between scans

// Test mode variables
bool testMode = false; // Make sure test mode is disabled
unsigned long lastTestTime = 0;
const unsigned long testInterval = 5000; // Send test scan every 5 seconds

// Valid test card IDs (from test fixtures)
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

    if (testMode)
    {
        Serial.println("Test mode enabled - will send test scans every 5 seconds");
        Serial.println("Press any key to send a manual test scan");
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
            delay(100); // Add a small delay to avoid tight loop
            return;
        }

        // Read the card serial
        if (!rfid.PICC_ReadCardSerial())
        {
            delay(100); // Add a small delay to avoid tight loop
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
            Serial.println("Cooldown: " + String((scanCooldown - (currentTime - lastScanTime)) / 1000) + " seconds remaining");
            // Blink red LED to indicate cooldown
            blinkLED(RED_LED, 3, 100);

            // Halt PICC and stop encryption before returning
            rfid.PICC_HaltA();
            rfid.PCD_StopCrypto1();

            delay(1000); // Add a delay to prevent immediate re-reading
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
        delay(2000);
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

    // Disconnect first if we're already connected
    WiFi.disconnect();
    delay(1000);

    // Set WiFi mode
    WiFi.mode(WIFI_STA);
    delay(500);

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

        // Try to restart WiFi
        WiFi.disconnect(true);
        delay(3000);
        // Will try again on next loop
    }
}

void sendCardToServer(String cardId)
{
    if (WiFi.status() == WL_CONNECTED)
    {
        HTTPClient http;

        // Use primary or backup server based on current status
        const char *currentServerUrl = useBackupServer ? backupServerUrl : serverUrl;

        // Start HTTP connection with timeout handling
        http.begin(currentServerUrl);
        http.addHeader("Content-Type", "application/json");
        // Set timeouts to make sure we don't hang forever
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
        Serial.println(currentServerUrl);
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
                // Success, blink green LED
                digitalWrite(GREEN_LED, HIGH);
                delay(1000);
                digitalWrite(GREEN_LED, LOW);
                // Reset to primary server on success
                useBackupServer = false;
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

            // Try switching servers on next attempt if this one failed
            useBackupServer = !useBackupServer;
            Serial.print("Switching to ");
            Serial.print(useBackupServer ? "backup" : "primary");
            Serial.println(" server for next attempt");

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