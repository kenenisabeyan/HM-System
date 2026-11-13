import { useMemo, useState } from "react";
import { Search, Calendar, Filter, UserCheck, Stethoscope } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import {
  useAllDoctors,
  useAdminAppointments,
  useUpdateAdminAppointment,
} from "../hooks/useAdmin";

const statusOptions = ["Pending", "Confirmed", "Completed", "Cancelled"];

const ManageAppointments = () => {
  const { data: doctors = [] } = useAllDoctors();
  const [filters, setFilters] = useState({ status: "", date: "", doctor: "" });
  const [query, setQuery] = useState("");

  const apiFilters = useMemo(() => {
    const next = {};
    if (filters.status) next.status = filters.status;
    if (filters.date) next.date = filters.date;
    if (filters.doctor) next.doctor = filters.doctor;
    return next;
  }, [filters]);

  const {
    data: appointments = [],
    isLoading,
    isError,
  } = useAdminAppointments(apiFilters);
  const updateMutation = useUpdateAdminAppointment();

  const filteredAppointments = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return appointments;

    return appointments.filter((appointment) => {
      const patientName = appointment.patientId?.name || "";
      const patientEmail = appointment.patientId?.email || "";
      const doctorName = appointment.doctorId?.name || "";
      const doctorEmail = appointment.doctorId?.email || "";
      return [patientName, patientEmail, doctorName, doctorEmail].some(
        (value) => value.toLowerCase().includes(needle),
      );
    });
  }, [appointments, query]);

  const handleStatusUpdate = (id, status) => {
    updateMutation.mutate({ id, status });
  };

  const formatDateTime = (dateStr) =>
    new Date(dateStr).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <div className="w-10 h-10 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Loading hospital appointments...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-rose-400 bg-rose-500/5 border border-rose-500/20 rounded-2xl p-8">
        Failed to load appointments.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Calendar className="text-teal-400" size={28} />
            Manage Appointments
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Audit hospital visits, filter clinical schedules, and update statuses
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 w-fit">
          {filteredAppointments.length} Total Records
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0e172c]/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4 backdrop-blur-sm">
        <div className="relative max-w-xl">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by patient or doctor name/email..."
            className="w-full bg-[#090f1d] border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Status Filter
            </span>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full bg-[#090f1d] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Date Filter
            </span>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full bg-[#090f1d] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-teal-500"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Doctor Filter
            </span>
            <select
              value={filters.doctor}
              onChange={(e) =>
                setFilters({ ...filters, doctor: e.target.value })
              }
              className="w-full bg-[#090f1d] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="">All doctors</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor.userId?._id}>
                  Dr. {doctor.userId?.name || "Doctor"}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-[#0e172c]/90 rounded-2xl shadow-xl border border-slate-800/80 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[#090f1d] border-b border-slate-800/80 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Attending Doctor</th>
                <th className="px-6 py-4 font-semibold">Scheduled Time</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-16 text-center text-slate-400 text-sm"
                  >
                    No matching appointments found.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment._id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300 font-bold text-xs shrink-0">
                          {appointment.patientId?.name?.[0]?.toUpperCase() || "P"}
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {appointment.patientId?.name || "Patient"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {appointment.patientId?.email || ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Stethoscope size={15} className="text-teal-400 shrink-0" />
                        <div>
                          <p className="font-semibold text-white">
                            Dr. {appointment.doctorId?.name || "Staff"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {appointment.doctorId?.email || ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-xs">
                      {formatDateTime(appointment.appointmentDateTime)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={appointment.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {["Completed", "Cancelled"].includes(appointment.status) ? (
                        <span className="text-xs text-slate-500 italic">No further changes</span>
                      ) : (
                        <select
                          value={appointment.status}
                          onChange={(e) =>
                            handleStatusUpdate(appointment._id, e.target.value)
                          }
                          disabled={updateMutation.isPending}
                          className="bg-[#090f1d] border border-slate-700 text-teal-300 text-xs font-semibold rounded-xl px-3 py-1.5 outline-none focus:border-teal-500 cursor-pointer"
                        >
                          <option value={appointment.status} disabled>
                            Update: {appointment.status}
                          </option>
                          <option value="Confirmed">Confirm</option>
                          <option value="Cancelled">Cancel</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageAppointments;
