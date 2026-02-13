import CalendarEvent from "../models/calendarEvent.model.js";

/**
 * Calendar Event Repository
 *
 * Data access layer for Calendar Event model.
 * Function-based pattern for consistency across the codebase.
 * Handles all database operations for calendar events.
 *
 * IMPORTANT: The schema includes auto-filtering middleware that
 * automatically excludes soft-deleted records (deletedAt: null) in all find queries.
 */

/**
 * Create a new calendar event
 * @param {Object} data - Calendar event data
 * @returns {Promise<CalendarEvent>}
 */
const createCalendarEvent = async (data) => {
  const event = await CalendarEvent.create(data);
  // Return populated document
  return await getCalendarEventById(event._id);
};

/**
 * Get all calendar events with pagination and search
 * @param {Object} filters - Filter criteria (search, category, eventType, status, startDate, endDate, departmentId)
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @returns {Promise<{events: Array, total: Number}>}
 */
const getAllCalendarEvents = async (filters = {}, page = 1, limit = 10) => {
  const query = {};
  // Note: deletedAt filtering is handled automatically by schema middleware

  // Search filter - searches in title, description, and location
  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  // Category filter
  if (filters.category) {
    query.category = filters.category;
  }

  // Event type filter
  if (filters.eventType) {
    query.eventType = filters.eventType;
  }

  // Visibility filter
  if (filters.visibility) {
    query.visibility = filters.visibility;
  }

  // Status filter
  if (filters.status) {
    query.status = filters.status;
  }

  // Department filter
  if (filters.departmentId) {
    query.departmentId = filters.departmentId;
  }

  // Date range filter
  if (filters.startDate || filters.endDate) {
    const startDate = filters.startDate
      ? new Date(filters.startDate)
      : new Date();
    const endDate = filters.endDate
      ? new Date(filters.endDate)
      : new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000);

    query.$or = [
      { startDate: { $gte: startDate, $lte: endDate } },
      { endDate: { $gte: startDate, $lte: endDate } },
      {
        startDate: { $lte: startDate },
        endDate: { $gte: endDate },
      },
    ];
  }

  // Calculate skip value for pagination
  const skip = (page - 1) * limit;

  // Execute query with pagination
  const events = await CalendarEvent.find(query)
    .populate("createdBy", "full_name email")
    .populate("updatedBy", "full_name email")
    .populate("departmentId", "name code")
    .populate("attendees", "full_name email role")
    .sort({ startDate: 1 }) // Sort by start date
    .skip(skip)
    .limit(limit);

  // Get total count for pagination
  const total = await CalendarEvent.countDocuments(query);

  return { events, total };
};

/**
 * Get calendar event by ID
 * @param {String} id - Calendar event ID
 * @returns {Promise<CalendarEvent>}
 */
const getCalendarEventById = async (id) => {
  return await CalendarEvent.findById(id)
    .populate("createdBy", "full_name email")
    .populate("updatedBy", "full_name email")
    .populate("departmentId", "name code")
    .populate("attendees", "full_name email role");
};

/**
 * Get events by date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Array>}
 */
const getEventsByDateRange = async (startDate, endDate) => {
  return await CalendarEvent.getEventsByDateRange(startDate, endDate)
    .populate("createdBy", "full_name email")
    .populate("departmentId", "name code")
    .populate("attendees", "full_name email role");
};

/**
 * Get upcoming events
 * @param {Number} days - Number of days to look ahead
 * @param {Number} limit - Maximum number of events
 * @returns {Promise<Array>}
 */
const getUpcomingEvents = async (days = 7, limit = 10) => {
  return await CalendarEvent.getUpcomingEvents(days, limit)
    .populate("createdBy", "full_name email")
    .populate("departmentId", "name code")
    .populate("attendees", "full_name email role");
};

/**
 * Get events by department
 * @param {String} departmentId - Department ID
 * @returns {Promise<Array>}
 */
const getEventsByDepartment = async (departmentId) => {
  return await CalendarEvent.getEventsByDepartment(departmentId)
    .populate("createdBy", "full_name email")
    .populate("departmentId", "name code")
    .populate("attendees", "full_name email role");
};

/**
 * Get events requiring Google Calendar sync
 * @returns {Promise<Array>}
 */
const getPendingSyncEvents = async () => {
  return await CalendarEvent.getPendingSyncEvents()
    .populate("createdBy", "full_name email")
    .populate("departmentId", "name code");
};

/**
 * Update a calendar event
 * @param {String} id - Calendar event ID
 * @param {Object} data - Updated data
 * @returns {Promise<CalendarEvent>}
 */
const updateCalendarEvent = async (id, data) => {
  return await CalendarEvent.findByIdAndUpdate(id, data, { new: true })
    .populate("createdBy", "full_name email")
    .populate("updatedBy", "full_name email")
    .populate("departmentId", "name code")
    .populate("attendees", "full_name email role");
};

/**
 * Soft delete a calendar event
 * @param {String} id - Calendar event ID
 * @returns {Promise<CalendarEvent>}
 */
const deleteCalendarEvent = async (id) => {
  return await CalendarEvent.findByIdAndUpdate(
    id,
    { deletedAt: new Date() },
    { new: true },
  );
};

/**
 * Mark event as synced with Google Calendar
 * @param {String} id - Event ID
 * @param {String} googleCalendarId - Google Calendar event ID
 * @returns {Promise<CalendarEvent>}
 */
const markEventSynced = async (id, googleCalendarId) => {
  const event = await CalendarEvent.findById(id);
  if (event) {
    return await event.markSynced(googleCalendarId);
  }
  return null;
};

/**
 * Mark event sync as failed
 * @param {String} id - Event ID
 * @param {String} errorMessage - Error message
 * @returns {Promise<CalendarEvent>}
 */
const markEventSyncFailed = async (id, errorMessage) => {
  const event = await CalendarEvent.findById(id);
  if (event) {
    return await event.markSyncFailed(errorMessage);
  }
  return null;
};

// Export all repository functions as a single object
export const calendarEventRepository = {
  createCalendarEvent,
  getAllCalendarEvents,
  getCalendarEventById,
  getEventsByDateRange,
  getUpcomingEvents,
  getEventsByDepartment,
  getPendingSyncEvents,
  updateCalendarEvent,
  deleteCalendarEvent,
  markEventSynced,
  markEventSyncFailed,
};
