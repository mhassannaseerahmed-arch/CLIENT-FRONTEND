import React from "react";
import {
  Users,
  FolderKanban,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Lock,
  Loader2
} from "lucide-react";

import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../services/storage";

interface StatItem {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bg: string;
  trend: string;
  trendUp: boolean;
  visibleTo: UserRole[];
}

// Spinner
const Spinner = () => (
  <div className="flex justify-center py-6">
    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
  </div>
);

// Stat Skeleton
const StatSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
    <div className="h-8 bg-gray-200 rounded w-16" />
  </div>
);

// Row Skeleton
const RowSkeleton = () => (
  <div className="p-4 bg-gray-50 rounded-xl animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-40 mb-2" />
    <div className="h-3 bg-gray-100 rounded w-20" />
  </div>
);

const Dashboard: React.FC = () => {
  const { clients, projects, loading } = useData();
  const { user } = useAuth();

  const activeProjects = projects.filter(p => p.status === "Active").length;
  const totalRevenue = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const avgBudget =
    projects.length > 0 ? (totalRevenue / projects.length).toFixed(0) : 0;

  const stats: StatItem[] = [
    {
      title: "Active Projects",
      value: activeProjects,
      icon: <FolderKanban className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50",
      trend: "+12%",
      trendUp: true,
      visibleTo: ["admin", "manager", "employee", "client"]
    },
    {
      title: "Clients",
      value: clients.length,
      icon: <Users className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-50",
      trend: "+5%",
      trendUp: true,
      visibleTo: ["admin", "manager", "employee"]
    },
    {
      title: "Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="w-5 h-5 text-green-600" />,
      bg: "bg-green-50",
      trend: "+18%",
      trendUp: true,
      visibleTo: ["admin", "manager"]
    },
    {
      title: "Avg Budget",
      value: `$${avgBudget}`,
      icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-50",
      trend: "-2%",
      trendUp: false,
      visibleTo: ["admin"]
    }
  ];

  const allowedStats = stats.filter(stat =>
    user?.role ? stat.visibleTo.includes(user.role) : false
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back {user?.username}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
            <StatSkeleton key={i} />
          ))
          : allowedStats.map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border shadow-sm"
            >
              <div className="flex justify-between mb-3">
                <div className={`${item.bg} p-2 rounded`}>
                  {item.icon}
                </div>

                <div
                  className={`text-xs flex items-center gap-1 ${item.trendUp
                      ? "text-green-600"
                      : "text-red-600"
                    }`}
                >
                  {item.trendUp ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  {item.trend}
                </div>
              </div>

              <p className="text-gray-500 text-sm">
                {item.title}
              </p>
              <h2 className="text-2xl font-bold">
                {item.value}
              </h2>
            </div>
          ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Projects */}
        <div className="bg-white p-6 rounded-2xl border">
          <h3 className="font-semibold mb-4">
            Recent Projects
          </h3>

          {loading ? (
            <>
              <RowSkeleton />
              <RowSkeleton />
              <RowSkeleton />
            </>
          ) : projects.length === 0 ? (
            <div className="text-gray-400 text-center py-6">
              No Projects Yet
            </div>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map(project => (
                <div
                  key={project.id}
                  className="flex justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">
                      {project.name}
                    </p>

                    {["admin", "manager"].includes(
                      user?.role || ""
                    ) ? (
                      <p className="text-xs text-gray-500">
                        ${project.budget}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 flex gap-1 items-center">
                        <Lock size={12} />
                        Hidden
                      </p>
                    )}
                  </div>

                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clients */}
        <div className="bg-white p-6 rounded-2xl border">
          <h3 className="font-semibold mb-4">
            Clients
          </h3>

          {loading ? (
            <>
              <RowSkeleton />
              <RowSkeleton />
              <RowSkeleton />
            </>
          ) : clients.length === 0 ? (
            <div className="text-gray-400 text-center py-6">
              No Clients Yet
            </div>
          ) : (
            <div className="space-y-3">
              {clients.slice(0, 5).map(client => (
                <div
                  key={client.id}
                  className="flex justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">
                      {client.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {client.company}
                    </p>
                  </div>

                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                    {client.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;