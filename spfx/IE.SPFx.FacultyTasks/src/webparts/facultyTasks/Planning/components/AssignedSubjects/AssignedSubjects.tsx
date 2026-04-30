import { useMyAssignments } from 'hooks/useMyAssignments';
import * as React from 'react';
import { customFormatDate, isTodayInOpenAssignment, isTodayInOpenPeriod } from 'utils/Utils';
import styles from './AssignedSubjects.module.scss';
import { DefaultButton, Dropdown, DropdownMenuItemType, FontIcon, Icon, IDropdownOption, MessageBar, MessageBarType, PrimaryButton } from '@fluentui/react';
import { Assignment, SupportedAssignmentStatus, SupportedAvailabilityCompatibility } from 'types';
import { Planning } from 'FacultyTasksWebPartStrings';
import { useNavigate } from 'react-router-dom';
import AcceptAssignmentForm from '../AcceptAssignmentForm/AcceptAssignmentForm';
import RejectAssignmentForm from '../RejectAssignmentForm/RejectAssignmentForm';
import toast from 'react-hot-toast';
import { useAppStore } from 'store/useAppStore';
import { FacultyTasksService } from 'services/FacultyTasksService';
import Loader from "../../../components/Loader/Loader";

const AssignedSubjects: React.FC = () => {

    const { isDataLoaded, periods, selectedPeriod, assignments, isAllAvailable, changeSelectedPeriod, updateStateAssignment } = useMyAssignments();
    const [isModalOpen_AcceptAssignmentForm, setIsModalOpen_AcceptAssignmentForm] = React.useState(false);
    const [isModalOpen_RejectAssignmentForm, setIsModalOpen_RejectAssignmentForm] = React.useState(false);
    const [selectedAssignment, setSelectedAssignment] = React.useState<Assignment | undefined>(undefined);
    const { serviceScope } = useAppStore();

    const navigate = useNavigate();

    const getCampusIcon = (campus: string): JSX.Element | null => {
        const campusLowerCase = campus.toLowerCase();
        if (campusLowerCase === 'madrid') {
            return <img src={require("../../../assets/madrid.png")} alt="Madrid" style={{ width: '35px', height: '35px', marginTop: '1px' }} />;
        } else if (campusLowerCase === 'segovia') {
            return <img src={require("../../../assets/segovia.png")} alt="Segovia" style={{ width: '35px', height: '35px', marginTop: '3px' }} />;
        }
        return null;
    };

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
        }
    };



    const onAcceptAssignment = async (sessionStructureQuestions: string, additionalInfo: string): Promise<void> => {
        try {
            // setSavingData(true);
            if (serviceScope && selectedAssignment) {
                const facultyTasksService = serviceScope.consume(FacultyTasksService.serviceKey);
                const acceptedAssignment = await facultyTasksService.acceptMyAssignment(selectedAssignment.id, sessionStructureQuestions, additionalInfo);
                if (acceptedAssignment) {
                    toast.success(Planning.MyAssigments.AcceptAssignmentSuccess, { position: 'bottom-right', duration: 1500 })
                    updateStateAssignment(selectedAssignment.id, SupportedAssignmentStatus.accepted);
                } else {
                    toast.error(Planning.MyAssigments.AcceptAssignmentError, { position: 'bottom-right', duration: 1500 })
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            // setSavingData(false);
        }
    }

    const onRejectAssignment = async (rejectionReason: string): Promise<void> => {
        try {
            // setSavingData(true);
            if (serviceScope && selectedAssignment) {
                const facultyTasksService = serviceScope.consume(FacultyTasksService.serviceKey);
                const rejectedAssignment = await facultyTasksService.rejectMyAssignment(selectedAssignment.id, rejectionReason);
                if (rejectedAssignment) {
                    toast.success(Planning.MyAssigments.RejectAssignmentSuccess, { position: 'bottom-right', duration: 1500 })
                    updateStateAssignment(selectedAssignment.id, SupportedAssignmentStatus.rejected);
                } else {
                    toast.error(Planning.MyAssigments.RejectAssignmentError, { position: 'bottom-right', duration: 1500 })
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            // setSavingData(false);
        }
    }

    return (
        <section className={styles.assignedSubjectsSection}>
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
                        <MessageBar messageBarType={MessageBarType.warning}>{Planning.MyAssigments.Messages.NoPeriods}</MessageBar>
                        : <div className={styles.assignmentsResultArea} >
                            {assignments.length === 0 ?
                                <MessageBar messageBarType={MessageBarType.warning}>{Planning.MyAssigments.MessageBar.NoAssignmentsInPeriod}</MessageBar>
                                : <>
                                    {!isTodayInOpenAssignment(selectedPeriod) &&
                                        <MessageBar messageBarType={MessageBarType.warning}>{Planning.MyAssigments.Messages.ClosedAssignmentPeriodMessage}</MessageBar>
                                    }
                                    <div className={styles.assigmentsSummary}>
                                        {assignments.filter(a => a.status === SupportedAssignmentStatus.pending).length > 0 && (
                                            <div className={styles.assigmentSummary}>
                                                <div className={styles.assigmentSummaryTitle}>
                                                    <h1>{Planning.MyAssigments.Summary.PendingShort}</h1>
                                                    <FontIcon iconName="Clock" className={`${styles.assigmentStatusIcon} ${styles.assigmentStatusIconPending}`} />
                                                </div>
                                                <div className={styles.assigmentSummaryNumbers}>
                                                    <h2>{assignments.filter(a => a.status === SupportedAssignmentStatus.pending).length < 9 && '0'}{assignments.filter(a => a.status === SupportedAssignmentStatus.pending).length}</h2>
                                                    <h3>/{assignments.length < 9 && '0'}{assignments.length}</h3>
                                                </div>
                                                <h4>{Planning.MyAssigments.Summary.Pending}</h4>
                                                <p>{Planning.MyAssigments.Summary.Assignments}</p>
                                            </div>
                                        )}
                                        {assignments.filter(a => a.compatibilityStatus === SupportedAvailabilityCompatibility.conflicted).length > 0 && (
                                            <div className={styles.assigmentSummary}>
                                                <div className={styles.assigmentSummaryTitle}>
                                                    <h1>{Planning.MyAssigments.Summary.ConflictedShort}</h1>
                                                    <FontIcon iconName="Warning" className={`${styles.assigmentStatusIcon} ${styles.assigmentStatusIconConflicted}`} />
                                                </div>
                                                <div className={styles.assigmentSummaryNumbers}>
                                                    <h2>{assignments.filter(a => a.compatibilityStatus === SupportedAvailabilityCompatibility.conflicted).length < 9 && '0'}{assignments.filter(a => a.compatibilityStatus === SupportedAvailabilityCompatibility.conflicted).length}</h2>
                                                    <h3>/{assignments.length < 9 && '0'}{assignments.length}</h3>
                                                </div>
                                                <h4>{Planning.MyAssigments.Summary.Conflicted}</h4>
                                                <p>{Planning.MyAssigments.Summary.Assignments}</p>
                                            </div>
                                        )}
                                        {assignments.filter(a => a.status === SupportedAssignmentStatus.accepted).length > 0 && (
                                            <div className={styles.assigmentSummary}>
                                                <div className={styles.assigmentSummaryTitle}>
                                                    <h1>{Planning.MyAssigments.Summary.AcceptedShort}</h1>
                                                    <FontIcon iconName="CheckMark" className={`${styles.assigmentStatusIcon} ${styles.assigmentStatusIconAccepted}`} />
                                                </div>
                                                <div className={styles.assigmentSummaryNumbers}>
                                                    <h2>{assignments.filter(a => a.status === SupportedAssignmentStatus.accepted).length < 9 && '0'}{assignments.filter(a => a.status === SupportedAssignmentStatus.accepted).length}</h2>
                                                    <h3>/{assignments.length < 9 && '0'}{assignments.length}</h3>
                                                </div>
                                                <h4>{Planning.MyAssigments.Summary.Accepted}</h4>
                                                <p>{Planning.MyAssigments.Summary.Assignments}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.assignmentsList}>
                                        {assignments.map((assignment) => (
                                            <div key={assignment.id} className={`${styles.assignmentItem} ${assignment.compatibilityStatus === SupportedAvailabilityCompatibility.conflicted ? styles.conflictedCompatibility : ''}`}>
                                                <div className={styles.assignmentHeader}>
                                                    <div className={styles.assignmentHeaderData}>
                                                        <span>{assignment.program}</span>
                                                        <span>{assignment.intakeName}</span>
                                                    </div>
                                                    <div className={styles.assignmentTags}>
                                                        {assignment.status === SupportedAssignmentStatus.pending && <span className={`${styles.tag} ${styles.pendingTag}`}>{Planning.MyAssigments.AssignmentStatus.Pending}</span>}
                                                        {assignment.status === SupportedAssignmentStatus.accepted && <span className={`${styles.tag} ${styles.acceptedTag}`}>{Planning.MyAssigments.AssignmentStatus.Accepted}</span>}
                                                        {assignment.status === SupportedAssignmentStatus.rejected && <span className={`${styles.tag} ${styles.rejectedTag}`}>{Planning.MyAssigments.AssignmentStatus.Rejected}</span>}
                                                        {assignment.compatibilityStatus === SupportedAvailabilityCompatibility.conflicted && <span className={`${styles.tag} ${styles.conflictedTag}`}><Icon iconName="Error" />{Planning.MyAssigments.AvailabilityCompatibility.Conflicted}</span>}
                                                        {assignment.compatibilityStatus === SupportedAvailabilityCompatibility.compatible && <span className={`${styles.tag} ${styles.compatibleTag}`}><Icon iconName="Completed" />{Planning.MyAssigments.AvailabilityCompatibility.Compatible}</span>}
                                                    </div>
                                                </div>
                                                <div className={styles.assignmentDetails}>
                                                    <h2>{assignment.subject}</h2>
                                                    <div className={styles.assignmentInfo}>
                                                        <span><Icon iconName="Calendar" />{customFormatDate(assignment.startDate)} <Icon iconName="DoubleChevronRight8" /> {customFormatDate(assignment.endDate)}</span>
                                                        <span><Icon iconName="Education" />{assignment.numberOfSessions} {Planning.MyAssigments.Sessions}</span>
                                                        <span><Icon iconName="Group" />{assignment.assignedSections} {Planning.MyAssigments.Sections}</span>
                                                        {assignment.campus && <span>{getCampusIcon(assignment.campus)}{assignment.campus}</span>}
                                                        {assignment.shift && <span><Icon iconName="Clock" />{assignment.shift}</span>}
                                                        {assignment.nTotalSessions && <span><Icon iconName="WhiteBoardApp16" />{assignment.nTotalSessions} {Planning.MyAssigments.TotalSessions}</span>}
                                                    </div>
                                                    {assignment.compatibilityStatus === SupportedAvailabilityCompatibility.conflicted && (
                                                        <div className={`${styles.messageBar} ${styles.conflicted}`}>
                                                            <h3><Icon iconName="Error" />{Planning.MyAssigments.MessageBar.ConflictDetectedTitle}</h3>
                                                            <p>{Planning.MyAssigments.MessageBar.ConflictDetectedMessage}</p>
                                                        </div>
                                                    )}
                                                    {assignment.compatibilityStatus === SupportedAvailabilityCompatibility.compatible && assignment.status === SupportedAssignmentStatus.accepted && (
                                                        <div className={`${styles.messageBar} ${styles.completedAndCompatible}`}>
                                                            <p><Icon iconName="Completed" />{Planning.MyAssigments.MessageBar.CompatibleMessage}</p>
                                                        </div>
                                                    )}
                                                    {isAllAvailable && (
                                                        <div className={`${styles.messageBar} ${styles.allAvailable}`}>
                                                            <p><Icon iconName="Warning" />{Planning.MyAssigments.MessageBar.AllAvailableMessage}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                {(assignment.status === SupportedAssignmentStatus.pending && isTodayInOpenAssignment(selectedPeriod)) && (
                                                    <div className={styles.assigmentActions}>
                                                        {assignment.compatibilityStatus === SupportedAvailabilityCompatibility.compatible &&
                                                            <PrimaryButton
                                                                text={Planning.MyAssigments.Actions.Accept}
                                                                onClick={() => {
                                                                    setSelectedAssignment(assignment);
                                                                    setIsModalOpen_AcceptAssignmentForm(true)
                                                                }} />
                                                        }
                                                        <PrimaryButton
                                                            text={Planning.MyAssigments.Actions.Reject}
                                                            onClick={() => {
                                                                setSelectedAssignment(assignment);
                                                                setIsModalOpen_RejectAssignmentForm(true)
                                                            }} />
                                                        {assignment.compatibilityStatus === SupportedAvailabilityCompatibility.conflicted &&
                                                            <DefaultButton text={Planning.MyAssigments.Actions.AdjustAvailability} onClick={() => navigate('/planning/myavailability')} />
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <AcceptAssignmentForm
                                        isOpenModal={isModalOpen_AcceptAssignmentForm}
                                        setIsOpenModal={setIsModalOpen_AcceptAssignmentForm}
                                        onAcceptAssignment={onAcceptAssignment}
                                        assignment={selectedAssignment}
                                    />
                                    <RejectAssignmentForm
                                        isOpenModal={isModalOpen_RejectAssignmentForm}
                                        setIsOpenModal={setIsModalOpen_RejectAssignmentForm}
                                        onRejectAssignment={onRejectAssignment}
                                        assignment={selectedAssignment}
                                    />
                                </>
                            }

                        </div>
                    }


                </>







            }
        </section>
    );
};

export default AssignedSubjects;