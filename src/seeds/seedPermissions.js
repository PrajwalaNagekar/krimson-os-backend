import Permission from "../modules/access-control/models/PermissionSchema.js";

/**
 * GLOBAL PERMISSION CATALOG – FINAL (Phase 1)
 * Backend RBAC (API-level, not UI-level)
 */
export const PERMISSIONS = [
  /* ───────── AUTH & IDENTITY ───────── */
  { key: "AUTH:LOGIN", resource: "AUTH", action: "READ" },

  /* ───────── USER & ROLE MANAGEMENT ───────── */
  { key: "USER:READ_SELF", resource: "USER", action: "READ" },
  { key: "USER:UPDATE_SELF", resource: "USER", action: "UPDATE" },

  {
    key: "USER:CREATE",
    resource: "USER",
    action: "CREATE",
    is_sensitive: true,
  },
  { key: "USER:READ", resource: "USER", action: "READ", is_sensitive: true },
  {
    key: "USER:UPDATE",
    resource: "USER",
    action: "UPDATE",
    is_sensitive: true,
  },
  {
    key: "USER:DELETE",
    resource: "USER",
    action: "DELETE",
    is_sensitive: true,
  },

  { key: "ROLE:READ", resource: "ROLE", action: "READ" },
  {
    key: "ROLE:ASSIGN",
    resource: "ROLE",
    action: "UPDATE",
    is_sensitive: true,
  },

  /* ───────── SYSTEM & AUDIT ───────── */
  { key: "SYSTEM:READ", resource: "SYSTEM", action: "READ" },
  {
    key: "SYSTEM:UPDATE",
    resource: "SYSTEM",
    action: "UPDATE",
    is_sensitive: true,
  },

  { key: "AUDIT:READ", resource: "AUDIT", action: "READ", is_sensitive: true },
  {
    key: "AUDIT:EXPORT",
    resource: "AUDIT",
    action: "EXPORT",
    is_sensitive: true,
  },

  /* ───────── ACADEMICS ───────── */
  { key: "LESSON:CREATE", resource: "LESSON", action: "CREATE" },
  { key: "LESSON:READ", resource: "LESSON", action: "READ" },
  {
    key: "LESSON:APPROVE",
    resource: "LESSON",
    action: "APPROVE",
    is_sensitive: true,
  },

  { key: "ATTENDANCE:MARK", resource: "ATTENDANCE", action: "UPDATE" },
  { key: "ATTENDANCE:READ", resource: "ATTENDANCE", action: "READ" },

  { key: "ASSIGNMENT:CREATE", resource: "ASSIGNMENT", action: "CREATE" },
  { key: "ASSIGNMENT:SUBMIT", resource: "ASSIGNMENT", action: "CREATE" },
  { key: "ASSIGNMENT:GRADE", resource: "ASSIGNMENT", action: "UPDATE" },

  { key: "EXAM:CREATE", resource: "EXAM", action: "CREATE" },
  { key: "EXAM:EVALUATE", resource: "EXAM", action: "UPDATE" },
  {
    key: "EXAM:APPROVE",
    resource: "EXAM",
    action: "APPROVE",
    is_sensitive: true,
  },

  {
    key: "REPORTCARD:READ",
    resource: "REPORTCARD",
    action: "READ",
    is_sensitive: true,
  },
  {
    key: "REPORTCARD:GENERATE",
    resource: "REPORTCARD",
    action: "EXPORT",
    is_sensitive: true,
  },

  /* ───────── STUDENT & ADMISSIONS ───────── */
  {
    key: "STUDENT:CREATE",
    resource: "STUDENT",
    action: "CREATE",
    is_sensitive: true,
  },
  {
    key: "STUDENT:UPDATE",
    resource: "STUDENT",
    action: "UPDATE",
    is_sensitive: true,
  },
  { key: "STUDENT:READ_SELF", resource: "STUDENT", action: "READ" },
  { key: "STUDENT:READ_CLASS", resource: "STUDENT", action: "READ" },
  {
    key: "STUDENT:READ_ALL",
    resource: "STUDENT",
    action: "READ",
    is_sensitive: true,
  },

  {
    key: "ADMISSION:CREATE",
    resource: "ADMISSION",
    action: "CREATE",
    is_sensitive: true,
  },
  {
    key: "ADMISSION:UPDATE",
    resource: "ADMISSION",
    action: "UPDATE",
    is_sensitive: true,
  },

  /* ───────── FINANCE ───────── */
  { key: "FEE:READ", resource: "FEE", action: "READ", is_sensitive: true },
  { key: "FEE:CREATE", resource: "FEE", action: "CREATE", is_sensitive: true },
  {
    key: "FEE:RECONCILE",
    resource: "FEE",
    action: "UPDATE",
    is_sensitive: true,
  },
  {
    key: "PAYMENT:PROCESS",
    resource: "PAYMENT",
    action: "CREATE",
    is_sensitive: true,
  },

  /* ───────── COUNSELING / WELLBEING ───────── */
  {
    key: "CASE:CREATE",
    resource: "COUNSELING",
    action: "CREATE",
    is_sensitive: true,
  },
  {
    key: "CASE:READ",
    resource: "COUNSELING",
    action: "READ",
    is_sensitive: true,
  },
  {
    key: "CASE:UPDATE",
    resource: "COUNSELING",
    action: "UPDATE",
    is_sensitive: true,
  },

  /* ───────── LIBRARY ───────── */
  { key: "LIBRARY:CREATE", resource: "LIBRARY", action: "CREATE" },
  { key: "LIBRARY:UPDATE", resource: "LIBRARY", action: "UPDATE" },
  { key: "LIBRARY:ISSUE", resource: "LIBRARY", action: "UPDATE" },
  { key: "LIBRARY:RETURN", resource: "LIBRARY", action: "UPDATE" },

  /* ───────── COMMUNICATION & COMPLIANCE ───────── */
  { key: "MESSAGE:SEND", resource: "MESSAGE", action: "CREATE" },
  { key: "MESSAGE:READ", resource: "MESSAGE", action: "READ" },

  { key: "ANNOUNCEMENT:CREATE", resource: "ANNOUNCEMENT", action: "CREATE" },
  { key: "ANNOUNCEMENT:READ", resource: "ANNOUNCEMENT", action: "READ" },

  {
    key: "COMPLIANCE:READ",
    resource: "COMPLIANCE",
    action: "READ",
    is_sensitive: true,
  },
];

export const seedPermissions = async () => {
  await Permission.bulkWrite(
    PERMISSIONS.map((p) => ({
      updateOne: {
        filter: { key: p.key },
        update: { $set: p },
        upsert: true,
      },
    }))
  );

  console.log("✅ Permissions seeded (FINAL – Phase 1)");
};
