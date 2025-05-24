# Unimate - Product Context

## Why Unimate Exists

### The Problem
Modern university campuses are complex environments where students and staff struggle with:
- Finding classrooms in unfamiliar buildings
- Navigating efficiently between back-to-back classes
- Accessing real-time schedule information
- Getting lost during first weeks of semester
- Visitors unable to find meeting locations

### The Solution
Unimate provides an integrated navigation and information system that:
- Shows exactly where you need to go with 3D visualization
- Calculates optimal routes between locations
- Integrates with personal timetables
- Provides instant authentication via existing student ID cards
- Works on any device with a web browser

## How It Should Work

### User Journey

#### 1. Authentication Flow
- User taps RFID student card on any campus kiosk
- System instantly authenticates and displays personalized dashboard
- WebSocket connection established for real-time updates
- Session persists across devices with JWT tokens

#### 2. Navigation Experience
- 3D campus map loads showing current location
- Timetable displays upcoming classes with room details  
- User clicks on any class to navigate there immediately
- System calculates route and shows walking time
- Visual route appears on 3D map with start/end markers

#### 3. Information Access
- Real-time class schedules with lecturer information
- Building details and facilities
- Urgent event notifications
- Distance and time estimates for planning

### Design Philosophy

#### Simplicity First
- One-tap authentication
- Click-to-navigate interface
- Clear visual hierarchy
- Minimal cognitive load

#### Real-time Responsiveness  
- Instant RFID recognition
- Live WebSocket updates
- Smooth 3D interactions
- Quick route calculations

#### Universal Accessibility
- Works on any modern browser
- No app installation required
- Responsive design for all devices
- Clear visual feedback

### User Experience Goals

#### For Students
- Never be late due to navigation issues
- Plan routes between classes efficiently
- Access schedule information instantly
- Feel confident navigating campus

#### For Staff
- Quickly find meeting locations
- Monitor facility usage
- Update event information easily
- Access from office or mobile

#### For Visitors
- Navigate campus without prior knowledge
- Find specific offices or facilities
- Access publicly available events
- Get walking time estimates

### Integration Points

#### Campus Systems
- Student information system for enrollment data
- Timetabling system for schedule updates
- Facility management for room details
- Security system for access control

#### Physical Infrastructure
- RFID scanners at building entrances
- Kiosk displays in high-traffic areas
- Existing student ID cards
- Campus network connectivity

### Success Metrics

#### Usage Indicators
- Daily active users
- Average session duration
- Routes calculated per day
- Peak usage patterns

#### Performance Metrics
- Authentication speed < 1 second
- Route calculation < 3 seconds
- 3D map load time < 5 seconds
- WebSocket latency < 100ms

#### User Satisfaction
- Reduced late arrivals to classes
- Decreased navigation queries at info desks
- Positive user feedback scores
- High adoption rate among students 

## Why Unimate Exists

### The Problem
Modern university campuses are complex environments where students and staff struggle with:
- Finding classrooms in unfamiliar buildings
- Navigating efficiently between back-to-back classes
- Accessing real-time schedule information
- Getting lost during first weeks of semester
- Visitors unable to find meeting locations

### The Solution
Unimate provides an integrated navigation and information system that:
- Shows exactly where you need to go with 3D visualization
- Calculates optimal routes between locations
- Integrates with personal timetables
- Provides instant authentication via existing student ID cards
- Works on any device with a web browser

## How It Should Work

### User Journey

#### 1. Authentication Flow
- User taps RFID student card on any campus kiosk
- System instantly authenticates and displays personalized dashboard
- WebSocket connection established for real-time updates
- Session persists across devices with JWT tokens

#### 2. Navigation Experience
- 3D campus map loads showing current location
- Timetable displays upcoming classes with room details  
- User clicks on any class to navigate there immediately
- System calculates route and shows walking time
- Visual route appears on 3D map with start/end markers

#### 3. Information Access
- Real-time class schedules with lecturer information
- Building details and facilities
- Urgent event notifications
- Distance and time estimates for planning

### Design Philosophy

#### Simplicity First
- One-tap authentication
- Click-to-navigate interface
- Clear visual hierarchy
- Minimal cognitive load

#### Real-time Responsiveness  
- Instant RFID recognition
- Live WebSocket updates
- Smooth 3D interactions
- Quick route calculations

#### Universal Accessibility
- Works on any modern browser
- No app installation required
- Responsive design for all devices
- Clear visual feedback

### User Experience Goals

#### For Students
- Never be late due to navigation issues
- Plan routes between classes efficiently
- Access schedule information instantly
- Feel confident navigating campus

#### For Staff
- Quickly find meeting locations
- Monitor facility usage
- Update event information easily
- Access from office or mobile

#### For Visitors
- Navigate campus without prior knowledge
- Find specific offices or facilities
- Access publicly available events
- Get walking time estimates

### Integration Points

#### Campus Systems
- Student information system for enrollment data
- Timetabling system for schedule updates
- Facility management for room details
- Security system for access control

#### Physical Infrastructure
- RFID scanners at building entrances
- Kiosk displays in high-traffic areas
- Existing student ID cards
- Campus network connectivity

### Success Metrics

#### Usage Indicators
- Daily active users
- Average session duration
- Routes calculated per day
- Peak usage patterns

#### Performance Metrics
- Authentication speed < 1 second
- Route calculation < 3 seconds
- 3D map load time < 5 seconds
- WebSocket latency < 100ms

#### User Satisfaction
- Reduced late arrivals to classes
- Decreased navigation queries at info desks
- Positive user feedback scores
- High adoption rate among students 