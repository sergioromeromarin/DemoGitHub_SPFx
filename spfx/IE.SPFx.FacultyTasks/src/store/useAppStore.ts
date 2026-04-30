import { create } from 'zustand';
import { ServiceScope } from '@microsoft/sp-core-library';
import { MSGraphClientFactory, SPHttpClient } from '@microsoft/sp-http';

interface AppState {
    serviceScope?: ServiceScope;
    userId?: string;
    currentUICultureName: string;
    absoluteUrl?: string;
    msGraphClientFactory?: MSGraphClientFactory;
    spHttpClient?: SPHttpClient;
    hasTeamsContext?: boolean;
    isAdmin: boolean;
    isUser: boolean;
    isTaskUser: boolean;
    isLoading: boolean;
    hasUnsavedChanges: boolean;
    currentOperation?: string;

    setServiceScope: (serviceScope: ServiceScope) => void;
    setUserId: (userId: string) => void;
    setCurrentUICultureName: (currentUICultureName: string) => void;
    setAbsoluteUrl: (absoluteUrl: string) => void;
    setMsGraphClientFactory: (msGraphClientFactory: MSGraphClientFactory) => void;
    setSpHttpClient: (spHttpClient: SPHttpClient) => void;
    setHasTeamsContext: (hasTeamsContext: boolean) => void;
    setRoles: (roles: { isUser: boolean; isAdmin: boolean, isTaskUser: boolean }) => void;
    setUnsavedChanges: (hasChanges: boolean, operation?: string) => void;
    clearUnsavedChanges: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    serviceScope: undefined,
    userId: undefined,
    currentUICultureName: 'en-US',
    absoluteUrl: undefined,
    msGraphClientFactory: undefined,
    spHttpClient: undefined,
    hasTeamsContext: false,
    isAdmin: false,
    isUser: false,
    isTaskUser: false,
    isLoading: true,
    hasUnsavedChanges: false,
    currentOperation: undefined,

    setServiceScope: (serviceScope) => set({ serviceScope: serviceScope }),
    setUserId: (userId) => set({ userId: userId }),
    setCurrentUICultureName: (currentUICultureName) => set({ currentUICultureName: currentUICultureName }),
    setAbsoluteUrl: (absoluteUrl) => set({ absoluteUrl: absoluteUrl }),
    setMsGraphClientFactory: (msGraphClientFactory) => set({ msGraphClientFactory: msGraphClientFactory }),
    setSpHttpClient: (spHttpClient) => set({ spHttpClient: spHttpClient }),
    setHasTeamsContext: (hasTeamsContext) => set({ hasTeamsContext: hasTeamsContext }),
    setRoles: (roles) => set({ ...roles, isLoading: false }),
    setUnsavedChanges: (hasChanges, operation) => set({ hasUnsavedChanges: hasChanges, currentOperation: operation }),
    clearUnsavedChanges: () => set({ hasUnsavedChanges: false, currentOperation: undefined })
}));
