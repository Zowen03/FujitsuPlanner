// filepath: c:\Users\Cara PC\fujitsu-growth\FujitsuPlanner\src\api.d.ts
declare module '../../api' {
    export declare function register(username: string, password: string): Promise<{ success: boolean }>;
export declare function login(username: string, password: string): Promise<{ success: boolean; user: { username: string } }>;
export declare function createTemplate(template: { name: string; tasks: any[] }): Promise<{ success: boolean; template: { id: string; name: string } }>;
export declare function getTemplates(): Promise<{ id: string; name: string }[]>;
export declare function assignTemplate(assignment: { templateId: string; startDate: string; hoursPerWeek: number }): Promise<{ success: boolean; assignment: { id: string } }>;
export declare function getAssignments(): Promise<{ id: string; templateId: string }[]>;
export declare function checkSession(): Promise<{ success: boolean; user: { username: string } }>;
  }