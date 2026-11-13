import { User, Stethoscope, Building2, CheckCircle2, XCircle } from "lucide-react";

const DoctorCard = ({ doctor, onSelect }) => {
  const name = doctor.userId?.name || "Unknown Doctor";
  const specialization = doctor.specialization || "General Physician";
  const department = doctor.department || "General Medicine";
  const availableDays = doctor.availableDays || [];
  const isActive = doctor.isActive !== false && doctor.userId?.isActive !== false;

  return (
    <div className="bg-[#0e172c]/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl hover:border-teal-500/40 hover:shadow-teal-500/10 transition-all duration-300 group backdrop-blur-sm flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-all shadow-md">
            <User size={24} />
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            isActive ? "text-teal-300 border-teal-500/30 bg-teal-500/10" : "text-rose-400 border-rose-500/20 bg-rose-500/10"
          }`}>
            {isActive ? <CheckCircle2 size={12} className="text-teal-400" /> : <XCircle size={12} className="text-rose-400" />}
            {isActive ? "Available" : "Unavailable"}
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
              Dr. {name}
            </h3>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 mt-1">
              <Stethoscope size={14} className="text-teal-400 shrink-0" />
              <span>{specialization}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Building2 size={14} className="text-slate-500 shrink-0" />
            <span>{department}</span>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Available Days:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {availableDays.length > 0 ? (
                availableDays.map((day) => (
                  <span key={day} className="px-2 py-0.5 rounded-md bg-[#090f1d] text-slate-300 text-[10px] font-medium border border-slate-700/80">
                    {day.substring(0, 3)}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">No set days</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => onSelect(doctor)}
        disabled={!isActive}
        className="w-full mt-6 py-2.5 px-4 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:hover:bg-teal-600 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-teal-600/25 hover:shadow-teal-500/35 hover:-translate-y-0.5"
      >
        Select Specialist
      </button>
    </div>
  );
};

export default DoctorCard;
