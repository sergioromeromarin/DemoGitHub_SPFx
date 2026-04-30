import type { Availability, Period } from "types";
import { AvailabilityBulkActions } from "utils/Constants";

export type UseWeeklyAvailability = {
    isDataLoaded: boolean,
    periodsWeeklyAvailabilities: Array<Availability>,
    selectedWeeklyAvailability: Availability | undefined,
    periods: Array<Period>,
    selectedPeriod: Period | undefined,
    changeDayAvailability: (clickedDateId: string) => void,
    changeBulkDayAvailability: (action: AvailabilityBulkActions, day: Date) => void,
    changeSelectedWeeklyAvailability: (av: Availability) => void
    changeSelectedPeriod: (per: Period) => void
}