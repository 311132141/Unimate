# UNIMATE Timetable System Enhancement

## Overview
The UNIMATE timetable system has been significantly enhanced with comprehensive course offerings, diverse room locations, and realistic event scheduling spanning multiple days.

## Enhanced Data Structure

### Courses (25 total across 5 faculties)

#### Engineering Faculty (5 courses)
- **ENGGEN205** - Engineering Mechanics: Static and dynamic mechanics, force analysis
- **ENGGEN131** - Introduction to Engineering: Design and problem-solving methodologies  
- **MECH201** - Thermodynamics: Heat engines and energy conversion systems
- **CIVIL220** - Structural Engineering: Beams, columns, and foundations
- **ELEC201** - Circuit Analysis: DC/AC circuits and network theorems

#### Computer Science Faculty (4 courses)
- **COMPSCI101** - Introduction to Computer Science: Python programming fundamentals
- **COMPSCI220** - Data Structures and Algorithms: Advanced algorithms and complexity
- **COMPSCI235** - Software Engineering: Design patterns and project management
- **COMPSCI367** - Artificial Intelligence: Machine learning and neural networks

#### Mathematics & Statistics Faculty (4 courses)
- **STATS100** - Introduction to Statistics: Probability and hypothesis testing
- **MATHS150** - Calculus and Linear Algebra: Differential calculus and matrices
- **MATHS250** - Differential Equations: ODEs and PDEs with applications
- **STATS220** - Statistical Modelling: Regression and statistical inference

#### Business & Management Faculty (4 courses)
- **BUS202** - Business Strategy: Strategic management and competitive analysis
- **ACCTG102** - Management Accounting: Cost accounting and budgeting
- **ECON101** - Microeconomics: Supply/demand and market structures
- **MGMT301** - Operations Management: Production planning and quality control

#### Arts & Humanities Faculty (4 courses)
- **PHIL105** - Introduction to Philosophy: Classical and contemporary problems
- **HIST210** - Modern European History: 1789-1945 political/social developments
- **PSYC109** - Introduction to Psychology: Cognitive and developmental psychology
- **ENGL120** - Academic Writing: Essay structure and research methods

#### Health & Life Sciences Faculty (4 courses)
- **BIOSCI101** - Cell Biology: Cellular structure and molecular biology
- **CHEM110** - General Chemistry: Atomic structure and chemical bonding
- **PHYSICS201** - Quantum Mechanics: Wave-particle duality and quantum systems
- **MEDSCI142** - Human Anatomy: Human organ systems and physiology

### Room Locations (23 rooms across 6 buildings)

#### Engineering Building (ENG) - 5 rooms
- 401-403 (Floor 4), 301 (Floor 3), 201 (Floor 2), 105 (Floor 1), Lab A (Floor 1)

#### Science Building (SCI) - 5 rooms  
- 101A, 201B, 301C, Physics Lab, Chemistry Lab

#### Library (LIB) - 4 rooms
- G02 Study Hall, 301, Conference Room A, Group Study 1

#### Business School (BUS) - 3 rooms
- Lecture Hall 1, Seminar Room 201, Case Study Room

#### Arts Building (ARTS) - 3 rooms
- 102, 203, Humanities Lab

#### Health Sciences Building (HSB) - 3 rooms
- Anatomy Lab, Lecture Theatre, Tutorial Room 301

### Weekly Event Schedule (22+ events)

#### Monday Schedule
- 09:00-10:00: ENGGEN205 Lecture (Dr. Sarah Smith)
- 11:00-13:00: COMPSCI101 Lab (Prof. Ada Lovelace)
- 14:00-15:00: MATHS150 Tutorial (Dr. Alan Turing)
- 16:00-17:00: BUS202 Seminar (Prof. Michael Porter)

#### Tuesday Schedule
- 09:00-12:00: PHYSICS201 Lab Session (Prof. David Kim)
- 13:00-14:00: STATS100 Lecture (Dr. Florence Nightingale)
- 15:00-16:00: COMPSCI220 Lecture (Dr. Michael Chen)
- 17:00-18:00: **URGENT: PHIL105 Venue Change** (Dr. Emma Wilson)

