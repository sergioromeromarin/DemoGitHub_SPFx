import { ServiceKey, ServiceScope } from '@microsoft/sp-core-library';
import { AadHttpClientFactory, HttpClient, AadHttpClient, HttpClientResponse, IHttpClientOptions } from '@microsoft/sp-http';
import { FacultyTasksAPIURL, Local, AzureAd } from 'appSettings';
import { Assignment, AssignmentDTO, AssignmentStatus, AvailabilityCompatibility, UserPeriodDTO, PeriodDataForm, PeriodDTO, SupportedAssignmentStatus, SupportedAvailabilityCompatibility, SupportedDateAvailabilityStatus, UserDTO, type Availability, type AvailabilityStatus, type DateAvailabilityDTO, type Period, type UpdatedAvailabilityDTO, Task, TaskDTO } from 'types';
import { AdminAvailabilitiesEndpoint, AdminAssignmentsEndpoint, AssignmentsEndpoint, AvailabilityEndpoint, PeriodEndpoint, TextField_MaxLenght, TasksEndpoint } from 'utils/Constants';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

export class FacultyTasksService {

    public static readonly serviceKey: ServiceKey<FacultyTasksService> = ServiceKey.create('faculty-tasks:FacultyTasksService', FacultyTasksService);

    private aadHttpClientFactory: AadHttpClientFactory;
    private httpClient: HttpClient;

    constructor(serviceScope: ServiceScope) {
        serviceScope.whenFinished(() => {
            this.aadHttpClientFactory = serviceScope.consume(AadHttpClientFactory.serviceKey);
            this.httpClient = serviceScope.consume(HttpClient.serviceKey);
        });
    }

    // Users Planning - Availabilities
    public getMyAvailability = async (period: Period): Promise<Availability | undefined> => {
        try {
            let response: HttpClientResponse;

            if (Local) {
                response = await this.httpClient.get(`${FacultyTasksAPIURL}${AvailabilityEndpoint.MyAvailabilities}/${period.id.toUpperCase()}`, HttpClient.configurations.v1);
            } else {
                const client = await this.aadHttpClientFactory.getClient(AzureAd.ApplicationUri);
                response = await client.get(`${FacultyTasksAPIURL}${AvailabilityEndpoint.MyAvailabilities}/${period.id.toUpperCase()}`, AadHttpClient.configurations.v1);
            }

            if (response.status === 200) {
                const dataResponse: Array<DateAvailabilityDTO> = await response.json();

                const statusMap: Record<number, AvailabilityStatus> = {
                    0: SupportedDateAvailabilityStatus.available,
                    1: SupportedDateAvailabilityStatus.preferred,
                    2: SupportedDateAvailabilityStatus.blocked
                };

                const availabilities: Availability = {
                    periodId: period.id,
                    periodName: period.name,
                    course: period.course,
                    openPeriod: period.availabilityStartDate <= new Date() && period.availabilityEndDate >= new Date(),
                    selected: true,
                    dates: []
                }
                dataResponse.map(availabilityDTO => {
                    availabilities.dates.push({
                        id: availabilityDTO.id,
                        date: new Date(availabilityDTO.availabilityDate),
                        status: statusMap[availabilityDTO.status] ?? SupportedDateAvailabilityStatus.available,
                        week: dayjs(new Date(availabilityDTO.availabilityDate)).isoWeek(),
                    });
                });

                return availabilities;
            }

        } catch (error) {
            console.log("Error en FacultyTasksService.getMyAvailability");
            console.log(error);
        }
    }

