import type { Holiday } from "types";

export type PeriodDataForm = {
    course: string | undefined;
    name: string | undefined;
    periodStartDate: Date | undefined;
    periodEndDate: Date | undefined;
    availabilityStartDate: Date | undefined;
    availabilityEndDate: Date | undefined;
    assignmentReviewStartDate: Date | undefined;
    assignmentReviewEndDate: Date | undefined;
    hoursPerDay: number | undefined;
    gapsCoefficient: number | undefined;
    holidays: Holiday[];
}