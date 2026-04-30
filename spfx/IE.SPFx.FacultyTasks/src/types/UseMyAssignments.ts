import type { Assignment, AssignmentStatus, Period } from "types";

export type UseMyAssignments = {
    isDataLoaded: boolean,
    periods: Array<Period>,
    selectedPeriod: Period | undefined,
    assignments: Array<Assignment>,
    isAllAvailable: boolean,
    changeSelectedPeriod: (per: Period) => void,
    updateStateAssignment: (assignmentId: string, newStatus: AssignmentStatus) => void
}