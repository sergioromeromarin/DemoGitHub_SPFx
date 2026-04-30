import * as React from 'react';
import { GraphService } from 'services/GraphService';
import { useAppStore } from 'store/useAppStore';

export const useInitializeUser = (adminGroupId: string, userGroupId: string, taskUserGroupId: string): void => {
    const setUserRole = useAppStore((state) => state.setRoles);
    const serviceScope = useAppStore((state) => state.serviceScope);

    const loadUser = async (): Promise<void> => {
        try {
            if (serviceScope) {
                try {
                    const graphService = await serviceScope.consume(GraphService.serviceKey);
                    const result = await graphService.checkGroups(adminGroupId, userGroupId, taskUserGroupId);
                    setUserRole(result);
                } catch (err) {
                    console.error(err);
                    setUserRole({ isAdmin: false, isUser: false, isTaskUser: false });
                }
            }
        } catch (error) {
            console.error(`Error in loadUser(). ${error}`);
        }
    }

    React.useEffect(() => {
        loadUser().catch(console.error);
    }, [serviceScope]);

};