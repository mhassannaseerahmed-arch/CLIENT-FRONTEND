import React, { useMemo } from "react";
import { 
  Users, 
  FolderKanban, 
  UserCog, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Download,
  Target,
  BarChart3,
  ArrowUpRight,
  PieChart
} from "lucide-react";
import { useData } from "../context/DataContext";
import { Client, Project, Employee, Task } from "../services/storage";

interface AnalyticsData {
  totalClients: number;
  totalProjects: number;
  totalBudget: number;
  avgBudget: number;
  clientRevenue: { name: string; company: string; revenue: number }[];
  employeeWorkload: { name: string; taskCount: number }[];
  statusCounts: {
    Active: number;
    Pending: number;
    Completed: number;
  };
  totalEmployees: number;
  activeProjectsCount: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: React.ReactElement;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon, color, trend }) => (
  <div className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-[0.03] -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700`} />
    
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 group-hover:rotate-12 transition-transform`}>
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: `w-7 h-7 ${color.replace('bg-', 'text-')}` })}
      </div>
      {trend && (
        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
          <ArrowUpRight className="w-3 h-3" />
          {trend}
        </div>
      )}
    </div>
    
    <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
    <h3 className="text-3xl font-black text-gray-900 leading-none mb-1">{value}</h3>
    <p className="text-gray-500 text-xs font-semibold">{subtext}</p>
  </div>
);

