import * as React from 'react';
import { IListPeriodsProps } from './IListPeriodsProps';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { DetailsListLayoutMode, Selection, IColumn, CheckboxVisibility } from '@fluentui/react/lib/DetailsList';
import { Admin } from 'FacultyTasksWebPartStrings';
import getColumnDefinitions from './helpers/DetailsListHelper';
import styles from './ListPeriods.module.scss';
import { type Period } from 'types';
import { useAdminPlanningStore } from 'store/useAdminPlanningStore';
import { useAppStore } from 'store/useAppStore';


const ListPeriods: React.FC<IListPeriodsProps> = (props) => {

    const { currentUICultureName } = useAppStore();
    const periods = useAdminPlanningStore((state) => state.periods);
    const setSelectedPeriods = useAdminPlanningStore((state) => state.setSelectedPeriods);
    const setIsModalOpen_DetailPeriod = useAdminPlanningStore((state) => state.setIsModalOpen_DetailPeriod);
    const setIsModalOpen_PeriodForm = useAdminPlanningStore((state) => state.setIsModalOpen_PeriodForm);

    const columnsPeriods: IColumn[] = getColumnDefinitions(currentUICultureName);

    const [selectionState] = React.useState(new Selection({
        onSelectionChanged: () => {
            const selectionCount = selectionState.getSelectedCount();
            if (selectionCount >= 1) {
                setSelectedPeriods(selectionState.getSelection() as Period[]);
            } else {
                setSelectedPeriods([]);
            }
        }
    }));

    const onItemInvoked = (item: Period): void => {
        const selectedItems: Period[] = [];
        selectedItems.push(item);
        setSelectedPeriods(selectedItems);
        setIsModalOpen_DetailPeriod(true);
    };

    const onCreatePeriod = (): void => {
        setSelectedPeriods([]);
        setIsModalOpen_PeriodForm(true)
    };

    return (
        <div className={styles.container}>
            <div className={styles.menuActions}>
                <DefaultButton onClick={onCreatePeriod} text={Admin.Planning.ListPeriod.NewPeriod} />
            </div>
            <ShimmeredDetailsList
                items={periods}
                columns={columnsPeriods}
                setKey="set"
                layoutMode={DetailsListLayoutMode.justified}
                selection={selectionState}
                selectionPreservedOnEmptyClick={true}
                onItemInvoked={onItemInvoked}
                checkboxVisibility={CheckboxVisibility.hidden}
                enableShimmer={!props.isDataLoaded}
                shimmerLines={7}
            />
        </div>
    );
};

export default ListPeriods;