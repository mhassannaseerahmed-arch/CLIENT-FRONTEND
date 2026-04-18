import React from "react";
import { Users, FolderKanban, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Lock } from "lucide-react";
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

const Dashboard: React.FC = () => {
  const { clients, projects } = useData();
  const { user } = useAuth();

  // 1. Data Calculations
  const activeProjectsCount = projects.filter(p => p.status === "Active").length;
  const totalRevenue = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
  const avgBudget = projects.length > 0 ? (totalRevenue / projects.length).toFixed(0) : 0;

  // 2. Define which roles can see which Stat Cards
  const stats: StatItem[] = [
    {
      title: "Active Projects",
      value: activeProjectsCount,
      icon: <FolderKanban className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50",
      trend: "+12%",
      trendUp: true,
      visibleTo: ["admin", "manager", "employee", "client"]
    },
    {
      title: "Total Clients",
      value: clients.length,
      icon: <Users className="w-6 h-6 text-purple-600" />,
      bg: "bg-purple-50",
      trend: "+5%",
      trendUp: true,
      visibleTo: ["admin", "manager", "employee"]
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
      bg: "bg-emerald-50",
      trend: "+18%",
      trendUp: true,
      visibleTo: ["admin", "manager"]
    },
    {
      title: "Avg Project Size",
      value: `$${Number(avgBudget).toLocaleString()}`,
      icon: <TrendingUp className="w-6 h-6 text-amber-600" />,
      bg: "bg-amber-50",
      trend: "-2%",
      trendUp: false,
      visibleTo: ["admin"]
    },
  ];

  // Filter stats based on the logged-in user's role
  const allowedStats = stats.filter(stat => user?.role ? stat.visibleTo.includes(user.role) : false);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header with Welcome Message */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Business Intelligence</h1>
          <p className="text-gray-500 mt-2 text-lg font-medium">
            Welcome back, <span className="text-blue-600 capitalize">{user?.username}</span> ({user?.role})
          </p>
        </div>
      </div>

      {/* Stats Grid - Automatically adjusts based on role permissions */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${allowedStats.length} gap-6 mb-12`}>
        {allowedStats.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`${item.bg} p-4 rounded-2xl`}>{item.icon}</div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${item.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {item.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {item.trend}
              </div>
            </div>
            <h2 className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-1">{item.title}</h2>
            <p className="text-3xl font-black text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Projects List - Role Based Detail Hiding */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Projects</h3>
          <div className="space-y-4">
            {projects.map((project, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-bold text-blue-600 shadow-sm">
                    {project.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{project.name}</h4>
                    {/* HIDE BUDGET FROM CLIENTS/EMPLOYEES */}
                    {user?.role && ["admin", "manager"].includes(user.role) ? (
                      <p className="text-xs text-gray-500 font-medium font-mono">${project.budget?.toLocaleString()}</p>
                    ) : (
                      <p className="text-xs text-gray-400 flex items-center gap-1"><Lock className="w-3 h-3" /> Budget Hidden</p>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${project.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio - Only show to Admin/Manager/Employee */}
        {user?.role !== "client" ? (
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Strategic Partners</h3>
            <div className="space-y-4">
              {clients.slice(0, 5).map((client, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-blue-100 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center font-bold text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{client.company}</h4>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                        {projects.filter(p => p.clientId === client.id).length} Active Projects
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${client.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {client.status}
                  </div>
                </div>
              ))}
              {clients.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400 italic">
                  <Users className="w-12 h-12 mb-2 opacity-20" />
                  <p className="text-sm font-medium">No clients registered in ecosystem.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-blue-600 p-8 rounded-[2rem] text-white flex flex-col justify-center items-center text-center">
            <h3 className="text-2xl font-bold mb-2 text-white">Need Professional Support?</h3>
            <p className="opacity-80 mb-6 font-medium">Your account manager is standing by to coordinate your digital ecosystem.</p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">Open Transmission</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