    public updateMyAvailability = async (updatedAvailabilities: UpdatedAvailabilityDTO[]): Promise<number> => {
        try {
            let response: HttpClientResponse;

            const requestHeaders: Headers = new Headers();
            requestHeaders.append("Content-type", "application/json");

            const postOptions: IHttpClientOptions = {
                headers: requestHeaders,
                body: JSON.stringify(updatedAvailabilities),
                method: 'PUT'
            };

            if (Local) {
                response = await this.httpClient.fetch(`${FacultyTasksAPIURL}${AvailabilityEndpoint.BulkUpdate}`, HttpClient.configurations.v1, postOptions);
            } else {
                const client = await this.aadHttpClientFactory.getClient(AzureAd.ApplicationUri);
                response = await client.fetch(`${FacultyTasksAPIURL}${AvailabilityEndpoint.BulkUpdate}`, AadHttpClient.configurations.v1, postOptions);
            }
            return response.status;

        } catch (error) {
            console.log("Error en updateMyAvailability");
            console.log(error);
            return 500;
        }
    }

    public getPeriodsForAvailability = async (): Promise<Array<Period> | undefined> => {
        try {
            let response: HttpClientResponse;
            const periods: Array<Period> = [];
            if (Local) {
                response = await this.httpClient.get(`${FacultyTasksAPIURL}${PeriodEndpoint.ForAvailabitly}`, HttpClient.configurations.v1);
            } else {
                const client = await this.aadHttpClientFactory.getClient(AzureAd.ApplicationUri);
                response = await client.get(`${FacultyTasksAPIURL}${PeriodEndpoint.ForAvailabitly}`, AadHttpClient.configurations.v1);
            }

            if (response.status === 200) {
                const periodsDTO: Array<UserPeriodDTO> = await response.json();

                periodsDTO.map(periodDTO => {
                    periods.push({
                        id: periodDTO.id,
                        course: periodDTO.course,
                        name: periodDTO.name,
                        periodStartDate: new Date(periodDTO.periodStartDate),
                        periodEndDate: new Date(periodDTO.periodEndDate),
                        availabilityStartDate: new Date(periodDTO.availabilityStartDate),
                        availabilityEndDate: new Date(periodDTO.availabilityEndDate),
                        assignmentReviewStartDate: new Date(periodDTO.assignmentReviewStartDate),
                        assignmentReviewEndDate: new Date(periodDTO.assignmentReviewEndDate),
                        holidays: periodDTO.holidays
                    });
                });
                return periods;
            }
        } catch (error) {
            console.log("Error en FacultyTasksService.getPeriodsForAvailability");
            console.log(error);
        }
    }

    // Users Planning - Assignments
    public getMyAssignments = async (period: Period): Promise<Array<Assignment> | undefined> => {
        try {
            let response: HttpClientResponse;

            if (Local) {
                response = await this.httpClient.get(`${FacultyTasksAPIURL}${AssignmentsEndpoint.MyAssignments}/${period.id.toUpperCase()}`, HttpClient.configurations.v1);
            } else {
                const client = await this.aadHttpClientFactory.getClient(AzureAd.ApplicationUri);
                response = await client.get(`${FacultyTasksAPIURL}${AssignmentsEndpoint.MyAssignments}/${period.id.toUpperCase()}`, AadHttpClient.configurations.v1);
            }

            if (response.status === 200) {
                const dataResponse: Array<AssignmentDTO> = await response.json();

                const statusMap: Record<number, AssignmentStatus> = {
                    0: SupportedAssignmentStatus.pending,
                    1: SupportedAssignmentStatus.accepted,
                    2: SupportedAssignmentStatus.rejected
                };

                const compatibilityStatusMap: Record<number, AvailabilityCompatibility> = {
                    0: SupportedAvailabilityCompatibility.compatible,
                    1: SupportedAvailabilityCompatibility.conflicted,
                    2: SupportedAvailabilityCompatibility.unknown
                };

                const assignments: Array<Assignment> = [];

                dataResponse.map(assignmentDTO => {
                    assignments.push({
                        id: assignmentDTO.id,
                        subject: assignmentDTO.subject,
                        program: assignmentDTO.program,
                        academicArea: assignmentDTO.academicArea,
                        numberOfSessions: assignmentDTO.numberOfSessions,
                        description: assignmentDTO.description,
                        startDate: new Date(assignmentDTO.startDate),
                        endDate: new Date(assignmentDTO.endDate),
                        status: statusMap[assignmentDTO.status] ?? SupportedAssignmentStatus.pending,
                        rejectionReason: assignmentDTO.rejectionReason,
                        compatibilityStatus: compatibilityStatusMap[assignmentDTO.compatibilityStatus] ?? SupportedAvailabilityCompatibility.unknown,
                        assignedSections: assignmentDTO.assignedSections,
                        intakeName: assignmentDTO?.intakeName,
                        campus: assignmentDTO?.campus,
                        shift: assignmentDTO?.shift,
                        nTotalSessions: assignmentDTO?.nTotalSessions
                    });
                });

                return assignments;
            }
            else if (response.status === 404) {
                return undefined;
            }
        } catch (error) {
            console.log("Error en FacultyTasksService.getMyAssignments");
            console.log(error);
        }
    }

