import React from "react";
import styles from './WeekAvailabilityTable.module.scss';
import { SupportedDateAvailabilityStatus } from "types";
import { AvailabilityBulkActions, FilterAvailabilityStatus } from "utils/Constants";
import { IconButton } from "@fluentui/react/lib/Button";
import { IContextualMenuProps } from "@fluentui/react/lib/ContextualMenu";
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { Planning } from "FacultyTasksWebPartStrings";
import { IWeekAvailabilityTableProps } from "./IWeekAvailabilityTableProps";
dayjs.extend(isoWeek);

// Devuelve las horas del día (8–21)
const HOURS = Array.from({ length: 14 }, (_, i) => 8 + i);

const WeekAvailabilityTable: React.FC<IWeekAvailabilityTableProps> = ({ week, weekData, filter, isOpenAvailability, holidays, changeDayAvailability, changeBulkDayAvailability }) => {
    const sortedDays = Object.keys(weekData).sort();
    const missingDatesAdded: Array<string> = [];

    // Agregar los días festivos al array de días si no están incluidos
    if (holidays && holidays.length > 0) {
        holidays.forEach(h => {
            const holidayWeek = dayjs(h).isoWeek();
            if (holidayWeek === week && new Date(h).getDay() !== 0 && new Date(h).getDay() !== 6) {
                const holidayDateStr = dayjs(h).format("YYYY-MM-DD");
                if (!sortedDays.includes(holidayDateStr)) {
                    sortedDays.push(holidayDateStr);
                    missingDatesAdded.push(holidayDateStr);
                }
            }
        });
    }
    sortedDays.sort();

    // Asegurarse de que haya al menos 5 días (de lunes a viernes). Para cuando un periodo no empieza o termina en lunes o viernes
    if (sortedDays.length < 5) {
        const firstDay = new Date(sortedDays[0]).getDay();
        const lastDay = new Date(sortedDays[sortedDays.length - 1]).getDay();
        if (firstDay > 1) { //Faltan días al inicio
            for (let i = 1; i < firstDay; i++) {
                const missingDate = dayjs(sortedDays[0]).subtract(1, 'day').format("YYYY-MM-DD");
                sortedDays.unshift(missingDate);
                missingDatesAdded.push(missingDate);
            }
        }

        if (lastDay < 5) { //Faltan días al final
            for (let i = lastDay; i < 5; i++) {
                const missingDate = dayjs(sortedDays[sortedDays.length - 1]).add(1, 'day').format("YYYY-MM-DD");
                sortedDays.push(missingDate);
                missingDatesAdded.push(missingDate);
            }
        }
    }

    const getCellData = (hour: number, day: string): SupportedDateAvailabilityStatus => {
        const match = weekData[day]?.find((d) => dayjs(d.date).hour() === hour);
        return match?.status ?? SupportedDateAvailabilityStatus.available;
    };

    const getCellID = (hour: number, day: string): string => {
        const match = weekData[day]?.find((d) => dayjs(d.date).hour() === hour);
        return match?.id
    };


    const getContextualMenuProps = (day: Date): IContextualMenuProps => {
        return {
            shouldFocusOnMount: true,
            items: [
                { key: AvailabilityBulkActions.allDayPreferred, text: Planning.MyAvailability.AvailabilityTable.ContextualMenu.MarkAllDayAsPreferred, onClick: () => changeBulkDayAvailability(AvailabilityBulkActions.allDayPreferred, day) },
                { key: AvailabilityBulkActions.allDayBlocked, text: Planning.MyAvailability.AvailabilityTable.ContextualMenu.MarkAllDayAsBlocked, onClick: () => changeBulkDayAvailability(AvailabilityBulkActions.allDayBlocked, day) },
                { key: AvailabilityBulkActions.allDayAvailable, text: Planning.MyAvailability.AvailabilityTable.ContextualMenu.MarkAllDayAsAvailable, onClick: () => changeBulkDayAvailability(AvailabilityBulkActions.allDayAvailable, day) },
                { key: AvailabilityBulkActions.replyDayToAllDaysWeek, text: Planning.MyAvailability.AvailabilityTable.ContextualMenu.ReplicateDayToAllWeek, onClick: () => changeBulkDayAvailability(AvailabilityBulkActions.replyDayToAllDaysWeek, day) },
                { key: AvailabilityBulkActions.replyDayToMonth, text: Planning.MyAvailability.AvailabilityTable.ContextualMenu.ReplicateDayToMonth, onClick: () => changeBulkDayAvailability(AvailabilityBulkActions.replyDayToMonth, day) },
                { key: AvailabilityBulkActions.replyDayToPeriod, text: Planning.MyAvailability.AvailabilityTable.ContextualMenu.ReplicateDayToPeriod, onClick: () => changeBulkDayAvailability(AvailabilityBulkActions.replyDayToPeriod, day) }
            ],
        }
    }

    return (
        <div>
            {!isOpenAvailability &&
                <MessageBar messageBarType={MessageBarType.warning}>{Planning.MyAvailability.AvailabilityTable.ClosedPeriodMessage}</MessageBar>
            }
            <table className={styles.availabilityTable}>
                <thead>
                    <tr>
                        <th />
                        {sortedDays.map((day) => (
                            <th key={day}>
                                <div className={styles.dayHeader}>
                                    {dayjs(day).format("ddd D")}
                                    {!missingDatesAdded.includes(day)
                                        && <IconButton iconProps={{ iconName: 'MoreVertical' }} title={Planning.MyAvailability.AvailabilityTable.ContextualMenu.Options} menuProps={getContextualMenuProps(new Date(day))} />
                                    }
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {HOURS.map((hour) => (
                        <tr key={hour}>
                            <td className={styles.hourCell}>{`${hour}:00`}</td>
                            {sortedDays.map((day) => {
                                const value = getCellData(hour, day);
                                const cellId = getCellID(hour, day);

                                if (!cellId)
                                    return <td key={`${day}-${hour}`} className={`${styles.cell} ${styles.empty}`} />

                                const isVisible =
                                    filter === FilterAvailabilityStatus.all ||
                                    (filter === FilterAvailabilityStatus.preferred && value === SupportedDateAvailabilityStatus.preferred) ||
                                    (filter === FilterAvailabilityStatus.blocked && value === SupportedDateAvailabilityStatus.blocked);

                                const className =
                                    isVisible && value === SupportedDateAvailabilityStatus.preferred
                                        ? styles.preferred
                                        : isVisible && value === SupportedDateAvailabilityStatus.blocked
                                            ? styles.blocked
                                            : "";

                                return (
                                    <td
                                        key={cellId}
                                        onClick={() => isOpenAvailability && changeDayAvailability(cellId)}
                                        className={`${styles.cell} ${className} ${!isOpenAvailability ? styles.disabled : ''}`}
                                    >
                                        {isVisible && value === SupportedDateAvailabilityStatus.preferred && <span>❤︎</span>}
                                        {isVisible && value === SupportedDateAvailabilityStatus.blocked && <span>✖</span>}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default WeekAvailabilityTable;