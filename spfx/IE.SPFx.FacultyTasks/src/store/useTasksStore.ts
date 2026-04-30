import { create } from "zustand";
import { ServiceScope } from "@microsoft/sp-core-library";
import type { Task, UserDTO } from "types";
import { FacultyTasksService } from "services/FacultyTasksService";
import { GraphService } from "services/GraphService";
import { TaskStatus } from "utils/Constants";


interface TasksState {
  tasks: Task[];
  tasksDueSoon: Task[];
  isDataLoaded: boolean;
  usersByEmail: Record<string, UserDTO>;
  loadTasks: (serviceScope: ServiceScope) => Promise<void>;
}

const getPendingTasks = (tasks: Task[]): Task[] =>
  tasks.filter(t => t.status === TaskStatus.pending).sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;  
      if (!b.dueDate) return -1; 

      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
});


const isEmail = (value: string): boolean =>  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  tasksDueSoon: [],
  isDataLoaded: false,
  usersByEmail: {},

  // Data actions
  loadTasks: async (serviceScope: ServiceScope) => {
    try {
      set({ isDataLoaded: false });

      const facultyTasksService = serviceScope.consume(FacultyTasksService.serviceKey);
      const tasks = await facultyTasksService.getMyTasks();

      if (tasks) {
        set({ tasks,tasksDueSoon:getPendingTasks(tasks) });

        // Cargar datos de supervisores de forma asincrona
        const supervisorEmails = Array.from(new Set(tasks.map(t => t.supervisor).filter(Boolean)));

        const { usersByEmail } = get();
        const emails = supervisorEmails.filter(key => !usersByEmail[key]);

        if (!emails.length) return;

        // Pintar placeholders mientras se resuelven los datos reales
        set((state) => ({
          usersByEmail: {
            ...state.usersByEmail,
            ...emails.reduce<Record<string, UserDTO>>((acc, key) => {
              acc[key] = { id: key, email: key, displayName: key };
              return acc;
            }, {})
          }
        }));

        const graphService = serviceScope.consume(GraphService.serviceKey);

        const emailsToLoad = emails.filter(isEmail);
        if (!emailsToLoad.length) return;

        //Recorremos todos los emails, sin duplicados, y vamos cargando su foto y su nombre
        emailsToLoad.forEach(async (email) => {
          try {
            
            const user = await graphService.getUserByEmail(email);
            if (user) {
              set((state) => ({
                usersByEmail: {
                  ...state.usersByEmail,
                  [email]: {
                    ...state.usersByEmail[email],
                    ...user
                  }
                }
              }));
            }

            const photoUrl = await graphService.getUserPhoto(email);
            if (photoUrl) {
              set((state) => ({
                usersByEmail: {
                  ...state.usersByEmail,
                  [email]: {
                    ...state.usersByEmail[email],
                    photoUrl
                  }
                }
              }));
            }
          } catch {
            // silencioso -> se queda placeholder cacheado (no reintenta)
          }
        });
      }
    } catch (error) {
      console.error(`Error in loadPeriods(). ${error}`);
      set({ tasks: [], tasksDueSoon: [] });
    } finally {
      set({ isDataLoaded: true });
    }
  },
}));