    public acceptMyAssignment = async (assignmentId: string, sessionStructureQuestions: string, additionalInfo: string): Promise<boolean> => {
        try {
            let response: HttpClientResponse;

            const requestHeaders: Headers = new Headers();
            requestHeaders.append("Content-type", "application/json");

            const postOptions: IHttpClientOptions = {
                headers: requestHeaders,
                body: JSON.stringify({
                    acceptAssignmentSessionStructure: sessionStructureQuestions,
                    acceptAssignmentAditionalInfo: additionalInfo
                }),
                method: 'PUT'
            };

            if (Local) {
                response = await this.httpClient.fetch(`${FacultyTasksAPIURL}${AssignmentsEndpoint.AcceptAssignment}/${assignmentId.toUpperCase()}`, HttpClient.configurations.v1, postOptions);
            } else {
                const client = await this.aadHttpClientFactory.getClient(AzureAd.ApplicationUri);
                response = await client.fetch(`${FacultyTasksAPIURL}${AssignmentsEndpoint.AcceptAssignment}/${assignmentId.toUpperCase()}`, AadHttpClient.configurations.v1, postOptions);
            }

            if (response.status === 200) {
                return true;
            }
            return false;
        } catch (error) {
            console.log("Error en acceptMyAssignment");
            console.log(error);
            return false;
        }
    }

    public rejectMyAssignment = async (assignmentId: string, rejectionReason: string): Promise<boolean> => {
        try {
            let response: HttpClientResponse;

            const requestHeaders: Headers = new Headers();
            requestHeaders.append("Content-type", "application/json");

            const postOptions: IHttpClientOptions = {
                headers: requestHeaders,
                body: JSON.stringify({
                    rejectAssignmentReason: rejectionReason
                }),
                method: 'PUT'
            };

            if (Local) {
                response = await this.httpClient.fetch(`${FacultyTasksAPIURL}${AssignmentsEndpoint.RejectAssignment}/${assignmentId.toUpperCase()}`, HttpClient.configurations.v1, postOptions);
            } else {
                const client = await this.aadHttpClientFactory.getClient(AzureAd.ApplicationUri);
                response = await client.fetch(`${FacultyTasksAPIURL}${AssignmentsEndpoint.RejectAssignment}/${assignmentId.toUpperCase()}`, AadHttpClient.configurations.v1, postOptions);
            }

            if (response.status === 200) {
                return true;
            }
            return false;
        } catch (error) {
            console.log("Error en rejectMyAssignment");
            console.log(error);
            return false;
        }
    }

