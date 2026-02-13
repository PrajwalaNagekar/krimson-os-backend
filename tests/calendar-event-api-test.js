const axios = require("axios");

/**
 * Calendar Event API Complete Test Suite
 * Tests all endpoints with real admin credentials
 */

const BASE_URL = "http://localhost:8000/api/v1";
const ADMIN_CREDENTIALS = {
  email: "prajwalanagekar@gmail.com",
  password: "admin123",
};

let authToken = "";
let createdEventIds = [];
const testResults = [];

// Helper: Log test result
function logTest(testName, success, details) {
  const result = {
    test: testName,
    status: success ? "✅ PASS" : "❌ FAIL",
    timestamp: new Date().toISOString(),
    details,
  };
  testResults.push(result);
  console.log(`\n${result.status} - ${testName}`);
  if (details.error) {
    console.log("Error:", JSON.stringify(details.error, null, 2));
  }
  if (details.data) {
    console.log("Response:", JSON.stringify(details.data, null, 2));
  }
}

// Step 1: Login and get auth token
async function login() {
  console.log("\n========================================");
  console.log("STEP 1: AUTHENTICATION");
  console.log("========================================");

  try {
    const response = await axios.post(
      `${BASE_URL}/auth/login`,
      ADMIN_CREDENTIALS,
    );
    authToken = response.data.data.accessToken;
    logTest("Admin Login", true, {
      message: "Successfully authenticated",
      user: response.data.data.user.email,
      role: response.data.data.user.role,
    });
    return true;
  } catch (error) {
    logTest("Admin Login", false, {
      error: error.response?.data || error.message,
    });
    return false;
  }
}

