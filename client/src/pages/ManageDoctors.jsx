import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Ban, X, CheckCircle2, RefreshCw, Trash2, Stethoscope } from "lucide-react";
import {
  useAllDoctors,
  useCreateDoctor,
  useUpdateDoctor,
  useDeactivateDoctor,
  useReactivateDoctor,
  useDeleteDoctor,
} from "../hooks/useAdmin";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const emptyForm = {
  fullName: "",
  email: "",
  password: "",
  specialization: "",
  department: "",
  availableDays: [],
};

const ManageDoctors = () => {
  const { data: doctors = [], isLoading, isError } = useAllDoctors();
  const createMutation = useCreateDoctor();
  const updateMutation = useUpdateDoctor();
  const deactivateMutation = useDeactivateDoctor();
  const reactivateMutation = useReactivateDoctor();
  const deleteMutation = useDeleteDoctor();

  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredDoctors = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return doctors;

    return doctors.filter((doctor) => {
      const name = doctor.userId?.name || "";
      const email = doctor.userId?.email || "";
      const specialization = doctor.specialization || "";
      const department = doctor.department || "";
      return [name, email, specialization, department].some((value) =>
        value.toLowerCase().includes(needle),
      );
    });
  }, [doctors, query]);

  const openCreate = () => {
    setEditingDoctor(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (doctor) => {
    setEditingDoctor(doctor);
    setForm({
      fullName: doctor.userId?.name || "",
      email: doctor.userId?.email || "",
      password: "",
      specialization: doctor.specialization || "",
      department: doctor.department || "",
      availableDays: doctor.availableDays || [],
    });
    setIsModalOpen(true);
  };

  const toggleDay = (day) => {
    setForm((prev) => {
      const exists = prev.availableDays.includes(day);
      return {
        ...prev,
        availableDays: exists
          ? prev.availableDays.filter((item) => item !== day)
          : [...prev.availableDays, day],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingDoctor) {
      updateMutation.mutate(
        {
          id: editingDoctor._id,
          payload: {
            fullName: form.fullName,
            email: form.email,
            specialization: form.specialization,
            department: form.department,
            availableDays: form.availableDays,
          },
        },
        {
          onSuccess: () => setIsModalOpen(false),
        },
      );
      return;
    }

    createMutation.mutate(form, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  const handleDeactivate = (doctor) => {
    const name = doctor.userId?.name || "this doctor";
    if (window.confirm(`Deactivate ${name}? They will lose access to clinical accounts.`)) {
      deactivateMutation.mutate(doctor._id);
    }
  };

  const handleReactivate = (doctor) => {
    const name = doctor.userId?.name || "this doctor";
    if (window.confirm(`Reactivate ${name}? Their account will be enabled immediately.`)) {
      reactivateMutation.mutate(doctor._id);
    }
  };

  const handleDelete = (doctor) => {
    const name = doctor.userId?.name || "this doctor";
    if (
      window.confirm(
        `PERMANENTLY delete ${name}? This action cannot be reversed!`,
      )
    ) {
      deleteMutation.mutate(doctor._id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <div className="w-10 h-10 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Loading medical staff...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-rose-400 bg-rose-500/5 border border-rose-500/20 rounded-2xl p-8">
        Failed to load doctors.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Stethoscope className="text-teal-400" size={28} />
            Manage Doctors
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Register medical practitioners, configure specializations, and manage account statuses
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-500 transition-all shadow-lg shadow-teal-600/25 hover:shadow-teal-500/35 hover:-translate-y-0.5"
        >
          <Plus size={18} />
          Add Doctor
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#0e172c]/90 border border-slate-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
        <div className="relative max-w-xl">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, specialization, or department..."
            className="w-full bg-[#090f1d] border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
          />
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-[#0e172c]/90 rounded-2xl shadow-xl border border-slate-800/80 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[#090f1d] border-b border-slate-800/80 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4 font-semibold">Doctor Profile</th>
                <th className="px-6 py-4 font-semibold">Specialization</th>
                <th className="px-6 py-4 font-semibold">Department</th>
                <th className="px-6 py-4 font-semibold">Available Days</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center text-slate-400 text-sm"
                  >
                    No matching doctors found.
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doctor) => {
                  const isActive =
                    doctor.isActive !== false &&
                    doctor.userId?.isActive !== false;
                  return (
                    <tr
                      key={doctor._id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300 font-bold text-sm shrink-0">
                            {doctor.userId?.name?.[0]?.toUpperCase() || "D"}
                          </div>
                          <div>
                            <p className="font-semibold text-white">
                              Dr. {doctor.userId?.name || "Staff"}
                            </p>
                            <p className="text-xs text-slate-400">
                              {doctor.userId?.email || ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-teal-400 font-medium">
                        {doctor.specialization || "General"}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {doctor.department || "Clinical Care"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(doctor.availableDays || []).length === 0 ? (
                            <span className="text-xs text-slate-500">Not set</span>
                          ) : (
                            doctor.availableDays.map((day) => (
                              <span
                                key={day}
                                className="text-[10px] font-semibold bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60"
                              >
                                {day.slice(0, 3)}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                            isActive
                              ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                              : "text-rose-400 border-rose-500/20 bg-rose-500/10"
                          }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(doctor)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:text-white hover:border-slate-600 transition-all"
                          >
                            <Pencil size={13} />
                            Edit
                          </button>
                          {isActive ? (
                            <button
                              onClick={() => handleDeactivate(doctor)}
                              disabled={deactivateMutation.isPending}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 disabled:opacity-50 transition-all"
                            >
                              <Ban size={13} />
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReactivate(doctor)}
                              disabled={reactivateMutation.isPending}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 hover:bg-teal-500/20 disabled:opacity-50 transition-all"
                            >
                              <RefreshCw size={13} />
                              Reactivate
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(doctor)}
                            disabled={deleteMutation.isPending}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 disabled:opacity-50 transition-all"
                            title="Delete Permanently"
                          >
                            <Trash2 size={13} />
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
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4 py-6">
          <div className="w-full max-w-2xl bg-[#0d162b] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#090f1d]">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {editingDoctor ? "Edit Doctor Profile" : "Register Doctor"}
                </h2>
                <p className="text-xs text-slate-400">
                  {editingDoctor
                    ? "Update specialization, department, and available schedule"
                    : "Create a new clinical practitioner account"}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Full Name</span>
                  <input
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    required
                    placeholder="Dr. Full Name"
                    className="w-full rounded-xl bg-[#090f1d] border border-slate-700/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                    placeholder="doctor@hospital.com"
                    className="w-full rounded-xl bg-[#090f1d] border border-slate-700/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </label>

                {!editingDoctor && (
                  <label className="space-y-1.5 md:col-span-2">
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</span>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      required
                      placeholder="Minimum 6 characters"
                      className="w-full rounded-xl bg-[#090f1d] border border-slate-700/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    />
                  </label>
                )}

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Specialization</span>
                  <input
                    value={form.specialization}
                    onChange={(e) =>
                      setForm({ ...form, specialization: e.target.value })
                    }
                    placeholder="Cardiology, Neurology, etc."
                    className="w-full rounded-xl bg-[#090f1d] border border-slate-700/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Department</span>
                  <input
                    value={form.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                    placeholder="Inpatient, Surgery, Outpatient"
                    className="w-full rounded-xl bg-[#090f1d] border border-slate-700/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </label>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Available Consultation Days</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {DAYS.map((day) => {
                    const checked = form.availableDays.includes(day);
                    return (
                      <label
                        key={day}
                        className={`cursor-pointer rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                          checked 
                            ? "bg-teal-500/15 border-teal-500/40 text-teal-300 shadow-sm" 
                            : "bg-[#090f1d] border-slate-700 text-slate-400 hover:border-slate-600"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleDay(day)}
                          className="mr-2 accent-teal-500"
                        />
                        {day}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800/80">
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-500 shadow-lg shadow-teal-600/25 disabled:opacity-50 transition-all"
                >
                  {editingDoctor ? "Save Changes" : "Create Doctor Account"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl bg-slate-800/80 border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
