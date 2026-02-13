import express from "express";

// Base Module Routes
import authRoutes from "../modules/identity/routes/auth.routes.js";

import roleRoutes from "../modules/access-control/routes/role.routes.js";

// // Academics Module Routes
// import studentRoutes from "../modules/academics/student/routes/student.routes.js";
// import teacherRoutes from "../modules/academics/teacher/routes/teacher.routes.js";
// import parentRoutes from "../modules/academics/parent/routes/parent.routes.js";
// import coordinatorRoutes from "../modules/academics/coordinator/routes/coordinator.routes.js";
// import registrarRoutes from "../modules/academics/registrar/routes/registrar.routes.js";

// Administration Module Routes
import adminRoutes from "../modules/administration/admin/routes/admin.routes.js";
import userManagementRoutes from "../modules/administration/admin/routes/userManagement.routes.js";
import departmentRoutes from "../modules/administration/admin/routes/department.routes.js";
import gradeRoutes from "../modules/administration/admin/routes/grade.routes.js";
import calendarEventRoutes from "../modules/administration/admin/routes/calendarEvent.routes.js";
import curriculumRoutes from "../modules/academics/lms/routes/curriculum.routes.js";
// import itAdminRoutes from "../modules/administration/it-admin/routes/itAdmin.routes.js";
// import librarianRoutes from "../modules/administration/librarian/routes/librarian.routes.js";

// Finance Module Routes
// import financeRoutes from "../modules/finance/routes/finance.routes.js";

// Governance Module Routes
// import principalRoutes from "../modules/governance/principal/routes/principal.routes.js";
// import managementRoutes from "../modules/governance/management/routes/management.routes.js";

// Wellbeing Module Routes
// import counselorRoutes from "../modules/wellbeing/routes/counselor.routes.js";

import analyticsRoutes from "../modules/analytics/analytics.routes.js";

const router = express.Router();

/**
 * Central Route Registry
 * Mounts all module routes under /api/v1
 */

// Identity & Access Control
router.use("/auth", authRoutes);

router.use("/access-control", roleRoutes);

// // Academics
// router.use("/academics/students", studentRoutes);
// router.use("/academics/teachers", teacherRoutes);
// router.use("/academics/parents", parentRoutes);
// router.use("/academics/coordinators", coordinatorRoutes);
// router.use("/academics/registrars", registrarRoutes);

// Administration
router.use("/administration/admins", adminRoutes);
router.use("/administration/users", userManagementRoutes);
router.use("/administration/departments", departmentRoutes);
router.use("/administration/grades", gradeRoutes);
router.use("/administration/calendar-events", calendarEventRoutes);
router.use("/administration/curriculum", curriculumRoutes);
// router.use("/administration/it-admins", itAdminRoutes);
// router.use("/administration/librarians", librarianRoutes);

// // Finance
// router.use("/finance", financeRoutes);

// // Governance
// router.use("/governance/principals", principalRoutes);
// router.use("/governance/management", managementRoutes);

// // Wellbeing
// router.use("/wellbeing/counselors", counselorRoutes);

// Analytics
router.use("/analytics", analyticsRoutes);

export default router;
