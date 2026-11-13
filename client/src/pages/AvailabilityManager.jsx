import { useState } from "react";
import {
  useMyAvailability,
  useCreateAvailability,
  useUpdateAvailability,
} from "../hooks/useAvailability";
import { Clock, Plus, CheckCircle2, AlertCircle, Pencil } from "lucide-react";

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
  dayOfWeek: 1,
  startTime: "09:00",
  endTime: "17:00",
  isAvailable: true,
};

const AvailabilityManager = () => {
  const { data: slots = [], isLoading, isError } = useMyAvailability();
  const createMutation = useCreateAvailability();
  const updateMutation = useUpdateAvailability();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const flashSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "dayOfWeek" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, ...form },
        {
          onSuccess: () => {
            flashSuccess("Consultation slot updated successfully!");
            resetForm();
          },
        }
      );
    } else {
      createMutation.mutate(form, {
        onSuccess: () => {
          flashSuccess("Consultation slot created successfully!");
          resetForm();
        },
      });
    }
  };

  const startEdit = (slot) => {
    setEditingId(slot._id);
    setForm({
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isAvailable: slot.isAvailable,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(false);
  };

  const toggleAvailability = (slot) => {
    updateMutation.mutate({
      id: slot._id,
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isAvailable: !slot.isAvailable,
    });
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error || updateMutation.error;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Clock className="text-teal-400" size={28} />
            Availability Manager
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure weekly consultation hours for patient booking
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-500 transition-all shadow-lg shadow-teal-600/25 hover:shadow-teal-500/35 hover:-translate-y-0.5"
          >
            <Plus size={18} />
            Add Time Slot
          </button>
        )}
      </div>

      {/* Success / Error alerts */}
      {successMsg && (
        <div className="p-3.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {mutationError && (
        <div className="p-3.5 text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-xl flex items-center gap-2 animate-in fade-in">
          <AlertCircle size={16} className="text-rose-400 shrink-0" />
          <span>{mutationError.response?.data?.message || "Something went wrong"}</span>
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-[#0e172c]/90 rounded-2xl shadow-xl border border-slate-800/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white tracking-tight">
              {editingId ? "Edit Consultation Window" : "New Consultation Window"}
            </h2>
            <span className="text-xs text-slate-400">Step 1 of 1</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Day of Week
              </label>
              <select
                name="dayOfWeek"
                value={form.dayOfWeek}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#090f1d] border border-slate-700/80 text-slate-100 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-sm cursor-pointer"
              >
                {DAYS.map((day, i) => (
                  <option key={i} value={i}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#090f1d] border border-slate-700/80 text-slate-100 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-sm [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#090f1d] border border-slate-700/80 text-slate-100 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-sm [color-scheme:dark]"
              />
            </div>

            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={form.isAvailable}
                  onChange={handleChange}
                  className="w-4 h-4 accent-teal-500 rounded"
                />
                <span className="text-xs font-semibold text-slate-300">Accept Bookings</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-slate-800/80">
            <button
              type="submit"
              disabled={isMutating}
              className="px-6 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-500 disabled:opacity-50 transition-all shadow-lg shadow-teal-600/25"
            >
              {isMutating
                ? "Saving..."
                : editingId
                ? "Update Slot"
                : "Save Slot"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2.5 bg-slate-800 text-slate-300 text-sm font-semibold rounded-xl hover:bg-slate-700 hover:text-white border border-slate-700 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Slots List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <div className="w-10 h-10 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium">Loading availability schedule...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-rose-400 bg-rose-500/5 border border-rose-500/20 rounded-2xl p-8">
          Failed to load availability data.
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-16 bg-[#0e172c]/90 rounded-2xl shadow-xl border border-dashed border-slate-800">
          <p className="text-slate-300 font-semibold text-sm">No availability slots configured.</p>
          <p className="text-xs text-slate-400 mt-1">
            Click "Add Time Slot" to publish your working hours to patients.
          </p>
        </div>
      ) : (
        <div className="bg-[#0e172c]/90 rounded-2xl shadow-xl border border-slate-800/80 overflow-hidden backdrop-blur-sm">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-[#090f1d] border-b border-slate-800/80 text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4 font-semibold">Weekday</th>
                  <th className="px-6 py-4 font-semibold">Consultation Start</th>
                  <th className="px-6 py-4 font-semibold">Consultation End</th>
                  <th className="px-6 py-4 font-semibold">Booking Status</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {slots.map((slot) => (
                  <tr key={slot._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{DAYS[slot.dayOfWeek]}</td>
                    <td className="px-6 py-4 text-slate-300 font-mono text-xs">{slot.startTime}</td>
                    <td className="px-6 py-4 text-slate-300 font-mono text-xs">{slot.endTime}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${
                        slot.isAvailable 
                          ? "bg-teal-500/10 text-teal-300 border-teal-500/20" 
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}>
                        {slot.isAvailable ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleAvailability(slot)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
                        >
                          {slot.isAvailable ? "Disable" : "Enable"}
                        </button>
                        <button
                          onClick={() => startEdit(slot)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 hover:bg-teal-500/20 transition-all"
                        >
                          <Pencil size={12} />
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-800/80">
            {slots.map((slot) => (
              <div key={slot._id} className="p-4 space-y-3 hover:bg-slate-800/40 transition-colors">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-white text-sm">{DAYS[slot.dayOfWeek]}</p>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    slot.isAvailable 
                      ? "bg-teal-500/10 text-teal-300 border-teal-500/20" 
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}>
                    {slot.isAvailable ? "Active" : "Disabled"}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-slate-400 font-mono">
                  <p><span className="text-slate-500">From:</span> {slot.startTime}</p>
                  <p><span className="text-slate-500">To:</span> {slot.endTime}</p>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => toggleAvailability(slot)}
                    className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
                  >
                    {slot.isAvailable ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => startEdit(slot)}
                    className="flex-1 py-2 text-xs font-semibold rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityManager;
