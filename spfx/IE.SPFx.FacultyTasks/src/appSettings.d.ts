declare interface IAppSettings {
    AzureAd: {
        ApplicationName: string;
        ApplicationUri: string;
    },
    FacultyTasksAPIURL: string;
    Local?: boolean;
    AdminGroupId: string;
    UserGroupId: string;
    TaskUserGroupId:string;
}

declare module 'appSettings' {
    const appSettings: IAppSettings;
    export = appSettings;
}