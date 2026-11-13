import { useMemo, useState } from "react";
import { Pencil, Search, X, Trash2, Users } from "lucide-react";
import { useAllPatients, useUpdatePatient, useDeletePatient } from "../hooks/useAdmin";

const emptyForm = {
  age: "",
  gender: "",
  bloodGroup: "",
  phone: "",
  address: "",
};

const ManagePatients = () => {
  const { data: patients = [], isLoading, isError } = useAllPatients();
  const updateMutation = useUpdatePatient();
  const deleteMutation = useDeletePatient();

  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredPatients = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return patients;

    return patients.filter((patient) => {
      const name = patient.userId?.name || "";
      const email = patient.userId?.email || "";
      const patientId = patient.patientId || "";
      const phone = patient.phone || "";
      const bloodGroup = patient.bloodGroup || "";
      return [name, email, patientId, phone, bloodGroup].some((value) =>
        value.toLowerCase().includes(needle),
      );
    });
  }, [patients, query]);

  const openEdit = (patient) => {
    setEditingPatient(patient);
    setForm({
      age: patient.age ?? "",
      gender: patient.gender || "",
      bloodGroup: patient.bloodGroup || "",
      phone: patient.phone || "",
      address: patient.address || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editingPatient) return;

    updateMutation.mutate(
      {
        id: editingPatient._id,
        payload: {
          age: form.age === "" ? undefined : Number(form.age),
          gender: form.gender,
          bloodGroup: form.bloodGroup,
          phone: form.phone,
          address: form.address,
        },
      },
      {
        onSuccess: () => setIsModalOpen(false),
      },
    );
  };

  const handleDelete = (patient) => {
    const name = patient.userId?.name || "this patient";
    if (
      window.confirm(
        `Are you sure you want to delete ${name}? This will remove all their appointments and records permanently!`,
      )
    ) {
      deleteMutation.mutate(patient._id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <div className="w-10 h-10 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Loading patient directory...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-rose-400 bg-rose-500/5 border border-rose-500/20 rounded-2xl p-8">
        Failed to load patients.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Users className="text-teal-400" size={28} />
            Manage Patients
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Search patient directory, review demographics, and maintain clinical accounts
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 w-fit">
          {filteredPatients.length} Registered Patients
        </div>
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
            placeholder="Search by name, email, patient ID, phone, or blood group..."
            className="w-full bg-[#090f1d] border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-[#0e172c]/90 rounded-2xl shadow-xl border border-slate-800/80 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[#090f1d] border-b border-slate-800/80 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4 font-semibold">Patient Profile</th>
                <th className="px-6 py-4 font-semibold">Hospital ID</th>
                <th className="px-6 py-4 font-semibold">Contact Phone</th>
                <th className="px-6 py-4 font-semibold">Blood Group</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-16 text-center text-slate-400 text-sm"
                  >
                    No matching patients found.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient._id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300 font-bold text-sm shrink-0">
                          {patient.userId?.name?.[0]?.toUpperCase() || "P"}
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {patient.userId?.name || "Patient"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {patient.userId?.email || ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-teal-400 font-mono text-xs font-semibold">
                      {patient.patientId || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-xs">
                      {patient.phone || "Not provided"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border border-teal-500/20 text-teal-300 bg-teal-500/10">
                        {patient.bloodGroup || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEdit(patient)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:text-white hover:border-slate-600 transition-all"
                        >
                          <Pencil size={13} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(patient)}
                          disabled={deleteMutation.isPending}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 disabled:opacity-50 transition-all"
                          title="Delete Permanently"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4 py-6">
          <div className="w-full max-w-2xl bg-[#0d162b] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#090f1d]">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Edit Patient Details
                </h2>
                <p className="text-xs text-slate-400">
                  Update demographic and clinical emergency attributes
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
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Patient Name</span>
                  <input
                    value={editingPatient?.userId?.name || ""}
                    readOnly
                    className="w-full rounded-xl bg-[#090f1d] border border-slate-700/80 px-4 py-2.5 text-sm text-slate-400 outline-none cursor-not-allowed"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Hospital ID</span>
                  <input
                    value={editingPatient?.patientId || ""}
                    readOnly
                    className="w-full rounded-xl bg-[#090f1d] border border-slate-700/80 px-4 py-2.5 text-sm text-slate-400 outline-none font-mono cursor-not-allowed"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Age</span>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    placeholder="e.g. 32"
                    className="w-full rounded-xl bg-[#090f1d] border border-slate-700/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Gender</span>
                  <select
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#090f1d] border border-slate-700/80 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Blood Group</span>
                  <select
                    value={form.bloodGroup}
                    onChange={(e) =>
                      setForm({ ...form, bloodGroup: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#090f1d] border border-slate-700/80 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Phone</span>
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="+251 ..."
                    className="w-full rounded-xl bg-[#090f1d] border border-slate-700/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </label>

                <label className="space-y-1.5 md:col-span-2">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Residential Address</span>
                  <textarea
                    rows={3}
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    placeholder="Street, City, Postal Code"
                    className="w-full rounded-xl bg-[#090f1d] border border-slate-700/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all resize-none"
                  />
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800/80">
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-500 shadow-lg shadow-teal-600/25 disabled:opacity-50 transition-all"
                >
                  Save Changes
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

export default ManagePatients;
