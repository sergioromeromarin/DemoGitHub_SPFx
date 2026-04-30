import { Availability, DateAvailability, SupportedDateAvailabilityStatus } from "types";
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Guid } from "@microsoft/sp-core-library";
dayjs.extend(isoWeek);

// Helper para generar rango de fechas
function generateDatesBetween(start: Date, end: Date): Date[] {
    const dates: Date[] = [];
    const current = new Date(start);
    // eslint-disable-next-line no-unmodified-loop-condition
    while (current <= end) {
        dates.push(new Date(current));
        current.setUTCDate(current.getUTCDate() + 1);
    }
    return dates;
}

// Helper para crear status aleatorio (mayoría "available")
function randomStatus(): keyof typeof SupportedDateAvailabilityStatus {
    const rand = Math.random();
    if (rand < 0.8) return "available";
    if (rand < 0.9) return "preferred";
    return "blocked";
}

// Genera todas las fechas del periodo con horas 8–20 UTC
function generateDateAvailabilities(start: Date, end: Date): DateAvailability[] {
    const dates: { date: Date; status: keyof typeof SupportedDateAvailabilityStatus, week: number, id: string }[] = [];

    const dayList = generateDatesBetween(start, end);

    for (const day of dayList) {
        for (let hour = 6; hour <= 20; hour++) {
            const dateUTC = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), hour));

            if (dateUTC.getDay() !== 0 && dateUTC.getDay() !== 6) { // Evita sábados y domingos
                dates.push({
                    date: dateUTC,
                    status: randomStatus(),
                    week: dayjs(dateUTC).isoWeek(),
                    id: Guid.newGuid().toString()
                });
            }
        }
    }

    return dates;
}

// Definición de periodos
const Q2_2025_2026 = {
    start: new Date(Date.UTC(2026, 0, 1)),
    end: new Date(Date.UTC(2026, 6, 31))
};

const Q1_2025_2026 = {
    start: new Date(Date.UTC(2025, 8, 1)),
    end: new Date(Date.UTC(2025, 11, 31))
};

const Q2_2024_2025 = {
    start: new Date(Date.UTC(2025, 0, 1)),
    end: new Date(Date.UTC(2025, 6, 31))
};

// Mock principal
export const mockAvailabilities: Availability[] = [
    {
        course: "2025-2026",
        periodId: "68f725b2-b07c-8329-ad93-a6019c289d40",
        periodName: "Q2",
        openPeriod: true,
        selected: false,
        dates: generateDateAvailabilities(Q2_2025_2026.start, Q2_2025_2026.end)
    },
    {
        course: "2025-2026",
        periodId: "68f725b2-b07c-8329-ad93-a6019c289d41",
        periodName: "Q1",
        openPeriod: false,
        selected: true,
        dates: generateDateAvailabilities(Q1_2025_2026.start, Q1_2025_2026.end)
    },
    {
        course: "2024-2025",
        periodId: "68f725b2-b07c-8329-ad93-a6019c289d42",
        periodName: "Q2",
        openPeriod: true,
        selected: false,
        dates: generateDateAvailabilities(Q2_2024_2025.start, Q2_2024_2025.end)
    }
];