#### Wednesday Schedule
- 09:00-10:00: MECH201 Lecture (Prof. James Watt)
- 11:00-14:00: BIOSCI101 Lab (Dr. Marie Curie)
- 15:00-17:00: **STATS100 Mid-term Exam** (Urgent)
- 18:00-19:00: ENGL120 Workshop (Prof. Virginia Woolf)

#### Thursday Schedule
- 09:00-11:00: CIVIL220 Design Project (Eng. Frank Lloyd Wright)
- 12:00-14:00: COMPSCI367 AI Workshop (Dr. Geoffrey Hinton)
- 15:00-16:00: ECON101 Tutorial (Prof. Adam Smith)
- 17:00-19:00: CHEM110 Lab Session (Dr. Dmitri Mendeleev)

#### Friday Schedule
- 09:00-11:00: ENGGEN131 Project Presentation (Prof. Isambard Brunel)
- 12:00-13:00: PSYC109 Lecture (Dr. Sigmund Freud)
- 14:00-16:00: COMPSCI235 Code Review (Linus Torvalds)
- 17:00-19:00: **URGENT: MEDSCI142 Lab Cancelled** (Dr. Andreas Vesalius)

#### Weekend Exams
- Saturday 09:00-12:00: COMPSCI220 Final Exam
- Saturday 14:00-17:00: MATHS250 Final Exam

### User Enrollment Profiles

#### Alice (Engineering Focus)
- ENGGEN205, MECH201, ELEC201, MATHS150

#### Bob (Computer Science Focus)  
- COMPSCI101, COMPSCI220, COMPSCI235, STATS100

#### Carol (Business/Arts Focus)
- BUS202, ACCTG102, PHIL105, PSYC109

#### TestUser (Mixed Subjects)
- ENGGEN205, COMPSCI101, STATS100, BUS202, BIOSCI101

## Key Features

### Event Types
- **Classes**: Lectures, labs, tutorials, workshops, seminars
- **Exams**: Mid-terms, finals with urgent flagging
- **Special Events**: Project presentations, code reviews

### Building Navigation
- 3D coordinate system for room positioning
- Building abbreviations: ENG, SCI, LIB, BUS, ARTS, HSB
- Multi-floor support with floor indicators

### Realistic Scheduling
- Varied time slots (1-3 hour durations)
- Multiple days of the week coverage
- Mix of regular and urgent events
- Historical figure lecturers for educational appeal

### Notable Instructors
- Dr. Sarah Smith, Prof. Ada Lovelace, Dr. Alan Turing
- Prof. David Kim, Dr. Florence Nightingale, Dr. Michael Chen
- Prof. James Watt, Dr. Marie Curie, Prof. Virginia Woolf
- Eng. Frank Lloyd Wright, Dr. Geoffrey Hinton, Prof. Adam Smith
- Linus Torvalds, Dr. Andreas Vesalius, and more

## Technical Implementation

### Setup Script Usage
```bash
cd backend
python setup_data.py
```

### Database Models
- **Course**: Code, name, description
- **Room**: Building, number, floor, 3D coordinates  
- **Event**: Title, type, course, room, times, lecturer, urgency
- **Enrollment**: User-course relationships with semester tracking

### Frontend Integration
- Event modal popups with comprehensive details
- Building-based navigation support
- Urgent event highlighting
- Multi-day timetable views

## Testing & Validation

The enhanced system creates:
- ✅ 25 courses across 5 faculties
- ✅ 23 rooms across 6 buildings  
- ✅ 22+ events spanning multiple days
- ✅ 4 users with diverse course enrollments
- ✅ Realistic weekly schedule with variety

## Login Credentials

### Primary Test Account
- **Username**: testuser
- **Password**: password123
- **RFID**: 5A653600

### Additional Demo Users
- **Username**: alice, bob, carol
- **Password**: Pass123! (for all)
- **RFID**: Unique per user

## Benefits

1. **Comprehensive Testing**: Rich data for testing all timetable features
2. **Realistic Scenarios**: Varied course types, buildings, and schedules
3. **Educational Value**: Recognizable course names and instructor personalities  
4. **Navigation Testing**: Multiple buildings with 3D coordinates
5. **Event Variety**: Classes, labs, exams, urgent notifications
6. **User Diversity**: Different academic focuses per user 

