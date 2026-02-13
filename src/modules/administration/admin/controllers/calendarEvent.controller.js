import { calendarEventService } from "../services/calendarEvent.service.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";
import { ApiResponse } from "../../../../utils/ApiReponse.js";

/**
 * Calendar Event Controller
 *
 * Handles HTTP requests for calendar event management.
 * All operations require appropriate role permissions (enforced in routes).
 *
 * Endpoints:
 * - POST /api/v1/administration/calendar-events - Create event
 * - GET /api/v1/administration/calendar-events - Get all events (with pagination/filters)
 * - GET /api/v1/administration/calendar-events/:id - Get event by ID
 * - PUT /api/v1/administration/calendar-events/:id - Update event
 * - DELETE /api/v1/administration/calendar-events/:id - Delete event (soft delete)
 * - GET /api/v1/administration/calendar-events/upcoming - Get upcoming events
 * - GET /api/v1/administration/calendar-events/date-range - Get events by date range
 * - GET /api/v1/administration/calendar-events/department/:departmentId - Get events by department
 */

/**
 * Create a new calendar event
 * POST /api/v1/administration/calendar-events
 *
 * Request Body:
 * {
 *   title: String (required) - Event title
 *   description: String (optional) - Event description
 *   startDate: Date (required) - Event start date
 *   time: String (optional) - Event time in HH:MM format
 *   isMultiDay: Boolean (optional) - Is multi-day event
 *   endDate: Date (optional) - Event end date (required if isMultiDay is true)
 *   location: String (optional) - Event location
 *   category: String (required) - Event category
 *   eventType: String (required) - Event type
 *   departmentId: String (optional) - Department reference
 *   status: String (optional) - Event status
 *   attendees: Array (optional) - Array of user IDs
 *   reminderMinutes: Number (optional) - Reminder time in minutes
 *   recurrenceRule: String (optional) - Recurrence rule in iCalendar format
 * }
 */
export const createCalendarEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      startDate,
      time,
      isMultiDay,
      endDate,
      location,
      category,
      eventType,
      visibility,
      departmentId,
      status,
      attendees,
      reminderMinutes,
      recurrenceRule,
    } = req.body;
    const createdBy = req.user?._id; // Get logged-in user ID from auth middleware

    // Validate required fields
    if (!title) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          new ApiResponse(
            HTTP_STATUS.BAD_REQUEST,
            null,
            "Event title is required",
          ),
        );
    }

    if (!startDate) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          new ApiResponse(
            HTTP_STATUS.BAD_REQUEST,
            null,
            "Event start date is required",
          ),
        );
    }

    if (!category) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          new ApiResponse(
            HTTP_STATUS.BAD_REQUEST,
            null,
            "Event category is required",
          ),
        );
    }

    if (!eventType) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          new ApiResponse(
            HTTP_STATUS.BAD_REQUEST,
            null,
            "Event type is required",
          ),
        );
    }

    // Validate multi-day event
    if (isMultiDay && !endDate) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          new ApiResponse(
            HTTP_STATUS.BAD_REQUEST,
            null,
            "End date is required for multi-day events",
          ),
        );
    }

    // Create event
    const event = await calendarEventService.createCalendarEvent(
      {
        title,
        description,
        startDate,
        time,
        isMultiDay,
        endDate,
        location,
        category,
        eventType,
        visibility,
        departmentId,
        status,
        attendees,
        reminderMinutes,
        recurrenceRule,
      },
      createdBy,
    );

    return res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          event,
          "Calendar event created successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all calendar events with pagination and filters
 * GET /api/v1/administration/calendar-events
 *
 * Query Parameters:
 * - page: Number (default: 1) - Page number for pagination
 * - limit: Number (default: 10) - Items per page
 * - search: String (optional) - Search in title, description, location
 * - category: String (optional) - Filter by category
 * - eventType: String (optional) - Filter by event type
 * - status: String (optional) - Filter by status
 * - departmentId: String (optional) - Filter by department
 * - startDate: Date (optional) - Filter by start date
 * - endDate: Date (optional) - Filter by end date
 *
 * Response: Array of events with pagination metadata
 */
export const getCalendarEvents = async (req, res, next) => {
  try {
    // Extract pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Extract filter parameters
    const filters = {
      search: req.query.search || "",
      category: req.query.category || "",
      eventType: req.query.eventType || "",
      visibility: req.query.visibility || "",
      status: req.query.status || "",
      departmentId: req.query.departmentId || "",
      startDate: req.query.startDate || "",
      endDate: req.query.endDate || "",
    };

    // Get events from service
    const result = await calendarEventService.getAllCalendarEvents(
      page,
      limit,
      filters,
    );

    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        result.events,
        "Calendar events retrieved successfully",
        {
          pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
          },
        },
      ),
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get calendar event by ID
 * GET /api/v1/administration/calendar-events/:id
 */
export const getCalendarEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await calendarEventService.getCalendarEventById(id);

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          event,
          "Calendar event retrieved successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Update a calendar event
 * PUT /api/v1/administration/calendar-events/:id
 *
 * Request Body: Same fields as create (all optional)
 */
export const updateCalendarEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedBy = req.user?._id;

    const event = await calendarEventService.updateCalendarEvent(
      id,
      req.body,
      updatedBy,
    );

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          event,
          "Calendar event updated successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a calendar event (soft delete)
 * DELETE /api/v1/administration/calendar-events/:id
 */
export const deleteCalendarEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    await calendarEventService.deleteCalendarEvent(id);

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          null,
          "Calendar event deleted successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Get upcoming events
 * GET /api/v1/administration/calendar-events/upcoming
 *
 * Query Parameters:
 * - days: Number (default: 7) - Number of days to look ahead
 * - limit: Number (default: 10) - Maximum number of events
 */
export const getUpcomingEvents = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const limit = parseInt(req.query.limit) || 10;

    const events = await calendarEventService.getUpcomingEvents(days, limit);

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          events,
          "Upcoming events retrieved successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Get events by date range
 * GET /api/v1/administration/calendar-events/date-range
 *
 * Query Parameters:
 * - startDate: Date (required) - Start date
 * - endDate: Date (required) - End date
 */
export const getEventsByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          new ApiResponse(
            HTTP_STATUS.BAD_REQUEST,
            null,
            "Start date and end date are required",
          ),
        );
    }

    const events = await calendarEventService.getEventsByDateRange(
      new Date(startDate),
      new Date(endDate),
    );

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          events,
          "Events retrieved successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Get events by department
 * GET /api/v1/administration/calendar-events/department/:departmentId
 */
export const getEventsByDepartment = async (req, res, next) => {
  try {
    const { departmentId } = req.params;

    const events =
      await calendarEventService.getEventsByDepartment(departmentId);

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          events,
          "Department events retrieved successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};
