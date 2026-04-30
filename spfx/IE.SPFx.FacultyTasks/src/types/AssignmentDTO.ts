export type AssignmentDTO = {
    id: string;
    subject: string;
    program: string;
    academicArea: string;
    numberOfSessions: number;
    description: string;
    startDate: string;
    endDate: string;
    status: number;
    rejectionReason: string | undefined;
    compatibilityStatus: number;
    assignedSections: number;
    intakeName?: string;
    campus?: string;
    shift?: string;
    nTotalSessions?: number;
}