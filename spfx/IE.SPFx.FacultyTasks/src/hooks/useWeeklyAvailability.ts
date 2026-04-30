import * as React from 'react';
import { FacultyTasksService } from 'services/FacultyTasksService';
import { type UseWeeklyAvailability, type Availability, type AvailabilityStatus, type Period, SupportedDateAvailabilityStatus } from 'types';
import { useAppStore } from 'store/useAppStore';
import { AvailabilityBulkActions, Operations } from 'utils/Constants';

export function useWeeklyAvailability(): UseWeeklyAvailability {

    const [isDataLoaded, setIsDataLoaded] = React.useState(false);
    const [periodsWeeklyAvailabilities, setPeriodsWeeklyAvailabilities] = React.useState<Array<Availability>>([]);
    const [selectedWeeklyAvailability, setSelectedWeeklyAvailability] = React.useState<Availability>();
    const [periods, setPeriods] = React.useState<Array<Period>>([]);
    const [selectedPeriod, setSelectedPeriod] = React.useState<Period>();

    const serviceScope = useAppStore((state) => state.serviceScope);
    const { setUnsavedChanges } = useAppStore();

    const loadPeriods = async (): Promise<void> => {
        try {
            if (serviceScope) {
                setIsDataLoaded(false);
                const facultyTasksService = serviceScope.consume(FacultyTasksService.serviceKey);

                const periodsResult = await facultyTasksService.getPeriodsForAvailability();

                if (periodsResult && periodsResult.length > 0) {
                    setPeriods(periodsResult);
                    //Vienen ordenados por Course desc y PeriodStartDate desc. Seleccionamos el primero
                    setSelectedPeriod(periodsResult[0]);
                }
            }
        } catch (error) {
            console.error(`Error in loadPeriods(). ${error}`);
        }
        finally {
            setIsDataLoaded(true);
        }
    }

    const loadAvailabilities = async (): Promise<void> => {
        try {
            if (serviceScope && selectedPeriod) {
                const facultyTasksService = serviceScope.consume(FacultyTasksService.serviceKey);
                const availability = await facultyTasksService.getMyAvailability(selectedPeriod);
                if (availability) {
                    setPeriodsWeeklyAvailabilities([availability])
                    setSelectedWeeklyAvailability(availability);
                }
            }

        } catch (error) {
            console.error(`Error in loadAvailabilities(). ${error}`);
        }
        finally {
            setIsDataLoaded(true);
        }
    }

    const changeSelectedWeeklyAvailability = (av: Availability): void => {
        setSelectedWeeklyAvailability(av);
    }

    const changeDayAvailability = (clickedDateId: string): void => {
        setUnsavedChanges(true, Operations.planing_myavailability);

        setSelectedWeeklyAvailability(prev => {
            if (!prev) return prev;

            const updated = structuredClone(prev);

            const target = updated.dates.find(d =>
                d.id.toUpperCase() === clickedDateId.toUpperCase()
            );

            if (!target) return prev;

            const currentValue = target.status;

            // Ciclo de valores: available -> preferred -> blocked -> available
            let nextValue: AvailabilityStatus;

            if (!currentValue) nextValue = SupportedDateAvailabilityStatus.available;
            else if (currentValue === SupportedDateAvailabilityStatus.available)
                nextValue = SupportedDateAvailabilityStatus.preferred;
            else if (currentValue === SupportedDateAvailabilityStatus.preferred)
                nextValue = SupportedDateAvailabilityStatus.blocked;
            else nextValue = SupportedDateAvailabilityStatus.available;

            target.status = nextValue;

            return updated;
        });
    };

    const changeBulkDayAvailability = (action: AvailabilityBulkActions, day: Date): void => {
        setUnsavedChanges(true, Operations.planing_myavailability);
        switch (action) {
            case AvailabilityBulkActions.allDayPreferred:
                setSelectedWeeklyAvailability(prev => {
                    if (!prev) return prev;

                    const updated = structuredClone(prev);

                    const targets = updated.dates.filter(d =>
                        d.date.getDate() === day.getDate() && d.date.getMonth() === day.getMonth() && d.date.getFullYear() === day.getFullYear()
                    );

                    if (!targets) return prev;

                    targets.forEach(target => {
                        target.status = SupportedDateAvailabilityStatus.preferred
                    });

                    return updated;
                });
                break;
            case AvailabilityBulkActions.allDayBlocked:
                setSelectedWeeklyAvailability(prev => {
                    if (!prev) return prev;

                    const updated = structuredClone(prev);

                    const targets = updated.dates.filter(d =>
                        d.date.getDate() === day.getDate() && d.date.getMonth() === day.getMonth() && d.date.getFullYear() === day.getFullYear()
                    );

                    if (!targets) return prev;

                    targets.forEach(target => {
                        target.status = SupportedDateAvailabilityStatus.blocked
                    });

                    return updated;
                });
                break;
            case AvailabilityBulkActions.allDayAvailable:
                setSelectedWeeklyAvailability(prev => {
                    if (!prev) return prev;

                    const updated = structuredClone(prev);

                    const targets = updated.dates.filter(d =>
                        d.date.getDate() === day.getDate() && d.date.getMonth() === day.getMonth() && d.date.getFullYear() === day.getFullYear()
                    );

                    if (!targets) return prev;

                    targets.forEach(target => {
                        target.status = SupportedDateAvailabilityStatus.available
                    });

                    return updated;
                });
                break;
            case AvailabilityBulkActions.replyDayToAllDaysWeek:
                setSelectedWeeklyAvailability(prev => {
                    if (!prev) return prev;

                    const updated = structuredClone(prev);

                    const sources = updated.dates.filter(d =>
                        d.date.getDate() === day.getDate() && d.date.getMonth() === day.getMonth() && d.date.getFullYear() === day.getFullYear()
                    );

                    sources.forEach(source => {
                        const targets = updated.dates.filter(d =>
                            d.week === source.week && d.date.getHours() === source.date.getHours()
                        );

                        if (!targets) return prev;

                        targets.forEach(target => {
                            target.status = source.status
                        });
                    });
                    return updated;
                });
                break;
            case AvailabilityBulkActions.replyDayToMonth:
                setSelectedWeeklyAvailability(prev => {
                    if (!prev) return prev;

                    const updated = structuredClone(prev);

                    const sources = updated.dates.filter(d =>
                        d.date.getDate() === day.getDate() && d.date.getMonth() === day.getMonth() && d.date.getFullYear() === day.getFullYear()
                    );

                    sources.forEach(source => {
                        const targets = updated.dates.filter(d =>
                            d.date.getDay() === source.date.getDay() && d.date.getMonth() === source.date.getMonth() && d.date.getHours() === source.date.getHours()
                        );

                        if (!targets) return prev;

                        targets.forEach(target => {
                            target.status = source.status
                        });
                    });
                    return updated;
                });
                break;
            case AvailabilityBulkActions.replyDayToPeriod:
                setSelectedWeeklyAvailability(prev => {
                    if (!prev) return prev;

                    const updated = structuredClone(prev);

                    const sources = updated.dates.filter(d =>
                        d.date.getDate() === day.getDate() && d.date.getMonth() === day.getMonth() && d.date.getFullYear() === day.getFullYear()
                    );

                    sources.forEach(source => {
                        const targets = updated.dates.filter(d =>
                            d.date.getDay() === source.date.getDay() && d.date.getHours() === source.date.getHours()
                        );

                        if (!targets) return prev;

                        targets.forEach(target => {
                            target.status = source.status
                        });
                    });
                    return updated;
                });
                break;
            default:
                break;
        }

    }

    const changeSelectedPeriod = (per: Period): void => {
        setSelectedPeriod(per);
    }

    React.useEffect(() => {
        loadPeriods().catch(console.error);
    }, []);

    React.useEffect(() => {
        if (selectedPeriod) {
            loadAvailabilities().catch(console.error);
        }
    }, [selectedPeriod]);


    return { isDataLoaded, periodsWeeklyAvailabilities, selectedWeeklyAvailability, periods, selectedPeriod, changeDayAvailability, changeBulkDayAvailability, changeSelectedWeeklyAvailability, changeSelectedPeriod };
}