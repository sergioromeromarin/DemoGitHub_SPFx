import type { Holiday } from "./Holiday"

export type UserPeriodDTO = {
    id: string,
    course: string,
    name: string,
    periodStartDate: string,
    periodEndDate: string,
    availabilityStartDate: string,
    availabilityEndDate: string,
    assignmentReviewStartDate: string,
    assignmentReviewEndDate: string,
    holidays: Holiday[]
}