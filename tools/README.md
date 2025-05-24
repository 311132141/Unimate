# Unimate Tools

This directory contains various utilities and tools for development, testing, and maintenance of the Unimate system.

## Tools Overview

### RFID Simulation

- **rfid_simulator.py**: Simulates RFID card scans for testing without physical hardware
- **test_card.ps1**: PowerShell script for quick card scan testing

### Testing Utilities

- **test_websocket.py**: Utility for testing WebSocket connections and messages
- **load_test.py**: Simple load testing for the backend API

### Development Helpers

- **setup_dev_env.py**: Script to set up a development environment with test data
- **generate_test_data.py**: Generate sample data for development purposes

## Usage

### RFID Simulator

To simulate an RFID card scan:

```bash
# Run in interactive mode
python rfid_simulator.py

# Send a specific card ID
python rfid_simulator.py --card 5A653600
```

### WebSocket Testing

To test WebSocket connections:

```bash
# Connect to the WebSocket server and listen for messages
python test_websocket.py --kiosk test-kiosk-1

# Send a test message to the WebSocket server
python test_websocket.py --kiosk test-kiosk-1 --message "Test message"
```

## Adding New Tools

When adding new tools to this directory, please follow these guidelines:

1. Add proper documentation in the tool's header comments
2. Update this README with a brief description of the tool
3. Ensure all tools follow the same coding style and conventions
4. Include example usage in the tool's help text 

This directory contains various utilities and tools for development, testing, and maintenance of the Unimate system.

## Tools Overview

### RFID Simulation

- **rfid_simulator.py**: Simulates RFID card scans for testing without physical hardware
- **test_card.ps1**: PowerShell script for quick card scan testing

### Testing Utilities

- **test_websocket.py**: Utility for testing WebSocket connections and messages
- **load_test.py**: Simple load testing for the backend API

### Development Helpers

- **setup_dev_env.py**: Script to set up a development environment with test data
- **generate_test_data.py**: Generate sample data for development purposes

## Usage

### RFID Simulator

To simulate an RFID card scan:

```bash
# Run in interactive mode
python rfid_simulator.py

# Send a specific card ID
python rfid_simulator.py --card 5A653600
```

### WebSocket Testing

To test WebSocket connections:

```bash
# Connect to the WebSocket server and listen for messages
python test_websocket.py --kiosk test-kiosk-1

# Send a test message to the WebSocket server
python test_websocket.py --kiosk test-kiosk-1 --message "Test message"
```

## Adding New Tools

When adding new tools to this directory, please follow these guidelines:

1. Add proper documentation in the tool's header comments
2. Update this README with a brief description of the tool
3. Ensure all tools follow the same coding style and conventions
4. Include example usage in the tool's help text 