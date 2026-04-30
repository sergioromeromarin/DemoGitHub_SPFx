import { Assignment } from "types";

export interface IAcceptAssignmentFormProps {
    isOpenModal: boolean;
    setIsOpenModal: (open: boolean) => void;
    onAcceptAssignment: (sessionStructureQuestions: string, additionalInfo: string) => void;
    assignment: Assignment | undefined;
}
