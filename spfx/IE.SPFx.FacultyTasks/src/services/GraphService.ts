import { ServiceKey, ServiceScope } from '@microsoft/sp-core-library';
import { MSGraphClientFactory } from '@microsoft/sp-http';
import { UserDTO } from 'types';

export class GraphService {

    public static readonly serviceKey: ServiceKey<GraphService> = ServiceKey.create('faculty-taskss:GraphService', GraphService);

    private mSGraphClientFactory: MSGraphClientFactory;

    constructor(serviceScope: ServiceScope) {
        serviceScope.whenFinished(() => {
            this.mSGraphClientFactory = serviceScope.consume(MSGraphClientFactory.serviceKey);
        });
    }

    public async checkGroups(adminGroupId: string, userGroupId: string, taskUserGroupId: string): Promise<{ isAdmin: boolean; isUser: boolean, isTaskUser: boolean }> {
        try {
            const graphClient = await this.mSGraphClientFactory.getClient('3');
            const response = await graphClient.api('/me/checkMemberGroups').headers({ "Accept": "application/json;odata.metadata=none" }).post({
                groupIds: [adminGroupId, userGroupId, taskUserGroupId],
            })

            const groups: string[] = response.value || [];
            const isAdmin = groups.includes(adminGroupId);
            const isUser = groups.includes(userGroupId);
            const isTaskUser = groups.includes(taskUserGroupId);

            return { isAdmin, isUser,isTaskUser };
        } catch (error) {
            console.error('Error checking group membership', error);
            return { isAdmin: false, isUser: false, isTaskUser: false };
        }
    }

    public getUserPhoto = async (email: string): Promise<string> => {
        let blobUrl: string = "";
        const graphClient = await this.mSGraphClientFactory.getClient('3');
        try {
            const photoValue = await graphClient.api(`/users/${email}/photo/$value`).headers({ "Accept": "application/json;odata.metadata=none" }).get();
            const url = window.URL;
            blobUrl = url.createObjectURL(photoValue);
        } catch (error) {
            console.error(`Error at GraphService.getUserPhoto`, error);
        }
        return blobUrl;
    }

    public getUserByEmail = async (email: string): Promise<UserDTO | undefined> => {
        try {
            const graphClient = await this.mSGraphClientFactory.getClient('3');
            const user = await graphClient.api(`/users/${encodeURIComponent(email)}`).select('id,displayName,mail,userPrincipalName').headers({ "Accept": "application/json;odata.metadata=none" }).get();

            const resolvedEmail: string = (user?.mail || user?.userPrincipalName || email) as string;

            return {
                id: user?.id ?? resolvedEmail,
                displayName: user?.displayName ?? resolvedEmail,
                email: resolvedEmail
        };
        } catch (error) {
            console.error(`Error at GraphService.getUserByEmail`, error);
            return undefined;
        }
  }

}