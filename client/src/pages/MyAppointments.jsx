import { useState } from "react";
import {
  useMyAppointments,
  useCancelAppointment,
} from "../hooks/usePatient";
import StatusBadge from "../components/StatusBadge";
import RescheduleModal from "../components/RescheduleModal";
import { Calendar, Clock, Stethoscope, AlertCircle, CheckCircle2, RotateCw } from "lucide-react";

const MyAppointments = () => {
  const { data: appointments = [], isLoading, isError } = useMyAppointments();
  const cancelMutation = useCancelAppointment();

  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const flashSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const handleCancel = (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }
    cancelMutation.mutate(id, {
      onSuccess: () => flashSuccess("Appointment successfully cancelled."),
    });
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Split into upcoming and past
  const now = new Date();
  const upcoming = appointments.filter(
    (a) => new Date(a.appointmentDateTime) >= now && a.status !== "Cancelled"
  );
  const past = appointments.filter(
    (a) => new Date(a.appointmentDateTime) < now || a.status === "Cancelled"
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Calendar className="text-teal-400" size={28} />
          My Appointments
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Review, reschedule, or cancel your hospital consultations
        </p>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="p-3.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {cancelMutation.isError && (
        <div className="p-3.5 text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-xl flex items-center gap-2 animate-in fade-in">
          <AlertCircle size={16} className="text-rose-400 shrink-0" />
          <span>{cancelMutation.error.response?.data?.message || "Failed to cancel appointment"}</span>
        </div>
      )}

      {/* Loading / Error states */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <div className="w-10 h-10 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium">Loading your clinical visits...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-rose-400 bg-rose-500/5 border border-rose-500/20 rounded-2xl p-8">
          Failed to load appointments.
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 bg-[#0e172c]/90 rounded-2xl shadow-xl border border-dashed border-slate-800">
          <p className="text-slate-200 text-base font-semibold">No appointments scheduled.</p>
          <p className="text-xs text-slate-400 mt-1">
            Browse our specialist directory to book your first clinical consultation!
          </p>
        </div>
      ) : (
        <>
          {/* Upcoming appointments */}
          {upcoming.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Clock size={18} className="text-teal-400" />
                Upcoming Consultations ({upcoming.length})
              </h2>
              <div className="space-y-3">
                {upcoming.map((appt) => (
                  <div
                    key={appt._id}
                    className="bg-[#0e172c]/90 rounded-2xl shadow-xl border border-slate-800/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-teal-500/30 transition-all backdrop-blur-sm"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Stethoscope size={16} className="text-teal-400" />
                        <p className="text-sm font-bold text-white">
                          {appt.doctorId?.name ? `Dr. ${appt.doctorId.name}` : "Clinical Staff"}
                        </p>
                      </div>
                      <p className="text-xs text-teal-400 font-medium pl-6">
                        {appt.doctorId?.specialization || "General Medicine"}
                      </p>
                      <p className="text-xs text-slate-300 pl-6 flex items-center gap-1.5 pt-0.5">
                        <Calendar size={13} className="text-slate-400" />
                        {formatDateTime(appt.appointmentDateTime)}
                      </p>
                      {appt.notes && (
                        <p className="text-xs text-slate-400 italic mt-2 bg-[#090f1d] p-3 rounded-xl border border-slate-800/80">
                          "{appt.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <StatusBadge status={appt.status} />

                      {["Pending", "Confirmed"].includes(appt.status) && (
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => setRescheduleTarget(appt)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 border border-teal-500/20 transition-all"
                          >
                            <RotateCw size={12} />
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancel(appt._id)}
                            disabled={cancelMutation.isPending}
                            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past / Cancelled appointments */}
          {past.length > 0 && (
            <div className="space-y-4 pt-4">
              <h2 className="text-base font-bold text-slate-400 tracking-tight">
                Past & Cancelled Visits ({past.length})
              </h2>
              <div className="space-y-3">
                {past.map((appt) => (
                  <div
                    key={appt._id}
                    className="bg-[#0e172c]/50 rounded-2xl border border-slate-800/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-slate-300">
                        {appt.doctorId?.name ? `Dr. ${appt.doctorId.name}` : "Clinical Staff"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDateTime(appt.appointmentDateTime)}
                      </p>
                      {appt.notes && (
                        <p className="text-xs text-slate-500 italic">
                          "{appt.notes}"
                        </p>
                      )}
                    </div>
                    <StatusBadge status={appt.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Reschedule modal */}
      {rescheduleTarget && (
        <RescheduleModal
          appointment={rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
        />
      )}
    </div>
  );
};

export default MyAppointments;