    public getPeriodsForAssignment = async (): Promise<Array<Period> | undefined> => {
        try {
            let response: HttpClientResponse;
            const periods: Array<Period> = [];
            if (Local) {
                response = await this.httpClient.get(`${FacultyTasksAPIURL}${PeriodEndpoint.ForAssignments}`, HttpClient.configurations.v1);
            } else {
                const client = await this.aadHttpClientFactory.getClient(AzureAd.ApplicationUri);
                response = await client.get(`${FacultyTasksAPIURL}${PeriodEndpoint.ForAssignments}`, AadHttpClient.configurations.v1);
            }

            if (response.status === 200) {
                const periodsDTO: Array<UserPeriodDTO> = await response.json();

                periodsDTO.map(periodDTO => {
                    periods.push({
                        id: periodDTO.id,
                        course: periodDTO.course,
                        name: periodDTO.name,
                        periodStartDate: new Date(periodDTO.periodStartDate),
                        periodEndDate: new Date(periodDTO.periodEndDate),
                        availabilityStartDate: new Date(periodDTO.availabilityStartDate),
                        availabilityEndDate: new Date(periodDTO.availabilityEndDate),
                        assignmentReviewStartDate: new Date(periodDTO.assignmentReviewStartDate),
                        assignmentReviewEndDate: new Date(periodDTO.assignmentReviewEndDate),
                        holidays: periodDTO.holidays
                    });
                });
                return periods;
            }
        } catch (error) {
            console.log("Error en FacultyTasksService.getPeriodsForAssignment");
            console.log(error);
        }
    }

    public checkIsAllAvailable = async (periodId: string): Promise<boolean | undefined> => {
        try {
            let response: HttpClientResponse;
            if (Local) {
                response = await this.httpClient.get(`${FacultyTasksAPIURL}${AvailabilityEndpoint.IsAllAvailable}/${periodId.toUpperCase()}`, HttpClient.configurations.v1);
            } else {
                const client = await this.aadHttpClientFactory.getClient(AzureAd.ApplicationUri);
                response = await client.get(`${FacultyTasksAPIURL}${AvailabilityEndpoint.IsAllAvailable}/${periodId.toUpperCase()}`, AadHttpClient.configurations.v1);
            }

            if (response.status === 200) {
                const isAllAvailable: boolean = await response.json();
                return isAllAvailable;
            }
        } catch (error) {
            console.log("Error en FacultyTasksService.checkIsAllAvailable");
            console.log(error);
        }
    }

    // Admin Planning - Periods
    public getPeriods = async (): Promise<Array<Period> | undefined> => {
        try {
            let response: HttpClientResponse;
            const periods: Array<Period> = [];
            if (Local) {
                response = await this.httpClient.get(`${FacultyTasksAPIURL}${PeriodEndpoint.Base}`, HttpClient.configurations.v1);
            } else {
                const client = await this.aadHttpClientFactory.getClient(AzureAd.ApplicationUri);
                response = await client.get(`${FacultyTasksAPIURL}${PeriodEndpoint.Base}`, AadHttpClient.configurations.v1);
            }

            if (response.status === 200) {
                const periodsDTO: Array<PeriodDTO> = await response.json();

                periodsDTO.map(periodDTO => {
                    periods.push({
                        id: periodDTO.id,
                        course: periodDTO.course,
                        name: periodDTO.name,
                        periodStartDate: new Date(periodDTO.periodStartDate),
                        periodEndDate: new Date(periodDTO.periodEndDate),
                        availabilityStartDate: new Date(periodDTO.availabilityStartDate),
                        availabilityEndDate: new Date(periodDTO.availabilityEndDate),
                        assignmentReviewStartDate: new Date(periodDTO.assignmentReviewStartDate),
                        assignmentReviewEndDate: new Date(periodDTO.assignmentReviewEndDate),
                        hoursPerDay: periodDTO.hoursPerDay,
                        gapsCoefficient: periodDTO.gapsCoefficient,
                        hasAvailabilities: periodDTO.hasAvailabilities,
                        holidays: periodDTO.holidays
                    });
                });
                return periods;
            }
        } catch (error) {
            console.log("Error en FacultyTasksService.getPeriods");
            console.log(error);
        }
    }

