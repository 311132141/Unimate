# Unimate - Campus Navigation System Project Brief

## Project Overview
Unimate is an integrated campus navigation and information system that combines physical RFID authentication with an advanced 3D web-based navigation interface.

## Core Requirements

### 1. Authentication System
- RFID card scanning via ESP32 hardware devices
- User authentication through Django backend
- JWT token-based session management
- Real-time card scan notifications via WebSocket

### 2. 3D Campus Navigation
- Interactive 3D map of campus buildings
- Route calculation and visualization
- Building selection and navigation
- User location awareness
- Walking time and distance calculations

### 3. Timetable Integration
- Personal timetable display for authenticated users
- Event management (classes, exams, appointments)
- Room and building information
- Lecturer and course details
- Urgent event highlighting

### 4. Real-time Communication
- WebSocket support for live updates
- Kiosk-specific communication channels
- Card scan event broadcasting
- User status updates

## Project Goals

### Primary Goals
1. Provide seamless campus navigation for students and staff
2. Enable quick building and room location through interactive 3D visualization
3. Integrate personal schedules with navigation capabilities
4. Create a modern, responsive user interface

### Secondary Goals
1. Support multiple RFID scanner kiosks across campus
2. Provide administrative tools for event management
3. Enable future expansion with additional campus services
4. Maintain high performance with real-time updates

## Target Users
- Students navigating between classes
- Visitors finding campus locations  
- Staff managing schedules and events
- Administrators monitoring system usage

## Success Criteria
- Sub-second RFID authentication response
- Accurate 3D navigation with < 5 second route calculation
- 99.9% uptime for critical services
- Intuitive UI requiring no training
- Support for 1000+ concurrent users

## Project Scope
- Full-stack web application (Django + JavaScript)
- Hardware integration (ESP32 RFID scanners)
- 3D visualization using Three.js
- Real-time features using WebSockets
- Responsive design for desktop and mobile

## Constraints
- Must work on campus network (192.168.20.x)
- ESP32 memory limitations for firmware
- Browser compatibility requirements
- Performance on standard student devices 

## Project Overview
Unimate is an integrated campus navigation and information system that combines physical RFID authentication with an advanced 3D web-based navigation interface.

## Core Requirements

### 1. Authentication System
- RFID card scanning via ESP32 hardware devices
- User authentication through Django backend
- JWT token-based session management
- Real-time card scan notifications via WebSocket

### 2. 3D Campus Navigation
- Interactive 3D map of campus buildings
- Route calculation and visualization
- Building selection and navigation
- User location awareness
- Walking time and distance calculations

### 3. Timetable Integration
- Personal timetable display for authenticated users
- Event management (classes, exams, appointments)
- Room and building information
- Lecturer and course details
- Urgent event highlighting

### 4. Real-time Communication
- WebSocket support for live updates
- Kiosk-specific communication channels
- Card scan event broadcasting
- User status updates

## Project Goals

### Primary Goals
1. Provide seamless campus navigation for students and staff
2. Enable quick building and room location through interactive 3D visualization
3. Integrate personal schedules with navigation capabilities
4. Create a modern, responsive user interface

### Secondary Goals
1. Support multiple RFID scanner kiosks across campus
2. Provide administrative tools for event management
3. Enable future expansion with additional campus services
4. Maintain high performance with real-time updates

## Target Users
- Students navigating between classes
- Visitors finding campus locations  
- Staff managing schedules and events
- Administrators monitoring system usage

## Success Criteria
- Sub-second RFID authentication response
- Accurate 3D navigation with < 5 second route calculation
- 99.9% uptime for critical services
- Intuitive UI requiring no training
- Support for 1000+ concurrent users

## Project Scope
- Full-stack web application (Django + JavaScript)
- Hardware integration (ESP32 RFID scanners)
- 3D visualization using Three.js
- Real-time features using WebSockets
- Responsive design for desktop and mobile

## Constraints
- Must work on campus network (192.168.20.x)
- ESP32 memory limitations for firmware
- Browser compatibility requirements
- Performance on standard student devices 