import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Edit, Trash2, UserPlus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useData } from "../context/DataContext";
import { Employee } from "../services/storage";

// ── Pagination config ──────────────────────────────────────────────────────────
const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

// ── Pagination helper ──────────────────────────────────────────────────────────
function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

const Employees: React.FC = () => {
  const { employees, deleteEmployee, tasks } = useData();
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);

  // ── Filter ────────────────────────────────────────────────────────────────────
  const filteredEmployees = useMemo(() => {
    // Reset to page 1 whenever search changes is handled via the input handler
    return employees.filter((e: Employee) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase())
    );
  }, [employees, search]);

  // ── Pagination derived values ─────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const pageSlice = filteredEmployees.slice(start, start + limit);
  const pageNumbers = getPageNumbers(safePage, totalPages);

  const goTo = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // reset to page 1 on new search
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-inter">

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Team Members</h2>
          <p className="text-gray-500 mt-2 font-medium">Manage and monitor your project teams and resources.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search team..."
              value={search}
              onChange={handleSearch}
              className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-gray-50 hover:bg-white shadow-sm"
            />
          </div>
          <Link
            to="/add-employee"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
          >
            <UserPlus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Member</span>
          </Link>
        </div>
      </div>

      {/* Empty state – no employees at all */}
      {employees.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2rem] p-20 text-center shadow-inner bg-gray-50/30">
          <div className="bg-white shadow-sm w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserPlus className="text-blue-500 w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Build your dream team</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-8 font-medium">
            Start by adding project managers, developers, and designers to your workspace.
          </p>
          <Link
            to="/add-employee"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-md"
          >
            Add first member
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Employee Info</th>
                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Active Load</th>
                    <th className="px-8 py-5 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {pageSlice.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center bg-gray-50/10">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <Search className="w-12 h-12 mb-4 opacity-10" />
                          <p className="text-lg font-medium">No team members match "{search}"</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    pageSlice.map((employee: Employee) => {
                      const activeTasks = tasks.filter(
                        (t) => t.employeeId === employee.id && t.status !== "Done"
                      ).length;
                      return (
                        <tr key={employee.id} className="hover:bg-blue-50/30 transition-all group">
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center font-black text-gray-900 text-lg border border-gray-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all">
                                {employee.name.charAt(0)}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{employee.name}</span>
                                <span className="text-sm text-gray-500 font-medium">{employee.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <span className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">{employee.role}</span>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${employee.status === "Active"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : employee.status === "On Leave"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-2 ${employee.status === "Active"
                                    ? "bg-emerald-500"
                                    : employee.status === "On Leave"
                                      ? "bg-amber-500"
                                      : "bg-gray-500"
                                  }`}
                              />
                              {employee.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-16 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${activeTasks > 0 ? "bg-blue-500" : "bg-gray-300"}`}
                                  style={{ width: `${Math.min(activeTasks * 20, 100)}%` }}
                                />
                              </div>
                              <span className={`text-sm font-black ${activeTasks > 0 ? "text-blue-700" : "text-gray-400"}`}>
                                {activeTasks} Tasks
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap text-center text-sm font-medium">
                            <div className="flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => navigate(`/edit-employee/${employee.id}`)}
                                className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-blue-100 transition-all"
                                title="Edit Member"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm("Are you sure you want to delete this employee?")) {
                                    deleteEmployee(employee.id);
                                  }
                                }}
                                className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-red-100 transition-all"
                                title="Delete Member"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Pagination Bar ─────────────────────────────────────────────── */}
            {filteredEmployees.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-4 border-t border-gray-100 bg-gray-50/40">

                {/* Left: result count + per-page selector */}
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>
                    Showing{" "}
                    <span className="font-bold text-gray-800">{start + 1}</span>
                    {" – "}
                    <span className="font-bold text-gray-800">
                      {Math.min(start + limit, filteredEmployees.length)}
                    </span>
                    {" of "}
                    <span className="font-bold text-gray-800">{filteredEmployees.length}</span>
                    {" members"}
                  </span>
                  <select
                    value={limit}
                    onChange={handleLimitChange}
                    className="ml-2 border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-bold text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  >
                    {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                      <option key={n} value={n}>{n} / page</option>
                    ))}
                  </select>
                </div>

                {/* Right: page buttons */}
                <div className="flex items-center gap-1">
                  {/* First */}
                  <button
                    onClick={() => goTo(1)}
                    disabled={safePage === 1}
                    className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-white hover:border-blue-100 border border-transparent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  {/* Prev */}
                  <button
                    onClick={() => goTo(safePage - 1)}
                    disabled={safePage === 1}
                    className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-white hover:border-blue-100 border border-transparent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page numbers */}
                  {pageNumbers.map((p, i) =>
                    p === "…" ? (
                      <span key={`ellipsis-${i}`} className="px-2 text-gray-300 text-sm select-none">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => goTo(p as number)}
                        className={`min-w-[36px] h-9 px-2 rounded-xl text-sm font-bold border transition-all ${p === safePage
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200"
                            : "text-gray-500 border-transparent hover:bg-white hover:border-blue-100 hover:text-blue-600"
                          }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  {/* Next */}
                  <button
                    onClick={() => goTo(safePage + 1)}
                    disabled={safePage === totalPages}
                    className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-white hover:border-blue-100 border border-transparent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  {/* Last */}
                  <button
                    onClick={() => goTo(totalPages)}
                    disabled={safePage === totalPages}
                    className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-white hover:border-blue-100 border border-transparent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Employees;