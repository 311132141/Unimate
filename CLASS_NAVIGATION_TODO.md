# 🎯 Class-Based Navigation Implementation TODO

## 📋 **Overview**
Transform the timetable so users can click on classes to immediately navigate to that classroom, while keeping building selection as backup.

---

## 🎨 **1. CSS & Styling Updates**

### 1.1 Add Selected Class Highlighting ✅ COMPLETE- [x] Add `.timetable-item.selected` CSS class  - Background: `#1f3a93 !important`  - Border-left-color: `#60a5fa`  - Text color: `white`  - Info text color: `#e5e7eb`

### 1.2 Improve Navigation Panel Design ✅ COMPLETE- [x] Add collapsible/expandable design- [x] Change header to "Quick Building Access"- [x] Add small descriptive text: "Or select building manually"- [x] Style as secondary/backup option- [x] Add icon for building navigation

### 1.3 Add Time-based Visual Indicators
- [ ] Add CSS for upcoming class highlighting
- [ ] Add CSS for current class highlighting
- [ ] Add CSS for time-sensitive classes (starting soon)

---

## 🗺️ **2. Room-to-Location Mapping System**

### 2.1 Create Room Mapping Data Structure
- [ ] Define `roomLocationMap` object with building coordinates
- [ ] Map specific room numbers to exact positions within buildings
- [ ] Create room entrance positions for accurate navigation

### 2.2 Building-to-Coordinates Mapping
```javascript
const buildingRoomMap = {
  'Main Building': { 
    baseCoords: { x: 0, z: 0 },
    rooms: {
      '101': { x: -1, z: 1 },
      '201': { x: 0, z: 1 },
      '301': { x: 1, z: 1 }
    }
  },
  'Science Block': { 
    baseCoords: { x: 6, z: -5 },
    rooms: {
      '201': { x: 0.5, z: -0.5 },
      '202': { x: -0.5, z: -0.5 }
    }
  },
  // ... other buildings
}
```

### 2.3 Room Resolution Function
- [ ] Create `resolveRoomLocation(buildingName, roomNumber)` function
- [ ] Handle room number parsing (extract numbers from "Room 101")
- [ ] Return precise coordinates for room entrance
- [ ] Handle "TBA" rooms gracefully (default to building center)

---

## 🎮 **3. Interactive Features**

### 3.1 Modify Timetable Click Handler
- [ ] Replace current `showEventDetails(event)` with `navigateToClass(event)`
- [ ] Keep event details accessible (maybe right-click or button)
- [ ] Add visual feedback when clicking
- [ ] Implement selected class highlighting

### 3.2 Class Selection Logic
- [ ] Clear previous class selection when new class clicked
- [ ] Store selected class data globally (`dashboardSelectedClass`)
- [ ] Update building selection to match class building
- [ ] Sync building list selection state

### 3.3 Enhanced Building Selection
- [ ] Keep existing building click functionality
- [ ] Clear class selection when building manually selected
- [ ] Maintain both navigation methods simultaneously

---

## 🧭 **4. Navigation & Routing**

### 4.1 Enhanced Route Calculation
- [ ] Update `calculateDashboardRoute()` to accept room coordinates
- [ ] Create more precise route to room entrance vs building center
- [ ] Add route metadata (room number, building name)
- [ ] Handle room-specific vs building-general navigation

### 4.2 Route Information Display
- [ ] Show "Navigate to: [Building] Room [Number]" 
- [ ] Display walking time and distance
- [ ] Add class timing info: "Class starts in X hours Y minutes"
- [ ] Show lecturer and course code in route info

### 4.3 Visual Route Enhancements
- [ ] Different route colors for different types:
  - Blue: Normal navigation
  - Green: Current/upcoming class
  - Orange: Urgent class
- [ ] Enhanced start/end markers
- [ ] Room-specific destination marker

---

## ⏰ **5. Time-Based Features**

### 5.1 Time Calculation Functions
- [ ] Create `getTimeUntilClass(event)` function
- [ ] Format time display (hours/minutes)
- [ ] Handle past events gracefully
- [ ] Add "Class in progress" detection

### 5.2 Dynamic Class Status
- [ ] Add real-time updates for class timing
- [ ] Highlight classes starting within 30 minutes
- [ ] Show different status for current classes
- [ ] Add countdown for urgent classes

### 5.3 Smart Notifications
- [ ] Show status messages with timing: "Navigate to CS101 - starts in 45 minutes"
- [ ] Add walking time considerations: "15 min walk + 45 min until class"
- [ ] Priority handling for urgent classes