const Reports: React.FC = () => {
  const { clients, projects, employees, tasks } = useData();
  
  // --- Data Analytics ---
  const analytics: AnalyticsData = useMemo(() => {
    const totalClients = clients.length;
    const totalProjects = projects.length;
    const activeProjects = projects.filter((p: Project) => p.status === "Active");
    const totalBudget = projects.reduce((sum: number, p: Project) => sum + (Number(p.budget) || 0), 0);
    const avgBudget = totalProjects > 0 ? (totalBudget / totalProjects) : 0;

    // 1. Revenue by Client (Top 5)
    const clientRevenue = clients.map((client: Client) => {
      const clientProjects = projects.filter((p: Project) => p.clientId === client.id);
      const revenue = clientProjects.reduce((sum: number, p: Project) => sum + (Number(p.budget) || 0), 0);
      return { name: client.name, company: client.company, revenue };
    }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    // 2. Employee Workload (Active Tasks)
    const employeeWorkload = employees.map((emp: Employee) => {
      const activeTasks = tasks.filter((t: Task) => t.employeeId === emp.id && t.status !== "Done").length;
      return { name: emp.name, taskCount: activeTasks };
    }).sort((a, b) => b.taskCount - a.taskCount);

    // 3. Project Distribution
    const statusCounts = {
      Active: activeProjects.length,
      Pending: projects.filter((p: Project) => p.status === "Pending").length,
      Completed: projects.filter((p: Project) => p.status === "Completed").length
    };

    return {
      totalClients,
      totalProjects,
      totalBudget,
      avgBudget,
      clientRevenue,
      employeeWorkload,
      statusCounts,
      totalEmployees: employees.length,
      activeProjectsCount: activeProjects.length
    };
  }, [clients, projects, employees, tasks]);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700 font-inter">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-200">
              <PieChart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">Insights Engine v2.0</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Intelligence Dashboard</h2>
          <p className="text-slate-500 font-medium">Monitoring <span className="text-blue-600 font-bold">{analytics.totalProjects} active portfolios</span> across your ecosystem.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95 text-sm">
            <Clock className="w-4 h-4" />
            Last 30 Days
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 text-sm">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Total Ecosystem Revenue" 
          value={`$${analytics.totalBudget.toLocaleString()}`} 
          subtext={`Avg $${Number(analytics.avgBudget).toLocaleString()} per project`}
          icon={<DollarSign />} 
          color="bg-blue-600" 
          trend="+14.2%" 
        />
        <StatCard 
          title="Active Initiatives" 
          value={analytics.activeProjectsCount} 
          subtext={analytics.totalProjects > 0 ? `${((analytics.activeProjectsCount/analytics.totalProjects)*100).toFixed(0)}% of total pipeline` : "0% of pipeline"}
          icon={<FolderKanban />} 
          color="bg-emerald-600" 
          trend="+8%" 
        />
        <StatCard 
          title="Client Partnerships" 
          value={analytics.totalClients} 
          subtext={analytics.totalClients > 0 ? `Avg ${ (analytics.totalProjects / analytics.totalClients).toFixed(1) } projects / client` : "0 projects / client"}
          icon={<Users />} 
          color="bg-orange-600" 
        />
        <StatCard 
          title="Team Strength" 
          value={analytics.totalEmployees} 
          subtext={`${analytics.totalEmployees} active professionals`}
          icon={<UserCog />} 
          color="bg-indigo-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Client Revenue Breakdown */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Revenue Distribution Chart */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Portfolio Distribution</h3>
                  <p className="text-sm text-slate-500 font-medium">Revenue contribution by top 5 clients</p>
                </div>
              </div>
              <button className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline">Full Analysis</button>
            </div>

            <div className="space-y-8">
              {analytics.clientRevenue.length === 0 ? (
                <div className="text-center py-10 text-slate-400 font-medium italic">No revenue data available yet.</div>
              ) : (
                analytics.clientRevenue.map((client, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{client.company}</span>
                        <p className="text-sm font-bold text-slate-800">{client.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">${client.revenue.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase">
                          {analytics.totalBudget > 0 ? `+${((client.revenue/analytics.totalBudget)*100).toFixed(1)}%` : "0%"}
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-50 h-3.5 rounded-full overflow-hidden border border-slate-100/50">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out shadow-sm" 
                        style={{ width: `${(client.revenue / (analytics.clientRevenue[0]?.revenue || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-12 p-8 bg-slate-50 rounded-3xl grid grid-cols-3 gap-6 text-center border border-slate-100">
              <div>
                <p className="text-xl font-black text-slate-900">${(analytics.totalBudget/1000).toFixed(1)}k</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Gross Value</p>
              </div>
              <div className="border-x border-slate-200">
                <p className="text-xl font-black text-slate-900">{analytics.statusCounts.Completed}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Converted</p>
              </div>
              <div>
                <p className="text-xl font-black text-indigo-600">89%</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Efficiency</p>
              </div>
            </div>
          </div>

          {/* Productivity Section */}
          <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 opacity-[0.05] rounded-full -mr-32 -mt-32 blur-3xl group-hover:opacity-20 transition-opacity" />
            
            <div className="flex items-center gap-4 mb-10 relative z-10">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-black">Team Productivity Spectrum</h3>
                <p className="text-slate-400 text-sm font-semibold">Active tasks distribution per lead professional</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {analytics.employeeWorkload.length === 0 ? (
                <div className="col-span-full text-center py-10 text-slate-500 font-medium italic">No employee workflow data.</div>
              ) : (
                analytics.employeeWorkload.map((emp, i) => (
                  <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all cursor-default">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-black text-slate-300">
                        {emp.name.charAt(0)}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${emp.taskCount > 2 ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {emp.taskCount > 2 ? 'Focused' : 'Available'}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm mb-1">{emp.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-blue-400">{emp.taskCount}</span>
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tasks</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Status & Strategy */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* Status Breakdown Gauge */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
            <h3 className="text-xl font-black text-slate-900 mb-8">Initiative Health</h3>
            
            <div className="relative w-48 h-48 mx-auto mb-10">
              <div className="absolute inset-0 rounded-full border-[12px] border-slate-50" />
              <div 
                className="absolute inset-0 rounded-full border-[12px] border-blue-600 border-t-transparent border-r-transparent transition-all duration-1000 shadow-[0_0_20px_rgba(37,99,235,0.2)]" 
                style={{ transform: `rotate(${ analytics.totalProjects > 0 ? (analytics.statusCounts.Active / analytics.totalProjects) * 360 : 0 }deg)` }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900">
                  {analytics.totalProjects > 0 ? ((analytics.statusCounts.Active / analytics.totalProjects) * 100).toFixed(0) : 0}%
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Operational</span>
              </div>
            </div>

            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest leading-none">Active</span>
                </div>
                <span className="text-sm font-black text-slate-900">{analytics.statusCounts.Active}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest leading-none">Pending</span>
                </div>
                <span className="text-sm font-black text-slate-900">{analytics.statusCounts.Pending}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl opacity-80">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest leading-none">Success</span>
                </div>
                <span className="text-sm font-black text-slate-900">{analytics.statusCounts.Completed}</span>
              </div>
            </div>
          </div>

          {/* Strategy Summary */}
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/20 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-black">Efficiency Meta</h3>
            </div>
            <p className="text-indigo-100 text-sm leading-relaxed font-medium mb-8">
              Based on the core data set, your operations are currently <span className="text-white font-black underline decoration-indigo-400 decoration-4 underline-offset-4">Accelerated</span>. 
              {analytics.totalBudget > 0 && analytics.clientRevenue.length > 0 && (
                <>
                  The revenue distribution shows a healthy <span className="text-white font-black">{((analytics.clientRevenue[0]?.revenue / analytics.totalBudget) * 100).toFixed(0)}% focus</span> on your lead partner, 
                </>
              )}
              while maintaining an average of <span className="text-white font-black">{ analytics.totalEmployees > 0 ? (analytics.totalProjects / analytics.totalEmployees).toFixed(1) : 0 } projects per professional.</span>
            </p>
            <div className="p-6 bg-white/10 rounded-3xl border border-white/10 text-center">
              <p className="text-xs font-bold text-indigo-200 uppercase tracking-[0.2em] mb-2">Growth Forecast</p>
              <p className="text-3xl font-black text-white">+24.5%</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;
