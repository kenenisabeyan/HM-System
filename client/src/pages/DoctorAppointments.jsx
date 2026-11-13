import { useState } from "react";
import { 
  useDoctorAppointments, 
  useCompleteAppointment 
} from "../hooks/useDoctor";
import StatusBadge from "../components/StatusBadge";
import { 
  Calendar, 
  Filter, 
  CheckCircle, 
  User, 
  ClipboardList, 
  FilePlus, 
  Clock,
  RotateCcw
} from "lucide-react";
import PatientInfoModal from "../components/PatientInfoModal";
import MedicalRecordForm from "../components/MedicalRecordForm";
import PrescriptionForm from "../components/PrescriptionForm";

const DoctorAppointments = () => {
  const [filters, setFilters] = useState({
    date: "",
    status: ""
  });

  const { data: appointments = [], isLoading, isError } = useDoctorAppointments(filters);
  const completeMutation = useCompleteAppointment();

  // Modals state
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [medicalRecordAppt, setMedicalRecordAppt] = useState(null);
  const [prescriptionAppt, setPrescriptionAppt] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleComplete = (id) => {
    if (window.confirm("Mark this appointment as completed?")) {
      completeMutation.mutate(id);
    }
  };

  if (isError) {
    return (
      <div className="text-center py-20 text-rose-400 bg-rose-500/5 border border-rose-500/20 rounded-2xl p-8">
        Failed to load appointments.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Calendar className="text-teal-400" size={28} />
          Clinical Appointments
        </h1>
        <p className="text-sm text-slate-400 mt-1">Review schedules, complete consultations, and issue records</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#0e172c]/90 p-4 rounded-2xl border border-slate-800/80 shadow-xl flex flex-wrap gap-4 items-center backdrop-blur-sm">
        <div className="flex items-center gap-2.5 bg-[#090f1d] px-3.5 py-2.5 rounded-xl border border-slate-700/80 flex-1 min-w-[220px]">
          <Calendar size={18} className="text-teal-400" />
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="bg-transparent border-none text-slate-100 text-sm focus:outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-2.5 bg-[#090f1d] px-3.5 py-2.5 rounded-xl border border-slate-700/80 w-full sm:w-56">
          <Filter size={18} className="text-teal-400" />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="bg-[#090f1d] border-none text-slate-100 text-sm focus:outline-none w-full cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button 
          onClick={() => setFilters({ date: "", status: "" })}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-300 transition-colors px-3 py-2 rounded-lg hover:bg-slate-800/60"
        >
          <RotateCcw size={14} />
          Reset Filters
        </button>
      </div>

      {/* Appointments List */}
      <div className="bg-[#0e172c]/90 rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#090f1d] text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800/80">
              <tr>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Clinical Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center text-slate-400 text-sm">Loading appointments...</td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center text-slate-400 text-sm">No appointments found matching your filters.</td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300 font-bold text-sm">
                          {appt.patientId?.name?.[0]?.toUpperCase() || "P"}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{appt.patientId?.name || "Patient"}</p>
                          <button 
                            onClick={() => setSelectedPatientId(appt.patientId?._id)}
                            className="text-[11px] text-teal-400 hover:text-teal-300 hover:underline flex items-center gap-1 mt-0.5 transition-colors font-medium"
                          >
                            <User size={11} /> Clinical Details
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-200 font-medium">
                        {new Date(appt.appointmentDateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock size={12} className="text-teal-400" />
                        {new Date(appt.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {appt.status === "Confirmed" && (
                          <button
                            onClick={() => handleComplete(appt._id)}
                            disabled={completeMutation.isPending}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-all"
                            title="Mark Consultation as Completed"
                          >
                            <CheckCircle size={14} />
                            Complete
                          </button>
                        )}
                        
                        {appt.status === "Completed" && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setMedicalRecordAppt(appt)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl transition-all"
                              title="Add Medical Record"
                            >
                              <ClipboardList size={13} />
                              Record
                            </button>
                            <button
                              onClick={() => setPrescriptionAppt(appt)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 rounded-xl transition-all"
                              title="Issue Prescription"
                            >
                              <FilePlus size={13} />
                              Prescribe
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {selectedPatientId && (
        <PatientInfoModal 
          userId={selectedPatientId} 
          onClose={() => setSelectedPatientId(null)} 
        />
      )}

      {medicalRecordAppt && (
        <MedicalRecordForm 
          appointment={medicalRecordAppt} 
          onClose={() => setMedicalRecordAppt(null)} 
        />
      )}

      {prescriptionAppt && (
        <PrescriptionForm 
          appointment={prescriptionAppt} 
          onClose={() => setPrescriptionAppt(null)} 
        />
      )}
    </div>
  );
};

export default DoctorAppointments;
