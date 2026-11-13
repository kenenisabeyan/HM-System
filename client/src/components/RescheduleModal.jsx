import { useState } from "react";
import { useRescheduleAppointment } from "../hooks/usePatient";
import { Calendar, Clock, RotateCw, X, CheckCircle2, AlertCircle } from "lucide-react";

const RescheduleModal = ({ appointment, onClose }) => {
  const existingDate = new Date(appointment.appointmentDateTime);
  
  const existingDateStr = existingDate.toISOString().split("T")[0];
  const existingTimeStr = existingDate.toTimeString().slice(0, 5);

  const [date, setDate] = useState(existingDateStr);
  const [time, setTime] = useState(existingTimeStr);
  const rescheduleMutation = useRescheduleAppointment();

  const handleReschedule = (e) => {
    e.preventDefault();
    
    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes] = time.split(":").map(Number);
    const appointmentDateTime = new Date(year, month - 1, day, hours, minutes);

    if (appointmentDateTime < new Date()) {
      alert("Cannot reschedule to a past date or time.");
      return;
    }

    rescheduleMutation.mutate(
      { id: appointment._id, appointmentDateTime },
      {
        onSuccess: () => {
          setTimeout(onClose, 1200);
        },
      }
    );
  };

  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0d162b] rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden border border-slate-800 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-teal-600 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 text-white">
            <RotateCw size={18} />
            <h2 className="text-base font-bold tracking-tight">
              Reschedule Appointment
            </h2>
          </div>
          <button onClick={onClose} className="text-teal-100 hover:text-white p-1 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleReschedule} className="p-6 space-y-4">
          {/* Success */}
          {rescheduleMutation.isSuccess && (
            <div className="p-3 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Appointment rescheduled successfully!</span>
            </div>
          )}

          {/* Error */}
          {rescheduleMutation.isError && (
            <div className="p-3 text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-400 shrink-0" />
              <span>{rescheduleMutation.error.response?.data?.message || "Reschedule failed"}</span>
            </div>
          )}

          {/* Current Info */}
          <div className="bg-[#090f1d] p-4 rounded-xl border border-slate-800 space-y-2">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              Current Booking
            </p>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Doctor</span>
              <span className="font-semibold text-white">
                Dr. {appointment.doctorId?.name || "Clinical Staff"}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Scheduled Date</span>
              <span className="font-semibold text-teal-300">
                {existingDate.toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>

          {/* New Date */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              New Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={minDate}
              required
              className="w-full px-3.5 py-2.5 bg-[#090f1d] border border-slate-700/80 text-slate-100 rounded-xl text-xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 [color-scheme:dark]"
            />
          </div>

          {/* New Time */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              New Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[#090f1d] border border-slate-700/80 text-slate-100 rounded-xl text-xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 [color-scheme:dark]"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3 border-t border-slate-800/80">
            <button
              type="submit"
              disabled={
                rescheduleMutation.isPending || rescheduleMutation.isSuccess
              }
              className="flex-1 py-3 bg-teal-600 text-white text-xs font-semibold rounded-xl hover:bg-teal-500 disabled:opacity-50 transition-all shadow-lg shadow-teal-600/25"
            >
              {rescheduleMutation.isPending
                ? "Rescheduling..."
                : "Confirm Reschedule"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={rescheduleMutation.isPending}
              className="flex-1 py-3 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700 hover:text-white transition-all border border-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleModal;