    public createPeriod = async (periodDataForm: PeriodDataForm): Promise<Period | undefined> => {
        try {
            let response: HttpClientResponse;

            const requestHeaders: Headers = new Headers();
            requestHeaders.append("Content-type", "application/json");

            const postOptions: IHttpClientOptions = {
                headers: requestHeaders,
                body: JSON.stringify({
                    Course: periodDataForm.course?.substring(0, TextField_MaxLenght.Course),
                    Name: periodDataForm.name?.substring(0, TextField_MaxLenght.Name),
                    PeriodStartDate: periodDataForm.periodStartDate,
                    PeriodEndDate: periodDataForm.periodEndDate,
                    AvailabilityStartDate: periodDataForm.availabilityStartDate,
                    AvailabilityEndDate: periodDataForm.availabilityEndDate,
                    AssignmentReviewStartDate: periodDataForm.assignmentReviewStartDate,
                    AssignmentReviewEndDate: periodDataForm.assignmentReviewEndDate,
                    HoursPerDay: periodDataForm.hoursPerDay,
                    GapsCoefficient: periodDataForm.gapsCoefficient,
                    Holidays: periodDataForm.holidays.map(holiday => holiday.holidayDate)
                })
            };

            if (Local) {
                response = await this.httpClient.post(`${FacultyTasksAPIURL}${PeriodEndpoint.Base}`, HttpClient.configurations.v1, postOptions);
            } else {
                const client = await this.aadHttpClientFactory.getClient(AzureAd.ApplicationUri);
                response = await client.post(`${FacultyTasksAPIURL}${PeriodEndpoint.Base}`, AadHttpClient.configurations.v1, postOptions);
            }

            if (response.status === 201) {
                const dataResponse: PeriodDTO = await response.json();
                const data: Period = {
                    id: dataResponse.id,
                    course: periodDataForm.course ? periodDataForm.course : '',
                    name: periodDataForm.name ? periodDataForm.name : '',
                    periodStartDate: periodDataForm.periodStartDate ? new Date(periodDataForm.periodStartDate) : new Date(),
                    periodEndDate: periodDataForm.periodEndDate ? new Date(periodDataForm.periodEndDate) : new Date(),
                    availabilityStartDate: periodDataForm.availabilityStartDate ? new Date(periodDataForm.availabilityStartDate) : new Date(),
                    availabilityEndDate: periodDataForm.availabilityEndDate ? new Date(periodDataForm.availabilityEndDate) : new Date(),
                    assignmentReviewStartDate: periodDataForm.assignmentReviewStartDate ? new Date(periodDataForm.assignmentReviewStartDate) : new Date(),
                    assignmentReviewEndDate: periodDataForm.assignmentReviewEndDate ? new Date(periodDataForm.assignmentReviewEndDate) : new Date(),
                    hoursPerDay: periodDataForm.hoursPerDay ? periodDataForm.hoursPerDay : 0,
                    gapsCoefficient: periodDataForm.gapsCoefficient ? periodDataForm.gapsCoefficient : 0,
                    hasAvailabilities: false,
                    holidays: periodDataForm.holidays
                }
                return data;
            }
            return undefined;
        } catch (error) {
            console.log("Error en createPeriod");
            console.log(error);
        }
    }

    public updatePeriod = async (periodDataForm: PeriodDataForm, periodId: string): Promise<boolean | undefined> => {
        try {
            let response: HttpClientResponse;

            const requestHeaders: Headers = new Headers();
            requestHeaders.append("Content-type", "application/json");

            const postOptions: IHttpClientOptions = {
                headers: requestHeaders,
                body: JSON.stringify({
                    Id: periodId,
                    Course: periodDataForm.course?.substring(0, TextField_MaxLenght.Course),
                    Name: periodDataForm.name?.substring(0, TextField_MaxLenght.Name),
                    PeriodStartDate: periodDataForm.periodStartDate,
                    PeriodEndDate: periodDataForm.periodEndDate,
                    AvailabilityStartDate: periodDataForm.availabilityStartDate,
                    AvailabilityEndDate: periodDataForm.availabilityEndDate,
                    AssignmentReviewStartDate: periodDataForm.assignmentReviewStartDate,
                    AssignmentReviewEndDate: periodDataForm.assignmentReviewEndDate,
                    HoursPerDay: periodDataForm.hoursPerDay,
                    GapsCoefficient: periodDataForm.gapsCoefficient,
                    Holidays: periodDataForm.holidays
                }),
                method: 'PUT'
            };

            if (Local) {
                response = await this.httpClient.fetch(`${FacultyTasksAPIURL}${PeriodEndpoint.Base}/${periodId}`, HttpClient.configurations.v1, postOptions);
            } else {
                const client = await this.aadHttpClientFactory.getClient(AzureAd.ApplicationUri);
                response = await client.fetch(`${FacultyTasksAPIURL}${PeriodEndpoint.Base}/${periodId}`, AadHttpClient.configurations.v1, postOptions);
            }

            if (response.status === 204) {
                return true;
            }
            return undefined;
        } catch (error) {
            console.log("Error en updatePeriod");
            console.log(error);
        }
    }

