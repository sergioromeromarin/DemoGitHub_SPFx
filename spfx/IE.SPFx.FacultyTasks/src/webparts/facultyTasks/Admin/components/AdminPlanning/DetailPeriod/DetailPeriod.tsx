import * as React from 'react';
import styles from './DetailPeriod.module.scss';
import { Admin } from 'FacultyTasksWebPartStrings';
import { Modal } from '@fluentui/react/lib/Modal';
import { Label } from '@fluentui/react/lib/Label';
import { IconButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { useAppStore } from 'store/useAppStore';
import { useAdminPlanningStore } from 'store/useAdminPlanningStore';

const MODAL_SCROLL_CONTAINER_CLASSNAME = "modalScrollContainer";

const DetailPeriod: React.FC = () => {

    const { currentUICultureName } = useAppStore();
    const selectedPeriods = useAdminPlanningStore((state) => state.selectedPeriods);
    const isModalOpen_DetailPeriod = useAdminPlanningStore((state) => state.isModalOpen_DetailPeriod);
    const setIsModalOpen_DetailPeriod = useAdminPlanningStore((state) => state.setIsModalOpen_DetailPeriod);

    const onCloseModal = (): void => {
        setIsModalOpen_DetailPeriod(false);
    };

    const period = selectedPeriods[0];

    return (
        <Modal
            isOpen={isModalOpen_DetailPeriod}
            isBlocking={true}
            isDarkOverlay={true}
            onDismiss={() => onCloseModal()}
            containerClassName={styles.modal}
            scrollableContentClassName={MODAL_SCROLL_CONTAINER_CLASSNAME}
        >
            <div className={styles.modalTitle}>
                {Admin.Planning.DetailPeriodModal.Title}
                <IconButton
                    styles={{ root: { marginLeft: 'auto', marginTop: '4px', marginRight: '2px' } }}
                    iconProps={{ iconName: 'Cancel' }}
                    onClick={() => onCloseModal()}
                />
            </div>
            <div className={styles.modalContainer}>
                {period &&
                    <div className={styles.principalInfo}>
                        <div className={styles.periodDetails}>
                            <div className={styles.periodData}>
                                <Label>{Admin.Planning.PeriodFormModal.Course}</Label>
                                <span>{period.course}</span>
                            </div>
                            <div className={styles.periodData}>
                                <Label>{Admin.Planning.PeriodFormModal.Name}</Label>
                                <span>{period.name}</span>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.periodData}>
                                    <Label>{Admin.Planning.PeriodFormModal.PeriodStartDate}</Label>
                                    <span>{period.periodStartDate?.toLocaleDateString(currentUICultureName, { year: "numeric", month: "2-digit", day: "2-digit" })}</span>
                                </div>
                                <div className={styles.periodData}>
                                    <Label>{Admin.Planning.PeriodFormModal.PeriodEndDate}</Label>
                                    <span>{period.periodEndDate?.toLocaleDateString(currentUICultureName, { year: "numeric", month: "2-digit", day: "2-digit" })}</span>
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.periodData}>
                                    <Label>{Admin.Planning.PeriodFormModal.Holidays}</Label>
                                    {period.holidays.length > 0
                                        && <div className={styles.holidaysList}>
                                            {period.holidays.sort((a, b) => new Date(a.holidayDate).getTime() - new Date(b.holidayDate).getTime()).map((holiday, index) => (
                                                <div key={index} className={styles.holidayItem}>
                                                    {new Date(holiday.holidayDate).toLocaleDateString(currentUICultureName, { year: "numeric", month: "2-digit", day: "2-digit" })}
                                                </div>
                                            ))}
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.periodData}>
                                    <Label>{Admin.Planning.PeriodFormModal.AvailabilityStartDate}</Label>
                                    <span>{period.availabilityStartDate?.toLocaleDateString(currentUICultureName, { year: "numeric", month: "2-digit", day: "2-digit" })}</span>
                                </div>
                                <div className={styles.periodData}>
                                    <Label>{Admin.Planning.PeriodFormModal.AvailabilityEndDate}</Label>
                                    <span>{period.availabilityEndDate?.toLocaleDateString(currentUICultureName, { year: "numeric", month: "2-digit", day: "2-digit" })}</span>
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.periodData}>
                                    <Label>{Admin.Planning.PeriodFormModal.AssignmentReviewStartDate}</Label>
                                    <span>{period.assignmentReviewStartDate?.toLocaleDateString(currentUICultureName, { year: "numeric", month: "2-digit", day: "2-digit" })}</span>
                                </div>
                                <div className={styles.periodData}>
                                    <Label>{Admin.Planning.PeriodFormModal.AssignmentReviewEndDate}</Label>
                                    <span>{period.assignmentReviewEndDate?.toLocaleDateString(currentUICultureName, { year: "numeric", month: "2-digit", day: "2-digit" })}</span>
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.periodData}>
                                    <Label>{Admin.Planning.PeriodFormModal.HoursPerDay}</Label>
                                    <span>{period.hoursPerDay}</span>
                                </div>
                                <div className={styles.periodData}>
                                    <Label>{Admin.Planning.PeriodFormModal.GapsCoefficient}</Label>
                                    <span>{period.gapsCoefficient}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <div className={styles.footerButtons}>
                    <PrimaryButton
                        text={Admin.Planning.DetailPeriodModal.BtnClose}
                        onClick={() => onCloseModal()}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default DetailPeriod;