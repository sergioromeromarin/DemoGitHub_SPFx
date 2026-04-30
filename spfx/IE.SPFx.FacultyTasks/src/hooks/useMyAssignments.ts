import * as React from 'react';
import { FacultyTasksService } from 'services/FacultyTasksService';
import type { UseMyAssignments, Period, Assignment, AssignmentStatus } from 'types';
import { useAppStore } from 'store/useAppStore';

export function useMyAssignments(): UseMyAssignments {

    const [isDataLoaded, setIsDataLoaded] = React.useState(false);
    const [periods, setPeriods] = React.useState<Array<Period>>([]);
    const [selectedPeriod, setSelectedPeriod] = React.useState<Period>();
    const [assignments, setAssignments] = React.useState<Assignment[]>([]);
    const [isAllAvailable, setIsAllAvailable] = React.useState<boolean>(false);

    const serviceScope = useAppStore((state) => state.serviceScope);

    const loadPeriods = async (): Promise<void> => {
        try {
            if (serviceScope) {
                setIsDataLoaded(false);
                const facultyTasksService = serviceScope.consume(FacultyTasksService.serviceKey);
                const periodsResult = await facultyTasksService.getPeriodsForAssignment();
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

    const loadAssignments = async (): Promise<void> => {
        try {
            if (serviceScope && selectedPeriod) {
                setIsDataLoaded(false);
                const facultyTasksService = serviceScope.consume(FacultyTasksService.serviceKey);
                const assignments = await facultyTasksService.getMyAssignments(selectedPeriod);
                if (assignments) {
                    setAssignments(assignments);
                }
                else {
                    setAssignments([]);
                }

                const checkIsAllAvailable = await facultyTasksService.checkIsAllAvailable(selectedPeriod.id);
                if (checkIsAllAvailable !== undefined)
                    setIsAllAvailable(checkIsAllAvailable);
            }
        } catch (error) {
            console.error(`Error in loadAssignments(). ${error}`);
        }
        finally {
            setIsDataLoaded(true);
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
            loadAssignments().catch(console.error);
        }
    }, [selectedPeriod]);

    const updateStateAssignment = (assignmentId: string, newStatus: AssignmentStatus): void => {
        setAssignments((prevAssignments) =>
            prevAssignments.map((assignment) =>
                assignment.id === assignmentId
                    ? { ...assignment, status: newStatus }
                    : assignment
            )
        );
    }

    return { isDataLoaded, periods, selectedPeriod, assignments, isAllAvailable, changeSelectedPeriod, updateStateAssignment };
}