import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Briefcase, Calendar, DollarSign, User, CheckCircle2, Plus, Trash2, ListChecks } from "lucide-react";
import { useData } from "../context/DataContext";
import { Project, Client, Employee, Task } from "../services/storage";

interface ProjectFormState {
  id: string;
  name: string;
  clientId: string;
  budget: string;
  status: Project['status'];
  timeline: string;
}

interface FormErrors {
  name?: string;
  clientId?: string;
  budget?: string;
  timeline?: string;
}

const EditProject: React.FC = () => {
  const { projects, clients, editProject, tasks, addTask, updateTaskStatus, deleteTask, employees } = useData();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const project = projects.find(p => String(p.id) === String(id));

  const [form, setForm] = useState<ProjectFormState>({
    id: "",
    name: "",
    clientId: "",
    budget: "",
    status: "Active",
    timeline: ""
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Task State
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const projectTasks = tasks.filter(t => t.projectId === id);

  useEffect(() => {
    if (project) {
      setForm({
        id: project.id,
        name: project.name,
        clientId: String(project.clientId),
        budget: String(project.budget),
        status: project.status,
        timeline: project.timeline
      });
    }
  }, [project]);

  if (!project) return (
    <div className="p-20 text-center font-inter bg-white rounded-[2rem] border border-gray-100 shadow-sm mx-auto max-w-2xl mt-20">
      <Briefcase className="w-16 h-16 text-gray-200 mx-auto mb-6" />
      <h2 className="text-2xl font-black text-gray-900 mb-2">Project not found</h2>
      <p className="text-gray-500 font-medium mb-8">The project you are looking for does not exist or has been removed.</p>
      <button onClick={() => navigate('/projects')} className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-black transition-all">Back to Projects</button>
    </div>
  );

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Project name is required";
    if (!form.clientId) newErrors.clientId = "Please select a client";
    if (!form.budget || isNaN(Number(form.budget))) newErrors.budget = "Valid budget is required";
    if (!form.timeline.trim()) newErrors.timeline = "Timeline is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      editProject({
        id: id || "",
        name: form.name,
        clientId: form.clientId,
        budget: Number(form.budget),
        status: form.status,
        timeline: form.timeline
      });
      navigate("/projects");
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 font-inter">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Project Configuration</h2>
        <p className="text-gray-500 mt-2 font-medium">Calibrate details and orchestrate tasks for <span className="text-blue-600 uppercase tracking-tighter">{project.name}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-10 space-y-8 transition-all">
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4" />
            Project Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter high-level title"
            className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all font-bold ${errors.name ? 'border-rose-500 bg-rose-50/50' : 'border-gray-100 bg-gray-50/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}`}
          />
          {errors.name && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <User className="w-4 h-4" />
              Client Entity
            </label>
            <select
              name="clientId"
              value={form.clientId}
              onChange={handleChange}
              className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all font-bold cursor-pointer ${errors.clientId ? 'border-rose-500 bg-rose-50/50' : 'border-gray-100 bg-gray-50/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}`}
            >
              <option value="">Select Portfolio Client</option>
              {clients.map((client: Client) => (
                <option key={client.id} value={client.id}>{client.name} — {client.company}</option>
              ))}
            </select>
            {errors.clientId && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-1">{errors.clientId}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4" />
              Allocated Budget
            </label>
            <input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="0.00"
              className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all font-mono font-bold ${errors.budget ? 'border-rose-500 bg-rose-50/50' : 'border-gray-100 bg-gray-50/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}`}
            />
            {errors.budget && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-1">{errors.budget}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              Lifecycle Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold cursor-pointer"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" />
              Project Timeline
            </label>
            <input
              type="text"
              name="timeline"
              value={form.timeline}
              onChange={handleChange}
              placeholder="e.g. Q4 2024"
              className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all font-bold ${errors.timeline ? 'border-rose-500 bg-rose-50/50' : 'border-gray-100 bg-gray-50/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}`}
            />
            {errors.timeline && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-1">{errors.timeline}</p>}
          </div>
        </div>

        <div className="pt-6 flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50 uppercase tracking-widest"
          >
            {isSubmitting ? "Orchestrating..." : "Synchronize Project"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="px-8 py-4 rounded-2xl border border-gray-100 text-gray-400 font-black hover:bg-gray-50 transition-all uppercase tracking-widest text-xs"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Task Management Section */}
      <div className="mt-16 bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-10">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-100">
            <ListChecks className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Action Items</h3>
            <p className="text-sm text-gray-500 font-medium italic">Atomic tasks breakdown for this initiative.</p>
          </div>
        </div>

        {/* Add Task Input Layer */}
        <div className="flex flex-col md:flex-row gap-5 mb-12 p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
          <div className="flex-1">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Task Specification</label>
            <input
              type="text"
              placeholder="e.g. Stakeholder Alignment..."
              value={newTaskTitle}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTaskTitle(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-900 shadow-sm"
            />
          </div>
          
          <div className="md:w-72">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Assigned Resource</label>
            <select
              value={selectedEmployeeId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedEmployeeId(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-gray-900 appearance-none cursor-pointer shadow-sm"
            >
              <option value="">Operational Nodes</option>
              {employees.map((emp: Employee) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                if (newTaskTitle.trim() && selectedEmployeeId) {
                  addTask({ 
                    projectId: id || "", 
                    title: newTaskTitle, 
                    status: "To Do",
                    employeeId: selectedEmployeeId
                  });
                  setNewTaskTitle("");
                  setSelectedEmployeeId("");
                }
              }}
              className="h-[60px] bg-gray-900 text-white px-10 rounded-2xl hover:bg-blue-600 transition-all font-black flex items-center gap-2 active:scale-95 disabled:opacity-20 uppercase tracking-widest text-xs"
              disabled={!newTaskTitle.trim() || !selectedEmployeeId}
            >
              <Plus className="w-5 h-5" />
              Deploy
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {projectTasks.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/20">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-50 shadow-sm">
                 <ListChecks className="text-gray-200 w-6 h-6" />
              </div>
              <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">No active signals. Initiate task sequence.</p>
            </div>
          ) : (
            projectTasks.map((task: Task) => (
              <div key={task.id} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-[2rem] hover:ring-4 hover:ring-blue-500/5 transition-all group shadow-sm hover:shadow-md">
                <div className="flex items-center gap-5 flex-1">
                  <div 
                    className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                      task.status === 'Done' ? 'bg-emerald-500 ring-2 ring-emerald-100' : 
                      task.status === 'In Progress' ? 'bg-blue-500 ring-2 ring-blue-100' : 'bg-gray-200'
                    }`} 
                  />
                  <div className="flex flex-col">
                    <span className={`font-black text-sm tracking-tight ${task.status === 'Done' ? 'line-through text-gray-300' : 'text-gray-900'}`}>
                      {task.title}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1">
                      {employees.find(e => e.id === task.employeeId)?.name || 'Fragmented Resource'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <select
                    value={task.status}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                    className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border-none outline-none cursor-pointer transition-all ${
                      task.status === 'Done' ? 'bg-emerald-50 text-emerald-600' : 
                      task.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    <option value="To Do">Queue</option>
                    <option value="In Progress">Active</option>
                    <option value="Done">Finalized</option>
                  </select>
                  
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2.5 text-gray-200 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    title="Terminate Task"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProject;