// Helper: Make authenticated API call
async function apiCall(method, endpoint, data = null, params = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        Authorization: `Bearer ${authToken}`,
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

// Test Data
const testEvents = [
  {
    title: "Science Fair 2026",
    description: "Annual science exhibition showcasing student projects",
    startDate: "2026-03-15",
    time: "09:00",
    isMultiDay: false,
    location: "School Auditorium",
    category: "ACADEMIC",
    eventType: "PUBLIC",
    visibility: "PUBLIC",
    status: "APPROVED",
    reminderMinutes: 60,
  },
  {
    title: "Inter-School Sports Championship",
    description: "Three-day sports competition",
    startDate: "2026-04-10",
    endDate: "2026-04-12",
    time: "08:30",
    isMultiDay: true,
    location: "Main Sports Complex",
    category: "SPORTS",
    eventType: "PUBLIC",
    visibility: "PUBLIC",
    status: "APPROVED",
    reminderMinutes: 120,
  },
  {
    title: "Staff Meeting - Curriculum Review",
    description: "Monthly staff meeting",
    startDate: "2026-03-05",
    time: "14:00",
    isMultiDay: false,
    location: "Conference Room A",
    category: "MEETING",
    eventType: "STAFF_ONLY",
    visibility: "ROLE_BASED",
    status: "APPROVED",
    reminderMinutes: 30,
  },
  {
    title: "Parent-Teacher Conference",
    description: "Individual meetings to discuss student progress",
    startDate: "2026-03-25",
    endDate: "2026-03-26",
    time: "10:00",
    isMultiDay: true,
    location: "Classrooms",
    category: "PARENT_TEACHER",
    eventType: "PRIVATE",
    visibility: "SELECTED_USERS",
    status: "APPROVED",
    reminderMinutes: 1440,
  },
  {
    title: "Spring Break",
    description: "School holiday for spring season",
    startDate: "2026-04-01",
    endDate: "2026-04-07",
    isMultiDay: true,
    category: "HOLIDAY",
    eventType: "PUBLIC",
    visibility: "PUBLIC",
    status: "APPROVED",
  },
];

// Run all tests
async function runTests() {
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║   CALENDAR EVENT API TEST SUITE       ║");
  console.log("╔════════════════════════════════════════╗\n");

  // Step 1: Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log("\n❌ Authentication failed. Cannot proceed with tests.");
    return;
  }

  // Step 2: Create Events
  console.log("\n========================================");
  console.log("STEP 2: CREATE EVENTS");
  console.log("========================================");

  for (let i = 0; i < testEvents.length; i++) {
    const result = await apiCall(
      "POST",
      "/administration/calendar-events",
      testEvents[i],
    );
    logTest(
      `Create Event ${i + 1}: ${testEvents[i].title}`,
      result.success && result.status === 201,
      {
        endpoint: "POST /administration/calendar-events",
        data: result.success
          ? { id: result.data.data.id, title: result.data.data.title }
          : null,
        error: result.error,
      },
    );
    if (result.success) {
      createdEventIds.push(result.data.data.id);
    }
  }

  // Step 3: Get All Events
  console.log("\n========================================");
  console.log("STEP 3: RETRIEVE EVENTS");
  console.log("========================================");

  const allEvents = await apiCall("GET", "/administration/calendar-events");
  logTest("Get All Events", allEvents.success && allEvents.status === 200, {
    endpoint: "GET /administration/calendar-events",
    data: allEvents.success
      ? {
          total: allEvents.data.metadata?.pagination?.total || "N/A",
          count: allEvents.data.data?.length || 0,
        }
      : null,
    error: allEvents.error,
  });

  // Step 4: Pagination Test
  const paginated = await apiCall(
    "GET",
    "/administration/calendar-events",
    null,
    { page: 1, limit: 3 },
  );
  logTest(
    "Get Events with Pagination (page=1, limit=3)",
    paginated.success && paginated.status === 200,
    {
      endpoint: "GET /administration/calendar-events?page=1&limit=3",
      data: paginated.success
        ? {
            returned: paginated.data.data?.length || 0,
            pagination: paginated.data.metadata?.pagination,
          }
        : null,
      error: paginated.error,
    },
  );

  // Step 5: Filter by Category
  const filtered = await apiCall(
    "GET",
    "/administration/calendar-events",
    null,
    { category: "ACADEMIC" },
  );
  logTest(
    "Filter by Category (ACADEMIC)",
    filtered.success && filtered.status === 200,
    {
      endpoint: "GET /administration/calendar-events?category=ACADEMIC",
      data: filtered.success
        ? { count: filtered.data.data?.length || 0 }
        : null,
      error: filtered.error,
    },
  );

  // Step 6: Filter by Visibility
  const visibilityFilter = await apiCall(
    "GET",
    "/administration/calendar-events",
    null,
    { visibility: "PUBLIC" },
  );
  logTest(
    "Filter by Visibility (PUBLIC)",
    visibilityFilter.success && visibilityFilter.status === 200,
    {
      endpoint: "GET /administration/calendar-events?visibility=PUBLIC",
      data: visibilityFilter.success
        ? { count: visibilityFilter.data.data?.length || 0 }
        : null,
      error: visibilityFilter.error,
    },
  );

  // Step 7: Get Event by ID
  if (createdEventIds.length > 0) {
    const singleEvent = await apiCall(
      "GET",
      `/administration/calendar-events/${createdEventIds[0]}`,
    );
    logTest(
      "Get Event by ID",
      singleEvent.success && singleEvent.status === 200,
      {
        endpoint: `GET /administration/calendar-events/${createdEventIds[0]}`,
        data: singleEvent.success
          ? {
              id: singleEvent.data.data?.id,
              title: singleEvent.data.data?.title,
              visibility: singleEvent.data.data?.visibility,
            }
          : null,
        error: singleEvent.error,
      },
    );
  }

  // Step 8: Update Event
  if (createdEventIds.length > 0) {
    const updateData = {
      title: "Science Fair 2026 - UPDATED",
      visibility: "DEPARTMENT",
      status: "COMPLETED",
    };
    const updated = await apiCall(
      "PUT",
      `/administration/calendar-events/${createdEventIds[0]}`,
      updateData,
    );
    logTest("Update Event", updated.success && updated.status === 200, {
      endpoint: `PUT /administration/calendar-events/${createdEventIds[0]}`,
      data: updated.success
        ? {
            title: updated.data.data?.title,
            visibility: updated.data.data?.visibility,
            status: updated.data.data?.status,
          }
        : null,
      error: updated.error,
    });
  }

  // Step 9: Get Upcoming Events
  const upcoming = await apiCall(
    "GET",
    "/administration/calendar-events/upcoming",
    null,
    { days: 90, limit: 10 },
  );
  logTest(
    "Get Upcoming Events (90 days)",
    upcoming.success && upcoming.status === 200,
    {
      endpoint: "GET /administration/calendar-events/upcoming?days=90&limit=10",
      data: upcoming.success
        ? { count: upcoming.data.data?.length || 0 }
        : null,
      error: upcoming.error,
    },
  );

  // Step 10: Get Events by Date Range
  const dateRange = await apiCall(
    "GET",
    "/administration/calendar-events/date-range",
    null,
    {
      startDate: "2026-03-01",
      endDate: "2026-06-30",
    },
  );
  logTest(
    "Get Events by Date Range",
    dateRange.success && dateRange.status === 200,
    {
      endpoint:
        "GET /administration/calendar-events/date-range?startDate=2026-03-01&endDate=2026-06-30",
      data: dateRange.success
        ? { count: dateRange.data.data?.length || 0 }
        : null,
      error: dateRange.error,
    },
  );

  // Step 11: Delete Event (Soft Delete)
  if (createdEventIds.length > 1) {
    const deleted = await apiCall(
      "DELETE",
      `/administration/calendar-events/${createdEventIds[1]}`,
    );
    logTest(
      "Delete Event (Soft Delete)",
      deleted.success && deleted.status === 200,
      {
        endpoint: `DELETE /administration/calendar-events/${createdEventIds[1]}`,
        data: deleted.success ? { message: "Event soft deleted" } : null,
        error: deleted.error,
      },
    );
  }

  // Step 12: Validation Tests
  console.log("\n========================================");
  console.log("STEP 4: VALIDATION TESTS");
  console.log("========================================");

  const invalidEvent1 = await apiCall(
    "POST",
    "/administration/calendar-events",
    {
      description: "Missing title",
      startDate: "2026-07-01",
      category: "ACADEMIC",
      eventType: "PUBLIC",
    },
  );
  logTest(
    "Validation: Missing Required Field (title)",
    !invalidEvent1.success && invalidEvent1.status === 400,
    {
      endpoint: "POST /administration/calendar-events",
      expectedError: "Should fail with 400",
      error: invalidEvent1.error,
    },
  );

  const invalidEvent2 = await apiCall(
    "POST",
    "/administration/calendar-events",
    {
      title: "Invalid Multi-day Event",
      startDate: "2026-07-01",
      isMultiDay: true,
      category: "ACADEMIC",
      eventType: "PUBLIC",
    },
  );
  logTest(
    "Validation: Multi-day without End Date",
    !invalidEvent2.success && invalidEvent2.status === 400,
    {
      endpoint: "POST /administration/calendar-events",
      expectedError: "Should fail with 400",
      error: invalidEvent2.error,
    },
  );

  // Print Summary
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║          TEST SUMMARY                  ║");
  console.log("╚════════════════════════════════════════╝");

  const passed = testResults.filter((r) => r.status.includes("PASS")).length;
  const failed = testResults.filter((r) => r.status.includes("FAIL")).length;
  const total = testResults.length;

  console.log(`\nTotal Tests: ${total}`);
  console.log(`Passed: ${passed} ✅`);
  console.log(`Failed: ${failed} ❌`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(2)}%\n`);

  // Save results
  const fs = require("fs");
  fs.writeFileSync(
    "calendar-event-test-results.json",
    JSON.stringify(
      {
        summary: {
          total,
          passed,
          failed,
          successRate: ((passed / total) * 100).toFixed(2) + "%",
        },
        results: testResults,
        createdEventIds,
        timestamp: new Date().toISOString(),
      },
      null,
      2,
    ),
  );

  console.log(
    "📄 Full test results saved to: calendar-event-test-results.json\n",
  );
}

// Execute tests
runTests().catch((error) => {
  console.error("\n❌ Test execution failed:", error);
  process.exit(1);
});
