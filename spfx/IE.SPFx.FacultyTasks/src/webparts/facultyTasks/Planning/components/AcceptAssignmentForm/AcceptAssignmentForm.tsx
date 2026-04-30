import * as React from 'react';
import styles from './AcceptAssignmentForm.module.scss';
import { Modal } from '@fluentui/react/lib/Modal';
import { TextField } from '@fluentui/react/lib/TextField';
import { DefaultButton, IconButton, PrimaryButton, } from '@fluentui/react/lib/Button';
import { CommonStrings, Planning } from 'FacultyTasksWebPartStrings';
import { Label } from '@fluentui/react';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { IAcceptAssignmentFormProps } from './IAcceptAssignmentFormProps';

const MODAL_SCROLL_CONTAINER_CLASSNAME = "modalScrollContainer";

const AcceptAssignmentForm: React.FC<IAcceptAssignmentFormProps> = (props) => {

    const [sessionStructureQuestions, setSessionStructureQuestions] = React.useState<string>('');
    const [additionalInfo, setAdditionalInfo] = React.useState<string>('');

    const onCloseModal = (): void => {
        setSessionStructureQuestions('');
        setAdditionalInfo('');
        props.setIsOpenModal(false);
    };

    const onAccept = (): void => {
        props.onAcceptAssignment(sessionStructureQuestions, additionalInfo);
        onCloseModal();
    }

    const isMandatoryFieldsFilled = (): boolean => {
        let filled = false;
        if (sessionStructureQuestions?.trim()) {
            filled = true;
        }
        return filled;
    }

    return (
        <Modal
            isOpen={props.isOpenModal}
            isBlocking={true}
            isDarkOverlay={true}
            onDismiss={() => onCloseModal()}
            containerClassName={styles.modal}
            scrollableContentClassName={MODAL_SCROLL_CONTAINER_CLASSNAME}
        >
            <div className={styles.modalTitle}>
                {Planning.MyAssigments.AcceptAssignmentDialog.Title}
                <IconButton
                    styles={{ root: { marginLeft: 'auto', marginTop: '4px', marginRight: '2px' } }}
                    iconProps={{ iconName: 'Cancel' }}
                    onClick={() => onCloseModal()}
                />
            </div>
            <div className={styles.modalContainer}>
                <TextField
                    label="PCSA"
                    value={props.assignment?.subject || ''}
                    disabled
                />
                <div className={styles.row}>
                    <TextField
                        label="Sessions"
                        value={props.assignment?.numberOfSessions.toString() || ''}
                        className={styles.column}
                        disabled
                    />
                    <TextField
                        label="Sections"
                        value={props.assignment?.assignedSections.toString() || ''}
                        className={styles.column}
                        disabled
                    />
                </div>

                <div className={styles.acceptAssignmentQuestions}>
                    <Label>{Planning.MyAssigments.AcceptAssignmentDialog.SessionStructure}</Label>
                    <div className={styles.acceptAssignmentQuestionsLabel}>
                        <div className={styles.languageVersion}>
                            <p>{Planning.MyAssigments.AcceptAssignmentDialog.Questions.English.Advice}</p>
                            <p>{Planning.MyAssigments.AcceptAssignmentDialog.Questions.English.AuthorizatedDoubleSessions}</p>
                            <p>{Planning.MyAssigments.AcceptAssignmentDialog.Questions.English.DoubleSessions}</p>
                            <p>{Planning.MyAssigments.AcceptAssignmentDialog.Questions.English.TypeOfSessions}</p>
                        </div>
                        <div className={styles.languageVersion}>
                            <p>{Planning.MyAssigments.AcceptAssignmentDialog.Questions.Spanish.Advice}</p>
                            <p>{Planning.MyAssigments.AcceptAssignmentDialog.Questions.Spanish.AuthorizatedDoubleSessions}</p>
                            <p>{Planning.MyAssigments.AcceptAssignmentDialog.Questions.Spanish.DoubleSessions}</p>
                            <p>{Planning.MyAssigments.AcceptAssignmentDialog.Questions.Spanish.TypeOfSessions}</p>
                        </div>
                    </div>
                    <TextField
                        required
                        onChange={(event, newValue) => setSessionStructureQuestions(newValue || '')}
                        errorMessage={isEmpty(sessionStructureQuestions) ? CommonStrings.Required : undefined}
                        autoComplete='off'
                        multiline
                    />
                </div>
                <div className={styles.acceptAssignmentQuestions}>
                    <Label>{Planning.MyAssigments.AcceptAssignmentDialog.AdditionalRelevantInformation}</Label>
                    <div className={styles.acceptAssignmentQuestionsLabel}>
                        <div className={styles.languageVersion}>
                            <p>{Planning.MyAssigments.AcceptAssignmentDialog.AdditionalInfo.English.HelpfulInfo}</p>
                        </div>
                        <div className={styles.languageVersion}>
                            <p>{Planning.MyAssigments.AcceptAssignmentDialog.AdditionalInfo.Spanish.HelpfulInfo}</p>
                        </div>
                    </div>
                    <TextField
                        onChange={(event, newValue) => setAdditionalInfo(newValue || '')}
                        autoComplete='off'
                        multiline
                    />
                </div>
                <div className={styles.footerButtons}>
                    <DefaultButton
                        text={Planning.MyAssigments.AcceptAssignmentDialog.BtnCancel}
                        onClick={() => onCloseModal()}
                    />
                    <PrimaryButton
                        text={Planning.MyAssigments.AcceptAssignmentDialog.BtnAccept}
                        onClick={onAccept}
                        className={styles.btnSave}
                        disabled={!isMandatoryFieldsFilled()}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default AcceptAssignmentForm;