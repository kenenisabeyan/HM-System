import { format } from "date-fns";
import { CheckCircle2, User, Calendar, Clock, Building2, FileText, Loader2 } from "lucide-react";

const BookingSummary = ({ doctor, date, time, notes, setNotes, onConfirm, isBooking }) => {
  const formattedDate = date ? format(new Date(date), "PPP") : "";

  return (
    <div className="bg-[#0e172c] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300 backdrop-blur-sm">
      <div className="bg-teal-600 px-6 py-4 flex items-center gap-3 shadow-md">
        <div className="p-2 bg-white/20 rounded-xl text-white">
          <CheckCircle2 size={22} />
        </div>
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Confirm Appointment</h3>
          <p className="text-teal-100 text-xs">Please review your consultation details</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#090f1d] text-teal-400 border border-slate-700/80 shrink-0 mt-0.5">
                <User size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Specialist</p>
                <p className="text-white font-semibold text-sm">Dr. {doctor.userId?.name}</p>
                <p className="text-xs text-teal-400 font-medium">{doctor.specialization}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#090f1d] text-teal-400 border border-slate-700/80 shrink-0 mt-0.5">
                <Building2 size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Department</p>
                <p className="text-white font-semibold text-sm">{doctor.department}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#090f1d] text-teal-400 border border-slate-700/80 shrink-0 mt-0.5">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Consultation Date</p>
                <p className="text-white font-semibold text-sm">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#090f1d] text-teal-400 border border-slate-700/80 shrink-0 mt-0.5">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Time Slot</p>
                <p className="text-white font-semibold text-sm">{time}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-slate-400 uppercase font-bold tracking-wider">
            <FileText size={14} className="text-teal-400" />
            Reason for Visit / Patient Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tell the doctor briefly about your symptoms or medical concern..."
            className="w-full bg-[#090f1d] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 min-h-[100px] resize-none transition-all"
          />
        </div>

        <button
          onClick={onConfirm}
          disabled={isBooking}
          className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-600/25 hover:shadow-teal-500/35 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isBooking ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Confirming Clinical Booking...
            </>
          ) : (
            "Confirm & Book Consultation"
          )}
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;
