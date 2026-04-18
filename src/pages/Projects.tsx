import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Briefcase,
  Calendar,
  DollarSign,
  ListChecks
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Project, Client } from "../services/storage";

const Projects: React.FC = () => {
  const { projects, clients, deleteProject, tasks } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");

  const isAuthorized = user?.role ? ["admin", "manager"].includes(user.role) : false;

  // Get Client Name
  const getClientName = (clientId: string): string => {
    const client = clients.find((c: Client) => c.id === clientId);
    return client ? client.name : "Unknown Client";
  };

  // Advanced Search
  const filteredProjects = projects.filter((project: Project) => {
    const searchTerm = search.toLowerCase();
    return (
      project.name?.toLowerCase().includes(searchTerm) ||
      getClientName(project.clientId).toLowerCase().includes(searchTerm) ||
      project.status?.toLowerCase().includes(searchTerm) ||
      project.timeline?.toLowerCase().includes(searchTerm) ||
      project.budget?.toString().includes(searchTerm)
    );
  });

  // Stats
  const stats = [
    {
      label: "Total Projects",
      value: projects.length,
      icon: <Briefcase className="text-blue-600 w-5 h-5" />
    },
    {
      label: "Active Projects",
      value: projects.filter((p) => p.status === "Active").length,
      icon: <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
    },
    {
      label: "Total Budget",
      value: `$${projects
        .reduce((sum, p) => sum + (p.budget || 0), 0)
        .toLocaleString()}`,
      icon: <DollarSign className="text-emerald-600 w-5 h-5" />
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Project Hub
          </h2>
          <p className="text-gray-500 mt-2 font-medium">
            Oversee and manage your enterprise projects
          </p>
        </div>

        {isAuthorized && (
          <Link
            to="/add-project"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-700 hover:shadow-xl active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
            New Project
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow"
          >
            <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/30">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects, client, status..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="pl-12 pr-4 py-3.5 w-full border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-white"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Project Details</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Budget</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Timeline</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Tasks</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Briefcase className="w-12 h-12 mb-4 opacity-10" />
                      <p className="text-lg font-medium">No projects matching your search</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project: Project) => (
                  <tr key={project.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm">
                           {project.name.charAt(0)}
                         </div>
                         <div>
                           <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{project.name}</p>
                           <p className="text-sm text-gray-500 font-medium">{getClientName(project.clientId)}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-mono font-bold text-gray-700">${project.budget?.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-600 font-medium text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {project.timeline}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <ListChecks className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-bold text-gray-700">
                          {tasks.filter(t => t.projectId === project.id).length}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        project.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      {isAuthorized ? (
                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => navigate(`/edit-project/${project.id}`)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-blue-100 transition-all"
                            title="Edit Project"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => { if(window.confirm('Delete this project?')) deleteProject(project.id); }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-red-100 transition-all"
                            title="Delete Project"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300 font-bold uppercase tracking-widest">Locked</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Projects;
