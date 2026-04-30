import { Assignment } from "types";

export interface IRejectAssignmentFormProps {
    isOpenModal: boolean;
    setIsOpenModal: (open: boolean) => void;
    onRejectAssignment: (reason: string) => void;
    assignment: Assignment | undefined;
}
