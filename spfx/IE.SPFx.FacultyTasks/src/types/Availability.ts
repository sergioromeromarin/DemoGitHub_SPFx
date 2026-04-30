export enum SupportedDateAvailabilityStatus {
    preferred = 'preferred',
    blocked = 'blocked',
    available = 'available'
}

export type AvailabilityStatus = keyof typeof SupportedDateAvailabilityStatus


export type DateAvailability = {
    id: string,
    date: Date,
    status?: AvailabilityStatus,
    week: number
}

export type Availability = {
    course: string,
    periodId: string,
    periodName: string,
    openPeriod: boolean,
    selected: boolean,
    dates: DateAvailability[]
}