## Overview
The UNIMATE timetable system has been significantly enhanced with comprehensive course offerings, diverse room locations, and realistic event scheduling spanning multiple days.

## Enhanced Data Structure

### Courses (25 total across 5 faculties)

#### Engineering Faculty (5 courses)
- **ENGGEN205** - Engineering Mechanics: Static and dynamic mechanics, force analysis
- **ENGGEN131** - Introduction to Engineering: Design and problem-solving methodologies  
- **MECH201** - Thermodynamics: Heat engines and energy conversion systems
- **CIVIL220** - Structural Engineering: Beams, columns, and foundations
- **ELEC201** - Circuit Analysis: DC/AC circuits and network theorems

#### Computer Science Faculty (4 courses)
- **COMPSCI101** - Introduction to Computer Science: Python programming fundamentals
- **COMPSCI220** - Data Structures and Algorithms: Advanced algorithms and complexity
- **COMPSCI235** - Software Engineering: Design patterns and project management
- **COMPSCI367** - Artificial Intelligence: Machine learning and neural networks

#### Mathematics & Statistics Faculty (4 courses)
- **STATS100** - Introduction to Statistics: Probability and hypothesis testing
- **MATHS150** - Calculus and Linear Algebra: Differential calculus and matrices
- **MATHS250** - Differential Equations: ODEs and PDEs with applications
- **STATS220** - Statistical Modelling: Regression and statistical inference

#### Business & Management Faculty (4 courses)
- **BUS202** - Business Strategy: Strategic management and competitive analysis
- **ACCTG102** - Management Accounting: Cost accounting and budgeting
- **ECON101** - Microeconomics: Supply/demand and market structures
- **MGMT301** - Operations Management: Production planning and quality control

#### Arts & Humanities Faculty (4 courses)
- **PHIL105** - Introduction to Philosophy: Classical and contemporary problems
- **HIST210** - Modern European History: 1789-1945 political/social developments
- **PSYC109** - Introduction to Psychology: Cognitive and developmental psychology
- **ENGL120** - Academic Writing: Essay structure and research methods

#### Health & Life Sciences Faculty (4 courses)
- **BIOSCI101** - Cell Biology: Cellular structure and molecular biology
- **CHEM110** - General Chemistry: Atomic structure and chemical bonding
- **PHYSICS201** - Quantum Mechanics: Wave-particle duality and quantum systems
- **MEDSCI142** - Human Anatomy: Human organ systems and physiology

### Room Locations (23 rooms across 6 buildings)

#### Engineering Building (ENG) - 5 rooms
- 401-403 (Floor 4), 301 (Floor 3), 201 (Floor 2), 105 (Floor 1), Lab A (Floor 1)

#### Science Building (SCI) - 5 rooms  
- 101A, 201B, 301C, Physics Lab, Chemistry Lab

#### Library (LIB) - 4 rooms
- G02 Study Hall, 301, Conference Room A, Group Study 1

#### Business School (BUS) - 3 rooms
- Lecture Hall 1, Seminar Room 201, Case Study Room

#### Arts Building (ARTS) - 3 rooms
- 102, 203, Humanities Lab

#### Health Sciences Building (HSB) - 3 rooms
- Anatomy Lab, Lecture Theatre, Tutorial Room 301

### Weekly Event Schedule (22+ events)

#### Monday Schedule
- 09:00-10:00: ENGGEN205 Lecture (Dr. Sarah Smith)
- 11:00-13:00: COMPSCI101 Lab (Prof. Ada Lovelace)
- 14:00-15:00: MATHS150 Tutorial (Dr. Alan Turing)
- 16:00-17:00: BUS202 Seminar (Prof. Michael Porter)

#### Tuesday Schedule
- 09:00-12:00: PHYSICS201 Lab Session (Prof. David Kim)
- 13:00-14:00: STATS100 Lecture (Dr. Florence Nightingale)
- 15:00-16:00: COMPSCI220 Lecture (Dr. Michael Chen)
- 17:00-18:00: **URGENT: PHIL105 Venue Change** (Dr. Emma Wilson)

