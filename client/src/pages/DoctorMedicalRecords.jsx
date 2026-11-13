import { useQuery } from "@tanstack/react-query";
import api from "../api/authApi";
import { ClipboardList, Calendar } from "lucide-react";

const DoctorMedicalRecords = () => {
  const { data: records = [], isLoading } = useQuery({
    queryKey: ["doctorMedicalRecords"],
    queryFn: async () => {
      const { data } = await api.get("/medical-records/doctor");
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <div className="w-10 h-10 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Loading clinical records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <ClipboardList className="text-teal-400" size={28} />
          Medical Records
        </h1>
        <p className="text-sm text-slate-400 mt-1">History of all clinical consultations and patient diagnosis entries</p>
      </div>

      <div className="bg-[#0e172c]/90 rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#090f1d] text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800/80">
              <tr>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Consultation Date</th>
                <th className="px-6 py-4 font-semibold">Diagnosis</th>
                <th className="px-6 py-4 font-semibold">Symptoms Observed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {records.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center text-slate-400 text-sm">
                    No medical records created yet.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record._id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300 font-bold text-xs">
                          {record.patientId?.userId?.name?.[0]?.toUpperCase() || "P"}
                        </div>
                        <span className="text-sm text-white font-medium">{record.patientId?.userId?.name || "Patient"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Calendar size={13} className="text-teal-400" />
                        {new Date(record.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-200 line-clamp-1">{record.diagnosis}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {record.symptoms?.slice(0, 3).map((s, i) => (
                          <span key={i} className="text-[11px] bg-teal-500/10 text-teal-300 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                            {s}
                          </span>
                        ))}
                        {record.symptoms?.length > 3 && (
                          <span className="text-[10px] text-slate-500 font-medium self-center">+{record.symptoms.length - 3}</span>
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
    </div>
  );
};

export default DoctorMedicalRecords;
