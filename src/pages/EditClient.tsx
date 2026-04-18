import { useParams } from "react-router-dom";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useData } from "../context/DataContext";
import { Client } from "../services/storage";

const EditClient: React.FC = () => {
  const { clients, editClient } = useData();
  const { id } = useParams<{ id: string }>();

  const client = clients?.find(c => String(c.id) === String(id));

  const [form, setForm] = useState<Client>(() => {
    return client || {
      id: "",
      name: "",
      company: "",
      email: "",
      status: "Active"
    };
  });
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (client) {
      setForm(client);
    }
  }, [client]);

  if (!client && (clients?.length ?? 0) > 0) {
    return (
      <div className="p-8 max-w-lg mx-auto bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center justify-center font-bold">
        Error: Client not found.
      </div>
    );
  } else if (!client) {
    return (
      <div className="p-8 max-w-lg mx-auto flex items-center justify-center text-gray-500 font-medium">
        <div className="animate-pulse">Loading client profile...</div>
      </div>
    );
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    editClient(form);
    setMessage("Success: Client updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto font-inter">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Edit Client</h1>
        <p className="text-gray-500 mt-2 font-medium">Update profile details for <span className="text-blue-600 uppercase tracking-tighter">{client.name}</span></p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl shadow-sm border border-emerald-100 font-bold animate-in fade-in slide-in-from-top-2">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 transition-all">
        {/* Name */}
        <div className="mb-6">
          <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-3">Full Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter client name"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
          />
        </div>

        {/* Company */}
        <div className="mb-6">
          <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-3">Company Entity</label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Enter company name"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
          />
        </div>

        {/* Email */}
        <div className="mb-10">
          <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-3">Contact Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl active:scale-95 transition-all uppercase tracking-widest"
        >
          Update Portfolio
        </button>
      </form>
    </div>
  );
};

export default EditClient;
