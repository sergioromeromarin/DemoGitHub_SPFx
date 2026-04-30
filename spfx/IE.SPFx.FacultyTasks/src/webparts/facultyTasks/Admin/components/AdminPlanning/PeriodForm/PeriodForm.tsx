import * as React from 'react';
import styles from './PeriodForm.module.scss';
import { Modal } from '@fluentui/react/lib/Modal';
import { TextField } from '@fluentui/react/lib/TextField';
import { DefaultButton, IconButton, PrimaryButton, } from '@fluentui/react/lib/Button';
import { Admin, CommonStrings } from 'FacultyTasksWebPartStrings';
import { DatePicker, DayOfWeek, Label, Position, SpinButton } from '@fluentui/react';
import { PeriodDataForm } from 'types';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import toast from 'react-hot-toast';
import { TextField_MaxLenght } from 'utils/Constants';
import { useAdminPlanningStore } from 'store/useAdminPlanningStore';
import { useAppStore } from 'store/useAppStore';
import { addHoursToDate } from 'utils/Utils';


const MODAL_SCROLL_CONTAINER_CLASSNAME = "modalScrollContainer";

const MODES = {
    New: 'New',
    Edit: 'Edit'
}
type Mode = keyof typeof MODES

const PeriodForm: React.FC = () => {

    const [mode, setMode] = React.useState<Mode>("New");
    const [period, setPeriod] = React.useState<PeriodDataForm>({
        course: undefined,
        name: undefined,
        periodStartDate: undefined,
        periodEndDate: undefined,
        availabilityStartDate: undefined,
        availabilityEndDate: undefined,
        assignmentReviewStartDate: undefined,
        assignmentReviewEndDate: undefined,
        hoursPerDay: undefined,
        gapsCoefficient: undefined,
        holidays: []
    });
    const [savingData, setSavingData] = React.useState(false);
    const [newHoliday, setNewHoliday] = React.useState<Date | undefined>(undefined);

    const createPeriod = useAdminPlanningStore((state) => state.createPeriod);
    const updatePeriod = useAdminPlanningStore((state) => state.updatePeriod);
    const setIsModalOpen_PeriodForm = useAdminPlanningStore((state) => state.setIsModalOpen_PeriodForm);
    const selectedPeriods = useAdminPlanningStore((state) => state.selectedPeriods);
    const isModalOpen_PeriodForm = useAdminPlanningStore((state) => state.isModalOpen_PeriodForm)
    const { currentUICultureName, serviceScope } = useAppStore();

    React.useEffect(() => {
        if (isModalOpen_PeriodForm) {
            if (selectedPeriods.length > 0) {
                setMode("Edit");
                setPeriod({
                    course: selectedPeriods[0].course,
                    name: selectedPeriods[0].name,
                    periodStartDate: selectedPeriods[0].periodStartDate,
                    periodEndDate: selectedPeriods[0].periodEndDate,
                    availabilityStartDate: selectedPeriods[0].availabilityStartDate,
                    availabilityEndDate: selectedPeriods[0].availabilityEndDate,
                    assignmentReviewStartDate: selectedPeriods[0].assignmentReviewStartDate,
                    assignmentReviewEndDate: selectedPeriods[0].assignmentReviewEndDate,
                    hoursPerDay: selectedPeriods[0].hoursPerDay,
                    gapsCoefficient: selectedPeriods[0].gapsCoefficient,
                    holidays: selectedPeriods[0].holidays
                })
            } else {
                setMode("New");
            }
        }
    }, [isModalOpen_PeriodForm]);

    const onCloseModal = (): void => {
        setPeriod({
            course: undefined,
            name: undefined,
            periodStartDate: undefined,
            periodEndDate: undefined,
            availabilityStartDate: undefined,
            availabilityEndDate: undefined,
            assignmentReviewStartDate: undefined,
            assignmentReviewEndDate: undefined,
            hoursPerDay: undefined,
            gapsCoefficient: undefined,
            holidays: []
        });
        setNewHoliday(undefined);
        setIsModalOpen_PeriodForm(false);
    };

    const onSavePeriod = async (): Promise<void> => {
        try {
            setSavingData(true);

            if (serviceScope) {
                if (mode === MODES.New) {
                    const createdPeriod = await createPeriod(serviceScope, period);

                    if (createdPeriod) {
                        toast.success(Admin.Planning.PeriodFormModal.CreateSuccess, { position: 'bottom-right', duration: 1500 })
                    } else {
                        toast.error(Admin.Planning.PeriodFormModal.CreateError, { position: 'bottom-right', duration: 1500 })
                    }
                } else {
                    const updatedPeriod = await updatePeriod(serviceScope, period, selectedPeriods[0].id);

                    if (updatedPeriod) {
                        toast.success(Admin.Planning.PeriodFormModal.UpdateSuccess, { position: 'bottom-right', duration: 1500 })
                    } else {
                        toast.error(Admin.Planning.PeriodFormModal.UpdateError, { position: 'bottom-right', duration: 1500 })
                    }
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSavingData(false);
            onCloseModal();
        }
    }

    const isMandatoryFieldsFilled = (): boolean => {
        let filled = false;
        if (period.course?.trim() && period.name?.trim() && period.periodStartDate && period.periodEndDate && period.availabilityStartDate && period.availabilityEndDate && period.assignmentReviewStartDate && period.assignmentReviewEndDate && period.hoursPerDay && period.gapsCoefficient) {
            filled = true;
        }
        return filled;
    }

    return (
        <Modal
            isOpen={isModalOpen_PeriodForm}
            isBlocking={true}
            isDarkOverlay={true}
            onDismiss={() => onCloseModal()}
            containerClassName={styles.modal}
            scrollableContentClassName={MODAL_SCROLL_CONTAINER_CLASSNAME}
        >
            <div className={styles.modalTitle}>
                {mode === MODES.New ? Admin.Planning.PeriodFormModal.NewFormTitle : Admin.Planning.PeriodFormModal.EditFormTitle}
                <IconButton
                    styles={{ root: { marginLeft: 'auto', marginTop: '4px', marginRight: '2px' } }}
                    iconProps={{ iconName: 'Cancel' }}
                    onClick={() => onCloseModal()}
                />
            </div>
            <div className={styles.modalContainer}>
                <TextField
                    label={Admin.Planning.PeriodFormModal.Course}
                    placeholder={Admin.Planning.PeriodFormModal.Placeholders.Course}
                    required
                    maxLength={TextField_MaxLenght.Course}
                    onChange={(event, newValue) => {
                        setPeriod({
                            ...period,
                            course: newValue
                        });
                    }}
                    errorMessage={isEmpty(period.course) ? CommonStrings.Required : undefined}
                    autoComplete='off'
                    value={period.course}
                />
                <TextField
                    label={Admin.Planning.PeriodFormModal.Name}
                    placeholder={Admin.Planning.PeriodFormModal.Placeholders.Name}
                    required
                    maxLength={TextField_MaxLenght.Name}
                    onChange={(event, newValue) => {
                        setPeriod({
                            ...period,
                            name: newValue
                        });
                    }}
                    errorMessage={isEmpty(period.name) ? CommonStrings.Required : undefined}
                    autoComplete='off'
                    value={period.name}
                />
                <div className={styles.row}>
                    <div className={styles.datePickerContainer}>
                        <DatePicker
                            firstDayOfWeek={DayOfWeek.Monday}
                            className={styles.datePicker}
                            label={Admin.Planning.PeriodFormModal.PeriodStartDate}
                            strings={CommonStrings.DayPickerStrings}
                            value={period.periodStartDate}
                            isRequired
                            formatDate={(date) => date ? date.toLocaleDateString(currentUICultureName, { year: "numeric", month: "2-digit", day: "2-digit" }) : ''}
                            onSelectDate={(date) =>
                                setPeriod({
                                    ...period,
                                    periodStartDate: date !== null ? addHoursToDate(date, 2) : undefined
                                })
                            }
                            minDate={new Date()}
                            maxDate={period.periodEndDate ? period.periodEndDate : undefined}
                        />
                        <IconButton iconProps={{ iconName: 'Delete' }}
                            className={styles.deleteDate}
                            title={CommonStrings.Delete}
                            ariaLabel={CommonStrings.Delete}
                            onClick={() => setPeriod({
                                ...period,
                                periodStartDate: undefined
                            })}
                        />
                    </div>
                    <div className={styles.datePickerContainer}>
                        <DatePicker
                            firstDayOfWeek={DayOfWeek.Monday}
                            className={styles.datePicker}
                            label={Admin.Planning.PeriodFormModal.PeriodEndDate}
                            strings={CommonStrings.DayPickerStrings}
                            value={period.periodEndDate}
                            isRequired
                            formatDate={(date) => date ? date.toLocaleDateString(currentUICultureName, { year: "numeric", month: "2-digit", day: "2-digit" }) : ''}
                            onSelectDate={(date) =>
                                setPeriod({
                                    ...period,
                                    periodEndDate: date !== null ? addHoursToDate(date, 2) : undefined
                                })
                            }
                            minDate={period.periodStartDate ? period.periodStartDate : undefined}
                        />
                        <IconButton iconProps={{ iconName: 'Delete' }}
                            className={styles.deleteDate}
                            title={CommonStrings.Delete}
                            ariaLabel={CommonStrings.Delete}
                            onClick={() => setPeriod({
                                ...period,
                                periodEndDate: undefined
                            })}
                        />
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.holidaysContainer}>
                        <Label>{Admin.Planning.PeriodFormModal.Holidays}</Label>
                        <span>{Admin.Planning.PeriodFormModal.HolidaysInfo}</span>
                        <div className={styles.newHoliday}>
                            <DatePicker
                                firstDayOfWeek={DayOfWeek.Monday}
                                className={styles.datePicker}
                                label={Admin.Planning.PeriodFormModal.AddHoliday}
                                strings={CommonStrings.DayPickerStrings}
                                value={newHoliday}
                                formatDate={(date) => date ? date.toLocaleDateString(currentUICultureName, { year: "numeric", month: "2-digit", day: "2-digit" }) : ''}
                                onSelectDate={(date) => setNewHoliday(date !== null ? date : undefined)}
                                minDate={period.periodStartDate ? period.periodStartDate : new Date()}
                                maxDate={period.periodEndDate ? period.periodEndDate : new Date()}
                            />
                            <IconButton
                                className={styles.addDate}
                                iconProps={{ iconName: 'AddTo' }}
                                title={Admin.Planning.PeriodFormModal.AddHoliday}
                                onClick={() => {
                                    if (newHoliday) {
                                        const newHolidayAtNoon = new Date(newHoliday);
                                        newHolidayAtNoon.setHours(12, 0, 0, 0);
                                        const exists = period.holidays.find((holiday) => {
                                            const holidayAtNoon = new Date(holiday.holidayDate);
                                            holidayAtNoon.setHours(12, 0, 0, 0);
                                            return holidayAtNoon.getTime() === newHolidayAtNoon.getTime();
                                        });
                                        if (!exists) {
                                            setPeriod({
                                                ...period,
                                                holidays: [...period.holidays, { holidayDate: newHolidayAtNoon }]
                                            });
                                        }
                                        setNewHoliday(undefined);
                                    }
                                }}
                            />
                        </div>
                        {period.holidays.length > 0
                            && <div className={styles.holidaysList}>
                                {period.holidays.sort((a, b) => new Date(a.holidayDate).getTime() - new Date(b.holidayDate).getTime()).map((holiday, index) => (
                                    <div key={index} className={styles.holidayItem}>
                                        {new Date(holiday.holidayDate).toLocaleDateString(currentUICultureName, { year: "numeric", month: "2-digit", day: "2-digit" })}
                                        <IconButton iconProps={{ iconName: 'Delete' }}
                                            title={CommonStrings.Delete}
                                            ariaLabel={CommonStrings.Delete}
                                            onClick={() => setPeriod({
                                                ...period,
                                                holidays: period.holidays.filter((h) => h !== holiday)
                                            })}
                                        />
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.datePickerContainer}>
                        <DatePicker
                            firstDayOfWeek={DayOfWeek.Monday}
                            className={styles.datePicker}
                            label={Admin.Planning.PeriodFormModal.AvailabilityStartDate}
                            strings={CommonStrings.DayPickerStrings}
                            value={period.availabilityStartDate}
                            isRequired
                            formatDate={(date) => date ? date.toLocaleDateString(currentUICultureName, { year: "numeric", month: "2-digit", day: "2-digit" }) : ''}
                            onSelectDate={(date) =>
                                setPeriod({
                                    ...period,
                                    availabilityStartDate: date !== null ? addHoursToDate(date, 2) : undefined
                                })
                            }
                            minDate={new Date()}
                            maxDate={period.availabilityEndDate ? period.availabilityEndDate : undefined}
                        />
                        <IconButton iconProps={{ iconName: 'Delete' }}
                            className={styles.deleteDate}
                            title={CommonStrings.Delete}
                            ariaLabel={CommonStrings.Delete}
                            onClick={() => setPeriod({
                                ...period,
                                availabilityStartDate: undefined
                            })}
                        />
                    </div>
                    <div className={styles.datePickerContainer}>
                        <DatePicker
                            firstDayOfWeek={DayOfWeek.Monday}
                            className={styles.datePicker}
                            label={Admin.Planning.PeriodFormModal.AvailabilityEndDate}
                            strings={CommonStrings.DayPickerStrings}
                            value={period.availabilityEndDate}
                            isRequired
                            formatDate={(date) => date ? date.toLocaleDateString(currentUICultureName, { year: "numeric", month: "2-digit", day: "2-digit" }) : ''}
                            onSelectDate={(date) =>
                                setPeriod({
                                    ...period,
                                    availabilityEndDate: date !== null ? addHoursToDate(date, 2) : undefined
                                })
                            }
                            minDate={period.availabilityStartDate ? period.availabilityStartDate : undefined}
                        />
                        <IconButton iconProps={{ iconName: 'Delete' }}
                            className={styles.deleteDate}
                            title={CommonStrings.Delete}
                            ariaLabel={CommonStrings.Delete}
                            onClick={() => setPeriod({
                                ...period,
                                availabilityEndDate: undefined
                            })}
                        />
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.datePickerContainer}>
                        <DatePicker
                            firstDayOfWeek={DayOfWeek.Monday}
                            className={styles.datePicker}
                            label={Admin.Planning.PeriodFormModal.AssignmentReviewStartDate}
                            strings={CommonStrings.DayPickerStrings}
                            value={period.assignmentReviewStartDate}
                            isRequired
                            formatDate={(date) => date ? date.toLocaleDateString(currentUICultureName, { year: "numeric", month: "2-digit", day: "2-digit" }) : ''}
                            onSelectDate={(date) =>
                                setPeriod({
                                    ...period,
                                    assignmentReviewStartDate: date !== null ? addHoursToDate(date, 2) : undefined
                                })
                            }
                            minDate={new Date()}
                            maxDate={period.assignmentReviewEndDate ? period.assignmentReviewEndDate : undefined}
                        />
                        <IconButton iconProps={{ iconName: 'Delete' }}
                            className={styles.deleteDate}
                            title={CommonStrings.Delete}
                            ariaLabel={CommonStrings.Delete}
                            onClick={() => setPeriod({
                                ...period,
                                assignmentReviewStartDate: undefined
                            })}
                        />
                    </div>
                    <div className={styles.datePickerContainer}>
                        <DatePicker
                            firstDayOfWeek={DayOfWeek.Monday}
                            className={styles.datePicker}
                            label={Admin.Planning.PeriodFormModal.AssignmentReviewEndDate}
                            strings={CommonStrings.DayPickerStrings}
                            value={period.assignmentReviewEndDate}
                            isRequired
                            formatDate={(date) => date ? date.toLocaleDateString(currentUICultureName, { year: "numeric", month: "2-digit", day: "2-digit" }) : ''}
                            onSelectDate={(date) =>
                                setPeriod({
                                    ...period,
                                    assignmentReviewEndDate: date !== null ? addHoursToDate(date, 2) : undefined
                                })
                            }
                            minDate={period.assignmentReviewStartDate ? period.assignmentReviewStartDate : undefined}
                        />
                        <IconButton iconProps={{ iconName: 'Delete' }}
                            className={styles.deleteDate}
                            title={CommonStrings.Delete}
                            ariaLabel={CommonStrings.Delete}
                            onClick={() => setPeriod({
                                ...period,
                                assignmentReviewEndDate: undefined
                            })}
                        />
                    </div>
                </div>
                <div className={styles.row}>
                    <SpinButton
                        label={Admin.Planning.PeriodFormModal.HoursPerDay}
                        labelPosition={Position.top}
                        placeholder={Admin.Planning.PeriodFormModal.Placeholders.HoursPerDay}
                        defaultValue="0"
                        min={0}
                        max={10}
                        step={0.1}
                        styles={{ spinButtonWrapper: { width: 75 } }}
                        onChange={(event, newValue) => {
                            setPeriod({
                                ...period,
                                hoursPerDay: newValue ? parseFloat(newValue) : undefined
                            });
                        }}
                        className={styles.column}
                        value={period.hoursPerDay?.toString()}
                    />
                    <SpinButton
                        label={Admin.Planning.PeriodFormModal.GapsCoefficient}
                        labelPosition={Position.top}
                        placeholder={Admin.Planning.PeriodFormModal.Placeholders.GapsCoefficient}
                        defaultValue="0"
                        min={0}
                        max={10}
                        step={0.1}
                        styles={{ spinButtonWrapper: { width: 75 } }}
                        onChange={(event, newValue) => {
                            setPeriod({
                                ...period,
                                gapsCoefficient: newValue ? parseFloat(newValue) : undefined
                            });
                        }}
                        className={styles.column}
                        value={period.gapsCoefficient?.toString()}
                    />
                </div>
                <div className={styles.footerButtons}>
                    <DefaultButton
                        text={Admin.Planning.PeriodFormModal.BtnCancel}
                        onClick={() => onCloseModal()}
                        disabled={savingData}
                    />
                    <PrimaryButton
                        text={mode === MODES.New ? Admin.Planning.PeriodFormModal.BtnSaveNewPeriod : Admin.Planning.PeriodFormModal.BtnSaveEditPeriod}
                        onClick={onSavePeriod}
                        className={styles.btnSave}
                        disabled={!isMandatoryFieldsFilled() || savingData}
                    />
                </div>
            </div>
        </Modal>
    );

};

export default PeriodForm;