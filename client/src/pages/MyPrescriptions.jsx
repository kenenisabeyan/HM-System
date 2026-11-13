import { useMyPrescriptions } from "../hooks/usePatient";
import { Pill, Clock, Calendar, Stethoscope } from "lucide-react";

const MyPrescriptions = () => {
  const { data: prescriptions = [], isLoading, isError } = useMyPrescriptions();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Pill className="text-teal-400" size={28} />
          My Prescriptions
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Review prescribed medical treatments, dosages, and dosage instructions
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <div className="w-10 h-10 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium">Loading clinical prescriptions...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-rose-400 bg-rose-500/5 border border-rose-500/20 rounded-2xl p-8">
          Failed to load prescriptions.
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-16 bg-[#0e172c]/90 rounded-2xl shadow-xl border border-dashed border-slate-800">
          <p className="text-slate-200 text-base font-semibold">No digital prescriptions on file.</p>
          <p className="text-xs text-slate-400 mt-1">
            Prescriptions issued by your doctor will show up here along with instructions.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <div key={prescription._id} className="bg-[#0e172c]/90 rounded-2xl shadow-xl border border-slate-800/80 p-6 backdrop-blur-sm hover:border-teal-500/30 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2">
                    <Pill size={18} className="text-teal-400" />
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      Prescription Order
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 pl-6">
                    <Stethoscope size={13} className="text-teal-400" />
                    Prescribed by: Dr. {prescription.doctorId?.userId?.name || "Doctor"}
                  </p>
                </div>
                <div className="text-xs font-semibold text-teal-400/90 flex items-center gap-1.5 bg-teal-500/10 px-3 py-1 rounded-xl border border-teal-500/20 w-fit">
                  <Calendar size={13} />
                  {new Date(prescription.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="space-y-4 mt-4">
                {prescription.medicines && prescription.medicines.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Medications & Schedule:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {prescription.medicines.map((med, idx) => (
                        <div key={idx} className="bg-[#090f1d] p-4 rounded-xl border border-slate-700/80 hover:border-teal-500/30 transition-all">
                          <p className="text-teal-300 font-bold text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                            {med.name}
                          </p>
                          <div className="mt-2 space-y-0.5 text-xs text-slate-300">
                            <p><span className="text-slate-500">Dosage:</span> {med.dosage}</p>
                            <p><span className="text-slate-500">Duration:</span> {med.duration}</p>
                          </div>
                          {med.instructions && (
                            <p className="text-xs text-slate-400 mt-2.5 pt-2 border-t border-slate-800 italic">
                              "{med.instructions}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-500">
                  <Clock size={13} className="text-teal-400" />
                  <span>Issued on {new Date(prescription.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPrescriptions;
