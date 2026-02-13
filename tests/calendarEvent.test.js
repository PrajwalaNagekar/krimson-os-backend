const axios = require("axios");
const testData = require("./calendarEvent.testData");

/**
 * Calendar Event API Test Runner
 *
 * This script tests all calendar event API endpoints
 * Make sure to:
 * 1. Start the backend server (npm run dev)
 * 2. Login as ADMINISTRATOR and get JWT token
 * 3. Update AUTH_TOKEN in calendarEvent.testData.js
 */

const { BASE_URL, AUTH_TOKEN, testEvents, updateEvent } = testData;

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  tests: [],
};

// Helper function to make API calls
async function apiCall(method, endpoint, data = null, params = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    };

    if (data) config.data = data;
    if (params) config.params = params;

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status,
    };
  }
}

// Test reporter
function reportTest(name, result, details) {
  const test = {
    name,
    passed: result,
    details,
    timestamp: new Date().toISOString(),
  };
  testResults.tests.push(test);

  if (result) {
    testResults.passed++;
    console.log(`✅ PASSED: ${name}`);
  } else {
    testResults.failed++;
    console.log(`❌ FAILED: ${name}`);
  }

  console.log(`   Details: ${JSON.stringify(details, null, 2)}\n`);
}

// Main test runner
async function runTests() {
  console.log("========================================");
  console.log("CALENDAR EVENT API TESTS");
  console.log("========================================\n");

  let createdEventIds = [];

  // ========================================
  // TEST 1: Create Single Day Event
  // ========================================
  console.log("--- TEST 1: Create Single Day Academic Event ---");
  const test1 = await apiCall(
    "POST",
    "/administration/calendar-events",
    testEvents[0],
  );
  reportTest("Create Single Day Event", test1.success && test1.status === 201, {
    endpoint: "POST /administration/calendar-events",
    response: test1,
  });
  if (test1.success) createdEventIds.push(test1.data.data.id);

  // ========================================
  // TEST 2: Create Multi-Day Event
  // ========================================
  console.log("--- TEST 2: Create Multi-Day Sports Event ---");
  const test2 = await apiCall(
    "POST",
    "/administration/calendar-events",
    testEvents[1],
  );
  reportTest("Create Multi-Day Event", test2.success && test2.status === 201, {
    endpoint: "POST /administration/calendar-events",
    response: test2,
  });
  if (test2.success) createdEventIds.push(test2.data.data.id);

  // ========================================
  // TEST 3: Create Multiple Events
  // ========================================
  console.log("--- TEST 3: Create Additional Events ---");
  for (let i = 2; i < testEvents.length; i++) {
    const test = await apiCall(
      "POST",
      "/administration/calendar-events",
      testEvents[i],
    );
    if (test.success) createdEventIds.push(test.data.data.id);
    reportTest(
      `Create Event ${i + 1}: ${testEvents[i].title}`,
      test.success && test.status === 201,
      { endpoint: "POST /administration/calendar-events", response: test },
    );
  }

  // ========================================
  // TEST 4: Get All Events
  // ========================================
  console.log("--- TEST 4: Get All Calendar Events ---");
  const test4 = await apiCall("GET", "/administration/calendar-events");
  reportTest("Get All Events", test4.success && test4.status === 200, {
    endpoint: "GET /administration/calendar-events",
    response: test4,
  });

  // ========================================
  // TEST 5: Get Events with Pagination
  // ========================================
  console.log("--- TEST 5: Get Events with Pagination ---");
  const test5 = await apiCall("GET", "/administration/calendar-events", null, {
    page: 1,
    limit: 5,
  });
  reportTest(
    "Get Events with Pagination",
    test5.success && test5.status === 200,
    {
      endpoint: "GET /administration/calendar-events?page=1&limit=5",
      response: test5,
    },
  );

  // ========================================
  // TEST 6: Filter by Category
  // ========================================
  console.log("--- TEST 6: Filter Events by Category (ACADEMIC) ---");
  const test6 = await apiCall("GET", "/administration/calendar-events", null, {
    category: "ACADEMIC",
  });
  reportTest("Filter by Category", test6.success && test6.status === 200, {
    endpoint: "GET /administration/calendar-events?category=ACADEMIC",
    response: test6,
  });

  // ========================================
  // TEST 7: Filter by Event Type
  // ========================================
  console.log("--- TEST 7: Filter Events by Type (PUBLIC) ---");
  const test7 = await apiCall("GET", "/administration/calendar-events", null, {
    eventType: "PUBLIC",
  });
  reportTest("Filter by Event Type", test7.success && test7.status === 200, {
    endpoint: "GET /administration/calendar-events?eventType=PUBLIC",
    response: test7,
  });

  // ========================================
  // TEST 8: Filter by Status
  // ========================================
  console.log("--- TEST 8: Filter Events by Status (APPROVED) ---");
  const test8 = await apiCall("GET", "/administration/calendar-events", null, {
    status: "APPROVED",
  });
  reportTest("Filter by Status", test8.success && test8.status === 200, {
    endpoint: "GET /administration/calendar-events?status=APPROVED",
    response: test8,
  });

  // ========================================
  // TEST 9: Get Event by ID
  // ========================================
  if (createdEventIds.length > 0) {
    console.log("--- TEST 9: Get Event by ID ---");
    const test9 = await apiCall(
      "GET",
      `/administration/calendar-events/${createdEventIds[0]}`,
    );
    reportTest("Get Event by ID", test9.success && test9.status === 200, {
      endpoint: `GET /administration/calendar-events/${createdEventIds[0]}`,
      response: test9,
    });
  }

  // ========================================
  // TEST 10: Update Event
  // ========================================
  if (createdEventIds.length > 0) {
    console.log("--- TEST 10: Update Event ---");
    const test10 = await apiCall(
      "PUT",
      `/administration/calendar-events/${createdEventIds[0]}`,
      updateEvent,
    );
    reportTest("Update Event", test10.success && test10.status === 200, {
      endpoint: `PUT /administration/calendar-events/${createdEventIds[0]}`,
      response: test10,
    });
  }

  // ========================================
  // TEST 11: Get Upcoming Events
  // ========================================
  console.log("--- TEST 11: Get Upcoming Events ---");
  const test11 = await apiCall(
    "GET",
    "/administration/calendar-events/upcoming",
    null,
    { days: 30, limit: 5 },
  );
  reportTest("Get Upcoming Events", test11.success && test11.status === 200, {
    endpoint: "GET /administration/calendar-events/upcoming?days=30&limit=5",
    response: test11,
  });

  // ========================================
  // TEST 12: Get Events by Date Range
  // ========================================
  console.log("--- TEST 12: Get Events by Date Range ---");
  const test12 = await apiCall(
    "GET",
    "/administration/calendar-events/date-range",
    null,
    {
      startDate: "2026-03-01",
      endDate: "2026-06-30",
    },
  );
  reportTest(
    "Get Events by Date Range",
    test12.success && test12.status === 200,
    {
      endpoint:
        "GET /administration/calendar-events/date-range?startDate=2026-03-01&endDate=2026-06-30",
      response: test12,
    },
  );

  // ========================================
  // TEST 13: Delete Event
  // ========================================
  if (createdEventIds.length > 2) {
    console.log("--- TEST 13: Delete Event (Soft Delete) ---");
    const test13 = await apiCall(
      "DELETE",
      `/administration/calendar-events/${createdEventIds[2]}`,
    );
    reportTest("Delete Event", test13.success && test13.status === 200, {
      endpoint: `DELETE /administration/calendar-events/${createdEventIds[2]}`,
      response: test13,
    });
  }

  // ========================================
  // TEST 14: Validation - Missing Required Fields
  // ========================================
  console.log("--- TEST 14: Validation - Missing Title ---");
  const test14 = await apiCall("POST", "/administration/calendar-events", {
    startDate: "2026-07-01",
    category: "ACADEMIC",
  });
  reportTest(
    "Validation - Missing Title",
    !test14.success && test14.status === 400,
    { endpoint: "POST /administration/calendar-events", response: test14 },
  );

  // ========================================
  // TEST 15: Validation - Multi-day without End Date
  // ========================================
  console.log("--- TEST 15: Validation - Multi-day without End Date ---");
  const test15 = await apiCall("POST", "/administration/calendar-events", {
    title: "Invalid Event",
    startDate: "2026-07-01",
    isMultiDay: true,
    category: "ACADEMIC",
    eventType: "PUBLIC",
  });
  reportTest(
    "Validation - Multi-day without End Date",
    !test15.success && test15.status === 400,
    { endpoint: "POST /administration/calendar-events", response: test15 },
  );

  // ========================================
  // PRINT SUMMARY
  // ========================================
  console.log("\n========================================");
  console.log("TEST SUMMARY");
  console.log("========================================");
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`Passed: ${testResults.passed} ✅`);
  console.log(`Failed: ${testResults.failed} ❌`);
  console.log(
    `Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(2)}%`,
  );
  console.log("========================================\n");

  // Save results to file
  const fs = require("fs");
  fs.writeFileSync(
    "calendar-event-test-results.json",
    JSON.stringify(testResults, null, 2),
  );
  console.log("📄 Test results saved to: calendar-event-test-results.json\n");
}

// Run tests
runTests().catch(console.error);
