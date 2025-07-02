/*
 * --------------------------------------------------------------------------------------------------------------------
 * MFRC522 Test Firmware for Wemos D1 (ESP8266)
 * --------------------------------------------------------------------------------------------------------------------
 * This sketch tests your MFRC522 reader module firmware and functionality.
 * Only known firmware versions can be checked. If the test passes, it doesn't mean your module 
 * is completely faultless! Some modules have bad or broken antennas or the PICC is broken.
 * 
 * Wiring for Wemos D1:
 * -----------------------------------------------------------------------------------------
 *             MFRC522      Wemos D1
 *             Reader/PCD   ESP8266
 * Signal      Pin          Pin
 * -----------------------------------------------------------------------------------------
 * RST/Reset   RST          D3 (GPIO0)
 * SPI SS      SDA(SS)      D8 (GPIO15)
 * SPI MOSI    MOSI         D7 (GPIO13)
 * SPI MISO    MISO         D6 (GPIO12)
 * SPI SCK     SCK          D5 (GPIO14)
 * GND         GND          GND
 * 3.3V        3.3V         3.3V
 *
 * @license Released into the public domain.
 */

#include <SPI.h>
#include <MFRC522.h>

// MFRC522 pins for Wemos D1
#define RST_PIN         D3          // GPIO0
#define SS_PIN          D8          // GPIO15

MFRC522 mfrc522(SS_PIN, RST_PIN);  // Create MFRC522 instance

/**
 * Check firmware and test card reading
 */
void setup() {
  Serial.begin(115200);   // Initialize serial communications
  while (!Serial);        // Wait for serial port to connect
  delay(1000);           // Give time for serial monitor to open
  
  Serial.println();
  Serial.println(F("========================================="));
  Serial.println(F("MFRC522 Test Program for Wemos D1"));
  Serial.println(F("========================================="));
  
  SPI.begin();          // Init SPI bus
  mfrc522.PCD_Init();   // Init MFRC522 module
  delay(4);             // Optional delay. Some board do need more time after init
  
  // Test 1: Version Check
  Serial.println(F("\n[TEST 1] Firmware Version Check"));
  Serial.println(F("-----------------------------------------"));
  mfrc522.PCD_DumpVersionToSerial();  // Show version of PCD - MFRC522 Card Reader
  
  // Get version
  byte v = mfrc522.PCD_ReadRegister(MFRC522::VersionReg);
  Serial.print(F("Version: 0x"));
  Serial.print(v, HEX);
  if (v == 0x91) {
    Serial.println(F(" = v1.0"));
  } else if (v == 0x92) {
    Serial.println(F(" = v2.0"));
  } else if ((v == 0x88) || (v == 0x00) || (v == 0xFF)) {
    Serial.println(F(" = (Chinese clone - may work fine)"));
  } else {
    Serial.println(F(" = (Unknown)"));
  }
  
  // Test 2: Self Test
  Serial.println(F("\n[TEST 2] Self Test"));
  Serial.println(F("-----------------------------------------"));
  Serial.println(F("Performing self test..."));
  bool selfTestResult = mfrc522.PCD_PerformSelfTest();
  Serial.print(F("Self Test Result: "));
  if (selfTestResult) {
    Serial.println(F("PASSED ✓"));
  } else {
    Serial.println(F("FAILED ✗"));
    Serial.println(F("Note: Chinese clones often fail self-test but work fine"));
  }
  
  // Re-init after self test
  mfrc522.PCD_Init();
  delay(4);
  
  // Test 3: Antenna Check
  Serial.println(F("\n[TEST 3] Antenna Gain Check"));
  Serial.println(F("-----------------------------------------"));
  byte antennaGain = mfrc522.PCD_GetAntennaGain();
  Serial.print(F("Current antenna gain: "));
  Serial.print(antennaGain);
  Serial.print(F(" (max gain: 7)"));
  Serial.println();
  
  // Test 4: Connection Test
  Serial.println(F("\n[TEST 4] Communication Test"));
  Serial.println(F("-----------------------------------------"));
  // Use CommandReg which is safe to write to
  MFRC522::PCD_Register testReg = MFRC522::CommandReg;
  byte originalVal = mfrc522.PCD_ReadRegister(testReg);
  byte testVal = 0x00; // Idle command
  mfrc522.PCD_WriteRegister(testReg, testVal);
  byte readVal = mfrc522.PCD_ReadRegister(testReg);
  Serial.print(F("Write/Read test: "));
  if (readVal == testVal) {
    Serial.println(F("PASSED ✓"));
  } else {
    Serial.print(F("FAILED ✗ (wrote 0x"));
    Serial.print(testVal, HEX);
    Serial.print(F(", read 0x"));
    Serial.print(readVal, HEX);
    Serial.println(F(")"));
  }
  // Restore original value
  mfrc522.PCD_WriteRegister(testReg, originalVal);
  
  // Summary
  Serial.println(F("\n========================================="));
  Serial.println(F("SUMMARY"));
  Serial.println(F("========================================="));
  if (v == 0x00 || v == 0xFF) {
    Serial.println(F("WARNING: Communication failure!"));
    Serial.println(F("Check your wiring:"));
    Serial.println(F("  MFRC522 -> Wemos D1"));
    Serial.println(F("  3.3V -> 3.3V"));
    Serial.println(F("  GND -> GND"));
    Serial.println(F("  RST -> D3"));
    Serial.println(F("  SDA -> D8"));
    Serial.println(F("  SCK -> D5"));
    Serial.println(F("  MOSI -> D7"));
    Serial.println(F("  MISO -> D6"));
  } else {
    Serial.println(F("Module detected and responding!"));
    if (!selfTestResult) {
      Serial.println(F("Self-test failed (common with clones)"));
    }
    Serial.println(F("\nReady to scan cards!"));
    Serial.println(F("Place a card near the reader..."));
  }
  Serial.println(F("=========================================\n"));
}

void loop() {
  // Look for new cards
  if (!mfrc522.PICC_IsNewCardPresent()) {
    return;
  }

  // Select one of the cards
  if (!mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  // Show card details
  Serial.println(F("\n*** CARD DETECTED ***"));
  Serial.print(F("Card UID: "));
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if(mfrc522.uid.uidByte[i] < 0x10)
      Serial.print(F("0"));
    Serial.print(mfrc522.uid.uidByte[i], HEX);
    if (i < mfrc522.uid.size - 1) Serial.print(F(" "));
  }
  Serial.println();
  
  Serial.print(F("Card Type: "));
  MFRC522::PICC_Type piccType = mfrc522.PICC_GetType(mfrc522.uid.sak);
  Serial.println(mfrc522.PICC_GetTypeName(piccType));
  
  Serial.print(F("SAK: 0x"));
  Serial.println(mfrc522.uid.sak, HEX);
  
  Serial.println(F("********************\n"));
  
  // Halt PICC
  mfrc522.PICC_HaltA();
  // Stop encryption on PCD
  mfrc522.PCD_StopCrypto1();
  
  delay(1000); // Brief delay before next read
}