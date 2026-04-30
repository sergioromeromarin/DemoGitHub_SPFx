import * as React from 'react';
import styles from './RejectAssignmentForm.module.scss';
import { Modal } from '@fluentui/react/lib/Modal';
import { TextField } from '@fluentui/react/lib/TextField';
import { DefaultButton, IconButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { CommonStrings, Planning } from 'FacultyTasksWebPartStrings';
import { Label } from '@fluentui/react';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { IRejectAssignmentFormProps } from './IRejectAssignmentFormProps';

const MODAL_SCROLL_CONTAINER_CLASSNAME = "modalScrollContainer";

const RejectAssignmentForm: React.FC<IRejectAssignmentFormProps> = (props) => {

    const [rejectionReason, setRejectionReason] = React.useState<string>('');

    const onCloseModal = (): void => {
        setRejectionReason('');
        props.setIsOpenModal(false);
    };

    const onReject = (): void => {
        props.onRejectAssignment(rejectionReason);
        onCloseModal();
    }

    const isMandatoryFieldsFilled = (): boolean => {
        return rejectionReason?.trim() ? true : false;
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
                {Planning.MyAssigments.RejectAssignmentDialog.Title}
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

                <div className={styles.rejectionReasonSection}>
                    <Label required>{Planning.MyAssigments.RejectAssignmentDialog.RejectionReason}</Label>
                    <TextField
                        required
                        placeholder={Planning.MyAssigments.RejectAssignmentDialog.RejectionReasonPlaceholder}
                        onChange={(event, newValue) => setRejectionReason(newValue || '')}
                        errorMessage={isEmpty(rejectionReason) ? CommonStrings.Required : undefined}
                        autoComplete='off'
                        multiline
                        rows={6}
                    />
                </div>
                <div className={styles.footerButtons}>
                    <DefaultButton
                        text={Planning.MyAssigments.RejectAssignmentDialog.BtnCancel}
                        onClick={() => onCloseModal()}
                    />
                    <PrimaryButton
                        text={Planning.MyAssigments.RejectAssignmentDialog.BtnReject}
                        onClick={onReject}
                        className={styles.btnSave}
                        disabled={!isMandatoryFieldsFilled()}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default RejectAssignmentForm;