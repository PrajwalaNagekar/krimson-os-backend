import { calendarEventRepository } from "../repositories/calendarEvent.repository.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";
import AppError from "../../../../core/errors/app.error.js";

/**
 * Calendar Event Service
 *
 * Business logic layer for Calendar Event operations.
 * Function-based pattern for consistency.
 * Handles validation, error handling, and orchestrates repository operations.
 */

/**
 * Create a new calendar event
 * @param {Object} data - Calendar event data
 * @param {String} createdBy - ID of user creating the event
 * @returns {Promise<CalendarEvent>}
 * @throws {AppError} If validation fails
 */
const createCalendarEvent = async (data, createdBy) => {
  // Add createdBy to the data
  const eventData = {
    ...data,
    createdBy,
  };

  try {
    const event = await calendarEventRepository.createCalendarEvent(eventData);
    return event;
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      throw new AppError(messages.join(", "), HTTP_STATUS.BAD_REQUEST);
    }
    throw error;
  }
};

/**
 * Get all calendar events with pagination and filters
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Object>} - Paginated events with metadata
 */
const getAllCalendarEvents = async (page = 1, limit = 10, filters = {}) => {
  // Get events from repository with pagination
  const { events, total } = await calendarEventRepository.getAllCalendarEvents(
    filters,
    page,
    limit,
  );

  // Calculate total pages
  const totalPages = Math.ceil(total / limit);

  return {
    events,
    total,
    page,
    limit,
    totalPages,
  };
};

/**
 * Get calendar event by ID
 * @param {String} id - Calendar event ID
 * @returns {Promise<CalendarEvent>}
 * @throws {AppError} If event not found
 */
const getCalendarEventById = async (id) => {
  const event = await calendarEventRepository.getCalendarEventById(id);

  if (!event) {
    throw new AppError("Calendar event not found", HTTP_STATUS.NOT_FOUND);
  }

  return event;
};

/**
 * Get events by date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Array>}
 */
const getEventsByDateRange = async (startDate, endDate) => {
  return await calendarEventRepository.getEventsByDateRange(startDate, endDate);
};

/**
 * Get upcoming events
 * @param {Number} days - Number of days to look ahead
 * @param {Number} limit - Maximum number of events
 * @returns {Promise<Array>}
 */
const getUpcomingEvents = async (days = 7, limit = 10) => {
  return await calendarEventRepository.getUpcomingEvents(days, limit);
};

/**
 * Get events by department
 * @param {String} departmentId - Department ID
 * @returns {Promise<Array>}
 */
const getEventsByDepartment = async (departmentId) => {
  return await calendarEventRepository.getEventsByDepartment(departmentId);
};

/**
 * Update a calendar event
 * @param {String} id - Calendar event ID
 * @param {Object} data - Updated data
 * @param {String} updatedBy - ID of user updating the event
 * @returns {Promise<CalendarEvent>}
 * @throws {AppError} If event not found or validation fails
 */
const updateCalendarEvent = async (id, data, updatedBy) => {
  const updateData = {
    ...data,
    updatedBy,
  };

  try {
    const event = await calendarEventRepository.updateCalendarEvent(
      id,
      updateData,
    );

    if (!event) {
      throw new AppError("Calendar event not found", HTTP_STATUS.NOT_FOUND);
    }

    return event;
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      throw new AppError(messages.join(", "), HTTP_STATUS.BAD_REQUEST);
    }
    throw error;
  }
};

/**
 * Soft delete a calendar event
 * @param {String} id - Calendar event ID
 * @returns {Promise<CalendarEvent>}
 * @throws {AppError} If event not found
 */
const deleteCalendarEvent = async (id) => {
  const event = await calendarEventRepository.deleteCalendarEvent(id);

  if (!event) {
    throw new AppError("Calendar event not found", HTTP_STATUS.NOT_FOUND);
  }

  return event;
};

/**
 * Get events requiring Google Calendar sync
 * @returns {Promise<Array>}
 */
const getPendingSyncEvents = async () => {
  return await calendarEventRepository.getPendingSyncEvents();
};

/**
 * Mark event as synced with Google Calendar
 * @param {String} id - Event ID
 * @param {String} googleCalendarId - Google Calendar event ID
 * @returns {Promise<CalendarEvent>}
 * @throws {AppError} If event not found
 */
const markEventSynced = async (id, googleCalendarId) => {
  const event = await calendarEventRepository.markEventSynced(
    id,
    googleCalendarId,
  );

  if (!event) {
    throw new AppError("Calendar event not found", HTTP_STATUS.NOT_FOUND);
  }

  return event;
};

/**
 * Mark event sync as failed
 * @param {String} id - Event ID
 * @param {String} errorMessage - Error message
 * @returns {Promise<CalendarEvent>}
 * @throws {AppError} If event not found
 */
const markEventSyncFailed = async (id, errorMessage) => {
  const event = await calendarEventRepository.markEventSyncFailed(
    id,
    errorMessage,
  );

  if (!event) {
    throw new AppError("Calendar event not found", HTTP_STATUS.NOT_FOUND);
  }

  return event;
};

// Export all service functions as a single object
export const calendarEventService = {
  createCalendarEvent,
  getAllCalendarEvents,
  getCalendarEventById,
  getEventsByDateRange,
  getUpcomingEvents,
  getEventsByDepartment,
  updateCalendarEvent,
  deleteCalendarEvent,
  getPendingSyncEvents,
  markEventSynced,
  markEventSyncFailed,
};