    public deletePeriod = async (periodId: string): Promise<boolean | undefined> => {
        try {
            let response: HttpClientResponse;

            let isDeleted = false;

            const requestHeaders: Headers = new Headers();
            requestHeaders.append("Content-type", "application/json");

            const postOptions: IHttpClientOptions = {
                headers: requestHeaders,
                body: JSON.stringify({
                    status: false
                }),
                method: 'DELETE'
            };

            if (Local) {
                response = await this.httpClient.fetch(`${FacultyTasksAPIURL}${PeriodEndpoint.Base}/${periodId}`, HttpClient.configurations.v1, postOptions);
            } else {
                const client = await this.aadHttpClientFactory.getClient(AzureAd.ApplicationUri);
                response = await client.fetch(`${FacultyTasksAPIURL}${PeriodEndpoint.Base}/${periodId}`, AadHttpClient.configurations.v1, postOptions);
            }

            if (response.status === 204) {
                isDeleted = true;
            }
            return isDeleted;
        } catch (error) {
            console.log("Error en deletePeriod");
            console.log(error);
        }
    }

    public evalTeacherHasAvailability = async (periodId: string, teacherEmail: string): Promise<UserDTO | undefined> => {
        try {
            let response: HttpClientResponse;

            const requestHeaders: Headers = new Headers();
            requestHeaders.append("Content-type", "application/json");

            const postOptions: IHttpClientOptions = {
                headers: requestHeaders,
                body: JSON.stringify({
                    periodId: periodId,
                    email: teacherEmail
                })
            };

            if (Local) {
                response = await this.httpClient.post(`${FacultyTasksAPIURL}${AdminAvailabilitiesEndpoint.UserWithAvailability}`, HttpClient.configurations.v1, postOptions);
            } else {
                const client = await this.aadHttpClientFactory.getClient(AzureAd.ApplicationUri);
                response = await client.post(`${FacultyTasksAPIURL}${AdminAvailabilitiesEndpoint.UserWithAvailability}`, AadHttpClient.configurations.v1, postOptions);
            }

            if (response.status === 200) {
                const userDTO: UserDTO = await response.json();
                return {
                    id: userDTO.id,
                    displayName: userDTO.displayName,
                    email: userDTO.email
                };
            }
        } catch (error) {
            console.log("Error en FacultyTasksService.evalTeacherHasAvailability");
            console.log(error);
        }
    }

    public evalTeacherHasAssignment = async (periodId: string, teacherEmail: string): Promise<UserDTO | undefined> => {
        try {
            let response: HttpClientResponse;

            const requestHeaders: Headers = new Headers();
            requestHeaders.append("Content-type", "application/json");

            const postOptions: IHttpClientOptions = {
                headers: requestHeaders,
                body: JSON.stringify({
                    periodId: periodId,
                    email: teacherEmail
                })
            };

            if (Local) {
                response = await this.httpClient.post(`${FacultyTasksAPIURL}${AdminAssignmentsEndpoint.UserWithAssignment}`, HttpClient.configurations.v1, postOptions);
            } else {
                const client = await this.aadHttpClientFactory.getClient(AzureAd.ApplicationUri);
                response = await client.post(`${FacultyTasksAPIURL}${AdminAssignmentsEndpoint.UserWithAssignment}`, AadHttpClient.configurations.v1, postOptions);
            }

            if (response.status === 200) {
                const userDTO: UserDTO = await response.json();
                return {
                    id: userDTO.id,
                    displayName: userDTO.displayName,
                    email: userDTO.email
                };
            }
        } catch (error) {
            console.log("Error en FacultyTasksService.evalTeacherHasAssignment");
            console.log(error);
        }
    }

