/* eslint-disable @typescript-eslint/no-explicit-any */
// import { AvailabilityDTO, AvailabilityStatus } from 'types';

// const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
// const HOURS = Array.from({ length: 13 }, (_, i) => (8 + i).toString()); // 8 → 20

// const randomStatus = (): AvailabilityStatus | undefined => {
//     const options: (AvailabilityStatus | undefined)[] = ['available', 'blocked', undefined];
//     const index = Math.floor(Math.random() * options.length);
//     return options[index];
// };

// export const generateRandomAvailabilityDTO = (course: string, period: string, openPeriod: boolean): AvailabilityDTO => {
//     const dto: any = { course, period, openPeriod };

//     for (const hour of HOURS) {
//         dto[hour] = {};
//         for (const day of DAYS) {
//             dto[hour][day] = randomStatus();
//         }
//     }

//     return dto as AvailabilityDTO;
// };


// const sampleData: AvailabilityDTO[] = [
//   generateRandomAvailabilityDTO('2025-2026', 'Q1 | ENE - ABR'),
//   generateRandomAvailabilityDTO('2024-2025', 'Q2 | MAY - AGO'),
//   generateRandomAvailabilityDTO('2024-2025', 'Q1 | ENE - ABR')
// ];

