import { Clock } from "lucide-react";
import { isSameDay, parse, isAfter } from "date-fns";

const TimeSlotPicker = ({ selectedDate, selectedTime, onSelectTime, availability = [] }) => {
  // Default slots if no specific availability is defined
  const defaultSlots = [
    { id: "09:00", label: "09:00 AM" },
    { id: "10:00", label: "10:00 AM" },
    { id: "11:00", label: "11:00 AM" },
    { id: "12:00", label: "12:00 PM" },
    { id: "14:00", label: "02:00 PM" },
    { id: "15:00", label: "03:00 PM" },
    { id: "16:00", label: "04:00 PM" },
    { id: "17:00", label: "05:00 PM" },
  ];

  // Logic to get slots for the selected day
  const getSlotsForDay = () => {
    if (!selectedDate) return [];
    
    const dayNum = new Date(selectedDate).getDay();
    const hasAnyCustomAvailability = availability.length > 0;
    
    if (hasAnyCustomAvailability) {
      const daySlots = availability.filter(a => a.dayOfWeek === dayNum && a.isAvailable);
      
      const generatedSlots = [];
      daySlots.forEach(slot => {
        const startHour = parseInt(slot.startTime.split(":")[0]);
        const endHour = parseInt(slot.endTime.split(":")[0]);
        
        for (let h = startHour; h < endHour; h++) {
          const timeStr = `${h.toString().padStart(2, "0")}:00`;
          const label = h < 12 ? `${h}:00 AM` : h === 12 ? `12:00 PM` : `${h - 12}:00 PM`;
          generatedSlots.push({ id: timeStr, label });
        }
      });
      return generatedSlots.sort((a, b) => a.id.localeCompare(b.id));
    } else {
      return defaultSlots;
    }
  };

  const slots = getSlotsForDay();
  const now = new Date();
  const isToday = selectedDate && isSameDay(new Date(selectedDate), now);

  return (
    <div className="bg-[#0e172c]/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-5">
        <Clock size={20} className="text-teal-400" />
        <h3 className="text-base font-bold text-white tracking-tight">Select Time Slot</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {slots.map((slot) => {
          const isSelected = selectedTime === slot.id;
          
          let isPast = false;
          if (isToday) {
            const slotTime = parse(slot.id, "HH:mm", new Date(selectedDate));
            isPast = !isAfter(slotTime, now);
          }

          return (
            <button
              key={slot.id}
              disabled={isPast}
              onClick={() => onSelectTime(slot.id)}
              className={`py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? "bg-teal-600 border-teal-400 text-white shadow-lg shadow-teal-600/30 scale-105"
                  : isPast
                  ? "bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-40"
                  : "bg-[#090f1d] border-slate-700/80 text-slate-300 hover:border-teal-500/50 hover:bg-slate-800/60"
              }`}
            >
              {slot.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotPicker;
