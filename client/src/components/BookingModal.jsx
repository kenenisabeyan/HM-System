import { useState } from "react";
import { useBookAppointment } from "../hooks/usePatient";
import { Calendar, CheckCircle2, AlertCircle, X } from "lucide-react";

const BookingModal = ({ slot, selectedDate, onClose }) => {
  const [notes, setNotes] = useState("");
  const bookMutation = useBookAppointment();

  const handleBook = () => {
    const dateTimeString = `${selectedDate}T${slot.startTime}:00`;
    const appointmentDateTime = new Date(dateTimeString);

    bookMutation.mutate(
      {
        doctorId: slot.doctorId,
        appointmentDateTime,
        notes,
      },
      {
        onSuccess: () => {
          setTimeout(onClose, 1200);
        },
      }
    );
  };

  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0d162b] rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden border border-slate-800 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-teal-600 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 text-white">
            <Calendar size={18} />
            <h2 className="text-base font-bold tracking-tight">Book Appointment</h2>
          </div>
          <button onClick={onClose} className="text-teal-100 hover:text-white p-1 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Success message */}
          {bookMutation.isSuccess && (
            <div className="p-3 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Appointment booked successfully!</span>
            </div>
          )}

          {/* Error message */}
          {bookMutation.isError && (
            <div className="p-3 text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-400 shrink-0" />
              <span>{bookMutation.error.response?.data?.message || "Booking failed"}</span>
            </div>
          )}

          {/* Appointment summary */}
          <div className="space-y-2.5 bg-[#090f1d] p-4 rounded-xl border border-slate-800 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Doctor</span>
              <span className="font-semibold text-white">
                Dr. {slot.doctorName || "Specialist"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Day</span>
              <span className="font-semibold text-white">
                {DAYS[slot.dayOfWeek]}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date</span>
              <span className="font-semibold text-teal-300">{selectedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Time Window</span>
              <span className="font-semibold text-teal-300 font-mono">
                {slot.startTime} – {slot.endTime}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Reason / Medical Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-[#090f1d] border border-slate-700/80 text-slate-100 rounded-xl text-xs placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 resize-none"
              placeholder="Any specific symptoms or clinical requests..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2 border-t border-slate-800/80">
            <button
              onClick={handleBook}
              disabled={bookMutation.isPending || bookMutation.isSuccess}
              className="flex-1 py-3 bg-teal-600 text-white text-xs font-semibold rounded-xl hover:bg-teal-500 disabled:opacity-50 transition-all shadow-lg shadow-teal-600/25"
            >
              {bookMutation.isPending ? "Booking..." : "Confirm Booking"}
            </button>
            <button
              onClick={onClose}
              disabled={bookMutation.isPending}
              className="flex-1 py-3 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700 hover:text-white transition-all border border-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
