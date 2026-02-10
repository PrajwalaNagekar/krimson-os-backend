import User from "../../modules/identity/models/UserSchema.js";
import Student from "../../modules/academics/student/models/StudentSchema.js";
import Teacher from "../../modules/academics/teacher/models/TeacherSchema.js";
import { HTTP_STATUS } from "../../utils/constants.js";

/**
 * Analytics Controller
 * Provides dashboard statistics and KPIs
 * READ-ONLY - No writes to domain databases
 */

/**
 * @desc    Get Admin Dashboard Statistics
 * @route   GET /api/v1/analytics/dashboard-stats
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    // 1. User Stats (Real Data)
    const totalUsers = await User.countDocuments();
    const studentCount = await User.countDocuments({ active_role: "Student" });
    const parentCount = await User.countDocuments({ active_role: "Parent" });

    // Staff includes: Teacher, Principal, Admin, IT Admin, Finance Officer, etc.
    const staffCount = await User.countDocuments({
      active_role: {
        $nin: ["Student", "Parent"],
      },
    });

    // 2. Attendance Stats (Real Data Proxies)
    const totalStudents = studentCount;
    const activeStudents = await Student.countDocuments({
      enrollment_status: "active",
    });
    const studentAttendance =
      totalStudents > 0
        ? Math.round((activeStudents / totalStudents) * 100)
        : 0;

    // Calculate Staff "Activity" (Login within last 24h)
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const yesterday = new Date(Date.now() - ONE_DAY);

    const activeStaffCount = await User.countDocuments({
      active_role: { $nin: ["Student", "Parent"] },
      last_login_at: { $gte: yesterday },
    });

    const staffAttendance =
      staffCount > 0 ? Math.round((activeStaffCount / staffCount) * 100) : 0;

    const attendanceStats = {
      students: studentAttendance,
      staff: staffAttendance,
    };

    // 3. Finance Stats (derived from Student Wallets)
    const financeAgg = await Student.aggregate([
      {
        $group: {
          _id: null,
          totalBalance: { $sum: "$wallet_balance" },
        },
      },
    ]);

    const totalCollected =
      financeAgg.length > 0 ? financeAgg[0].totalBalance : 0;

    const pendingAdmissions = await Student.countDocuments({
      enrollment_status: { $in: ["inquiry", "applied"] },
    });
    const estimatedDue = pendingAdmissions * 5000;

    const financeStats = {
      collected: totalCollected,
      due: estimatedDue,
    };

    // 4. Alerts (Dynamic Generation)
    const alerts = [];

    if (pendingAdmissions > 0) {
      alerts.push({
        id: 1,
        text: `${pendingAdmissions} New Admission Inquirie(s)`,
        type: "Urgent",
      });
    }

    const suspendedUsers = await User.countDocuments({ status: "suspended" });
    if (suspendedUsers > 0) {
      alerts.push({
        id: 2,
        text: `${suspendedUsers} Suspended User Account(s)`,
        type: "Urgent",
      });
    }

    if (staffAttendance < 50 && staffCount > 0) {
      alerts.push({
        id: 3,
        text: "Low Staff System Activity (<50%)",
        type: "Warning",
      });
    }

    alerts.push({
      id: 4,
      text: "System Operational",
      type: "Info",
    });

    // Response
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          students: studentCount,
          staff: staffCount,
        },
        attendance: attendanceStats,
        finance: financeStats,
        alerts: alerts,
      },
    });
  } catch (error) {
    next(error);
  }
};
