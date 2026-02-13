import express from "express";
import {
  createCalendarEvent,
  getCalendarEvents,
  getCalendarEventById,
  updateCalendarEvent,
  deleteCalendarEvent,
  getUpcomingEvents,
  getEventsByDateRange,
  getEventsByDepartment,
} from "../controllers/calendarEvent.controller.js";
import { protect, authorize } from "../../../../core/auth/auth.middleware.js";
import { ROLES } from "../../../../utils/constants.js";

const router = express.Router();

/**
 * Calendar Event Routes for Administration
 *
 * All routes require authentication (protect middleware)
 * Most routes require ADMINISTRATOR role (authorize middleware)
 *
 * Routes:
 * - POST   /api/v1/administration/calendar-events                    - Create event
 * - GET    /api/v1/administration/calendar-events                    - Get all events (with pagination/filters)
 * - GET    /api/v1/administration/calendar-events/upcoming           - Get upcoming events
 * - GET    /api/v1/administration/calendar-events/date-range         - Get events by date range
 * - GET    /api/v1/administration/calendar-events/department/:id     - Get events by department
 * - GET    /api/v1/administration/calendar-events/:id                - Get event by ID
 * - PUT    /api/v1/administration/calendar-events/:id                - Update event
 * - DELETE /api/v1/administration/calendar-events/:id                - Delete event (soft delete)
 */

// Special routes (before :id route to avoid conflicts)
// GET /api/v1/administration/calendar-events/upcoming - Get upcoming events
router.get("/upcoming", protect, getUpcomingEvents);

// GET /api/v1/administration/calendar-events/date-range - Get events by date range
router.get("/date-range", protect, getEventsByDateRange);

// GET /api/v1/administration/calendar-events/department/:departmentId - Get events by department
router.get("/department/:departmentId", protect, getEventsByDepartment);

// POST /api/v1/administration/calendar-events - Create a new calendar event
router.post("/", protect, authorize(ROLES.ADMINISTRATOR), createCalendarEvent);

// GET /api/v1/administration/calendar-events - Get all calendar events with pagination and filters
router.get("/", protect, getCalendarEvents);

// GET /api/v1/administration/calendar-events/:id - Get calendar event by ID
router.get("/:id", protect, getCalendarEventById);

// PUT /api/v1/administration/calendar-events/:id - Update calendar event
router.put(
  "/:id",
  protect,
  authorize(ROLES.ADMINISTRATOR),
  updateCalendarEvent,
);

// DELETE /api/v1/administration/calendar-events/:id - Delete calendar event (soft delete)
router.delete(
  "/:id",
  protect,
  authorize(ROLES.ADMINISTRATOR),
  deleteCalendarEvent,
);

export default router;
