/**
 * Centralized Permission Registry
 * Permissions are defined as action-based strings: 'domain:action'
 */
export const PERMISSIONS = {
    // Academics Domain
    ACADEMICS_VIEW: 'academics:view',
    ACADEMICS_EDIT: 'academics:edit',
    ACADEMICS_DELETE: 'academics:delete',

    // Incidents Domain
    INCIDENT_CREATE: 'incident:create',
    INCIDENT_VIEW: 'incident:view',
    INCIDENT_UPDATE: 'incident:update',
    INCIDENT_DELETE: 'incident:delete',

    // Transport Domain
    TRANSPORT_MANAGE: 'transport:manage',
    TRANSPORT_VIEW: 'transport:view',

    // Trips Domain
    TRIP_CREATE: 'trip:create',
    TRIP_APPROVE: 'trip:approve',
    TRIP_VIEW: 'trip:view',

    // Users Domain
    USERS_MANAGE: 'users:manage',
    USERS_VIEW: 'users:view',
};

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);
