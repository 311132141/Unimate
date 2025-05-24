# UNIMATE Hardware Components

This directory contains all hardware-related components for the Unimate system.

## Contents

- **rfid_scanner/**: Main RFID scanner implementation for ESP32
- **docs/**: Hardware documentation and datasheets
- **tools/**: Test and utility scripts for hardware components

## RFID Scanner

The ESP32-based RFID scanner reads user ID cards and sends the data to the Unimate server. The scanner uses the MFRC522 RFID module and connects to the server via WiFi.

### Wiring

- **MFRC522 -> ESP32**:
  - SDA (SS) -> GPIO 5
  - SCK -> GPIO 18
  - MOSI -> GPIO 23
  - MISO -> GPIO 19
  - GND -> GND
  - RST -> GPIO 22
  - 3.3V -> 3.3V

- **LEDs**:
  - Green LED -> GPIO 2 (with 220 ohm resistor to GND)
  - Red LED -> GPIO 4 (with 220 ohm resistor to GND)

## Setup

1. Install the required libraries in Arduino IDE:
   - MFRC522
   - ArduinoJson
   - ESP32 WiFi library

2. Update the WiFi credentials in the sketch
3. Update the server URL to point to your Unimate backend
4. Upload the sketch to your ESP32 board

## Testing

The hardware directory includes testing tools to simulate card scans without physical hardware. 

This directory contains all hardware-related components for the Unimate system.

## Contents

- **rfid_scanner/**: Main RFID scanner implementation for ESP32
- **docs/**: Hardware documentation and datasheets
- **tools/**: Test and utility scripts for hardware components

## RFID Scanner

The ESP32-based RFID scanner reads user ID cards and sends the data to the Unimate server. The scanner uses the MFRC522 RFID module and connects to the server via WiFi.

### Wiring

- **MFRC522 -> ESP32**:
  - SDA (SS) -> GPIO 5
  - SCK -> GPIO 18
  - MOSI -> GPIO 23
  - MISO -> GPIO 19
  - GND -> GND
  - RST -> GPIO 22
  - 3.3V -> 3.3V

- **LEDs**:
  - Green LED -> GPIO 2 (with 220 ohm resistor to GND)
  - Red LED -> GPIO 4 (with 220 ohm resistor to GND)

## Setup

1. Install the required libraries in Arduino IDE:
   - MFRC522
   - ArduinoJson
   - ESP32 WiFi library

2. Update the WiFi credentials in the sketch
3. Update the server URL to point to your Unimate backend
4. Upload the sketch to your ESP32 board

## Testing

The hardware directory includes testing tools to simulate card scans without physical hardware. 