    public exportAvailabilitiesByUserAndPeriod = async (userId: string, periodId: string, availabilityStatus: SupportedDateAvailabilityStatus): Promise<Blob | undefined> => {
        try {
            let response: HttpClientResponse;
            const exportURL = AdminAvailabilitiesEndpoint.ExportAvailabilitiesByUserAndPeriod.replace("{userId}", userId).replace("{periodId}", periodId);
            if (Local) {
                response = await this.httpClient.get(`${FacultyTasksAPIURL}${exportURL}?type=${availabilityStatus}`, HttpClient.configurations.v1);
            } else {
                const client = await this.aadHttpClientFactory.getClient(AzureAd.ApplicationUri);
                response = await client.get(`${FacultyTasksAPIURL}${exportURL}?type=${availabilityStatus}`, AadHttpClient.configurations.v1);
            }

            if (response.status === 200) {
                const blob: Blob = await response.blob();
                return blob;
            }
        } catch (error) {
            console.log("Error en FacultyTasksService.exportAvailabilitiesByUserAndPeriod");
            console.log(error);
        }
    }

    public exportAvailabilitiesByPeriod = async (periodId: string, availabilityStatus: SupportedDateAvailabilityStatus): Promise<Blob | undefined> => {
        try {
            let response: HttpClientResponse;
            const exportURL = AdminAvailabilitiesEndpoint.ExportAvailabilitiesByPeriod.replace("{periodId}", periodId);
            if (Local) {
                response = await this.httpClient.get(`${FacultyTasksAPIURL}${exportURL}?type=${availabilityStatus}`, HttpClient.configurations.v1);
            } else {
                const client = await this.aadHttpClientFactory.getClient(AzureAd.ApplicationUri);
                response = await client.get(`${FacultyTasksAPIURL}${exportURL}?type=${availabilityStatus}`, AadHttpClient.configurations.v1);
            }

            if (response.status === 200) {
                const blob: Blob = await response.blob();
                return blob;
            }
        } catch (error) {
            console.log("Error en FacultyTasksService.exportAvailabilitiesByPeriod");
            console.log(error);
        }
    }

    public getUniqueUsersByPeriodWithAssignments = async (periodId: string): Promise<Array<UserDTO> | undefined> => {
        try {
            let response: HttpClientResponse;
            const users: Array<UserDTO> = [];
            const uniqueUsersByPeriodURL = AdminAssignmentsEndpoint.UniqueUsersByPeriod.replace("{periodId}", periodId);
            if (Local) {
                response = await this.httpClient.get(`${FacultyTasksAPIURL}${uniqueUsersByPeriodURL}`, HttpClient.configurations.v1);
            } else {
                const client = await this.aadHttpClientFactory.getClient(AzureAd.ApplicationUri);
                response = await client.get(`${FacultyTasksAPIURL}${uniqueUsersByPeriodURL}`, AadHttpClient.configurations.v1);
            }

            if (response.status === 200) {
                const usersDTO: Array<UserDTO> = await response.json();

                usersDTO.map(userDTO => {
                    users.push({
                        id: userDTO.id,
                        displayName: userDTO.displayName,
                        email: userDTO.email
                    });
                });
                return users;
            }
        } catch (error) {
            console.log("Error en FacultyTasksService.getUniqueUsersByPeriodWithAssignments");
            console.log(error);
        }
    }

