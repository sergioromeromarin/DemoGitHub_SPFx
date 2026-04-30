export enum SupportedAssignmentStatus {
    pending = 'pending',
    accepted = 'accepted',
    rejected = 'rejected'
}

export enum SupportedAvailabilityCompatibility {
    compatible = 'compatible',
    conflicted = 'conflicted',
    unknown = 'unknown'
}

export type AssignmentStatus = keyof typeof SupportedAssignmentStatus
export type AvailabilityCompatibility = keyof typeof SupportedAvailabilityCompatibility

export type Assignment = {
    id: string;
    subject: string;
    program: string;
    academicArea: string;
    numberOfSessions: number;
    description: string;
    startDate: Date;
    endDate: Date;
    status: AssignmentStatus;
    rejectionReason: string | undefined;
    compatibilityStatus: AvailabilityCompatibility;
    assignedSections: number;
    intakeName?: string;
    campus?: string;
    shift?: string;
    nTotalSessions?: number;
}