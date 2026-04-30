import { MyTasks } from "FacultyTasksWebPartStrings";
import type { DateAvailability, Period } from "types";

export const getIntervalDays = (days: Record<string, DateAvailability[]>): string => {
    const sortedDays = Object.keys(days).sort();
    const from = new Date(sortedDays[0]);
    const to = new Date(sortedDays[sortedDays.length - 1]);

    if (from.getFullYear() === to.getFullYear()) {
        return `${from.toLocaleDateString('en-US', { month: "long", day: "2-digit" })} - ${to.toLocaleDateString('en-US', { year: "numeric", month: "long", day: "2-digit" })}`;
    } else {
        return `${from.toLocaleDateString('en-US', { year: "numeric", month: "long", day: "2-digit" })} - ${to.toLocaleDateString('en-US', { year: "numeric", month: "long", day: "2-digit" })}`;
    }
}

export const reorderWeek53ToEndOfYear = (groupedWeeks: {
    week: number;
    days: Record<string, DateAvailability[]>;
}[]): {
    week: number;
    days: Record<string, DateAvailability[]>;
}[] => {

    if (groupedWeeks.length > 0) {
        if (groupedWeeks[0].week === 1) { // Los últimos días del año anterior están en la primera semana
            if (groupedWeeks[0].days[Object.keys(groupedWeeks[0].days)[0]][0].date.getMonth() === 11) { // Última semana de diciembre y no de enero
                const week53 = groupedWeeks.shift();
                if (week53) {
                    groupedWeeks.push(week53);
                }
            }
        }
    }

    return groupedWeeks;
}

export const isTodayInOpenPeriod = (period: Period): boolean => {
    if (!period) return false;
    const todayEnd = new Date();
    todayEnd.setHours(0, 0, 0, 0);
    return period.periodEndDate >= todayEnd
}

export const isTodayInOpenAvailability = (period: Period): boolean => {
    if (!period) return false;
    const todayStart = new Date();
    todayStart.setHours(23, 59, 59, 999);
    const todayEnd = new Date();
    todayEnd.setHours(0, 0, 0, 0);
    return period.availabilityStartDate <= todayStart && period.availabilityEndDate >= todayEnd;
}

export const isTodayInOpenAssignment = (period: Period | undefined): boolean => {
    if (!period) return false;
    const todayStart = new Date();
    todayStart.setHours(23, 59, 59, 999);
    const todayEnd = new Date();
    todayEnd.setHours(0, 0, 0, 0);
    return period.assignmentReviewStartDate <= todayStart && period.assignmentReviewEndDate >= todayEnd;
}

export const getDateColor = (date: Date | undefined): string => {
    let color = 'green'
    if (date) {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (today.getTime() > date.getTime()) {
            color = 'red'
        }
    }
    return color;
}

export const addHoursToDate = (date: Date | undefined, hours: number): Date | undefined => {
    if (!date) return undefined;
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
}

export const customFormatDate = (date: Date): string => {
    const [month, day, year] = date
        .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
        .replace(',', '')
        .split(' ');
    return `${year} - ${month} - ${day}`;
}

export const getStatusLabel = (status: number): string => {
    switch (status) {
        case 0:
            return MyTasks.Status.Pending;
        case 1:
            return MyTasks.Status.Completed;
        case 2:
            return MyTasks.Status.Expired;  
        default:
            return 'Unknown';
}}   