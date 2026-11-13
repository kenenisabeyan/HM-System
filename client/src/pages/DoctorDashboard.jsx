import { useDoctorAppointments } from "../hooks/useDoctor";
import StatusBadge from "../components/StatusBadge";
import { Users, CheckCircle, Clock, CalendarDays, UserCheck, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";

const DoctorDashboard = () => {
  const { data: appointments = [], isLoading, isError } = useDoctorAppointments();

  const {
    todaysAppointments,
    confirmedCount,
    completedCount,
    uniquePatientsCount,
    upcomingConsultations
  } = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const today = appointments
      .filter(appt => {
        const d = new Date(appt.appointmentDateTime);
        return d >= todayStart && d < todayEnd;
      })
      .sort((a, b) => new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime));

    const confirmed = appointments.filter(a => a.status === "Confirmed").length;
    const completed = appointments.filter(a => a.status === "Completed").length;
    
    // Unique patients handled (based on User ID)
    const patientIds = new Set(appointments.map(a => a.patientId?._id).filter(id => !!id));

    const upcoming = appointments
      .filter(a => new Date(a.appointmentDateTime) > new Date() && a.status === "Confirmed")
      .sort((a, b) => new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime))
      .slice(0, 5);

    return {
      todaysAppointments: today,
      confirmedCount: confirmed,
      completedCount: completed,
      uniquePatientsCount: patientIds.size,
      upcomingConsultations: upcoming
    };
  }, [appointments]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <div className="w-10 h-10 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Loading clinical schedule...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-rose-400 bg-rose-500/5 border border-rose-500/20 rounded-2xl p-8">
        Failed to load clinical dashboard.
      </div>
    );
  }

  const stats = [
    { label: "Today's Patients", value: todaysAppointments.length, icon: <Users size={22} />, color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" },
    { label: "Confirmed Ahead", value: confirmedCount, icon: <CheckCircle size={22} />, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { label: "Total Completed", value: completedCount, icon: <CheckCircle size={22} />, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Patients Handled", value: uniquePatientsCount, icon: <UserCheck size={22} />, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Doctor Dashboard</h1>
        <p className="text-sm text-slate-400">Daily overview, consultations, and patient queue</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0e172c]/90 p-5 rounded-2xl border border-slate-800/80 shadow-xl flex items-center gap-4 backdrop-blur-sm hover:border-slate-700/80 transition-all duration-300">
            <div className={`p-3 rounded-xl border ${stat.bg} ${stat.border} ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-extrabold text-white tracking-tight mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <CalendarDays size={20} className="text-teal-400" />
              Today's Schedule
            </h2>
            <Link to="/doctor/appointments" className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors">
              <span>All Appointments</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="bg-[#0e172c]/90 rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden backdrop-blur-sm">
            <div className="divide-y divide-slate-800/80">
              {todaysAppointments.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <p className="text-sm">No appointments scheduled for today.</p>
                </div>
              ) : (
                todaysAppointments.map((appt) => (
                  <div key={appt._id} className="p-5 flex items-center justify-between hover:bg-slate-800/40 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300 font-bold group-hover:scale-105 transition-transform">
                        {appt.patientId?.name?.[0]?.toUpperCase() || "P"}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{appt.patientId?.name || "Patient"}</p>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                          <Clock size={13} className="text-teal-400" />
                          {new Date(appt.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={appt.status} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Consultations */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <UserCheck size={20} className="text-cyan-400" />
            Upcoming Consultations
          </h2>
          <div className="space-y-3">
            {upcomingConsultations.length > 0 ? (
              upcomingConsultations.map((appt) => (
                <div key={appt._id} className="bg-[#0e172c]/90 p-4 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition-all backdrop-blur-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-white font-semibold text-sm truncate max-w-[140px]">{appt.patientId?.name || "Patient"}</p>
                    <span className="text-[11px] text-teal-400 font-medium">
                      {new Date(appt.appointmentDateTime).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 italic">
                    {appt.notes || "Routine clinical checkup."}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 bg-[#0e172c]/90 rounded-xl border border-dashed border-slate-800 text-center text-slate-400 text-xs">
                No upcoming confirmed consultations.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
