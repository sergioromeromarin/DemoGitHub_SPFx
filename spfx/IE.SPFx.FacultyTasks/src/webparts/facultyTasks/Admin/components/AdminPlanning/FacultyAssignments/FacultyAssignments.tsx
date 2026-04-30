import * as React from 'react';
import styles from './FacultyAssignments.module.scss';
import { Modal } from '@fluentui/react/lib/Modal';
import { DefaultButton, IconButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { useAdminPlanningStore } from 'store/useAdminPlanningStore';
import { useAppStore } from 'store/useAppStore';
import { Admin } from 'FacultyTasksWebPartStrings';
import { FacultyTasksService } from 'services/FacultyTasksService';
import { MessageBar, Spinner, SpinnerSize } from '@fluentui/react';
import { isEmpty } from '@microsoft/sp-lodash-subset/lib/index';
import { UserDTO } from 'types';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { UserGroupId } from 'appSettings';
import { Persona } from '@fluentui/react/lib/Persona';
import { GraphService } from 'services/GraphService';
import * as microsoftTeams from "@microsoft/teams-js";

const MODAL_SCROLL_CONTAINER_CLASSNAME = "modalScrollContainer";

const FacultyAssignments: React.FC = () => {

    const selectedPeriods = useAdminPlanningStore((state) => state.selectedPeriods);
    const isModalOpen_AssignmentsPeriod = useAdminPlanningStore((state) => state.isModalOpen_FacultyAssignments);
    const setIsModalOpen_AssignmentsPeriod = useAdminPlanningStore((state) => state.setIsModalOpen_FacultyAssignments)
    const { serviceScope, absoluteUrl, msGraphClientFactory, spHttpClient, hasTeamsContext } = useAppStore((state) => state);
    const [isDownloading, setIsDownloading] = React.useState<string>("");
    const [isSearching, setIsSearching] = React.useState<boolean>(false);
    const [teacher, setTeacher] = React.useState<UserDTO | undefined>(undefined);
    const [noDataTeacher, setNoDataTeacher] = React.useState<boolean>(false);
    const [noAssignmentsInPeriod, setNoAssignmentsInPeriod] = React.useState<boolean>(false);

    const period = selectedPeriods[0];

    const onCloseModal = (): void => {
        setIsModalOpen_AssignmentsPeriod(false);
        setIsDownloading("");
        setTeacher(undefined);
        setNoDataTeacher(false);
        setNoAssignmentsInPeriod(false);
    };

    const onExportUserAssignments = async (userId: string, periodId: string, teacherEmail: string): Promise<void> => {
        try {
            setIsDownloading(userId);
            if (!serviceScope) return;
            const facultyTasksService = serviceScope.consume(FacultyTasksService.serviceKey);
            const blob = await facultyTasksService.exportAssignmentsByUserAndPeriod(userId, periodId);
            if (!blob) return;
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `User_assignments_${period.course}_${period.name}_${teacherEmail.substring(0, teacherEmail.indexOf('@'))}.csv`;
            link.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        }
        finally {
            setIsDownloading("");
        }
    };

    const onExportPeriodAssignments = async (periodId: string): Promise<void> => {
        try {
            setIsDownloading(periodId);
            if (!serviceScope) return;
            const facultyTasksService = serviceScope.consume(FacultyTasksService.serviceKey);
            const blob = await facultyTasksService.exportAssignmentsByPeriod(periodId);

            if (!blob) {
                setNoAssignmentsInPeriod(true);
            } else {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Term_assignments_${period.course}_${period.name}.csv`;
                link.click();
                window.URL.revokeObjectURL(url);
            }

        } catch (error) {
            console.error(error);
        }
        finally {
            setIsDownloading("");
        }
    };

    const onChatWithTeacher = async (email: string): Promise<void> => {
        try {
            await microsoftTeams.chat.openChat({
                user: email
            });
        } catch (error) {
            console.error("Error opening chat:", error);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchUserAssignment = async (items: any[]): Promise<void> => {
        setNoDataTeacher(false);
        if (items && items.length > 0) {
            const fullId: string = items[0].id;
            const emailStartIndex = fullId.lastIndexOf('|') + 1;
            const email = fullId.substring(emailStartIndex);

            if (!serviceScope) return;
            setIsSearching(true);
            const facultyTasksService = serviceScope.consume(FacultyTasksService.serviceKey);
            const teacherAssignment = await facultyTasksService.evalTeacherHasAssignment(period?.id, email);

            if (teacherAssignment) {
                const graphService = serviceScope.consume(GraphService.serviceKey);
                teacherAssignment.photoUrl = await graphService.getUserPhoto(email);
                setTeacher(teacherAssignment)
            }
            else {
                setTeacher(undefined);
                setNoDataTeacher(true);
            }
            setIsSearching(false);
        }
        else {
            setTeacher(undefined);
        }
    }

    return (
        <Modal
            isOpen={isModalOpen_AssignmentsPeriod}
            isBlocking={true}
            isDarkOverlay={true}
            onDismiss={() => onCloseModal()}
            containerClassName={styles.modal}
            scrollableContentClassName={MODAL_SCROLL_CONTAINER_CLASSNAME}
        >
            <div className={styles.modalTitle}>
                {Admin.Planning.FacultyAssignmentsModal.Title}
                <IconButton
                    styles={{ root: { marginLeft: 'auto', marginTop: '4px', marginRight: '2px' } }}
                    iconProps={{ iconName: 'Cancel' }}
                    onClick={() => onCloseModal()}
                />
            </div>
            <div className={styles.modalContainer}>
                {period &&
                    <>
                        <div className={styles.facultyAssignments}>
                            <p>{Admin.Planning.FacultyAssignmentsModal.Subtitle} <strong>{period.course}-{period.name}</strong>:</p>
                            {(absoluteUrl !== undefined) && (msGraphClientFactory !== undefined) && (spHttpClient !== undefined) &&
                                <PeoplePicker
                                    context={{
                                        absoluteUrl: absoluteUrl,
                                        msGraphClientFactory: msGraphClientFactory,
                                        spHttpClient: spHttpClient
                                    }}
                                    titleText={Admin.Planning.FacultyAssignmentsModal.SearchFacultyMember}
                                    personSelectionLimit={1}
                                    groupId={UserGroupId}
                                    showtooltip={true}
                                    searchTextLimit={5}
                                    onChange={searchUserAssignment}
                                    showHiddenInUI={false}
                                    principalTypes={[PrincipalType.User]}
                                    resolveDelay={1000} />
                            }
                            {isSearching
                                ? <Spinner
                                    label={Admin.Planning.FacultyAssignmentsModal.SearchingUser}
                                    labelPosition='bottom'
                                    size={SpinnerSize.medium}
                                    className={styles.spinner} />
                                : <>
                                    {teacher === undefined
                                        ? <>
                                            {noDataTeacher
                                                ? <MessageBar>{Admin.Planning.FacultyAssignmentsModal.NoDataForUser}</MessageBar>
                                                : <MessageBar>{Admin.Planning.FacultyAssignmentsModal.NoUserSelected}</MessageBar>
                                            }
                                        </>
                                        : <div className={styles.facultyMember}>
                                            <Persona
                                                imageUrl={teacher.photoUrl} text={teacher.displayName} secondaryText={teacher.email} coinSize={48}
                                            />
                                            {hasTeamsContext &&
                                                <IconButton iconProps={{ iconName: 'Chat' }} onClick={() => onChatWithTeacher(teacher.email)} disabled={!isEmpty(isDownloading)} title={Admin.Planning.FacultyAssignmentsModal.ChatWithTeacher} alt={Admin.Planning.FacultyAssignmentsModal.ChatWithTeacher} />
                                            }
                                            <DefaultButton
                                                onClick={() => onExportUserAssignments(teacher.id, period.id, teacher.email)} disabled={!isEmpty(isDownloading)}>
                                                {isDownloading && isDownloading === teacher.id
                                                    && <Spinner size={SpinnerSize.small} className={styles.downloadSpinner} />
                                                }
                                                {Admin.Planning.FacultyAssignmentsModal.Assignments}
                                            </DefaultButton>
                                        </div>
                                    }
                                </>
                            }
                            <div className={styles.exportButtons}>
                                <DefaultButton text={Admin.Planning.FacultyAssignmentsModal.BtnExportAll} onClick={() => onExportPeriodAssignments(period.id)} disabled={!isEmpty(isDownloading)} />
                                {noAssignmentsInPeriod &&
                                    <MessageBar>{Admin.Planning.FacultyAssignmentsModal.NoAssignmentsInPeriod}</MessageBar>
                                }
                            </div>
                        </div>
                    </>
                }
                <div className={styles.footerButtons}>
                    <PrimaryButton
                        text={Admin.Planning.FacultyAssignmentsModal.BtnClose}
                        onClick={() => onCloseModal()}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default FacultyAssignments;