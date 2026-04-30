import type { Holiday } from "./Holiday"

export type PeriodDTO = {
    id: string,
    course: string,
    name: string,
    periodStartDate: string,
    periodEndDate: string,
    availabilityStartDate: string,
    availabilityEndDate: string,
    assignmentReviewStartDate: string,
    assignmentReviewEndDate: string,
    hoursPerDay: number,
    gapsCoefficient: number,
    hasAvailabilities: boolean,
    holidays: Holiday[]
}