# ESP32 RFID Scanner Setup

This directory contains the Arduino sketch for the ESP32 to read RFID cards using the MFRC522 module and send the card ID to the UNIMATE server.

## Hardware Requirements

- ESP32 DevKit v1 board
- MFRC522 RFID reader module
- 1x Green LED
- 1x Red LED
- 2x 220 ohm resistors
- Jumper wires
- Breadboard
- Micro-USB cable

## Wiring Diagram

### MFRC522 to ESP32
- SDA (SS) → GPIO 5
- SCK → GPIO 18
- MOSI → GPIO 23
- MISO → GPIO 19
- GND → GND
- RST → GPIO 22
- 3.3V → 3.3V

### LEDs
- Green LED → GPIO 2 (with 220 ohm resistor to GND)
- Red LED → GPIO 4 (with 220 ohm resistor to GND)

```
┌───────────────┐                ┌───────────────┐
│               │                │               │
│           3.3V├───────────────┤VCC            │
│            GND├───────────────┤GND            │
│            RST├───────────────┤RST            │
│     (SS) GPIO5├───────────────┤SDA            │
│         GPIO18├───────────────┤SCK    MFRC522 │
│         GPIO23├───────────────┤MOSI           │
│         GPIO19├───────────────┤MISO           │
│               │                │               │
│     ESP32     │                └───────────────┘
│               │
│          GPIO2├─────┬─[220Ω]─┬─(+) GREEN LED (-)─┐
│               │     │        │                    │
│               │     │        └────────────────────┼──┐
│          GPIO4├─────┼─[220Ω]─┬─(+) RED LED (-)───┘  │
│               │     │        │                       │
│            GND├─────┴────────┴───────────────────────┘
│               │
└───────────────┘
```

## Setup Instructions

1. **Install Required Libraries**
   - Open Arduino IDE
   - Go to Sketch > Include Library > Manage Libraries
   - Install the following libraries:
     - MFRC522 by GithubCommunity
     - ArduinoJson by Benoit Blanchon
     - ESP32 by Espressif Systems

2. **Connect the Hardware**
   - Wire everything according to the diagram above
   - Double-check your connections before powering on

3. **Configure Network Settings**
   - Open the `rfid_scanner.ino` file
   - Update the WiFi SSID, password, and server URL variables if needed

4. **Upload the Sketch**
   - Connect ESP32 to your computer via USB
   - Select the correct board and port in Arduino IDE
   - Press Upload

5. **Testing**
   - Open Serial Monitor (baud rate: 115200)
   - The ESP32 should connect to WiFi
   - Scan a card to see the output

## Using the Simulator

If you don't have the physical hardware, you can use the Python simulator:

```bash
# Start the backend server
cd ../../
python run.py --asgi

# In another terminal, run the simulator
cd hardware/esp32_rfid_scanner
python rfid_simulator.py
```

## Troubleshooting

- **Red LED blinks 5 times rapidly**: Failed to connect to WiFi
- **Red LED blinks 3 times slowly**: Failed to send data to server
- **LEDs not working**: Check wiring and resistors
- **Can't detect cards**: Ensure MFRC522 is wired correctly
- **Server connection issues**: Verify server URL and network connection 