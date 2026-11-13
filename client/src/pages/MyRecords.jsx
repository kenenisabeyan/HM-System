import { useMyRecords } from "../hooks/usePatient";
import { FileText, Calendar, Stethoscope, Activity } from "lucide-react";

const MyRecords = () => {
  const { data: records = [], isLoading, isError } = useMyRecords();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <FileText className="text-teal-400" size={28} />
          My Medical Records
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Historical diagnostic notes, observed symptoms, and physician assessments
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <div className="w-10 h-10 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium">Loading clinical records...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-rose-400 bg-rose-500/5 border border-rose-500/20 rounded-2xl p-8">
          Failed to load medical records.
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-16 bg-[#0e172c]/90 rounded-2xl shadow-xl border border-dashed border-slate-800">
          <p className="text-slate-200 text-base font-semibold">No medical records on file.</p>
          <p className="text-xs text-slate-400 mt-1">
            Clinical records created during your consultations will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record._id} className="bg-[#0e172c]/90 rounded-2xl shadow-xl border border-slate-800/80 p-6 backdrop-blur-sm hover:border-teal-500/30 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity size={18} className="text-teal-400" />
                    <h3 className="text-lg font-bold text-teal-300">
                      Diagnosis: {record.diagnosis || "General Consultation"}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 pl-6">
                    <Stethoscope size={13} className="text-teal-400" />
                    Attending: Dr. {record.doctorId?.userId?.name || "Clinical Specialist"}
                  </p>
                </div>
                <div className="text-xs font-semibold text-teal-400/90 flex items-center gap-1.5 bg-teal-500/10 px-3 py-1 rounded-xl border border-teal-500/20 w-fit">
                  <Calendar size={13} />
                  {new Date(record.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                {record.symptoms && record.symptoms.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Reported Symptoms:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {record.symptoms.map((s, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-500/10 text-teal-300 border border-teal-500/20">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {record.notes && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Clinical Evaluation & Notes:</h4>
                    <p className="text-xs text-slate-300 bg-[#090f1d] p-4 rounded-xl border border-slate-800/80 leading-relaxed">
                      {record.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecords;
