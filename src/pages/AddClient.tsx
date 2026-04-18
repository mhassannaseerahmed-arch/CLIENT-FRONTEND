import { useState, ChangeEvent, FormEvent } from "react";
import { useData } from "../context/DataContext";

type ClientForm = {
  name: string;
  company: string;
  email: string;
  status: "Active" | "Pending";
};

type FormErrors = {
  name?: string;
  company?: string;
  email?: string;
};

const AddClient = () => {
  const { addClient } = useData();

  const [form, setForm] = useState<ClientForm>({
    name: "",
    company: "",
    email: "",
    status: "Active",
  });

  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    let newErrors: FormErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.company.trim()) newErrors.company = "Company is required.";

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    addClient(form);

    setForm({
      name: "",
      company: "",
      email: "",
      status: "Active",
    });

    setMessage("Client saved successfully");

    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Add Client</h1>

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md max-w-lg"
      >
        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter name"
            className={`w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-500" : "border-gray-300"
              }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Company */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Company</label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Enter company"
            className={`w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${errors.company ? "border-red-500" : "border-gray-300"
              }`}
          />
          {errors.company && (
            <p className="text-red-500 text-sm mt-1">{errors.company}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
            className={`w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"
              }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option>Active</option>
            <option>Pending</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save Client
        </button>
      </form>
    </div>
  );
};

export default AddClient;