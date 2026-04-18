import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Projects from "./pages/Projects";
import Employees from "./pages/Employees";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import AddClient from "./pages/AddClient";
import EditClient from "./pages/EditClient";
import AddProject from "./pages/AddProject";
import EditProject from "./pages/EditProject";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/EditEmployee";
import MainLayout from "./layout/MainLayout";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes (Authenticated) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />

                {/* Projects: Accessible by everyone logged in */}
                <Route path="/projects" element={<Projects />} />

                {/* Clients: Admin, Manager, Employee */}
                <Route element={<ProtectedRoute allowedRoles={["admin", "manager", "employee"]} />}>
                  <Route path="/clients" element={<Clients />} />
                </Route>

                {/* Employees, Reports, Settings: Admin & Manager Only */}
                <Route element={<ProtectedRoute allowedRoles={["admin", "manager"]} />}>
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/add-employee" element={<AddEmployee />} />
                  <Route path="/edit-employee/:id" element={<EditEmployee />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />

                  {/* Modifying Clients/Projects is also Admin/Manager only */}
                  <Route path="/add-client" element={<AddClient />} />
                  <Route path="/edit-client/:id" element={<EditClient />} />
                  <Route path="/add-project" element={<AddProject />} />
                  <Route path="/edit-project/:id" element={<EditProject />} />
                </Route>

              </Route>
            </Route>
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
