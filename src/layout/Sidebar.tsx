import React from "react";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  UserCog,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../services/storage";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  visibleTo: UserRole[];
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menu: MenuItem[] = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard size={20} />,
      visibleTo: ["admin", "manager", "employee", "client"],
    },
    {
      name: "Clients",
      path: "/clients",
      icon: <Users size={20} />,
      visibleTo: ["admin", "manager", "employee"],
    },
    {
      name: "Projects",
      path: "/projects",
      icon: <FolderKanban size={20} />,
      visibleTo: ["admin", "manager", "employee", "client"],
    },
    {
      name: "Employees",
      path: "/employees",
      icon: <UserCog size={20} />,
      visibleTo: ["admin", "manager"],
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <BarChart3 size={20} />,
      visibleTo: ["admin", "manager"],
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings size={20} />,
      visibleTo: ["admin", "manager"],
    },
  ];

  const filteredMenu = menu.filter((item) =>
    user?.role ? item.visibleTo.includes(user.role) : false
  );

  return (
    <div className="w-64 h-screen bg-white shadow-md p-5 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-8">
          Client SaaS
        </h1>

        <ul className="space-y-2">
          {filteredMenu.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition ${
                  location.pathname === item.path
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={logout}
        className="flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
