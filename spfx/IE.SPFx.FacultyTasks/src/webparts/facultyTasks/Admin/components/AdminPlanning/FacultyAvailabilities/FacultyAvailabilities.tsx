import * as React from 'react';
import styles from './FacultyAvailabilities.module.scss';
import { Modal } from '@fluentui/react/lib/Modal';
import { DefaultButton, IconButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { useAdminPlanningStore } from 'store/useAdminPlanningStore';
import { useAppStore } from 'store/useAppStore';
import { Admin } from 'FacultyTasksWebPartStrings';
import { FacultyTasksService } from 'services/FacultyTasksService';
import { MessageBar, Spinner, SpinnerSize } from '@fluentui/react';
import { isEmpty } from '@microsoft/sp-lodash-subset/lib/index';
import { SupportedDateAvailabilityStatus, UserDTO } from 'types';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { UserGroupId } from 'appSettings';
import { Persona } from '@fluentui/react/lib/Persona';
import { GraphService } from 'services/GraphService';
import * as microsoftTeams from "@microsoft/teams-js";

const MODAL_SCROLL_CONTAINER_CLASSNAME = "modalScrollContainer";

const FacultyAvailabilities: React.FC = () => {

    const selectedPeriods = useAdminPlanningStore((state) => state.selectedPeriods);
    const isModalOpen_AvailabilitiesPeriod = useAdminPlanningStore((state) => state.isModalOpen_FacultyAvailabilities);
    const setIsModalOpen_AvailabilitiesPeriod = useAdminPlanningStore((state) => state.setIsModalOpen_FacultyAvailabilities)
    const { serviceScope, absoluteUrl, msGraphClientFactory, spHttpClient, hasTeamsContext } = useAppStore((state) => state);
    const [isDownloading, setIsDownloading] = React.useState<string>("");
    const [isSearching, setIsSearching] = React.useState<boolean>(false);
    const [teacher, setTeacher] = React.useState<UserDTO | undefined>(undefined);
    const [noDataTeacher, setNoDataTeacher] = React.useState<boolean>(false);
    const [noAvailabilitiesInPeriod, setNoAvailabilitiesInPeriod] = React.useState<boolean>(false);

    const period = selectedPeriods[0];

    const onCloseModal = (): void => {
        setIsModalOpen_AvailabilitiesPeriod(false);
        setIsDownloading("")
        setTeacher(undefined);
        setNoDataTeacher(false);
        setNoAvailabilitiesInPeriod(false);
    };

    const onExportUserAvailabilities = async (userId: string, periodId: string, teacherEmail: string, availabilityStatus: SupportedDateAvailabilityStatus): Promise<void> => {
        try {
            setIsDownloading(`${userId}_${availabilityStatus}`);
            if (!serviceScope) return;
            const facultyTasksService = serviceScope.consume(FacultyTasksService.serviceKey);
            const blob = await facultyTasksService.exportAvailabilitiesByUserAndPeriod(userId, periodId, availabilityStatus);
            if (!blob) return;
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `User_${availabilityStatus}_availabilities_${period.course}_${period.name}_${teacherEmail.substring(0, teacherEmail.indexOf('@'))}.csv`;
            link.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        }
        finally {
            setIsDownloading("");
        }
    };

    const onExportPeriodAvailabilities = async (periodId: string, availabilityStatus: SupportedDateAvailabilityStatus): Promise<void> => {
        try {
            setIsDownloading(`${periodId}_${availabilityStatus}`);
            if (!serviceScope) return;
            const facultyTasksService = serviceScope.consume(FacultyTasksService.serviceKey);
            const blob = await facultyTasksService.exportAvailabilitiesByPeriod(periodId, availabilityStatus);

            if (!blob) {
                setNoAvailabilitiesInPeriod(true);
            } else {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Term_${availabilityStatus}_availabilities_${period.course}_${period.name}.csv`;
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchUserAvailability = async (items: any[]): Promise<void> => {
        setNoDataTeacher(false);
        if (items && items.length > 0) {
            const fullId: string = items[0].id;
            const emailStartIndex = fullId.lastIndexOf('|') + 1;
            const email = fullId.substring(emailStartIndex);

            if (!serviceScope) return;
            setIsSearching(true);
            const facultyTasksService = serviceScope.consume(FacultyTasksService.serviceKey);
            const teacherAvailability = await facultyTasksService.evalTeacherHasAvailability(period?.id, email);
            if (teacherAvailability) {
                const graphService = serviceScope.consume(GraphService.serviceKey);
                teacherAvailability.photoUrl = await graphService.getUserPhoto(email);
                setTeacher(teacherAvailability)
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

    const onChatWithTeacher = async (email: string): Promise<void> => {
        try {
            await microsoftTeams.chat.openChat({
                user: email
            });
        } catch (error) {
            console.error("Error opening chat:", error);
        }
    };

    return (
        <Modal
            isOpen={isModalOpen_AvailabilitiesPeriod}
            isBlocking={true}
            isDarkOverlay={true}
            onDismiss={() => onCloseModal()}
            containerClassName={styles.modal}
            scrollableContentClassName={MODAL_SCROLL_CONTAINER_CLASSNAME}
        >
            <div className={styles.modalTitle}>
                {Admin.Planning.FacultyAvailabilitiesModal.Title}
                <IconButton
                    styles={{ root: { marginLeft: 'auto', marginTop: '4px', marginRight: '2px' } }}
                    iconProps={{ iconName: 'Cancel' }}
                    onClick={() => onCloseModal()}
                />
            </div>
            <div className={styles.modalContainer}>
                {period &&
                    <>
                        <div className={styles.facultyAvailabilities}>
                            <p>{Admin.Planning.FacultyAvailabilitiesModal.Subtitle} <strong>{period.course}-{period.name}</strong>:</p>
                            {(absoluteUrl !== undefined) && (msGraphClientFactory !== undefined) && (spHttpClient !== undefined) &&
                                <PeoplePicker
                                    context={{
                                        absoluteUrl: absoluteUrl,
                                        msGraphClientFactory: msGraphClientFactory,
                                        spHttpClient: spHttpClient
                                    }}
                                    titleText={Admin.Planning.FacultyAvailabilitiesModal.SearchFacultyMember}
                                    personSelectionLimit={1}
                                    groupId={UserGroupId}
                                    showtooltip={true}
                                    searchTextLimit={5}
                                    onChange={searchUserAvailability}
                                    showHiddenInUI={false}
                                    principalTypes={[PrincipalType.User]}
                                    resolveDelay={1000} />
                            }
                            {isSearching
                                ? <Spinner
                                    label={Admin.Planning.FacultyAvailabilitiesModal.SearchingUser}
                                    labelPosition='bottom'
                                    size={SpinnerSize.medium}
                                    className={styles.spinner} />
                                : <>
                                    {teacher === undefined
                                        ? <>
                                            {noDataTeacher
                                                ? <MessageBar>{Admin.Planning.FacultyAvailabilitiesModal.NoDataForUser}</MessageBar>
                                                : <MessageBar>{Admin.Planning.FacultyAvailabilitiesModal.NoUserSelected}</MessageBar>
                                            }
                                        </>
                                        : <div className={styles.facultyMember}>
                                            <Persona
                                                imageUrl={teacher.photoUrl} text={teacher.displayName} secondaryText={teacher.email} coinSize={48}
                                            />
                                            {hasTeamsContext &&
                                                <IconButton iconProps={{ iconName: 'Chat' }} onClick={() => onChatWithTeacher(teacher.email)} disabled={!isEmpty(isDownloading)} title={Admin.Planning.FacultyAvailabilitiesModal.ChatWithTeacher} alt={Admin.Planning.FacultyAvailabilitiesModal.ChatWithTeacher} />
                                            }
                                            <DefaultButton
                                                onClick={() => onExportUserAvailabilities(teacher.id, period.id, teacher.email, SupportedDateAvailabilityStatus.preferred)}
                                                disabled={!isEmpty(isDownloading)}>
                                                {isDownloading && isDownloading === `${teacher.id}_${SupportedDateAvailabilityStatus.preferred}`
                                                    && <Spinner size={SpinnerSize.small} className={styles.downloadSpinner} />
                                                }
                                                {Admin.Planning.FacultyAvailabilitiesModal.PreferredAvailability}
                                            </DefaultButton>
                                            <DefaultButton
                                                onClick={() => onExportUserAvailabilities(teacher.id, period.id, teacher.email, SupportedDateAvailabilityStatus.blocked)}
                                                disabled={!isEmpty(isDownloading)}>
                                                {isDownloading && isDownloading === `${teacher.id}_${SupportedDateAvailabilityStatus.blocked}`
                                                    && <Spinner size={SpinnerSize.small} className={styles.downloadSpinner} />
                                                }
                                                {Admin.Planning.FacultyAvailabilitiesModal.BlockedAvailability}
                                            </DefaultButton>
                                        </div>
                                    }
                                </>
                            }
                            <div className={styles.exportButtons}>
                                <DefaultButton
                                    onClick={() => onExportPeriodAvailabilities(period.id, SupportedDateAvailabilityStatus.preferred)}
                                    disabled={!isEmpty(isDownloading)}
                                >
                                    {!isEmpty(isDownloading) && isDownloading === `${period.id}_${SupportedDateAvailabilityStatus.preferred}`
                                        && <Spinner size={SpinnerSize.small} />
                                    }
                                    {Admin.Planning.FacultyAvailabilitiesModal.BtnPreferredExportAll}
                                </DefaultButton>
                                <DefaultButton
                                    onClick={() => onExportPeriodAvailabilities(period.id, SupportedDateAvailabilityStatus.blocked)}
                                    disabled={!isEmpty(isDownloading)} >
                                    {!isEmpty(isDownloading) && isDownloading === `${period.id}_${SupportedDateAvailabilityStatus.blocked}`
                                        && <Spinner size={SpinnerSize.small} />
                                    }
                                    {Admin.Planning.FacultyAvailabilitiesModal.BtnBlockedExportAll}
                                </DefaultButton>
                            </div>
                            {noAvailabilitiesInPeriod &&
                                <MessageBar>{Admin.Planning.FacultyAvailabilitiesModal.NoAvailabilitiesInPeriod}</MessageBar>
                            }
                        </div>
                    </>
                }
                <div className={styles.footerButtons}>
                    <PrimaryButton
                        text={Admin.Planning.FacultyAvailabilitiesModal.BtnClose}
                        onClick={() => onCloseModal()}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default FacultyAvailabilities;