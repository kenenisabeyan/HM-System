import { ArrowLeft, User, Stethoscope, Building2, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, addDays, isSameDay, startOfDay } from "date-fns";

const DoctorDetailsPanel = ({ doctor, onBack, selectedDate, onSelectDate, availability = [] }) => {
  const name = doctor.userId?.name || "Unknown Doctor";
  const specialization = doctor.specialization || "General Physician";
  const department = doctor.department || "General Medicine";
  const availableDays = doctor.availableDays || [];

  // Logic to find available dates for the next 30 days
  const getNextAvailableDates = () => {
    const dates = [];
    const today = startOfDay(new Date());
    
    // Get numeric days of week from Availability records
    const granularDays = availability.map(a => a.dayOfWeek);
    const hasCustomAvailability = granularDays.length > 0;

    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      const dayName = format(date, "EEEE");
      const dayNum = date.getDay();
      
      if (hasCustomAvailability) {
        if (granularDays.includes(dayNum)) {
          dates.push(date);
        }
      } else {
        if (availableDays.includes(dayName)) {
          dates.push(date);
        }
      }
    }
    return dates;
  };

  const availableDates = getNextAvailableDates();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-teal-400 transition-colors group px-3 py-1.5 rounded-lg hover:bg-slate-800/60"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Specialists
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Doctor Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0e172c]/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-4 shadow-lg shadow-teal-500/10">
                <User size={40} />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Dr. {name}</h2>
              <p className="text-teal-400 font-medium text-xs mt-0.5">{specialization}</p>
              <p className="text-xs text-slate-400 mt-1">{department}</p>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3.5">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <div className="p-2 rounded-xl bg-[#090f1d] text-teal-400 border border-slate-700/80">
                  <CalendarIcon size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Service Days</p>
                  <p className="mt-0.5 font-medium">{availableDays.join(", ") || "General Hospital Hours"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <div className="p-2 rounded-xl bg-[#090f1d] text-teal-400 border border-slate-700/80">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Earliest Slot</p>
                  <p className="mt-0.5 font-medium">{availableDates.length > 0 ? format(availableDates[0], "PPP") : "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Date Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0e172c]/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CalendarIcon size={18} className="text-teal-400" />
                Select Consultation Date
              </h3>
              <span className="text-xs text-teal-400 font-semibold">{availableDates.length} Days Available</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {availableDates.map((date) => {
                const isSelected = selectedDate && isSameDay(date, new Date(selectedDate));
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => onSelectDate(format(date, "yyyy-MM-dd"))}
                    className={`p-3.5 rounded-xl border flex flex-col items-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-teal-600 border-teal-400 text-white shadow-lg shadow-teal-600/30 scale-[1.02]"
                        : "bg-[#090f1d] border-slate-700/80 text-slate-300 hover:border-teal-500/50 hover:bg-slate-800/60"
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? "text-teal-100" : "text-slate-500"}`}>
                      {format(date, "EEE")}
                    </span>
                    <span className="text-lg font-extrabold my-0.5">
                      {format(date, "dd")}
                    </span>
                    <span className={`text-xs ${isSelected ? "text-teal-100" : "text-slate-400"}`}>
                      {format(date, "MMM")}
                    </span>
                  </button>
                );
              })}
              {availableDates.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400 bg-[#090f1d] rounded-xl border border-dashed border-slate-800">
                  No upcoming dates available for this doctor in the coming weeks.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsPanel;