#### Wednesday Schedule
- 09:00-10:00: MECH201 Lecture (Prof. James Watt)
- 11:00-14:00: BIOSCI101 Lab (Dr. Marie Curie)
- 15:00-17:00: **STATS100 Mid-term Exam** (Urgent)
- 18:00-19:00: ENGL120 Workshop (Prof. Virginia Woolf)

#### Thursday Schedule
- 09:00-11:00: CIVIL220 Design Project (Eng. Frank Lloyd Wright)
- 12:00-14:00: COMPSCI367 AI Workshop (Dr. Geoffrey Hinton)
- 15:00-16:00: ECON101 Tutorial (Prof. Adam Smith)
- 17:00-19:00: CHEM110 Lab Session (Dr. Dmitri Mendeleev)

#### Friday Schedule
- 09:00-11:00: ENGGEN131 Project Presentation (Prof. Isambard Brunel)
- 12:00-13:00: PSYC109 Lecture (Dr. Sigmund Freud)
- 14:00-16:00: COMPSCI235 Code Review (Linus Torvalds)
- 17:00-19:00: **URGENT: MEDSCI142 Lab Cancelled** (Dr. Andreas Vesalius)

#### Weekend Exams
- Saturday 09:00-12:00: COMPSCI220 Final Exam
- Saturday 14:00-17:00: MATHS250 Final Exam

### User Enrollment Profiles

#### Alice (Engineering Focus)
- ENGGEN205, MECH201, ELEC201, MATHS150

#### Bob (Computer Science Focus)  
- COMPSCI101, COMPSCI220, COMPSCI235, STATS100

#### Carol (Business/Arts Focus)
- BUS202, ACCTG102, PHIL105, PSYC109

#### TestUser (Mixed Subjects)
- ENGGEN205, COMPSCI101, STATS100, BUS202, BIOSCI101

## Key Features

### Event Types
- **Classes**: Lectures, labs, tutorials, workshops, seminars
- **Exams**: Mid-terms, finals with urgent flagging
- **Special Events**: Project presentations, code reviews

### Building Navigation
- 3D coordinate system for room positioning
- Building abbreviations: ENG, SCI, LIB, BUS, ARTS, HSB
- Multi-floor support with floor indicators

### Realistic Scheduling
- Varied time slots (1-3 hour durations)
- Multiple days of the week coverage
- Mix of regular and urgent events
- Historical figure lecturers for educational appeal

### Notable Instructors
- Dr. Sarah Smith, Prof. Ada Lovelace, Dr. Alan Turing
- Prof. David Kim, Dr. Florence Nightingale, Dr. Michael Chen
- Prof. James Watt, Dr. Marie Curie, Prof. Virginia Woolf
- Eng. Frank Lloyd Wright, Dr. Geoffrey Hinton, Prof. Adam Smith
- Linus Torvalds, Dr. Andreas Vesalius, and more

## Technical Implementation

### Setup Script Usage
```bash
cd backend
python setup_data.py
```

### Database Models
- **Course**: Code, name, description
- **Room**: Building, number, floor, 3D coordinates  
- **Event**: Title, type, course, room, times, lecturer, urgency
- **Enrollment**: User-course relationships with semester tracking

### Frontend Integration
- Event modal popups with comprehensive details
- Building-based navigation support
- Urgent event highlighting
- Multi-day timetable views

## Testing & Validation

The enhanced system creates:
- ✅ 25 courses across 5 faculties
- ✅ 23 rooms across 6 buildings  
- ✅ 22+ events spanning multiple days
- ✅ 4 users with diverse course enrollments
- ✅ Realistic weekly schedule with variety

## Login Credentials

### Primary Test Account
- **Username**: testuser
- **Password**: password123
- **RFID**: 5A653600

### Additional Demo Users
- **Username**: alice, bob, carol
- **Password**: Pass123! (for all)
- **RFID**: Unique per user

## Benefits

1. **Comprehensive Testing**: Rich data for testing all timetable features
2. **Realistic Scenarios**: Varied course types, buildings, and schedules
3. **Educational Value**: Recognizable course names and instructor personalities  
4. **Navigation Testing**: Multiple buildings with 3D coordinates
5. **Event Variety**: Classes, labs, exams, urgent notifications
6. **User Diversity**: Different academic focuses per user 