// TypeScript Interfaces (Our "Contracts")
// These define exactly what our data looks like.

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'Active' | 'Pending';
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  budget: number;
  status: 'Active' | 'Pending' | 'Completed';
  timeline: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'On Leave';
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  employeeId: string | null;
}

export type UserRole = "admin" | "manager" | "employee" | "client";

export interface User {
  id?: string;
  email?: string;
  username: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (params: { email: string; password: string }) => Promise<void>;
  register: (params: { email: string; username: string; password: string; role?: UserRole }) => Promise<void>;
  logout: () => Promise<void>;
}

export interface DataContextType {
  loading: boolean;
  clients: Client[];
  addClient: (client: Omit<Client, 'id'>) => void;
  editClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  editProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  editEmployee: (employee: Employee) => void;
  deleteEmployee: (id: string) => void;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  deleteTask: (taskId: string) => void;
}

const STORAGE_KEYS = {
  CLIENTS: "crm_clients",
  PROJECTS: "crm_projects",
  EMPLOYEES: "crm_employees",
  TASKS: "crm_tasks",
} as const;

// Initial data (Mock Data)
const INITIAL_CLIENTS: Client[] = [
  { id: "1", name: "John Doe", email: "john@example.com", company: "Tech Corp", status: "Active" },
  { id: "2", name: "Jane Smith", email: "jane@design.io", company: "Design Studio", status: "Pending" },
];

const INITIAL_PROJECTS: Project[] = [
  { id: "1", name: "E-commerce Website", clientId: "1", budget: 5000, status: "Active", timeline: "2024-01-01 to 2024-03-31" },
  { id: "2", name: "Mobile App Redesign", clientId: "2", budget: 3500, status: "Pending", timeline: "2024-02-15 to 2024-05-15" },
];

const INITIAL_EMPLOYEES: Employee[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Developer", status: "Active" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Designer", status: "On Leave" },
];

const INITIAL_TASKS: Task[] = [
  { id: "1", projectId: "1", title: "Design homepage", status: "Done", employeeId: "2" },
  { id: "2", projectId: "1", title: "Develop API", status: "In Progress", employeeId: "1" },
  { id: "3", projectId: "2", title: "Initial sketches", status: "To Do", employeeId: "2" },
];

export const storage = {
  // Generic Helpers with Type Safety
  get: <T>(key: string, defaults: T): T => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaults;
  },

  save: <T>(key: string, data: T): void => {
    localStorage.setItem(key, JSON.stringify(data));
  },

  // Entity Specific Methods (Facades)
  getClients: (): Client[] => storage.get<Client[]>(STORAGE_KEYS.CLIENTS, INITIAL_CLIENTS),
  saveClients: (data: Client[]): void => storage.save(STORAGE_KEYS.CLIENTS, data),

  getProjects: (): Project[] => storage.get<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS),
  saveProjects: (data: Project[]): void => storage.save(STORAGE_KEYS.PROJECTS, data),

  getEmployees: (): Employee[] => storage.get<Employee[]>(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES),
  saveEmployees: (data: Employee[]): void => storage.save(STORAGE_KEYS.EMPLOYEES, data),

  getTasks: (): Task[] => storage.get<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS),
  saveTasks: (data: Task[]): void => storage.save(STORAGE_KEYS.TASKS, data),
};
