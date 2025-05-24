# Unimate - Active Context

## Current Work Focus

### 🎯 Class-Based Navigation Implementation
Currently implementing the ability for users to click directly on timetable classes to navigate to those specific rooms, rather than just selecting buildings manually.

**Status:** Task 1.3 complete, ready for room mapping
**Reference:** CLASS_NAVIGATION_TODO.md

### Key Tasks in Progress

#### Task 1.2 ✅ COMPLETED
- Improved navigation panel design with collapsible interface
- Added "Quick Building Access" header with building icon
- Implemented smooth expand/collapse animations
- Styled as secondary/backup navigation option

#### Task 1.3 ✅ COMPLETED  
- Added CSS for upcoming class highlighting (green, within 30 min)
- Added CSS for current class highlighting (blue pulse animation)
- Added CSS for time-sensitive classes (orange, within 15 min)
- Implemented time calculation functions
- Dynamic time display showing "Starts in X" or "Ends in Y"
- Created comprehensive test file: `test_time_indicators_1_3.html`

#### Next Up: Room-to-Location Mapping
- Create mapping system for room numbers to exact coordinates
- Implement room resolution logic
- Handle "TBA" rooms gracefully
- Test with all 6 sample rooms in test data

## Recent Changes

### Error Fixes (Just Resolved)
- Fixed `showStatusMessage` function hoisting issue by moving definition to top
- Removed invalid `roughness` property from MeshLambertMaterial
- Fixed 401 auth error by using `window.location.origin` for API calls
- Removed duplicate function definition

### Time-based Visual Indicators (Task 1.3)
- Classes starting within 30 minutes show green "Starting Soon" indicator
- Classes starting within 15 minutes show orange "⚡ Urgent" indicator  
- Classes in progress show blue pulse animation with "In Progress" label
- Time countdown displays dynamically update

### Testing Infrastructure (New)
- Created `test_time_indicators_1_3.html` for visual validation
- Time simulation controls allow testing different scenarios
- Comprehensive behavior matrix documenting expected states

## Active Decisions

