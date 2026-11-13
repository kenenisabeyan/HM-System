import { useQuery } from "@tanstack/react-query";
import api from "../api/authApi";
import { Pill, Calendar } from "lucide-react";

const DoctorPrescriptions = () => {
  const { data: prescriptions = [], isLoading } = useQuery({
    queryKey: ["doctorPrescriptions"],
    queryFn: async () => {
      const { data } = await api.get("/prescriptions/doctor");
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <div className="w-10 h-10 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Loading clinical prescriptions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Pill className="text-teal-400" size={28} />
          Digital Prescriptions
        </h1>
        <p className="text-sm text-slate-400 mt-1">History of all digital medications issued to patients</p>
      </div>

      <div className="bg-[#0e172c]/90 rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#090f1d] text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800/80">
              <tr>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Issued Date</th>
                <th className="px-6 py-4 font-semibold">Prescribed Medications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {prescriptions.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-16 text-center text-slate-400 text-sm">
                    No prescriptions issued yet.
                  </td>
                </tr>
              ) : (
                prescriptions.map((pres) => (
                  <tr key={pres._id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300 font-bold text-xs">
                          {pres.patientId?.userId?.name?.[0]?.toUpperCase() || "P"}
                        </div>
                        <span className="text-sm text-white font-medium">{pres.patientId?.userId?.name || "Patient"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Calendar size={13} className="text-teal-400" />
                        {new Date(pres.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {pres.medicines?.map((med, i) => (
                          <div key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-xs">
                            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
                            <span className="font-semibold text-teal-300">{med.name}</span>
                            <span className="text-slate-400 text-[11px]">({med.dosage})</span>
                          </div>
                        ))}
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

export default DoctorPrescriptions;
