import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, UserPlus } from "lucide-react";
import { useData } from "../context/DataContext";
import { Employee } from "../services/storage";

interface FormErrors {
  name?: string;
  email?: string;
}

const AddEmployee: React.FC = () => {
  const { addEmployee } = useData();
  const navigate = useNavigate();
  
  const [form, setForm] = useState<Omit<Employee, 'id'>>({
    name: "",
    email: "",
    role: "Developer",
    status: "Active"
  });
  
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // addEmployee takes the form data, the service handles ID generation
    addEmployee(form as any); // Type cast since storage service expects full Employee but generates ID
    
    setMessage("Success: New team member onboarded!");
    
    setTimeout(() => {
      setMessage("");
      navigate("/employees");
    }, 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto font-inter">
      <div className="mb-8">
        <Link
          to="/employees"
          className="group flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-all mb-6 w-fit font-bold uppercase tracking-widest text-xs"
        >
          <div className="p-2 bg-gray-50 group-hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Directory
        </Link>
        <div className="flex items-center gap-4">
           <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-100">
             <UserPlus className="w-6 h-6 text-white" />
           </div>
           <div>
             <h2 className="text-4xl font-black text-gray-900 tracking-tight">Onboard Member</h2>
             <p className="text-gray-500 mt-1 font-medium italic">Initialize a new professional node in your ecosystem.</p>
           </div>
        </div>
      </div>

      {message && (
        <div className="mb-8 p-5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-[1.5rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 shadow-sm font-bold">
          <div className="bg-emerald-100 p-2 rounded-full">
            <Save className="w-4 h-4" />
          </div>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-200/50 overflow-hidden transition-all">
        <div className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Name */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Human Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Alice Johnson"
                className={`w-full px-5 py-3.5 border rounded-2xl outline-none transition-all focus:ring-4 focus:ring-blue-500/10 font-bold ${
                  errors.name ? 'border-rose-300 bg-rose-50' : 'border-gray-200 focus:border-blue-500 bg-gray-50/50'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-500 font-black">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Work Email Identity</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. alice@example.com"
                className={`w-full px-5 py-3.5 border rounded-2xl outline-none transition-all focus:ring-4 focus:ring-blue-500/10 font-bold ${
                  errors.email ? 'border-rose-300 bg-rose-50' : 'border-gray-200 focus:border-blue-500 bg-gray-50/50'
                }`}
              />
              {errors.email && <p className="text-xs text-rose-500 font-black">{errors.email}</p>}
            </div>

            {/* Role */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Professional Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl outline-none transition-all focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-gray-50/50 font-bold cursor-pointer"
              >
                <option value="Developer">Developer</option>
                <option value="Designer">Designer</option>
                <option value="Manager">Manager</option>
                <option value="QA">QA</option>
                <option value="Product">Product</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Operational Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl outline-none transition-all focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-gray-50/50 font-bold cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="px-10 py-8 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-5">
          <Link
            to="/employees"
            className="px-8 py-3 text-sm font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
          >
            Abort
          </Link>
          <button
            type="submit"
            className="px-8 py-3.5 text-sm font-black text-white bg-blue-600 hover:bg-black rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center gap-2 uppercase tracking-widest"
          >
            <Save className="w-5 h-5" />
            Commit Records
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