    public exportAssignmentsByUserAndPeriod = async (userId: string, periodId: string): Promise<Blob | undefined> => {
        try {
            let response: HttpClientResponse;
            const exportURL = AdminAssignmentsEndpoint.ExportAssignmentsByUserAndPeriod.replace("{userId}", userId).replace("{periodId}", periodId);
            if (Local) {
                response = await this.httpClient.get(`${FacultyTasksAPIURL}${exportURL}`, HttpClient.configurations.v1);
            } else {
                const client = await this.aadHttpClientFactory.getClient(AzureAd.ApplicationUri);
                response = await client.get(`${FacultyTasksAPIURL}${exportURL}`, AadHttpClient.configurations.v1);
            }

            if (response.status === 200) {
                const blob: Blob = await response.blob();
                return blob;
            }
        } catch (error) {
            console.log("Error en FacultyTasksService.exportAssignmentsByUserAndPeriod");
            console.log(error);
        }
    }

    public exportAssignmentsByPeriod = async (periodId: string): Promise<Blob | undefined> => {
        try {
            let response: HttpClientResponse;
            const exportURL = AdminAssignmentsEndpoint.ExportAssignmentsByPeriod.replace("{periodId}", periodId);
            if (Local) {
                response = await this.httpClient.get(`${FacultyTasksAPIURL}${exportURL}`, HttpClient.configurations.v1);
            } else {
                const client = await this.aadHttpClientFactory.getClient(AzureAd.ApplicationUri);
                response = await client.get(`${FacultyTasksAPIURL}${exportURL}`, AadHttpClient.configurations.v1);
            }

            if (response.status === 200) {
                const blob: Blob = await response.blob();
                return blob;
            }
        } catch (error) {
            console.log("Error en FacultyTasksService.exportAssignmentsByPeriod");
            console.log(error);
        }
    }


    //tasks
    public getMyTasks = async (): Promise<Array<Task> | undefined> => {

        try {
            let response: HttpClientResponse;
            const tasks: Array<Task> = [];
            if (Local) {
                response = await this.httpClient.get(`${FacultyTasksAPIURL}${TasksEndpoint.MyTasks}`, HttpClient.configurations.v1);
            } else {
                const client = await this.aadHttpClientFactory.getClient(AzureAd.ApplicationUri);
                response = await client.get(`${FacultyTasksAPIURL}${TasksEndpoint.MyTasks}`, AadHttpClient.configurations.v1);
            }

            if (response.status === 200) {
                const tasksDTO: Array<TaskDTO> = await response.json();

                tasksDTO.map(taskDTO => {
                    tasks.push({
                        type: taskDTO.type,
                        description: taskDTO.description,
                        dueDate: taskDTO.dueDate ? new Date(taskDTO.dueDate) : undefined,
                        status: taskDTO.status,
                        supervisor: taskDTO.supervisor,
                        url: taskDTO.url,
                        imageUrl: taskDTO.imageUrl
                    });
                });
                return tasks;
            }
        } catch (error) {
            console.log("Error en FacultyTasksService.getMyTasks");
            console.log(error);
        }
    }

    public getUserPendingTasks = async (userEmail: string): Promise<Array<Task> | undefined> => {

        try {
            let response: HttpClientResponse;
            const tasks: Array<Task> = [];

            const getTasksUrl = TasksEndpoint.UserPendingTasks.replace("{userEmail}", userEmail);

            if (Local) {
                response = await this.httpClient.get(`${FacultyTasksAPIURL}/${getTasksUrl}`, HttpClient.configurations.v1);
            } else {
                const client = await this.aadHttpClientFactory.getClient(AzureAd.ApplicationUri);
                response = await client.get(`${FacultyTasksAPIURL}/${getTasksUrl}`, AadHttpClient.configurations.v1);
            }

            if (response.status === 200) {
                const tasksDTO: Array<TaskDTO> = await response.json();

                tasksDTO.map(taskDTO => {
                    tasks.push({
                        type: taskDTO.type,
                        description: taskDTO.description,
                        dueDate: taskDTO.dueDate ? new Date(taskDTO.dueDate) : undefined,
                        status: taskDTO.status,
                        supervisor: taskDTO.supervisor,
                        url: taskDTO.url,
                        imageUrl: taskDTO.imageUrl
                    });
                });
                return tasks;
            }
        } catch (error) {
            console.log("Error en FacultyTasksService.getUserTasks");
            console.log(error);
        }
    }

}
