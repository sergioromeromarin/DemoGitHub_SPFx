import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import toast from 'react-hot-toast';
import { useAdminPlanningStore } from 'store/useAdminPlanningStore';
import { Admin } from 'FacultyTasksWebPartStrings';
import { useAppStore } from 'store/useAppStore';

const DeletePeriod: React.FC = () => {

    const selectedPeriods = useAdminPlanningStore((state) => state.selectedPeriods);
    const isDialogHidden_DeletePeriod = useAdminPlanningStore((state) => state.isDialogHidden_DeletePeriod);
    const setIsDialogHidden_DeletePeriod = useAdminPlanningStore((state) => state.setIsDialogHidden_DeletePeriod);
    const deletePeriod = useAdminPlanningStore((state) => state.deletePeriod);
    const { serviceScope } = useAppStore((state) => state);


    const dialogContentProps = {
        type: DialogType.close,
        title: Admin.Planning.DeletePeriodModal.Title,
        closeButtonAriaLabel: 'Close',
        subText: `${Admin.Planning.DeletePeriodModal.Subtitle} "${selectedPeriods.length > 0 ? `${selectedPeriods[0].course} - ${selectedPeriods[0].name}` : ''}"?`,
    };

    const onDeletePeriod = async (): Promise<void> => {
        try {
            if (selectedPeriods.length === 0)
                return;
            if (serviceScope) {
                const isDeleted = await deletePeriod(serviceScope, selectedPeriods[0].id);
                setIsDialogHidden_DeletePeriod(true);

                if (isDeleted) {
                    toast.success(Admin.Planning.DeletePeriodModal.Success, { position: 'bottom-right', duration: 1500 })
                } else {
                    toast.success(Admin.Planning.DeletePeriodModal.Error, { position: 'bottom-right', duration: 1500 })
                }
            }
        } catch (error) {
            console.error(`Error deleting a period. ${error}`);
        }
    };

    return (
        <Dialog
            hidden={isDialogHidden_DeletePeriod}
            onDismiss={() => setIsDialogHidden_DeletePeriod(true)}
            dialogContentProps={dialogContentProps}
        >
            <DialogFooter>
                <PrimaryButton onClick={() => onDeletePeriod()} text={Admin.Planning.DeletePeriodModal.Yes} />
                <DefaultButton onClick={() => setIsDialogHidden_DeletePeriod(true)} text={Admin.Planning.DeletePeriodModal.No} />
            </DialogFooter>
        </Dialog>
    );

};

export default DeletePeriod;