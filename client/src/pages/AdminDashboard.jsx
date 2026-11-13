import { Link } from "react-router-dom";
import {
  CalendarDays,
  Stethoscope,
  Users,
  Clock3,
  CheckCircle2,
  XCircle,
  CircleDot,
  ArrowUpRight,
} from "lucide-react";
import { useAdminDashboard } from "../hooks/useAdmin";
import StatusBadge from "../components/StatusBadge";

const statusMeta = {
  Pending: { label: "Pending", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: CircleDot },
  Confirmed: { label: "Confirmed", color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20", icon: Clock3 },
  Completed: {
    label: "Completed",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: CheckCircle2,
  },
  Cancelled: { label: "Cancelled", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", icon: XCircle },
};

const cardThemes = {
  teal: {
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
    text: "text-teal-400",
    hover: "hover:border-teal-500/40",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    hover: "hover:border-cyan-500/40",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    hover: "hover:border-emerald-500/40",
  },
};

const AdminDashboard = () => {
  const { data, isLoading, isError } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <div className="w-10 h-10 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Loading clinical analytics...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-rose-400 bg-rose-500/5 border border-rose-500/20 rounded-2xl p-8">
        Failed to load dashboard metrics.
      </div>
    );
  }

  const appointmentsByStatus = data?.appointmentsByStatus || {};
  const totalAppointments = Object.values(appointmentsByStatus).reduce(
    (sum, value) => sum + value,
    0,
  );

  const cards = [
    {
      label: "Total Patients",
      value: data?.totalPatients || 0,
      helper: "Registered patient accounts",
      icon: Users,
      accent: "teal",
      href: "/admin/patients",
    },
    {
      label: "Total Active Doctors",
      value: data?.activeDoctors || 0,
      helper: `${data?.totalDoctors || 0} registered medical staff`,
      icon: Stethoscope,
      accent: "cyan",
      href: "/admin/doctors",
    },
    {
      label: "Total Appointments",
      value: totalAppointments,
      helper: "Across all clinical workflows",
      icon: CalendarDays,
      accent: "emerald",
      href: "/admin/appointments",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-400">
          Live hospital operations, doctor availability, and appointment statistics
        </p>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          const theme = cardThemes[card.accent];
          return (
            <Link
              key={card.label}
              to={card.href}
              className={`bg-[#0e172c]/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl ${theme.hover} transition-all duration-300 flex items-center justify-between gap-4 group backdrop-blur-sm`}
            >
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">{card.label}</p>
                <p className="text-3xl font-extrabold text-white tracking-tight">{card.value}</p>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-2 group-hover:text-teal-400 transition-colors">
                  <span>{card.helper}</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div
                className={`p-4 rounded-2xl border ${theme.bg} ${theme.border} group-hover:scale-105 transition-transform`}
              >
                <Icon className={theme.text} size={28} />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workflow Status Distribution */}
        <div className="bg-[#0e172c]/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Appointment Status
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Current operational distribution
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(statusMeta).map(([status, meta]) => {
              const Icon = meta.icon;
              return (
                <div
                  key={status}
                  className="bg-[#090f1d] rounded-xl border border-slate-800/80 p-4 flex items-center gap-3.5 hover:border-slate-700/80 transition-colors"
                >
                  <div className={`p-2.5 rounded-xl border ${meta.bg} ${meta.border} ${meta.color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-semibold tracking-wider text-slate-400">
                      {meta.label}
                    </p>
                    <p className={`text-2xl font-bold ${meta.color}`}>
                      {appointmentsByStatus[status] || 0}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Doctor Registrations */}
        <div className="bg-[#0e172c]/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Recent Doctors
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Newly registered medical staff
              </p>
            </div>
            <Link to="/admin/doctors" className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {(data?.recentDoctors || []).length === 0 ? (
              <p className="text-sm text-slate-400 py-8 text-center bg-[#090f1d] rounded-xl border border-dashed border-slate-800">
                No doctors registered yet.
              </p>
            ) : (
              data.recentDoctors.slice(0, 4).map((doctor) => (
                <div
                  key={doctor._id}
                  className="bg-[#090f1d] rounded-xl border border-slate-800/80 p-4 flex items-center justify-between gap-4 hover:border-slate-700/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300 font-bold text-sm shrink-0">
                      {doctor.userId?.name?.[0]?.toUpperCase() || "D"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Dr. {doctor.userId?.name || "Unknown Doctor"}
                      </p>
                      <p className="text-xs text-teal-400/90 font-medium">
                        {doctor.specialization || "General Medicine"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {doctor.userId?.email || ""}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                      doctor.isActive 
                        ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" 
                        : "text-rose-400 border-rose-500/20 bg-rose-500/10"
                    }`}
                  >
                    {doctor.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-[#0e172c]/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Recent Appointments
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest scheduling across all departments
            </p>
          </div>
          <Link to="/admin/appointments" className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors">
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {(data?.recentAppointments || []).length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center bg-[#090f1d] rounded-xl border border-dashed border-slate-800">
              No appointments scheduled yet.
            </p>
          ) : (
            data.recentAppointments.slice(0, 5).map((appointment) => (
              <div
                key={appointment._id}
                className="bg-[#090f1d] rounded-xl border border-slate-800/80 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-slate-700/80 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-white">
                    {appointment.patientId?.name || "Patient"}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Attending: <span className="text-teal-400 font-medium">Dr. {appointment.doctorId?.name || "Staff"}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <CalendarDays size={13} className="text-teal-400" />
                    {new Date(appointment.appointmentDateTime).toLocaleString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <StatusBadge status={appointment.status} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
