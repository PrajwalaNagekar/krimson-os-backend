import Role from "../modules/access-control/models/RoleSchema.js";
import Permission from "../modules/access-control/models/PermissionSchema.js";

const resolvePermissions = async (keys) =>
  (await Permission.find({ key: { $in: keys } })).map((p) => p._id);

export const ROLE_PERMISSION_MAP = {
  R01: {
    name: "STUDENT",
    permissions: [
      "AUTH:LOGIN",
      "USER:READ_SELF",
      "USER:UPDATE_SELF",
      "STUDENT:READ_SELF",
      "ATTENDANCE:READ",
      "ASSIGNMENT:SUBMIT",
      "LESSON:READ",
      "REPORTCARD:READ",
      "ANNOUNCEMENT:READ",
      "MESSAGE:READ",
    ],
  },

  R02: {
    name: "TEACHER",
    permissions: [
      "AUTH:LOGIN",
      "USER:READ_SELF",
      "USER:UPDATE_SELF",
      "LESSON:CREATE",
      "LESSON:READ",
      "ATTENDANCE:MARK",
      "ASSIGNMENT:CREATE",
      "ASSIGNMENT:GRADE",
      "EXAM:CREATE",
      "EXAM:EVALUATE",
      "STUDENT:READ_CLASS",
      "MESSAGE:SEND",
      "MESSAGE:READ",
      "ANNOUNCEMENT:CREATE",
      "ANNOUNCEMENT:READ",
    ],
  },

  R03: {
    name: "PARENT",
    permissions: [
      "AUTH:LOGIN",
      "USER:READ_SELF",
      "USER:UPDATE_SELF",
      "STUDENT:READ_SELF",
      "ATTENDANCE:READ",
      "FEE:READ",
      "PAYMENT:PROCESS",
      "REPORTCARD:READ",
      "MESSAGE:SEND",
      "MESSAGE:READ",
      "ANNOUNCEMENT:READ",
    ],
  },

  R04: {
    name: "PRINCIPAL",
    permissions: [
      "AUTH:LOGIN",
      "USER:READ_SELF",
      "STUDENT:READ_ALL",
      "LESSON:APPROVE",
      "EXAM:APPROVE",
      "REPORTCARD:GENERATE",
      "AUDIT:READ",
      "AUDIT:EXPORT",
      "COMPLIANCE:READ",
      "ANNOUNCEMENT:CREATE",
      "ANNOUNCEMENT:READ",
    ],
  },

  R05: {
    name: "ADMINISTRATOR",
    permissions: [
      "AUTH:LOGIN",
      "USER:CREATE",
      "USER:READ",
      "USER:UPDATE",
      "USER:DELETE",
      "ROLE:READ",
      "ROLE:ASSIGN",
      "SYSTEM:READ",
      "SYSTEM:UPDATE",
      "AUDIT:READ",
      "AUDIT:EXPORT",
    ],
  },

  R06: {
    name: "FINANCE_OFFICER",
    permissions: [
      "AUTH:LOGIN",
      "USER:READ_SELF",
      "FEE:READ",
      "FEE:CREATE",
      "FEE:RECONCILE",
      "PAYMENT:PROCESS",
      "AUDIT:READ",
    ],
  },

  R07: {
    name: "REGISTRAR",
    permissions: [
      "AUTH:LOGIN",
      "USER:READ_SELF",
      "ADMISSION:CREATE",
      "ADMISSION:UPDATE",
      "STUDENT:CREATE",
      "STUDENT:UPDATE",
      "STUDENT:READ_ALL",
      "COMPLIANCE:READ",
    ],
  },

  R08: {
    name: "MANAGEMENT",
    permissions: [
      "AUTH:LOGIN",
      "AUDIT:READ",
      "AUDIT:EXPORT",
      "FEE:READ",
      "COMPLIANCE:READ",
    ],
  },

  R09: {
    name: "ACADEMIC_COORDINATOR",
    permissions: [
      "AUTH:LOGIN",
      "LESSON:READ",
      "LESSON:APPROVE",
      "EXAM:CREATE",
      "STUDENT:READ_CLASS",
      "REPORTCARD:GENERATE",
    ],
  },

  R10: {
    name: "COUNSELOR",
    permissions: [
      "AUTH:LOGIN",
      "CASE:CREATE",
      "CASE:READ",
      "CASE:UPDATE",
      "STUDENT:READ_CLASS",
    ],
  },

  R11: {
    name: "LIBRARIAN",
    permissions: [
      "AUTH:LOGIN",
      "LIBRARY:CREATE",
      "LIBRARY:UPDATE",
      "LIBRARY:ISSUE",
      "LIBRARY:RETURN",
      "STUDENT:READ_CLASS",
    ],
  },

  R12: {
    name: "IT_ADMIN",
    permissions: ["AUTH:LOGIN", "SYSTEM:READ", "SYSTEM:UPDATE", "AUDIT:READ"],
  },
};

export const seedRoles = async () => {
  for (const [code, role] of Object.entries(ROLE_PERMISSION_MAP)) {
    const permissionIds = await resolvePermissions(role.permissions);

    await Role.findOneAndUpdate(
      { code },
      { code, name: role.name, permissions: permissionIds },
      { upsert: true, new: true }
    );
  }

  console.log("✅ Roles seeded (FINAL – Phase 1)");
};