---

## 🎯 **6. User Experience Improvements**

### 6.1 Navigation Panel Redesign
- [ ] Move to collapsible accordion design
- [ ] Add header: "🏢 Quick Building Access"
- [ ] Add subtitle: "Or select any building manually"
- [ ] Make visually secondary to timetable
- [ ] Add expand/collapse functionality

### 6.2 Interactive Feedback
- [ ] Hover effects on timetable items showing "Click to navigate"
- [ ] Loading states during route calculation
- [ ] Success messages: "Route to [Room] calculated"
- [ ] Clear visual distinction between selected class and building

### 6.3 Error Handling
- [ ] Handle "TBA" rooms with appropriate messaging
- [ ] Graceful fallback to building navigation
- [ ] Clear error messages for failed navigation
- [ ] Retry mechanisms for failed route calculations

---

## 🔧 **7. Code Refactoring**

### 7.1 Function Restructuring
- [ ] Rename `showEventDetails()` to `showEventPopup()`
- [ ] Create new `navigateToClass(event)` as primary click handler
- [ ] Refactor `selectDashboardDestination()` to handle both buildings and rooms
- [ ] Create `clearAllSelections()` utility function

### 7.2 Global State Management
- [ ] Add `dashboardSelectedClass` variable
- [ ] Update `dashboardSelectedBuilding` to sync with class selection
- [ ] Create state management for navigation mode (class vs building)
- [ ] Add validation for state consistency

### 7.3 Event Handler Updates
- [ ] Update timetable item creation with new click handler
- [ ] Maintain building list click handlers
- [ ] Add right-click context menu for event details
- [ ] Implement keyboard navigation support

---

## 🧪 **8. Testing & Validation**

### 8.1 Room Mapping Tests
- [ ] Test all 6 rooms in test data:
  - Main Building Room 101
  - Science Block Room 201  
  - Library Room 301
  - Engineering Building Room 401
  - Business School Room 501
  - Student Center Room 601
- [ ] Verify coordinate accuracy
- [ ] Test fallback for unmapped rooms

### 8.2 Navigation Flow Tests
- [ ] Test class click → immediate navigation
- [ ] Test building selection still works
- [ ] Test clearing routes
- [ ] Test switching between class and building navigation
- [ ] Test TBA room handling

### 8.3 UI/UX Tests
- [ ] Test class highlighting
- [ ] Test time calculations
- [ ] Test responsive design
- [ ] Test error scenarios
- [ ] Test performance with multiple routes

---

## 📱 **9. Implementation Order**

### Phase 1: Core Functionality
1. Create room mapping system
2. Add selected class CSS
3. Modify timetable click handler
4. Basic room-to-building navigation

### Phase 2: Enhanced Features  
1. Time calculation functions
2. Improved route information display
3. Navigation panel redesign
4. State management improvements

### Phase 3: Polish & Testing
1. Visual enhancements
2. Error handling
3. Performance optimization
4. Comprehensive testing

---

## 🎨 **10. UI/UX Mockup Requirements**

### 10.1 Timetable Items
```
[SELECTED CLASS - Blue Background]
📚 Advanced Algorithms
CS301 - Main Building Room 101
⏰ 09:00 - 10:30 • Prof. Smith
🚶 Click to navigate (5 min walk)
```

### 10.2 Navigation Panel
```
🏢 Quick Building Access ⌄
💡 Or select any building manually

[Collapsed building list]
```

### 10.3 Route Information
```
📍 Navigate to: Main Building Room 101
🚶 Distance: 75m • Walking time: 5 min
⏰ Class starts in 2 hours 15 minutes
👨‍🏫 Prof. Smith • CS301 Advanced Algorithms
```

---

## ✅ **11. Acceptance Criteria**

- [ ] Clicking on any class immediately shows route to that specific room
- [ ] Building navigation panel remains functional as backup
- [ ] Selected class is visually highlighted
- [ ] Time until class is displayed in route info
- [ ] All 6 test rooms map correctly to their buildings
- [ ] TBA rooms handled gracefully
- [ ] Navigation panel has improved design
- [ ] State management is consistent
- [ ] No regressions in existing 3D map functionality

---

## 🚀 **Ready for Implementation!**

This todo list covers all aspects of the class-based navigation feature while maintaining the advanced 3D map functionality and ensuring a smooth, intuitive user experience. 