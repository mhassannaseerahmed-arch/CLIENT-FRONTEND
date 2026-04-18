import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Edit, Trash2, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Client } from "../services/storage";

const Clients: React.FC = () => {
  const { clients, deleteClient } = useData();

  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");

  const isAuthorized = ["admin", "manager"].includes(user?.role || "");

  // Now TypeScript knows that 'client' is of type 'Client'
  const filteredClients = clients.filter((client: Client) =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.email.toLowerCase().includes(search.toLowerCase()) ||
    client.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Clients List</h2>
          <p className="text-gray-500 mt-1">Manage and monitor your client relationships.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 hover:bg-white"
            />
          </div>
          {isAuthorized && (
            <Link
              to="/add-client"
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Client</span>
            </Link>
          )}
        </div>
      </div>

      {/* Table Section */}
      {clients.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-gray-400 w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No clients yet</h3>
          <p className="text-gray-500 mt-1 mb-6">Get started by adding your first client to the system.</p>
          <Link
            to="/add-client"
            className="text-blue-600 font-semibold hover:text-blue-700"
          >
            Add your first client →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Client Info</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500 italic">
                      No results matching "{search}"
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client: Client) => (
                    <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{client.name}</span>
                          <span className="text-sm text-gray-500">{client.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {client.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${client.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${client.status === "Active" ? "bg-green-500" : "bg-yellow-500"}`} />
                          {client.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        {isAuthorized ? (
                          <div className="flex justify-center items-center gap-2">
                            <button
                              onClick={() => navigate(`/edit-client/${client.id}`)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Edit Client"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this client?")) {
                                  deleteClient(client.id);
                                }
                              }}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete Client"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">View Only</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
