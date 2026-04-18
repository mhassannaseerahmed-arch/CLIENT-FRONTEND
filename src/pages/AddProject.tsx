import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Calendar, DollarSign, User, CheckCircle2 } from "lucide-react";
import { useData } from "../context/DataContext";
import { Client, Project } from "../services/storage";

interface ProjectFormState {
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

const AddProject: React.FC = () => {
  const { clients, addProject } = useData();
  const navigate = useNavigate();
  
  const [form, setForm] = useState<ProjectFormState>({
    name: "",
    clientId: "",
    budget: "",
    status: "Active",
    timeline: ""
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
    // Simulate API delay
    setTimeout(() => {
      addProject({
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
    <div className="max-w-2xl mx-auto p-8 font-inter">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Add a Project</h2>
        <p className="text-gray-500 mt-2 font-medium italic">Instantiate a new project architecture and assign stakeholder alignment.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-10 space-y-8 transition-all">
        {/* Project Name */}
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
            placeholder="e.g. Genesis Protocol"
            className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all font-bold ${errors.name ? 'border-rose-500 bg-rose-50/50' : 'border-gray-100 bg-gray-50/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}`}
          />
          {errors.name && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Client Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <User className="w-4 h-4" />
              Client Name
            </label>
            <div className="relative">
              <select
                name="clientId"
                value={form.clientId}
                onChange={handleChange}
                className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all font-bold cursor-pointer appearance-none ${errors.clientId ? 'border-rose-500 bg-rose-50/50' : 'border-gray-100 bg-gray-50/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}`}
              >
                <option value="">Select Client Entity</option>
                {clients.map((client: Client) => (
                  <option key={client.id} value={client.id}>{client.name} — {client.company}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            {errors.clientId && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-1">{errors.clientId}</p>}
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4" />
              Resource Allocation
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
          {/* Status */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              Current Vector
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

          {/* Timeline */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" />
              Delivery Window
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

        <div className="pt-6 flex gap-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-20 uppercase tracking-widest"
          >
            {isSubmitting ? "Orchestrating..." : "Deploy Initiative"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="px-8 py-4 rounded-2xl border border-gray-100 text-gray-400 font-black hover:bg-gray-50 transition-all uppercase tracking-widest text-[10px]"
          >
            Abort
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProject;
