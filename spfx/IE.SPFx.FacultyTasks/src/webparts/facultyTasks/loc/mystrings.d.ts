declare interface ICommonStrings {
  Required: string;
  DayPickerStrings: IDatePickerStrings;
  Delete: string;
}

declare interface IFacultyTasksWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  CommonStrings: ICommonStrings;
  Menu: {
    Tasks: {
      Title: string;
      MyPendingTasks: string;
      PersonalTasks: string;
    };
    Planning: {
      Title: string;
      HomeDescription: string;
      MyAssignments: string;
      MyAvailability: string;
      MySessions: string;
    };
    Requests: {
      Title: string;
    };
    Evaluations: {
      Title: string;
    };
    Administration: {
      Title: string;
      Planning: string;
      Tasks: string;
    };
    UnsaveChangesWarning: {
      ModalTitle: string;
      Message: string;
      StayBtn: string;
      LeaveBtn: string;
    };
  };
  Planning: {
    Title: string;
    Header: {
      Tag: string;
      Title: string;
      Subtitle: string;
    };
    MyAssigments: {
      Title: string;
      Header: {
        Tag: string;
        Title: string;
        Subtitle: string;
      };
      Messages: {
        NoPeriods: string;
        ClosedAssignmentPeriodMessage: string;
      };
      AssignmentStatus: {
        Pending: string;
        Accepted: string;
        Rejected: string;
      };
      Summary: {
        Pending: string;
        Accepted: string;
        Conflicted: string;
        Assignments: string;
        PendingShort: string;
        AcceptedShort: string;
        ConflictedShort: string;
      };
      AvailabilityCompatibility: {
        Compatible: string;
        Conflicted: string;
        Unknown: string;
      };
      Sessions: string;
      Sections: string;
      TotalSessions: string;
      MessageBar: {
        NoAssignmentsInPeriod: string;
        ConflictDetectedTitle: string;
        ConflictDetectedMessage: string;
        CompatibleMessage: string;
        AllAvailableMessage: string;
      };
      Actions: {
        Accept: string;
        Reject: string;
        AdjustAvailability: string;
      };
      AcceptAssignmentDialog: {
        Title: string;
        SessionStructure: string;
        Questions: {
          English: {
            Advice: string;
            AuthorizatedDoubleSessions: string;
            DoubleSessions: string;
            TypeOfSessions: string;
          };
          Spanish: {
            Advice: string;
            AuthorizatedDoubleSessions: string;
            DoubleSessions: string;
            TypeOfSessions: string;
          };
        };
        AdditionalRelevantInformation: string;
        AdditionalInfo: {
          English: {
            HelpfulInfo: string;
          };
          Spanish: {
            HelpfulInfo: string;
          };
        };
        BtnCancel: string;
        BtnAccept: string;
      };
      RejectAssignmentDialog: {
        Title: string;
        RejectionReason: string;
        RejectionReasonPlaceholder: string;
        BtnCancel: string;
        BtnReject: string;
      };
      AcceptAssignmentSuccess: string;
      AcceptAssignmentError: string;
      RejectAssignmentSuccess: string;
      RejectAssignmentError: string;
    };
    MyAvailability: {
      Title: string;
      Header: {
        Tag: string;
        Title: string;
        Subtitle: string;
      };
      PeriodFilter: {
        Title: string;
        Label: string;
        Placeholder: string;
        OpenPeriods: string;
        ClosedPeriods: string;
        NoPeriodsMessage: string;
      };
      AvailabilityTable: {
        Title: string;
        Subtitle: string;
        Week: string;
        PreviousWeekBtn: string;
        NextWeekBtn: string;
        FilterButton: {
          ShowAll: string;
          ShowPreferred: string;
          ShowBlocked: string;
        };
        Legend: {
          Preferred: string;
          Blocked: string;
          Available: string;
        };
        SaveAvailabilityBtn: string;
        SaveAvailabilitySuccess: string;
        SaveAvailabilityError: string;
        SaveAvailabilityConflict: string;
        ClosedPeriodMessage: string;
        ContextualMenu: {
          Options: string;
          MarkAllDayAsPreferred: string;
          MarkAllDayAsBlocked: string;
          MarkAllDayAsAvailable: string;
          ReplicateDayToAllWeek: string;
          ReplicateDayToMonth: string;
          ReplicateDayToPeriod: string;
        };
      };
    };
    MySessions: {
      Title: string;
      Header: {
        Tag: string;
        Title: string;
        Subtitle: string;
      };
    };
  };
  MyTasks: {
    Title: string;
    Status: {
      Pending: string;
      Completed: string;
      Expired: string;
    };
    Header: {
      Tag: string;
      Title: string;
      Subtitle: string;
    };
    Carrousel: {
      // Tag: string;
      Title: string;
      Subtitle: string;
      DueDate: string;
      SeeMore: string;
      NoPendingTasksMessage: string;
    };
    Table: {
      Columns: {
        Type: string;
        Description: string;
        DueDate: string;
        Supervisor: string;
        Status: string;
      };
      // Tag: string;
      Title: string;
      Subtitle: string;
      SearchBoxTooltip: string;
      Filters: {
        TypeLabel: string;
        DueDateLabel: string;
        SelectAll: string;
        AllTypes: string;
        AllDates: string;
        NoDueDate: string;
        SelectedCount: string;
      };
    };
  };
  Admin: {
    Planning: {
      HeaderTitle: string;
      ListPeriod: {
        NewPeriod: string;
        Col_Course: string;
        Col_Name: string;
        Col_PeriodStartDate: string;
        Col_PeriodEndDate: string;
        Col_AvailabilityStartDate: string;
        Col_AvailabilityEndDate: string;
        Col_Edit: string;
        Col_Delete: string;
        Col_FacultyAvailabilities: string;
        Col_FacultyAssignments: string;
        Col_Delete_TooltipCannotDelete: string;
      };
      PeriodFormModal: {
        NewFormTitle: string;
        EditFormTitle: string;
        Course: string;
        Name: string;
        PeriodStartDate: string;
        PeriodEndDate: string;
        Holidays: string;
        HolidaysInfo: string;
        AddHoliday: string;
        AvailabilityStartDate: string;
        AvailabilityEndDate: string;
        AssignmentReviewStartDate: string;
        AssignmentReviewEndDate: string;
        HoursPerDay: string;
        GapsCoefficient: string;
        Placeholders: {
          Course: string;
          Name: string;
          HoursPerDay: string;
          GapsCoefficient: string;
        };
        BtnCancel: string;
        BtnSaveNewPeriod: string;
        BtnSaveEditPeriod: string;
        CreateSuccess: string;
        CreateError: string;
        UpdateSuccess: string;
        UpdateError: string;
      };
      DetailPeriodModal: {
        Title: string;
        BtnClose: string;
      };
      FacultyAvailabilitiesModal: {
        Title: string;
        Subtitle: string;
        BtnClose: string;
        SearchFacultyMember: string;
        SearchingUser: string;
        NoUserSelected: string;
        NoDataForUser: string;
        NoAvailabilitiesInPeriod: string;
        BtnPreferredExportAll: string;
        BtnBlockedExportAll: string;
        PreferredAvailability: string;
        BlockedAvailability: string;
        ChatWithTeacher: string;
      };
      FacultyAssignmentsModal: {
        Title: string;
        Subtitle: string;
        BtnClose: string;
        LoadingAssignments: string;
        NoAssignments: string;
        BtnExportAll: string;
        Assignments: string;
        SearchFacultyMember: string;
        SearchingUser: string;
        NoDataForUser: string;
        NoUserSelected: string;
        NoAssignmentsInPeriod: string;
        ChatWithTeacher: string;
      };
      DeletePeriodModal: {
        Title: string;
        Subtitle: string;
        Yes: string;
        No: string;
        Success: string;
        Error: string;
      };

    };
    Tasks: {
      HeaderTitle: string;
      SubTitle: string;
      NoTasksForUser: string;
      SearchingUser: string;
      NoDataForUser: string;
      NoUserSelected: string;
      ChatWithTeacher: string;
      TaskListHeader: string;
      SearchFacultyMember: string;
      PendingTasks: string;
      EmailTeacher: string;
    }
  };
  NoAccessPage: {
    Title: string;
    Message: string;
  };
}

declare module "FacultyTasksWebPartStrings" {
  const strings: IFacultyTasksWebPartStrings;
  export = strings;
}
