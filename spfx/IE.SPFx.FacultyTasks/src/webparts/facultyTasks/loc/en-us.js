define([], function () {
  return {
    PropertyPaneDescription: "Faculty Tasks",
    BasicGroupName: "",
    Menu: {
      Tasks: {
        Title: "Tasks",
        MyPendingTasks: "My pending tasks",
        PersonalTasks: "Personal tasks",
      },
      Planning: {
        Title: "Planning",
        HomeDescription: "Select an option to manage your planning",
        MyAssignments: "My allocated academic duties",
        MyAvailability: "My academic availability",
        MySessions: "My sessions",
      },
      Requests: {
        Title: "Requests",
      },
      Evaluations: {
        Title: "Evaluations",
      },
      Administration: {
        Title: "Administration",
        Planning: "Planning",
        Tasks: "Tasks",
      },
      UnsaveChangesWarning: {
        ModalTitle: "Unsaved Changes",
        Message:
          "You have outstanding unsaved modifications. If you exit now, these changes will be permanently discarded. Do you wish to proceed without saving?",
        StayBtn: "Stay",
        LeaveBtn: "Leave",
      },
    },
    Planning: {
      Title: "Planning",
      Header: {
        Tag: "Plan your academic schedule",
        Title: "Academic planning",
        Subtitle: "Set your availability and review your academic allocations for the upcoming terms.",
      },
      MyAssigments: {
        Title: "My academic allocations",
        Header: {
          Tag: "View and manage your allocations",
          Title: "View your allocations",
          Subtitle: "Review and manage the allocation proposals we give you.",
        },
        Messages: {
          NoPeriods:
            "No academic terms are currently available. Please contact the administration for further assistance.",
          ClosedAssignmentPeriodMessage:
            "Allocation review is currently closed for this term. You may view your allocations, but modifications are not permitted at this stage.",
        },
        AssignmentStatus: {
          Pending: "Pending",
          Accepted: "Accepted",
          Rejected: "Rejected",
        },
        Summary: {
          Pending: "PENDINGS",
          Accepted: "ACCEPTED",
          Conflicted: "IN CONFLICT",
          Assignments: "ACADEMIC ALLOCATIONS",
          PendingShort: "PEND",
          AcceptedShort: "ACCEP",
          ConflictedShort: "CONFL",
        },
        AvailabilityCompatibility: {
          Compatible: "Compatible",
          Conflicted: "Conflicted",
          Unknown: "Unknown",
        },
        Sessions: "sessions",
        Sections: "sections",
        TotalSessions: "total sessions",
        MessageBar: {
          NoAssignmentsInPeriod:
            "There are no subjects assigned for the selected term.",
          ConflictDetectedTitle: "A scheduling conflict has been identified",
          ConflictDetectedMessage:
            "The proposed schedule is not compatible with the availability recorded in your calendar",
          CompatibleMessage: "The allocation has been confirmed",
          AllAvailableMessage:
            "You haven't set any preferences or blocked any days in the planning section. All academic days will be considered available.",
        },
        Actions: {
          Accept: "Accept",
          Reject: "Reject",
          AdjustAvailability: "Adjust availability",
        },
        AcceptAssignmentDialog: {
          Title: "Course directions",
          SessionStructure: "Session structure / Cadencia de sesión",
          Questions: {
            English: {
              Advice:
                "All sessions must be single, except for those cases explicitly approved for academic reasons.",
              AuthorizatedDoubleSessions:
                "Are there any double sessions in your subject authorized by your Area Director?",
              DoubleSessions: "Which sessions are double sessions?",
              TypeOfSessions: "Please indicate the type of session.",
            },
            Spanish: {
              Advice:
                "Todas las sesiones deberán ser sencillas, salvo excepciones aprobadas por motivos académicos.",
              AuthorizatedDoubleSessions:
                "¿Tienes alguna sesión doble autorizada por tu Director de Área para esta asignatura?",
              DoubleSessions: "¿Cuáles son las sesiones dobles?",
              TypeOfSessions: "Por favor, indica el tipo de sesión.",
            },
          },
          AdditionalRelevantInformation:
            "Additional relevant information / Información relevante adicional",
          AdditionalInfo: {
            English: {
              HelpfulInfo:
                "Any other kind of information you think will be helpful for us.",
            },
            Spanish: {
              HelpfulInfo:
                "Cualquier otra información que se considere oportuna para realizar una mejor planificación.",
            },
          },
          BtnCancel: "Cancel",
          BtnAccept: "Accept allocation",
        },
        RejectAssignmentDialog: {
          Title: "Reject allocation",
          RejectionReason: "Reason for declining the allocation",
          RejectionReasonPlaceholder:
            "Please provide a justification for declining this allocation",
          BtnCancel: "Cancel",
          BtnReject: "Reject allocation",
        },
        AcceptAssignmentSuccess: "Allocation accepted successfully",
        AcceptAssignmentError: "Error accepting allocation",
        RejectAssignmentSuccess: "Allocation rejected successfully",
        RejectAssignmentError: "Error rejecting allocation",
      },
      MyAvailability: {
        Title: "My availability and academic preferences",
        Header: {
          Tag: "Set your availability and academic preferences",
          Title: "My academic availability",
          Subtitle:
            "Indicate your preferred schedules for the academic term to facilitate more efficient planning",
        },
        PeriodFilter: {
          Title: "Academic term",
          Label: "Select academic term",
          Placeholder: "Select a term",
          OpenPeriods: "Open terms",
          ClosedPeriods: "Closed terms",
          NoPeriodsMessage:
            "No academic terms are currently available. Please contact the administration for further assistance.",
        },
        AvailabilityTable: {
          Title: "Weekly availability overview",
          Subtitle:
            "View and manage your weekly availabilities for the selected academic term.",
          Week: "Week",
          PreviousWeekBtn: "Previous week",
          NextWeekBtn: "Next week",
          FilterButton: {
            ShowAll: "Show all",
            ShowPreferred: "Preferred",
            ShowBlocked: "Blocked",
          },
          Legend: {
            Preferred: "Preferred",
            Blocked: "Blocked",
            Available: "Available",
          },
          SaveAvailabilityBtn: "Save availability",
          SaveAvailabilitySuccess:
            "Your availability has been successfully updated",
          SaveAvailabilityError: "Error updating your availability",
          SaveAvailabilityConflict: "The availability update cannot be processed because the expanded blocked hours overlap with allocations that have already been accepted",
          ClosedPeriodMessage:
            "Availability entry is currently closed for this term. You may only view your registered availability.",
          ContextualMenu: {
            Options: "Options",
            MarkAllDayAsPreferred: "Mark all day as preferred",
            MarkAllDayAsBlocked: "Mark all day as blocked",
            MarkAllDayAsAvailable: "Mark all day as available",
            ReplicateDayToAllWeek: "Replicate day to all week",
            ReplicateDayToMonth: "Replicate day to month",
            ReplicateDayToPeriod: "Replicate day to term",
          },
        },
      },
      MySessions: {
        Title: "My sessions",
        Header: {
          Tag: "View and manage your sessions",
          Title: "Your confirmed sessions",
          Subtitle: "All your confirmed sessions are displayed here.",
        },
      },
    },
    MyTasks: {
      Title: "My tasks",
      Status:{
        Pending: "Pending",
        Completed: "Completed",
        Expired: "Expired",
      },
      Header: {
        Tag: "Tasks Overview",
        Title: "My tasks",
        Subtitle: "Review, track and manage all tasks from this section.",
      },
      Carrousel:{
        // Tag: "View and manage your tasks",
        Title: "My pending tasks",
        Subtitle: "All your pending tasks are displayed here.",
        DueDate: "Due Date",
        SeeMore: "See more",
        NoPendingTasksMessage: "No pending tasks found.",
      },
      Table: {
        Columns: {
          Type: "TASK CATEGORY",
          Description: "DESCRIPTION",
          DueDate: "DUE DATE",
          Supervisor: "SUPERVISOR",
          Status: "STATUS"
        },
      // Tag: "My Tasks",
      Title: "All Tasks",
      Subtitle: "Task history overview",
      SearchBoxTooltip: "Search tasks...",
      Filters: {
          TypeLabel: "Category",
          DueDateLabel: "Due date",
          SelectAll: "Select all",
          AllTypes: "All",
          AllDates: "All",
          NoDueDate: "(No due date)",
          SelectedCount: "{0} selected"
        }
      },
    },
    Admin: {
      Planning: {
        HeaderTitle:"Planning Administration",
        ListPeriod: {
          NewPeriod: "New term",
          Col_Course: "Course",
          Col_Name: "Name",
          Col_PeriodStartDate: "Term start date",
          Col_PeriodEndDate: "Term end date",
          Col_AvailabilityStartDate: "Availability start date",
          Col_AvailabilityEndDate: "Availability end date",
          Col_Edit: "Edit",
          Col_Delete: "Delete",
          Col_FacultyAvailabilities: "Faculty availability records",
          Col_FacultyAssignments: "Faculty teaching allocations",
          Col_Delete_TooltipCannotDelete:
            "This term cannot be deleted because faculty availability records are associated with it.",
        },
        PeriodFormModal: {
          NewFormTitle: "New term",
          EditFormTitle: "Edit term",
          Course: "Course",
          Name: "Name",
          PeriodStartDate: "Term start date",
          PeriodEndDate: "Term end date",
          Holidays: "Public holidays in the term",
          HolidaysInfo:
            "Select the public holidays within the term to exclude them from faculty availability calculations.",
          AddHoliday: "Add holiday",
          AvailabilityStartDate: "Availability start date",
          AvailabilityEndDate: "Availability end date",
          AssignmentReviewStartDate: "Allocation review start date",
          AssignmentReviewEndDate: "Allocation review end date",
          HoursPerDay: "Hours per day",
          GapsCoefficient: "Gaps coefficient",
          Placeholders: {
            Course: "Ex.: 2025/2026",
            Name: "Ex.: Q1",
            HoursPerDay: "Ex.: 4",
            GapsCoefficient: "Ex.: 1.2",
          },
          BtnCancel: "Cancel",
          BtnSaveNewPeriod: "Save new term",
          BtnSaveEditPeriod: "Save edit term",
          CreateSuccess: "The term has been successfully created",
          CreateError: "An error occurred while attempting to create the term",
          UpdateSuccess: "The term has been successfully updated",
          UpdateError: "An error occurred while attempting to update the term",
        },
        DetailPeriodModal: {
          Title: "Term details",
          BtnClose: "Close",
        },
        DeletePeriodModal: {
          Title: "Delete term?",
          Subtitle: "Are you certain you wish to delete the term?",
          Yes: "Yes",
          No: "No",
          Success: "The term has been successfully deleted.",
          Error: "Error deleting term",
        },
        FacultyAvailabilitiesModal: {
          Title: "Faculty availability records",
          Subtitle:
            "Faculty members who have registered availabilities for the term",
          BtnClose: "Close",
          SearchFacultyMember: "Search for faculty member",
          SearchingUser: "Searching for faculty member availabilities...",
          NoUserSelected:
            "No faculty member selected. Please select a faculty member to view their availabilities.",
          NoDataForUser:
            "The selected faculty member has not registered any availabilities for this term.",
          NoAvailabilitiesInPeriod:
            "No faculty members have registered availabilities for this term.",
          BtnPreferredExportAll: "Bulk export preferred",
          BtnBlockedExportAll: "Bulk export blocked",
          PreferredAvailability: "Preferred availability",
          BlockedAvailability: "Blocked availability",
          ChatWithTeacher: "Chat with teacher",
        },
        FacultyAssignmentsModal: {
          Title: "Faculty teaching allocations",
          Subtitle: "Allocations allocated for this term",
          BtnClose: "Close",
          LoadingAssignments: "Loading allocations...",
          NoAssignments:
            "There are currently no allocations available for this term.",
          BtnExportAll: "Export all allocations",
          Assignments: "Allocations",
          SearchFacultyMember: "Search faculty member",
          SearchingUser: "Searching user...",
          NoDataForUser: "No allocations found for the selected user.",
          NoUserSelected: "Select a faculty member to view their allocations.",
          NoAssignmentsInPeriod:
            "No allocations found for any faculty member in this term.",
          ChatWithTeacher: "Chat with teacher",
        },
      },
      Tasks: {
        HeaderTitle: "Tasks administration",
        SubTitle:"Search a faculty member to see hes/shes tasks",
        NoDataForUser: "No tasks found for the selected user.",
        NoUserSelected: "Select a faculty member to review his/her pending tasks",
        NoTasksForUser: "No tasks found for the selected user.",
        SearchFacultyMember: "Search for faculty member",
        SearchingUser: "Searching for faculty member tasks...",
        ChatWithTeacher: "Chat with teacher",
        PendingTasks:"Pending Tasks",
        EmailTeacher:"Send email"
      }
    },
    NoAccessPage: {
      Title: "ACCESS DENIED",
      Message: "You do not have permission to access this application",
    },
    CommonStrings: {
      Required: "Required field",
      DayPickerStrings: {
        months: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        shortMonths: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        days: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        shortDays: ["S", "M", "T", "W", "T", "F", "S"],
        goToToday: "Go to today",
        prevMonthAriaLabel: "Go to previous month",
        nextMonthAriaLabel: "Go to next month",
        prevYearAriaLabel: "Go to previous year",
        nextYearAriaLabel: "Go to next year",
        closeButtonAriaLabel: "Close date picker",
      },
      Delete: "Delete",
    },
  };
});
