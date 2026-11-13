import { usePatientDetails } from "../hooks/useDoctor";
import { X, User, Phone, MapPin, Droplets, Calendar, Mail } from "lucide-react";

const PatientInfoModal = ({ userId, onClose }) => {
  const { data: patient, isLoading, isError } = usePatientDetails(userId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0d162b] rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden border border-slate-800 animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-[#090f1d]">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <User size={18} className="text-teal-400" />
            Patient Clinical Details
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12 text-slate-400 text-sm">Loading patient records...</div>
          ) : isError ? (
            <div className="text-center py-12 text-rose-400 text-sm">Failed to load patient information.</div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-4 p-4 bg-[#090f1d] rounded-xl border border-slate-800">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-xl font-bold text-teal-300 shrink-0">
                  {patient.userId?.name?.[0]?.toUpperCase() || "P"}
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-base font-bold text-white tracking-tight">{patient.userId?.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 truncate">
                    <Mail size={13} className="text-teal-400 shrink-0" />
                    <span>{patient.userId?.email}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-[#090f1d] rounded-xl border border-slate-800 space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Age</p>
                  <p className="text-white font-semibold text-xs flex items-center gap-1.5">
                    <Calendar size={13} className="text-teal-400" />
                    {patient.age ? `${patient.age} years` : "Not recorded"}
                  </p>
                </div>
                <div className="p-3.5 bg-[#090f1d] rounded-xl border border-slate-800 space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Gender</p>
                  <p className="text-white font-semibold text-xs flex items-center gap-1.5">
                    <User size={13} className="text-teal-400" />
                    {patient.gender || "Not recorded"}
                  </p>
                </div>
                <div className="p-3.5 bg-[#090f1d] rounded-xl border border-slate-800 space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Blood Group</p>
                  <p className="text-teal-300 font-semibold text-xs flex items-center gap-1.5">
                    <Droplets size={13} className="text-rose-400" />
                    {patient.bloodGroup || "Not recorded"}
                  </p>
                </div>
                <div className="p-3.5 bg-[#090f1d] rounded-xl border border-slate-800 space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Contact Phone</p>
                  <p className="text-white font-semibold text-xs flex items-center gap-1.5 truncate">
                    <Phone size={13} className="text-teal-400 shrink-0" />
                    {patient.phone || "Not recorded"}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-[#090f1d] rounded-xl border border-slate-800 space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Residential Address</p>
                <p className="text-slate-300 text-xs flex items-start gap-2 leading-relaxed">
                  <MapPin size={13} className="text-teal-400 mt-0.5 shrink-0" />
                  {patient.address || "No permanent address registered on file."}
                </p>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-teal-600/25 transition-all hover:-translate-y-0.5"
              >
                Close Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientInfoModal;
