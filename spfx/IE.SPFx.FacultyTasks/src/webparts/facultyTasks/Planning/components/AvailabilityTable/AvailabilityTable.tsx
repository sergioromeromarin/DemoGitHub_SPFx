import React, { useState } from "react";
import styles from './AvailabilityTable.module.scss';
import dayjs from "dayjs";
import { DateAvailability, UpdatedAvailabilityDTO } from "types";
import WeekAvailabilityTable from "../WeekAvailabilityTable/WeekAvailabilityTable";
import { useWeeklyAvailability } from "hooks/useWeeklyAvailability";
import { FilterAvailabilityStatus } from "utils/Constants";
import { Dropdown, DropdownMenuItemType, IconButton, IDropdownOption, MessageBar, MessageBarType, PrimaryButton, Spinner, SpinnerSize } from "@fluentui/react";
import { useAppStore } from "store/useAppStore";
import { FacultyTasksService } from "services/FacultyTasksService";
import toast from "react-hot-toast";
import { getIntervalDays, isTodayInOpenAvailability, isTodayInOpenPeriod, reorderWeek53ToEndOfYear } from "utils/Utils";
import { Planning } from "FacultyTasksWebPartStrings";
import Loader from "../../../components/Loader/Loader";

export const AvailabilityTable: React.FC = () => {
    const { isDataLoaded, periodsWeeklyAvailabilities, selectedWeeklyAvailability, periods, selectedPeriod, changeDayAvailability, changeBulkDayAvailability, changeSelectedPeriod } = useWeeklyAvailability();

    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const [filter, setFilter] = useState<FilterAvailabilityStatus>(FilterAvailabilityStatus.all);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const { setUnsavedChanges } = useAppStore();

    const serviceScope = useAppStore((state) => state.serviceScope);

    const periodOptions = React.useMemo<IDropdownOption[]>(() => {
        const openPeriods = periods.filter((period) => isTodayInOpenPeriod(period));
        const closedPeriods = periods.filter((period) => !isTodayInOpenPeriod(period));

        const options: IDropdownOption[] = [];

        if (openPeriods.length > 0) {
            options.push({ key: "openPeriodsHeader", text: Planning.MyAvailability.PeriodFilter.OpenPeriods, itemType: DropdownMenuItemType.Header });
            options.push(
                ...openPeriods.map((period) => ({
                    key: period.id,
                    text: `${period.course} - ${period.name}`,
                }))
            );
        }

        if (closedPeriods.length > 0) {
            options.push({ key: "closedPeriodsHeader", text: Planning.MyAvailability.PeriodFilter.ClosedPeriods, itemType: DropdownMenuItemType.Header });
            options.push(
                ...closedPeriods.map((period) => ({
                    key: period.id,
                    text: `${period.course} - ${period.name}`,
                }))
            );
        }
        return options;
    }, [periods]);

    const handlePeriodChange = (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption): void => {
        if (!option || option.itemType === DropdownMenuItemType.Header) return;
        const found = periods.find((period) => period.id === option.key);
        if (found) {
            changeSelectedPeriod(found);
            setCurrentWeekIndex(0);
        }
    };

    const FILTERS_BUTTONS = {
        [FilterAvailabilityStatus.all]: {
            literal: Planning.MyAvailability.AvailabilityTable.FilterButton.ShowAll,
            onClick: () => setFilter(FilterAvailabilityStatus.all)
        },
        [FilterAvailabilityStatus.preferred]: {
            literal: Planning.MyAvailability.AvailabilityTable.FilterButton.ShowPreferred,
            onClick: () => setFilter(FilterAvailabilityStatus.preferred)
        },
        [FilterAvailabilityStatus.blocked]: {
            literal: Planning.MyAvailability.AvailabilityTable.FilterButton.ShowBlocked,
            onClick: () => setFilter(FilterAvailabilityStatus.blocked)
        }
    } as const;

    let groupedWeeks: {
        week: number;
        days: Record<string, DateAvailability[]>;
    }[] = []

    if (selectedWeeklyAvailability) {
        groupedWeeks = Object.entries(
            selectedWeeklyAvailability.dates.reduce((acc, d) => {
                if (!acc[d.week]) acc[d.week] = {};
                const key = dayjs(d.date).format("YYYY-MM-DD");
                if (!acc[d.week][key]) acc[d.week][key] = [];
                acc[d.week][key].push(d);
                return acc;
            }, {} as Record<number, Record<string, typeof selectedWeeklyAvailability.dates>>)
        )
            .map(([week, days]) => ({ week: Number(week), days }))
            .sort((a, b) => a.week - b.week);
        groupedWeeks = reorderWeek53ToEndOfYear(groupedWeeks);
    }

    const currentWeek = groupedWeeks[currentWeekIndex];

    const handlePrevWeek = (): void => {
        setCurrentWeekIndex((i) => Math.max(0, i - 1));
    };

    const handleNextWeek = (): void => {
        setCurrentWeekIndex((i) => Math.min(groupedWeeks.length - 1, i + 1));
    };

    const saveAvailability = async (): Promise<void> => {
        try {
            setIsSaving(true);
            if (!selectedWeeklyAvailability) return;

            const original = periodsWeeklyAvailabilities.find(a => a.periodId === selectedWeeklyAvailability.periodId);
            if (!original) return;

            const updatedAvailabilities: UpdatedAvailabilityDTO[] = selectedWeeklyAvailability.dates.filter(updated => {
                const originalDate = original.dates.find(o => o.id === updated.id);
                return originalDate?.status !== updated.status;
            }).map(d => ({ id: d.id, status: d.status } as UpdatedAvailabilityDTO));

            if (updatedAvailabilities.length > 0) {
                if (serviceScope) {
                    const facultyTasksService = serviceScope.consume(FacultyTasksService.serviceKey);
                    const statusCodeUpdatesAvailabilities = await facultyTasksService.updateMyAvailability(updatedAvailabilities);
                    if (statusCodeUpdatesAvailabilities === 200) {
                        toast.success(Planning.MyAvailability.AvailabilityTable.SaveAvailabilitySuccess, { position: 'bottom-right', duration: 2500 });
                        setUnsavedChanges(false, undefined);
                    } else if (statusCodeUpdatesAvailabilities === 409) {
                        toast.error(Planning.MyAvailability.AvailabilityTable.SaveAvailabilityConflict, { position: 'bottom-right', duration: 15000 });
                    } else {
                        toast.error(Planning.MyAvailability.AvailabilityTable.SaveAvailabilityError, { position: 'bottom-right', duration: 2500 });
                    }
                }
            }
        } catch (error) {
            console.error("Error saving availabilities:", error);
            toast.error(Planning.MyAvailability.AvailabilityTable.SaveAvailabilityError, { position: 'bottom-right', duration: 2500 });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <section className={styles.availabilitySection}>
            <div className={styles.periodFilterArea}>
                <h1>{Planning.MyAvailability.PeriodFilter.Title}</h1>
                <Dropdown
                    label={Planning.MyAvailability.PeriodFilter.Label}
                    placeholder={Planning.MyAvailability.PeriodFilter.Placeholder}
                    selectedKey={selectedPeriod?.id}
                    onChange={handlePeriodChange}
                    options={periodOptions}
                    styles={{ dropdown: { width: 300 } }}
                />
            </div>

            {!isDataLoaded
                ? <Loader heightVH={60} />
                : <>
                    {periods.length === 0 ?
                        <MessageBar messageBarType={MessageBarType.warning}>{Planning.MyAvailability.PeriodFilter.NoPeriodsMessage}</MessageBar>
                        : <div className={styles.availabilityResultArea} >
                            <h1>{Planning.MyAvailability.AvailabilityTable.Title}</h1>
                            <h3>{Planning.MyAvailability.AvailabilityTable.Subtitle}</h3>
                            <div className={styles.actions} >
                                <div className={styles.weekNavigationArea}>
                                    <IconButton
                                        className={styles.weekNavButton}
                                        iconProps={{ iconName: 'ChevronLeftSmall' }}
                                        title={Planning.MyAvailability.AvailabilityTable.PreviousWeekBtn}
                                        disabled={currentWeekIndex === 0}
                                        onClick={handlePrevWeek} />
                                    <IconButton
                                        className={styles.weekNavButton}
                                        iconProps={{ iconName: 'ChevronRightSmall' }}
                                        title={Planning.MyAvailability.AvailabilityTable.NextWeekBtn}
                                        disabled={currentWeekIndex === groupedWeeks.length - 1}
                                        onClick={handleNextWeek} />
                                    {currentWeek &&
                                        <span>{Planning.MyAvailability.AvailabilityTable.Week} {currentWeek.week}. {getIntervalDays(currentWeek.days)}</span>
                                    }
                                </div>
                                <div className={styles.rightArea}>
                                    <PrimaryButton onClick={saveAvailability} disabled={isSaving || !isTodayInOpenAvailability(selectedPeriod!)}>
                                        {isSaving
                                            && <Spinner size={SpinnerSize.small} />
                                        }
                                        {Planning.MyAvailability.AvailabilityTable.SaveAvailabilityBtn}
                                    </PrimaryButton>
                                    <div className={styles.filterArea}>
                                        <div className={styles.filterButtons}>
                                            {Object.entries(FILTERS_BUTTONS).map(([key, { literal, onClick }]) => {
                                                return (
                                                    <button key={key} className={filter === key ? styles.active : ""} onClick={onClick}>{literal}</button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {currentWeek && (
                                <WeekAvailabilityTable
                                    key={`week_${currentWeek.week}`}
                                    week={currentWeek.week}
                                    weekData={currentWeek.days}
                                    filter={filter}
                                    changeDayAvailability={changeDayAvailability}
                                    changeBulkDayAvailability={changeBulkDayAvailability}
                                    isOpenAvailability={isTodayInOpenAvailability(selectedPeriod!)}
                                    holidays={selectedPeriod?.holidays.map(h => h.holidayDate)}
                                />
                            )}
                            <div className={styles.legendArea}>
                                <div><div className={`${styles.legend} ${styles.legendPreferred}`}>❤︎</div>{Planning.MyAvailability.AvailabilityTable.Legend.Preferred}</div>
                                <div><div className={`${styles.legend} ${styles.legendBlocked}`}>✖</div>{Planning.MyAvailability.AvailabilityTable.Legend.Blocked}</div>
                                <div><div className={`${styles.legend} ${styles.legendAvailable}`} />{Planning.MyAvailability.AvailabilityTable.Legend.Available}</div>
                            </div>
                            <div className={styles.footerArea}>
                                <PrimaryButton onClick={saveAvailability} disabled={isSaving || !isTodayInOpenAvailability(selectedPeriod!)}>
                                    {isSaving
                                        && <Spinner size={SpinnerSize.small} />
                                    }
                                    {Planning.MyAvailability.AvailabilityTable.SaveAvailabilityBtn}
                                </PrimaryButton>
                            </div>
                        </div>
                    }
                </>
            }
        </section >
    );
};
