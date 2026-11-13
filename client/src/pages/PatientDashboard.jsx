import { useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  useMyAppointments, 
  useMyRecords, 
  useMyPrescriptions 
} from "../hooks/usePatient";
import useAuthStore from "../store/useAuthStore";
import StatusBadge from "../components/StatusBadge";
import { 
  Calendar, 
  FileText, 
  Pill, 
  Clock, 
  ArrowRight, 
  User, 
  Activity,
  CheckCircle2,
  CalendarDays,
  Plus
} from "lucide-react";

const PatientDashboard = () => {
  const { user } = useAuthStore();
  const { data: appointments = [], isLoading: apptsLoading } = useMyAppointments();
  const { data: records = [], isLoading: recordsLoading } = useMyRecords();
  const { data: prescriptions = [], isLoading: prescriptionsLoading } = useMyPrescriptions();

  const nextAppointment = useMemo(() => {
    const now = new Date();
    return appointments
      .filter(a => new Date(a.appointmentDateTime) > now && a.status !== "Cancelled")
      .sort((a, b) => new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime))[0];
  }, [appointments]);

  const recentPrescriptions = useMemo(() => {
    return [...prescriptions]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  }, [prescriptions]);

  const stats = [
    {
      label: "Upcoming Visits",
      value: appointments.filter(a => new Date(a.appointmentDateTime) > new Date() && a.status !== "Cancelled").length,
      icon: <Clock size={22} className="text-teal-400" />,
      bg: "bg-teal-500/10",
      border: "border-teal-500/20"
    },
    {
      label: "Completed",
      value: appointments.filter(a => a.status === "Completed").length,
      icon: <CheckCircle2 size={22} className="text-emerald-400" />,
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    },
    {
      label: "Medical Records",
      value: records.length,
      icon: <FileText size={22} className="text-cyan-400" />,
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20"
    },
    {
      label: "Prescriptions",
      value: prescriptions.length,
      icon: <Pill size={22} className="text-violet-400" />,
      bg: "bg-violet-500/10",
      border: "border-violet-500/20"
    }
  ];

  if (apptsLoading || recordsLoading || prescriptionsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <div className="w-10 h-10 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Loading health summary...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name || "Patient"}!
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Personal health record, appointment schedules, and medical prescriptions
          </p>
        </div>
        <Link 
          to="/patient/book" 
          className="bg-teal-600 hover:bg-teal-500 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-teal-600/25 hover:shadow-teal-500/35 flex items-center justify-center gap-2 w-fit hover:-translate-y-0.5"
        >
          <Plus size={18} />
          Book Appointment
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`p-5 rounded-2xl border ${stat.border} ${stat.bg} shadow-xl flex items-center gap-4 backdrop-blur-sm hover:border-slate-700/80 transition-all`}>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
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
        {/* Next Appointment Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <CalendarDays size={20} className="text-teal-400" />
              Next Appointment
            </h2>
            <Link to="/patient/appointments" className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors">
              <span>All Appointments</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          
          {nextAppointment ? (
            <div className="bg-[#0e172c]/90 rounded-2xl border border-slate-800/80 p-6 shadow-xl hover:border-teal-500/30 transition-all group backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-16 h-16 bg-teal-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-teal-500/20 group-hover:scale-105 transition-transform shadow-lg shadow-teal-500/10">
                  <Calendar size={32} className="text-teal-400" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">Dr. {nextAppointment.doctorId?.name}</h3>
                      <p className="text-teal-400 text-xs font-medium mt-0.5">{nextAppointment.doctorId?.specialization || "Clinical Specialist"}</p>
                    </div>
                    <StatusBadge status={nextAppointment.status} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
                    <div className="flex items-center gap-3 text-slate-300">
                      <div className="p-2 bg-slate-800/80 rounded-lg text-teal-400"><Calendar size={16} /></div>
                      <span className="text-xs">
                        {new Date(nextAppointment.appointmentDateTime).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                      <div className="p-2 bg-slate-800/80 rounded-lg text-teal-400"><Clock size={16} /></div>
                      <span className="text-xs">
                        {new Date(nextAppointment.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0e172c]/90 rounded-2xl border border-dashed border-slate-800 p-12 text-center shadow-sm backdrop-blur-sm">
              <div className="w-14 h-14 bg-slate-800/60 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Calendar size={28} />
              </div>
              <h3 className="text-base font-bold text-slate-200">No upcoming appointments</h3>
              <p className="text-slate-400 mt-1 max-w-xs mx-auto text-xs">Schedule your next clinical consultation with our doctors today.</p>
              <Link to="/patient/book" className="text-teal-400 hover:text-teal-300 mt-4 inline-block font-semibold text-xs transition-colors">
                Book an Appointment &rarr;
              </Link>
            </div>
          )}

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Link to="/patient/profile" className="bg-[#0e172c]/90 p-5 rounded-2xl border border-slate-800/80 hover:border-teal-500/30 transition-all flex items-center gap-4 group backdrop-blur-sm">
              <div className="p-3 bg-teal-500/10 rounded-xl border border-teal-500/20 group-hover:scale-105 transition-transform text-teal-400">
                <User size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Personal Profile</p>
                <p className="text-xs text-slate-400">Manage blood group & contact details</p>
              </div>
            </Link>
            <Link to="/patient/records" className="bg-[#0e172c]/90 p-5 rounded-2xl border border-slate-800/80 hover:border-teal-500/30 transition-all flex items-center gap-4 group backdrop-blur-sm">
              <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 group-hover:scale-105 transition-transform text-cyan-400">
                <Activity size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Medical Records</p>
                <p className="text-xs text-slate-400">View diagnostic and consultation history</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Prescriptions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Pill size={20} className="text-violet-400" />
              Prescriptions
            </h2>
            <Link to="/patient/prescriptions" className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors">
              View All
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentPrescriptions.length > 0 ? (
              recentPrescriptions.map((pres) => (
                <div key={pres._id} className="bg-[#0e172c]/90 rounded-xl border border-slate-800/80 p-4 hover:border-slate-700/80 transition-all backdrop-blur-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-white font-semibold text-sm">Dr. {pres.doctorId?.userId?.name || "Doctor"}</p>
                    <span className="text-[11px] text-teal-400 font-medium">{new Date(pres.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="space-y-1.5">
                    {pres.medicines?.slice(0, 2).map((med, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
                        <span className="font-medium text-teal-300">{med.name}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{med.dosage}</span>
                      </div>
                    ))}
                    {pres.medicines?.length > 2 && (
                      <p className="text-[11px] text-slate-400 pl-3.5">+{pres.medicines.length - 2} more medications</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#0e172c]/90 rounded-xl border border-dashed border-slate-800 p-8 text-center backdrop-blur-sm">
                <p className="text-slate-400 text-xs">No active prescriptions on file.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