### Navigation Approach
- **Primary:** Click on timetable classes for direct room navigation
- **Secondary:** Manual building selection as backup
- **Visual:** Selected classes highlighted in blue (#1f3a93)
- **Time Indicators:** Green (30min), Orange (15min), Blue pulse (in progress)
- **UX:** Immediate navigation without intermediate steps

### Technical Choices
- Using Three.js for 3D visualization (no changes)
- WebSocket via Django Channels for real-time updates
- JWT authentication for session management
- Vanilla JavaScript for frontend (no framework)
- Dynamic API URL resolution using window.location.origin

### UI/UX Decisions
- Collapsible building panel to save space
- Time-until-class display in route information
- Color-coded routes based on urgency
- Hover effects showing "Click to navigate"
- Visual time indicators for class urgency

## Next Steps

### Immediate (This Session)
1. Create room mapping data structure
2. Implement `resolveRoomLocation()` function
3. Modify timetable click handlers for navigation
4. Test room-to-building navigation

### Short Term (Next Sessions)
1. Implement selected class highlighting
2. Create smart notification system
3. Add comprehensive error handling
4. Enhance route information display

### Medium Term
1. Performance optimization
2. Mobile responsiveness improvements
3. Advanced pathfinding algorithm
4. User preference storage

## Known Issues

### Current Bugs
- None critical at this time (previous errors resolved)

### Technical Debt
- Frontend code needs modularization
- Some inline styles should move to CSS
- WebSocket reconnection logic needs improvement

### UX Improvements Needed
- Loading states for route calculation
- Better feedback for failed navigations
- Clearer indication of clickable elements
- Accessibility improvements for screen readers

## Context for Next Session

When resuming work:
1. Start with room mapping implementation (Task 2.1)
2. Create buildingRoomMap data structure
3. Implement resolveRoomLocation function
4. Update timetable click handlers
5. Test navigation from class to specific room

## Important File Locations

### Currently Working On
- `frontend/pages/dashboard.html` - Main implementation file
- `CLASS_NAVIGATION_TODO.md` - Detailed task list
- `test_time_indicators_1_3.html` - Task 1.3 test file

### Reference Files
- `backend/api/models.py` - Room and Event models
- `frontend/static/site.css` - Global styles
- `tools/test_*.py` - Testing utilities

### Test Data
- 6 test rooms across different buildings
- 3 valid RFID cards for testing
- Sample timetable with various event types 

## Current Work Focus

### 🎯 Class-Based Navigation Implementation
Currently implementing the ability for users to click directly on timetable classes to navigate to those specific rooms, rather than just selecting buildings manually.

**Status:** Task 1.3 complete, ready for room mapping
**Reference:** CLASS_NAVIGATION_TODO.md

### Key Tasks in Progress

#### Task 1.2 ✅ COMPLETED
- Improved navigation panel design with collapsible interface
- Added "Quick Building Access" header with building icon
- Implemented smooth expand/collapse animations
- Styled as secondary/backup navigation option

#### Task 1.3 ✅ COMPLETED  
- Added CSS for upcoming class highlighting (green, within 30 min)
- Added CSS for current class highlighting (blue pulse animation)
- Added CSS for time-sensitive classes (orange, within 15 min)
- Implemented time calculation functions
- Dynamic time display showing "Starts in X" or "Ends in Y"
- Created comprehensive test file: `test_time_indicators_1_3.html`

#### Next Up: Room-to-Location Mapping
- Create mapping system for room numbers to exact coordinates
- Implement room resolution logic
- Handle "TBA" rooms gracefully
- Test with all 6 sample rooms in test data

## Recent Changes

### Error Fixes (Just Resolved)
- Fixed `showStatusMessage` function hoisting issue by moving definition to top
- Removed invalid `roughness` property from MeshLambertMaterial
- Fixed 401 auth error by using `window.location.origin` for API calls
- Removed duplicate function definition

### Time-based Visual Indicators (Task 1.3)
- Classes starting within 30 minutes show green "Starting Soon" indicator
- Classes starting within 15 minutes show orange "⚡ Urgent" indicator  
- Classes in progress show blue pulse animation with "In Progress" label
- Time countdown displays dynamically update

### Testing Infrastructure (New)
- Created `test_time_indicators_1_3.html` for visual validation
- Time simulation controls allow testing different scenarios
- Comprehensive behavior matrix documenting expected states

## Active Decisions

### Navigation Approach
- **Primary:** Click on timetable classes for direct room navigation
- **Secondary:** Manual building selection as backup
- **Visual:** Selected classes highlighted in blue (#1f3a93)
- **Time Indicators:** Green (30min), Orange (15min), Blue pulse (in progress)
- **UX:** Immediate navigation without intermediate steps

### Technical Choices
- Using Three.js for 3D visualization (no changes)
- WebSocket via Django Channels for real-time updates
- JWT authentication for session management
- Vanilla JavaScript for frontend (no framework)
- Dynamic API URL resolution using window.location.origin

### UI/UX Decisions
- Collapsible building panel to save space
- Time-until-class display in route information
- Color-coded routes based on urgency
- Hover effects showing "Click to navigate"
- Visual time indicators for class urgency

## Next Steps

### Immediate (This Session)
1. Create room mapping data structure
2. Implement `resolveRoomLocation()` function
3. Modify timetable click handlers for navigation
4. Test room-to-building navigation

### Short Term (Next Sessions)
1. Implement selected class highlighting
2. Create smart notification system
3. Add comprehensive error handling
4. Enhance route information display

### Medium Term
1. Performance optimization
2. Mobile responsiveness improvements
3. Advanced pathfinding algorithm
4. User preference storage

## Known Issues

### Current Bugs
- None critical at this time (previous errors resolved)

### Technical Debt
- Frontend code needs modularization
- Some inline styles should move to CSS
- WebSocket reconnection logic needs improvement

### UX Improvements Needed
- Loading states for route calculation
- Better feedback for failed navigations
- Clearer indication of clickable elements
- Accessibility improvements for screen readers

## Context for Next Session

When resuming work:
1. Start with room mapping implementation (Task 2.1)
2. Create buildingRoomMap data structure
3. Implement resolveRoomLocation function
4. Update timetable click handlers
5. Test navigation from class to specific room

## Important File Locations

### Currently Working On
- `frontend/pages/dashboard.html` - Main implementation file
- `CLASS_NAVIGATION_TODO.md` - Detailed task list
- `test_time_indicators_1_3.html` - Task 1.3 test file

### Reference Files
- `backend/api/models.py` - Room and Event models
- `frontend/static/site.css` - Global styles
- `tools/test_*.py` - Testing utilities

### Test Data
- 6 test rooms across different buildings
- 3 valid RFID cards for testing
- Sample timetable with various event types 