import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { storage, Client, Project, Employee, Task, DataContextType } from "../services/storage";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  // --- Initial State ---
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // --- Persistence Logic ---
  useEffect(() => {
    if (!user) {
      setClients([]);
      setProjects([]);
      setEmployees([]);
      setTasks([]);
      return;
    }

    const fetchData = async () => {
      try {
        const [clientsRes, projectsRes, employeesRes, tasksRes] = await Promise.all([
          axiosInstance.get("/api/clients"),
          axiosInstance.get("/api/projects"),
          axiosInstance.get("/api/employees"),
          axiosInstance.get("/api/tasks"),
        ]);
        setClients(clientsRes.data);
        setProjects(projectsRes.data);
        setEmployees(employeesRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [user]);

  // --- Logic Functions ---

  // Clients
  const addClient = async (client: Omit<Client, 'id'>) => {
    try {
      const response = await axiosInstance.post("/api/clients", client);
      setClients([...clients, response.data]);
    } catch (error) {
      console.error("Failed to add client:", error);
    }
  };

  const editClient = async (updatedClient: Client) => {
    try {
      const response = await axiosInstance.put(`/api/clients/${updatedClient.id}`, updatedClient);
      setClients(clients.map(client => client.id === updatedClient.id ? response.data : client));
    } catch (error) {
      console.error("Failed to edit client:", error);
    }
  };

  const deleteClient = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/clients/${id}`);
      setClients(clients.filter(client => client.id !== id));
      setProjects(projects.filter(project => project.clientId !== id));
    } catch (error) {
      console.error("Failed to delete client:", error);
    }
  };

  // Projects
  const addProject = async (project: Omit<Project, 'id'>) => {
    try {
      const response = await axiosInstance.post("/api/projects", project);
      setProjects([...projects, response.data]);
    } catch (error) {
      console.error("Failed to add project:", error);
    }
  };

  const editProject = async (updatedProject: Project) => {
    try {
      const response = await axiosInstance.put(`/api/projects/${updatedProject.id}`, updatedProject);
      setProjects(projects.map(project => project.id === updatedProject.id ? response.data : project));
    } catch (error) {
      console.error("Failed to edit project:", error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/projects/${id}`);
      setProjects(projects.filter(project => project.id !== id));
      setTasks(tasks.filter(task => task.projectId !== id));
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  // Employees
  const addEmployee = async (employee: Omit<Employee, 'id'>) => {
    try {
      const response = await axiosInstance.post("/api/employees", employee);
      setEmployees([...employees, response.data]);
    } catch (error) {
      console.error("Failed to add employee:", error);
    }
  };

  const editEmployee = async (updatedEmployee: Employee) => {
    try {
      const response = await axiosInstance.put(`/api/employees/${updatedEmployee.id}`, updatedEmployee);
      setEmployees(employees.map(employee => employee.id === updatedEmployee.id ? response.data : employee));
    } catch (error) {
      console.error("Failed to edit employee:", error);
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/employees/${id}`);
      setEmployees(employees.filter(employee => employee.id !== id));
      setTasks(tasks.map(task => task.employeeId === id ? { ...task, employeeId: null } : task));
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  // Tasks
  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      const response = await axiosInstance.post("/api/tasks", task);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    try {
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (!taskToUpdate) return;
      const response = await axiosInstance.put(`/api/tasks/${taskId}`, { ...taskToUpdate, status });
      setTasks(tasks.map(t => t.id === taskId ? response.data : t));
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await axiosInstance.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const value: DataContextType = {
    clients, addClient, editClient, deleteClient,
    projects, addProject, editProject, deleteProject,
    employees, addEmployee, editEmployee, deleteEmployee,
    tasks, addTask, updateTaskStatus, deleteTask
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
