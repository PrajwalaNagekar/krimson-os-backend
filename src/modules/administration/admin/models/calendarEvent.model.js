import mongoose from "mongoose";

/**
 * Calendar Event Schema
 * Production-Level Implementation for Google Calendar Integration
 *
 * Features:
 * - Multi-day event support
 * - Department-based event management
 * - Event categorization and typing
 * - Location tracking
 * - Status management (for approval workflows)
 * - Google Calendar synchronization ready
 * - Audit tracking
 * - Soft delete support
 *
 * Google Calendar Integration Notes:
 * - Use `googleCalendarId` field to store the Google Calendar event ID
 * - `googleCalendarSyncStatus` tracks sync state (pending, synced, failed)
 * - `googleCalendarSyncedAt` records last successful sync timestamp
 */

const calendarEventSchema = new mongoose.Schema(
  {
    /**
     * Event Title
     */
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
      index: true,
    },

    /**
     * Event Description
     */
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    /**
     * Event Start Date
     * For all-day events, time will be ignored
     */
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      index: true,
    },

    /**
     * Event Time
     * Stored as string in HH:MM format (24-hour)
     * Example: "09:30", "14:00"
     */
    time: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          // Allow empty or valid HH:MM format
          if (!v) return true;
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: "Time must be in HH:MM format (24-hour)",
      },
    },

    /**
     * Multi-Day Event Flag
     * If true, event spans multiple days
     */
    isMultiDay: {
      type: Boolean,
      default: false,
    },

    /**
     * End Date (for multi-day events)
     * Optional: only required if isMultiDay is true
     * Validation is handled in pre-save middleware
     */
    endDate: {
      type: Date,
    },

    /**
     * Event Location
     */
    location: {
      type: String,
      trim: true,
      maxlength: [300, "Location cannot exceed 300 characters"],
    },

    /**
     * Event Category
     * Example: Academic, Sports, Cultural, Administrative, Holiday
     */
    category: {
      type: String,
      required: [true, "Event category is required"],
      enum: {
        values: [
          "ACADEMIC",
          "SPORTS",
          "CULTURAL",
          "ADMINISTRATIVE",
          "HOLIDAY",
          "MEETING",
          "EXAMINATION",
          "PARENT_TEACHER",
          "WORKSHOP",
          "OTHER",
        ],
        message: "{VALUE} is not a valid category",
      },
      index: true,
    },

    /**
     * Event Type
     * Example: Public, Private, Department-Only
     */
    eventType: {
      type: String,
      required: [true, "Event type is required"],
      enum: {
        values: [
          "PUBLIC",
          "PRIVATE",
          "DEPARTMENT",
          "STAFF_ONLY",
          "STUDENT_ONLY",
        ],
        message: "{VALUE} is not a valid event type",
      },
      default: "PUBLIC",
      index: true,
    },

    /**
     * Event Visibility
     * Controls who can view this event
     */
    visibility: {
      type: String,
      enum: {
        values: [
          "PRIVATE", // Only owner
          "SELECTED_USERS", // Specific members
          "ROLE_BASED", // All students / parents / staff
          "DEPARTMENT", // Specific department
          "PUBLIC", // Everyone
        ],
        message: "{VALUE} is not a valid visibility type",
      },
      default: "PRIVATE",
      index: true,
    },

    /**
     * Department Reference
     * Optional: Associates event with a specific department
     */
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
      index: true,
    },

    /**
     * Event Status
     * Supports approval workflow
     */
    status: {
      type: String,
      enum: {
        values: ["DRAFT", "PENDING", "APPROVED", "CANCELLED", "COMPLETED"],
        message: "{VALUE} is not a valid status",
      },
      default: "PENDING",
      index: true,
    },

    /**
     * Google Calendar Integration Fields
     */
    googleCalendarId: {
      type: String,
      trim: true,
      sparse: true, // Allows multiple null values
      index: true,
    },

    googleCalendarSyncStatus: {
      type: String,
      enum: ["NOT_SYNCED", "PENDING", "SYNCED", "FAILED"],
      default: "NOT_SYNCED",
    },

    googleCalendarSyncedAt: {
      type: Date,
      default: null,
    },

    googleCalendarError: {
      type: String,
      trim: true,
    },

    /**
     * Recurrence Rule (for recurring events)
     * Stores iCalendar RRULE format
     * Example: "FREQ=WEEKLY;BYDAY=MO,WE,FR"
     */
    recurrenceRule: {
      type: String,
      trim: true,
    },

    /**
     * Attendees/Participants
     * Array of user references who will attend the event
     */
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    /**
     * Reminder Settings
     * Minutes before event to send reminder
     */
    reminderMinutes: {
      type: Number,
      min: 0,
      default: 30, // Default 30 minutes before
    },

    /**
     * Audit Fields
     */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
      index: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /**
     * Soft Delete Timestamp
     */
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

/* =========================================================
   INDEXES (Enterprise Optimized)
========================================================= */

/**
 * Compound index for date range queries
 * Useful for calendar views and event listings
 */
