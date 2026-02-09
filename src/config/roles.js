import { PERMISSIONS, ALL_PERMISSIONS } from './permissions.js';

/**
 * Role to Permission Mapping
 * Roles must only contain permissions, not business logic.
 */
export const ROLES = {
    ADMIN: 'ADMIN',
    // HOD: 'HOD',
    TEACHER: 'TEACHER',
    STUDENT: 'STUDENT',
    PARENT: 'PARENT',
};

export const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: [...ALL_PERMISSIONS],

    // [ROLES.HOD]: [
    //     PERMISSIONS.ACADEMICS_VIEW,
    //     PERMISSIONS.ACADEMICS_EDIT,
    //     PERMISSIONS.INCIDENT_VIEW,
    //     PERMISSIONS.INCIDENT_CREATE,
    //     PERMISSIONS.INCIDENT_UPDATE,
    //     PERMISSIONS.TRIP_VIEW,
    //     PERMISSIONS.TRIP_APPROVE,
    //     PERMISSIONS.USERS_VIEW,
    // ],

    [ROLES.TEACHER]: [
        PERMISSIONS.ACADEMICS_VIEW,
        PERMISSIONS.ACADEMICS_EDIT,
        PERMISSIONS.INCIDENT_VIEW,
        PERMISSIONS.INCIDENT_CREATE,
        PERMISSIONS.TRIP_VIEW,
        PERMISSIONS.TRIP_CREATE,
    ],

    [ROLES.STUDENT]: [
        PERMISSIONS.ACADEMICS_VIEW,
        PERMISSIONS.INCIDENT_VIEW,
        PERMISSIONS.TRIP_VIEW,
        PERMISSIONS.TRANSPORT_VIEW,
    ],

    [ROLES.PARENT]: [
        PERMISSIONS.ACADEMICS_VIEW,
        PERMISSIONS.INCIDENT_VIEW,
        PERMISSIONS.TRIP_VIEW,
        PERMISSIONS.TRANSPORT_VIEW,
    ],
};

/**
 * Helper to get permissions for a role
 * @param {string} role 
 * @returns {string[]}
 */
export const getPermissionsByRole = (role) => {
    return ROLE_PERMISSIONS[role] || [];
};
