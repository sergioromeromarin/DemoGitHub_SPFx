import type { Holiday } from "types"

export type Period = {
    id: string,
    course: string,
    name: string,
    periodStartDate: Date,
    periodEndDate: Date,
    availabilityStartDate: Date,
    availabilityEndDate: Date,
    assignmentReviewStartDate: Date,
    assignmentReviewEndDate: Date,
    hoursPerDay?: number
    gapsCoefficient?: number
    hasAvailabilities?: boolean
    holidays: Holiday[]
}