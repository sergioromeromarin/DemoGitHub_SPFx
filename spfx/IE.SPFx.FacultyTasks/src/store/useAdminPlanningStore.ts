import { create } from 'zustand';
import { ServiceScope } from '@microsoft/sp-core-library';
import type { Period, PeriodDataForm } from 'types';
import { FacultyTasksService } from 'services/FacultyTasksService';

interface AdminPlanningState {
    // Estado UI
    isModalOpen_PeriodForm: boolean;
    isModalOpen_DetailPeriod: boolean;
    isDialogHidden_DeletePeriod: boolean;
    isModalOpen_FacultyAvailabilities: boolean;
    isModalOpen_FacultyAssignments: boolean;

    // Datos
    periods: Period[];
    selectedPeriods: Period[];
    isDataLoaded: boolean;

    // Actions UI
    setIsModalOpen_PeriodForm: (open: boolean) => void;
    setIsModalOpen_DetailPeriod: (open: boolean) => void;
    setIsDialogHidden_DeletePeriod: (hidden: boolean) => void;
    setIsModalOpen_FacultyAvailabilities: (open: boolean) => void;
    setIsModalOpen_FacultyAssignments: (open: boolean) => void;
    setSelectedPeriods: (periods: Period[]) => void;

    // Actions Data
    loadPeriods: (serviceScope: ServiceScope) => Promise<void>;
    deletePeriod: (serviceScope: ServiceScope, periodId: string) => Promise<boolean | undefined>;
    createPeriod: (serviceScope: ServiceScope, data: PeriodDataForm) => Promise<Period | undefined>;
    updatePeriod: (serviceScope: ServiceScope, data: PeriodDataForm, periodId: string) => Promise<boolean>;
}

export const useAdminPlanningStore = create<AdminPlanningState>((set, get) => ({
    // Estado inicial
    isModalOpen_PeriodForm: false,
    isModalOpen_DetailPeriod: false,
    isDialogHidden_DeletePeriod: true,
    isModalOpen_FacultyAvailabilities: false,
    isModalOpen_FacultyAssignments: false,

    periods: [],
    selectedPeriods: [],
    isDataLoaded: false,

    // UI actions
    setIsModalOpen_PeriodForm: (open) => set({ isModalOpen_PeriodForm: open }),
    setIsModalOpen_DetailPeriod: (open) => set({ isModalOpen_DetailPeriod: open }),
    setIsDialogHidden_DeletePeriod: (hidden) => set({ isDialogHidden_DeletePeriod: hidden }),
    setIsModalOpen_FacultyAvailabilities: (open) => set({ isModalOpen_FacultyAvailabilities: open }),
    setIsModalOpen_FacultyAssignments: (open) => set({ isModalOpen_FacultyAssignments: open }),
    setSelectedPeriods: (periods) => set({ selectedPeriods: periods }),

    // Data actions
    loadPeriods: async (serviceScope: ServiceScope) => {
        try {
            set({ isDataLoaded: false });
            const facultyTasksService = serviceScope.consume(FacultyTasksService.serviceKey);
            const periods = await facultyTasksService.getPeriods();
            if (periods) {
                set({ periods });
            }
        } catch (error) {
            console.error(`Error in loadPeriods(). ${error}`);
        } finally {
            set({ isDataLoaded: true });
        }
    },

    deletePeriod: async (serviceScope: ServiceScope, periodId: string) => {
        try {
            const facultyTasksService = serviceScope.consume(FacultyTasksService.serviceKey);
            const isInactived = await facultyTasksService.deletePeriod(periodId);

            if (isInactived) {
                const { periods } = get();
                const filtered = periods.filter((s) => s.id !== periodId);
                set({ periods: filtered, selectedPeriods: [] });
            }

            return isInactived;
        } catch (error) {
            console.error(`Error inactivating period. ${error}`);
            return false;
        }
    },

    createPeriod: async (serviceScope: ServiceScope, data: PeriodDataForm) => {
        try {
            const facultyTasksService = serviceScope.consume(FacultyTasksService.serviceKey);
            const period = await facultyTasksService.createPeriod(data);
            if (period) {
                set({ periods: [period, ...get().periods] });
            }
            return period;
        } catch (error) {
            console.error(`Error creating period. ${error}`);
            return undefined;
        }
    },

    updatePeriod: async (serviceScope: ServiceScope, data: PeriodDataForm, periodId: string) => {
        try {
            const facultyTasksService = serviceScope.consume(FacultyTasksService.serviceKey);
            const updated = await facultyTasksService.updatePeriod(data, periodId);
            if (updated) {
                const periodIndex = get().periods.findIndex(item => item.id === periodId)
                if (periodIndex >= 0) {
                    const newPeriods = [
                        ...get().periods.slice(0, periodIndex),
                        {
                            ...get().periods[periodIndex],
                            course: data.course,
                            name: data.name,
                            periodStartDate: data.periodStartDate,
                            periodEndDate: data.periodEndDate,
                            availabilityStartDate: data.availabilityStartDate,
                            availabilityEndDate: data.availabilityEndDate,
                            assignmentReviewStartDate: data.assignmentReviewStartDate,
                            assignmentReviewEndDate: data.assignmentReviewEndDate,
                            hoursPerDay: data.hoursPerDay,
                            gapsCoefficient: data.gapsCoefficient,
                            holidays: data.holidays
                        } as Period,
                        ...get().periods.slice(periodIndex + 1)
                    ];
                    set({ periods: newPeriods });
                }
                set({
                    selectedPeriods: [
                        {
                            ...get().selectedPeriods[0],
                            course: data.course,
                            name: data.name,
                            periodStartDate: data.periodStartDate,
                            periodEndDate: data.periodEndDate,
                            availabilityStartDate: data.availabilityStartDate,
                            availabilityEndDate: data.availabilityEndDate,
                            assignmentReviewStartDate: data.assignmentReviewStartDate,
                            assignmentReviewEndDate: data.assignmentReviewEndDate,
                            hoursPerDay: data.hoursPerDay,
                            gapsCoefficient: data.gapsCoefficient,
                            holidays: data.holidays
                        } as Period
                    ]
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Error updating period. ${error}`);
            return false;
        }
    }
}));
