// Calendar Event API Test Script
// Base URL: http://localhost:8000/api/v1

/**
 * AUTHENTICATION REQUIRED
 * Before testing, you need to:
 * 1. Login as an ADMINISTRATOR user
 * 2. Copy the JWT token from the response
 * 3. Replace "YOUR_JWT_TOKEN_HERE" with the actual token
 */

const BASE_URL = "http://localhost:8000/api/v1";
const AUTH_TOKEN = "YOUR_JWT_TOKEN_HERE"; // Replace with actual token

// ========================================
// TEST DATA
// ========================================

// Test Data 1: Single Day Academic Event
const testEvent1 = {
  title: "Science Fair 2026",
  description:
    "Annual science exhibition showcasing student projects across all grades",
  startDate: "2026-03-15",
  time: "09:00",
  isMultiDay: false,
  location: "School Auditorium",
  category: "ACADEMIC",
  eventType: "PUBLIC",
  status: "APPROVED",
  reminderMinutes: 60,
};

// Test Data 2: Multi-Day Sports Event
const testEvent2 = {
  title: "Inter-School Sports Championship",
  description: "Three-day sports competition with multiple athletic events",
  startDate: "2026-04-10",
  endDate: "2026-04-12",
  time: "08:30",
  isMultiDay: true,
  location: "Main Sports Complex",
  category: "SPORTS",
  eventType: "PUBLIC",
  status: "APPROVED",
  reminderMinutes: 120,
};

// Test Data 3: Cultural Event
const testEvent3 = {
  title: "Annual Day Celebrations",
  description: "Cultural program showcasing student performances",
  startDate: "2026-05-20",
  time: "18:00",
  isMultiDay: false,
  location: "Open Air Theatre",
  category: "CULTURAL",
  eventType: "PUBLIC",
  status: "PENDING",
  reminderMinutes: 30,
};

// Test Data 4: Administrative Meeting
const testEvent4 = {
  title: "Staff Meeting - Curriculum Review",
  description: "Monthly staff meeting to review curriculum updates",
  startDate: "2026-03-05",
  time: "14:00",
  isMultiDay: false,
  location: "Conference Room A",
  category: "MEETING",
  eventType: "STAFF_ONLY",
  status: "APPROVED",
  reminderMinutes: 30,
};

// Test Data 5: Parent-Teacher Meeting
const testEvent5 = {
  title: "Parent-Teacher Conference",
  description: "Individual meetings to discuss student progress",
  startDate: "2026-03-25",
  endDate: "2026-03-26",
  time: "10:00",
  isMultiDay: true,
  location: "Classrooms",
  category: "PARENT_TEACHER",
  eventType: "PRIVATE",
  status: "APPROVED",
  reminderMinutes: 1440, // 24 hours
};

// Test Data 6: Holiday
const testEvent6 = {
  title: "Spring Break",
  description: "School holiday for spring season",
  startDate: "2026-04-01",
  endDate: "2026-04-07",
  isMultiDay: true,
  category: "HOLIDAY",
  eventType: "PUBLIC",
  status: "APPROVED",
};

// Test Data 7: Examination
const testEvent7 = {
  title: "Mid-Term Examinations",
  description: "Half-yearly exams for all grades",
  startDate: "2026-06-01",
  endDate: "2026-06-10",
  time: "09:00",
  isMultiDay: true,
  location: "Examination Halls",
  category: "EXAMINATION",
  eventType: "STUDENT_ONLY",
  status: "APPROVED",
  reminderMinutes: 2880, // 2 days
};

// Test Data 8: Workshop
const testEvent8 = {
  title: "Digital Learning Workshop",
  description: "Professional development workshop on digital teaching tools",
  startDate: "2026-03-18",
  time: "13:00",
  isMultiDay: false,
  location: "Computer Lab",
  category: "WORKSHOP",
  eventType: "STAFF_ONLY",
  status: "PENDING",
  reminderMinutes: 60,
};

// Update Test Data
const updateEvent = {
  title: "Science Fair 2026 - Updated",
  status: "COMPLETED",
  description: "Updated description after event completion",
};

module.exports = {
  BASE_URL,
  AUTH_TOKEN,
  testEvents: [
    testEvent1,
    testEvent2,
    testEvent3,
    testEvent4,
    testEvent5,
    testEvent6,
    testEvent7,
    testEvent8,
  ],
  updateEvent,
};
