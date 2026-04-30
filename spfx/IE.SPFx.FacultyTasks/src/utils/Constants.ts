export const Paths = {
    Root: "/",
    NoAccess: "/no-access",
    Tasks: "/tasks",
    Tasks_All: "/tasks/*",
    Tasks_MyPendingTasks: "/tasks/mypendingtasks",
    Tasks_MyPendingTasks_Relative: "/mypendingtasks",
    Tasks_PersonalTasks: "/tasks/personaltask",
    Tasks_PersonalTasks_Relative: "/personaltask",
    Planning: "/planning",
    Planning_All: "/planning/*",
    Planning_MyAvailabitity: "/planning/myavailability",
    Planning_MyAvailabitity_Relative: "/myavailability",
    Planning_MyAssignments: "/planning/myassignments",
    Planning_MyAssignments_Relative: "/myassignments",
    Planning_MySessions: "/planning/mysessions",
    Planning_MySessions_Relative: "/mysessions",
    // Requests: "/requests",
    // Evaluations: "/evaluations",
    Administration: "/admin",
    Administration_All: "/admin/*",
    Administration_Planning: "/admin/adminplanning",
    Administration_Planning_Relative: "/adminplanning",
    Administration_Tasks: "/admin/admintasks",
    Administration_Tasks_Relative: "/admintasks"
}

export const AvailabilityEndpoint = {
    MyAvailabilities: "/api/Availabilities/my-availabities-by-period",
    BulkUpdate: "/api/Availabilities/update-status",
    IsAllAvailable: "/api/Availabilities/check-all-available"
};

export const PeriodEndpoint = {
    Base: "/api/Periods",
    ForAvailabitly: "/api/Periods/for-availability",
    ForAssignments: "/api/Periods/for-assignments"
};

export const AssignmentsEndpoint = {
    MyAssignments: "/api/Assignments/my-assignments-by-period",
    AcceptAssignment: "/api/Assignments/accept-assignment",
    RejectAssignment: "/api/Assignments/reject-assignment"
};

export const TasksEndpoint = {
    MyTasks: "/api/Tasks/my-tasks",
    UserPendingTasks:"api/Tasks/user-pending-tasks?&userEmail={userEmail}"
};


export enum Roles {
    user = 'user',
    admin = 'admin',
    taskUser= 'taskUser'
}

export enum Operations {
    tasks_mytasks = 'tasks_mytasks',
    planing_myavailability = 'planing_myavailability'
}


//TASKS - STATUS
export enum TaskStatus {
    pending = 0,
    completed = 1,
    expired = 2
}

//PLANNING - WEEKLYAVAILABILITY

export enum FilterAvailabilityStatus {
    all = 'all',
    preferred = 'preferred',
    blocked = 'blocked'
}

export enum AvailabilityBulkActions {
    allDayPreferred = 'allDayPreferred',
    allDayBlocked = 'allDayBlocked',
    allDayAvailable = 'allDayAvailable',
    replyDayToAllDaysWeek = 'replyDayToAllDaysWeek',
    replyDayToMonth = 'replyDayToMonth',
    replyDayToPeriod = 'replyDayToPeriod'
}


//ADMIN - PLANNING - PERIODS
//Same Back-End
export const TextField_MaxLenght = {
    Course: 100,
    Name: 100,
}

export const AdminAvailabilitiesEndpoint = {
    UniqueUsersByPeriod: "/api/Availabilities/period/{periodId}/unique-users",
    ExportAvailabilitiesByUserAndPeriod: "/api/Availabilities/export/user/{userId}/period/{periodId}",
    ExportAvailabilitiesByPeriod: "/api/Availabilities/export/period/{periodId}",
    UserWithAvailability: "/api/Availabilities/user-with-availability"
};

export const AdminAssignmentsEndpoint = {
    UniqueUsersByPeriod: "/api/Assignments/period/{periodId}/unique-users",
    ExportAssignmentsByUserAndPeriod: "/api/Assignments/export/user/{userId}/period/{periodId}",
    ExportAssignmentsByPeriod: "/api/Assignments/export/period/{periodId}",
    UserWithAssignment: "/api/Assignments/user-with-assignment"
};

export const CULTURE_NAME_ES = 'es-ES';