import * as React from 'react';
import styles from './UserTasksSearch.module.scss';
import { IconButton } from '@fluentui/react/lib/Button';
import { useAppStore } from 'store/useAppStore';
import { Admin } from 'FacultyTasksWebPartStrings';
import { CheckboxVisibility, DetailsListLayoutMode, IColumn, MessageBar, ShimmeredDetailsList, Spinner, SpinnerSize } from '@fluentui/react';
import { Task, UserDTO } from 'types';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { UserGroupId } from 'appSettings';
import * as microsoftTeams from "@microsoft/teams-js";
import { FacultyTasksService } from 'services/FacultyTasksService';
import { CULTURE_NAME_ES } from 'utils/Constants';
import getColumnDefinitions from './helpers/DetailsListHelper';

const UserTasksSearch: React.FC = () => {

    const {serviceScope, absoluteUrl, msGraphClientFactory, spHttpClient, hasTeamsContext,currentUICultureName } = useAppStore((state) => state);
    const [isSearching, setIsSearching] = React.useState<boolean>(false);
    const [teacher, setTeacher] = React.useState<UserDTO | undefined>(undefined);
    const [noDataTeacher, setNoDataTeacher] = React.useState<boolean>(false);
    const [teacherTasks, setTeacherTasks] = React.useState<Array<Task> | undefined>(undefined);

    const cultureName = currentUICultureName || CULTURE_NAME_ES;

    const columnsTasks: IColumn[] = getColumnDefinitions(cultureName);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchUserTasks = async (items: any[]): Promise<void> => {

        setNoDataTeacher(false);
        setTeacherTasks(undefined);

        if (items && items.length > 0) {
            const fullId: string = items[0].id;
            const emailStartIndex = fullId.lastIndexOf('|') + 1;
            const email = fullId.substring(emailStartIndex);

            setTeacher( {
                id: fullId,
                displayName: items[0].text,
                email: email,
                photoUrl: items[0].imageUrl
            });

            if (!serviceScope) return;

            setIsSearching(true);

            try{
                const facultyTasksService = serviceScope.consume(FacultyTasksService.serviceKey);

                const tasks:Task[] | undefined= await facultyTasksService.getUserPendingTasks(email);
                setTeacherTasks(tasks);
                  
                setNoDataTeacher(!tasks);
                setTeacherTasks(tasks);

            } catch (e) {
                setNoDataTeacher(true);
                setTeacherTasks(undefined);
                console.log(e);
            } finally {
                setIsSearching(false);
            }
        }
        else {
            setTeacher(undefined);
            setTeacherTasks(undefined);
        }
    }

    const onChatWithTeacher = async (email: string): Promise<void> => {
        try {
            await microsoftTeams.chat.openChat({user: email});
        } catch (error) {
            console.error("Error opening chat:", error);
        }
    };
    
    const onEmailTeacher = async (email: string): Promise<void> => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mailApi: any = microsoftTeams?.mail;

            if (mailApi?.openComposeForm) {
                await mailApi.openComposeForm({ toRecipients: [email] });
                return;
            }

            window.open(`mailto:${email}`, "_blank");
        } catch (error) {
            console.error("Error opening email:", error);
            window.open(`mailto:${email}`, "_blank");
        }
    };


  return (
  <div className={styles.tasksAdministration}>
    <div className={styles.content}>
      <div className={styles.searchCard}>
        {(absoluteUrl !== undefined) &&
          (msGraphClientFactory !== undefined) &&
          (spHttpClient !== undefined) && (
            <div className={styles.peoplePickerWrapper}>
              <PeoplePicker
                context={{ absoluteUrl, msGraphClientFactory, spHttpClient }}
                titleText={Admin.Tasks.SearchFacultyMember}
                personSelectionLimit={1}
                groupId={UserGroupId}
                showtooltip={true}
                searchTextLimit={5}
                onChange={searchUserTasks}
                showHiddenInUI={false}
                principalTypes={[PrincipalType.User]}
                resolveDelay={1000}
              />
            </div>
          )}
      </div>

      <div className={styles.personCard}>
        {!teacher ? (
          noDataTeacher ? (
            <MessageBar>{Admin.Tasks.NoDataForUser}</MessageBar>
          ) : (
            <div className={styles.emptyHint}>{Admin.Tasks.NoUserSelected}</div>
          )
        ) : (
          <div className={styles.personRow}>
            <div className={styles.personInfo}>
              {teacher.photoUrl ? (
                <img
                  className={styles.personPhoto}
                  src={teacher.photoUrl}
                  alt={teacher.displayName}
                />
              ) : (
                <div className={styles.personPhotoFallback}>
                  {teacher.displayName?.trim()?.charAt(0)?.toUpperCase()}
                </div>
              )}

              <div className={styles.personText}>
                <div className={styles.personNameRow}>
                  <div className={styles.personName}>{teacher.displayName}</div>

                  <div className={styles.personActionsInline}>
                    {hasTeamsContext ? (
                      <>
                        <IconButton
                          className={styles.actionButton}
                          iconProps={{ iconName: "MailForward" }}
                          onClick={() => onEmailTeacher(teacher.email)}
                          title={Admin.Tasks.EmailTeacher ?? "Send email"}
                          ariaLabel={Admin.Tasks.EmailTeacher}
                        />
                        <IconButton
                          className={styles.chatButton}
                          iconProps={{ iconName: "Chat" }}
                          onClick={() => onChatWithTeacher(teacher.email)}
                          title={Admin.Tasks.ChatWithTeacher}
                          ariaLabel={Admin.Tasks.ChatWithTeacher}
                        />
                      </>
                    ) : (
                      <IconButton
                        className={styles.actionButton}
                        iconProps={{ iconName: "MailForward" }}
                        onClick={() => onEmailTeacher(teacher.email)}
                        title={Admin.Tasks.EmailTeacher}
                        ariaLabel={Admin.Tasks.EmailTeacher}
                      />
                    )}
                  </div>
                </div>

                <a className={styles.personEmail}>
                  {teacher.email}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.tasksCard}>
        
        {isSearching ? (
          <div className={styles.spinnerContainer}>
            <Spinner
              label={Admin.Tasks.SearchingUser}
              labelPosition="bottom"
              size={SpinnerSize.medium}
            />
          </div>
        ) : (
          <>
            {!teacher ? null : teacherTasks?.length ? (
            <>
                <div className={styles.tasksHeader}>
                    <div className={styles.tasksTitle}>
                        {Admin.Tasks.PendingTasks}
                    </div>
                </div>
                <div className={styles.tableContainer}>
                    <ShimmeredDetailsList
                    items={teacherTasks}
                    columns={columnsTasks}
                    setKey="set"
                    layoutMode={DetailsListLayoutMode.justified}
                    selectionPreservedOnEmptyClick={true}
                    checkboxVisibility={CheckboxVisibility.hidden}
                    shimmerLines={7}
                    styles={{ root: { width: "100%" } }}
                    />
                </div>
              </>
            ) : teacherTasks ? (
              <MessageBar>{Admin.Tasks.NoTasksForUser}</MessageBar>
            ) : null}
          </>
        )}
      </div>

    </div>
  </div>
);

};

export default UserTasksSearch;