calendarEventSchema.index({ startDate: 1, endDate: 1 });

/**
 * Compound index for department-specific queries
 */
calendarEventSchema.index({ departmentId: 1, startDate: 1 });

/**
 * Compound index for category and status filtering
 */
calendarEventSchema.index({ category: 1, status: 1 });

/**
 * Text index for search functionality
 */
calendarEventSchema.index({
  title: "text",
  description: "text",
  location: "text",
});

/* =========================================================
   MIDDLEWARE
========================================================= */

/**
 * Pre-save middleware
 * - Set endDate if not provided for single-day events
 * - Validate multi-day event requirements
 * Modern Mongoose 6+ pattern: async function without next parameter
 */
calendarEventSchema.pre("save", async function () {
  // If not multi-day and no endDate set, make endDate same as startDate
  if (!this.isMultiDay && !this.endDate) {
    this.endDate = this.startDate;
  }

  // Validate multi-day events have endDate
  if (this.isMultiDay && !this.endDate) {
    throw new Error("Multi-day events must have an end date");
  }
});

/**
 * Automatically exclude soft-deleted records from queries
 * Apply to all query methods
 */
calendarEventSchema.pre("find", function () {
  this.where({ deletedAt: null });
});

calendarEventSchema.pre("findOne", function () {
  this.where({ deletedAt: null });
});

calendarEventSchema.pre("findOneAndUpdate", function () {
  this.where({ deletedAt: null });
});

calendarEventSchema.pre("count", function () {
  this.where({ deletedAt: null });
});

calendarEventSchema.pre("countDocuments", function () {
  this.where({ deletedAt: null });
});

/* =========================================================
   VIRTUAL FIELDS
========================================================= */

/**
 * Virtual: Duration in days
 */
calendarEventSchema.virtual("durationDays").get(function () {
  if (!this.endDate || !this.startDate) return 1;
  const diffTime = Math.abs(this.endDate - this.startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Include both start and end day
});

/**
 * Virtual: Is event in the past
 */
calendarEventSchema.virtual("isPast").get(function () {
  const now = new Date();
  return this.endDate ? this.endDate < now : this.startDate < now;
});

/**
 * Virtual: Is event today
 */
calendarEventSchema.virtual("isToday").get(function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return this.startDate >= today && this.startDate < tomorrow;
});

/**
 * Virtual: Is Google Calendar synced
 */
calendarEventSchema.virtual("isSynced").get(function () {
  return this.googleCalendarSyncStatus === "SYNCED" && this.googleCalendarId;
});

/* =========================================================
   STATIC METHODS
========================================================= */

/**
 * Get events for a specific date range
 */
calendarEventSchema.statics.getEventsByDateRange = function (
  startDate,
  endDate,
) {
  return this.find({
    $or: [
      { startDate: { $gte: startDate, $lte: endDate } },
      { endDate: { $gte: startDate, $lte: endDate } },
      {
        startDate: { $lte: startDate },
        endDate: { $gte: endDate },
      },
    ],
  }).sort({ startDate: 1 });
};

/**
 * Get upcoming events (next N days)
 */
calendarEventSchema.statics.getUpcomingEvents = function (
  days = 7,
  limit = 10,
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const futureDate = new Date(today);
  futureDate.setDate(futureDate.getDate() + days);

  return this.find({
    startDate: { $gte: today, $lte: futureDate },
    status: { $in: ["APPROVED", "PENDING"] },
  })
    .sort({ startDate: 1 })
    .limit(limit);
};

/**
 * Get events by department
 */
calendarEventSchema.statics.getEventsByDepartment = function (departmentId) {
  return this.find({ departmentId }).sort({ startDate: -1 });
};

/**
 * Get events requiring sync with Google Calendar
 */
calendarEventSchema.statics.getPendingSyncEvents = function () {
  return this.find({
    googleCalendarSyncStatus: { $in: ["NOT_SYNCED", "PENDING", "FAILED"] },
    status: "APPROVED",
  });
};

/* =========================================================
   INSTANCE METHODS
========================================================= */

/**
 * Mark event as synced with Google Calendar
 */
calendarEventSchema.methods.markSynced = function (googleCalendarId) {
  this.googleCalendarId = googleCalendarId;
  this.googleCalendarSyncStatus = "SYNCED";
  this.googleCalendarSyncedAt = new Date();
  this.googleCalendarError = undefined;
  return this.save();
};

/**
 * Mark sync as failed
 */
calendarEventSchema.methods.markSyncFailed = function (errorMessage) {
  this.googleCalendarSyncStatus = "FAILED";
  this.googleCalendarError = errorMessage;
  return this.save();
};

/**
 * Soft delete the event
 */
calendarEventSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  return this.save();
};

/**
 * Restore soft-deleted event
 */
calendarEventSchema.methods.restore = function () {
  this.deletedAt = null;
  return this.save();
};

/* =========================================================
   EXPORT MODEL
========================================================= */

export default mongoose.models.CalendarEvent ||
  mongoose.model("CalendarEvent", calendarEventSchema);
