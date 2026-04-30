import { AvailabilityBulkActions, FilterAvailabilityStatus } from "utils/Constants";

export interface IWeekAvailabilityTableProps {
    week: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    weekData: Record<string, any[]>;
    filter: FilterAvailabilityStatus
    changeDayAvailability: (id: string) => void;
    changeBulkDayAvailability: (action: AvailabilityBulkActions, day: Date) => void;
    isOpenAvailability?: boolean;
    holidays?: Date[];
}