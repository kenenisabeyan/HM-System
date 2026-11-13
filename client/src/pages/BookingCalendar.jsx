import { useState, useMemo } from "react";
import { Search, Filter, Calendar as CalendarIcon, Stethoscope, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { useDoctors, useBookAppointment } from "../hooks/usePatient";
import { usePublicAvailability } from "../hooks/useAvailability";

import { useNavigate } from "react-router-dom";
import DoctorCard from "../components/DoctorCard";
import DoctorDetailsPanel from "../components/DoctorDetailsPanel";
import TimeSlotPicker from "../components/TimeSlotPicker";
import BookingSummary from "../components/BookingSummary";

const BookingCalendar = () => {
  const navigate = useNavigate();
  const { data: doctors = [], isLoading, isError } = useDoctors();
  const { data: allAvailability = [] } = usePublicAvailability();
  const bookMutation = useBookAppointment();

  // Booking Flow State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [notes, setNotes] = useState("");

  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("All Departments");
  const [filterSpec, setFilterSpec] = useState("All Specializations");

  // Get unique departments and specializations for filters
  const departments = useMemo(() => 
    ["All Departments", ...new Set(doctors.map(d => d.department).filter(Boolean))], 
    [doctors]
  );
  const specializations = useMemo(() => 
    ["All Specializations", ...new Set(doctors.map(d => d.specialization).filter(Boolean))], 
    [doctors]
  );

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const nameMatch = doc.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const deptMatch = filterDept === "All Departments" || doc.department === filterDept;
      const specMatch = filterSpec === "All Specializations" || doc.specialization === filterSpec;
      const isActive = doc.isActive !== false && doc.userId?.isActive !== false;
      return nameMatch && deptMatch && specMatch && isActive;
    });
  }, [doctors, searchQuery, filterDept, filterSpec]);

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleConfirmBooking = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;

    // Combine date and time
    const [hours, minutes] = selectedTime.split(":");
    const appointmentDateTime = new Date(selectedDate);
    appointmentDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    bookMutation.mutate(
      {
        doctorId: selectedDoctor._id,
        appointmentDateTime: appointmentDateTime.toISOString(),
        notes,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            navigate("/patient/appointments");
          }, 1500);
        },
      }
    );
  };

  const resetFlow = () => {
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setNotes("");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <div className="w-10 h-10 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Finding available clinical specialists...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-8 text-center">
        <p className="text-rose-400 font-semibold text-sm">Failed to load doctors directory.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-5 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold rounded-xl border border-rose-500/30 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1">
            <span>Clinical Booking</span>
            {selectedDoctor && (
              <>
                <ChevronRight size={14} className="text-slate-600" />
                <span className="text-white">Dr. {selectedDoctor.userId?.name}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {selectedDoctor ? "Select Consultation Time" : "Book Doctor Appointment"}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {selectedDoctor 
              ? "Choose your preferred date and verified time slot" 
              : "Search by specialist, department, or doctor name"}
          </p>
        </div>
      </div>

      {!selectedDoctor ? (
        <>
          {/* Filters Section */}
          <div className="bg-[#0e172c]/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search doctors by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#090f1d] border border-slate-700/80 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="relative">
                  <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-400 pointer-events-none" />
                  <select
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                    className="bg-[#090f1d] border border-slate-700/80 rounded-xl pl-10 pr-8 py-3 text-sm text-slate-200 outline-none focus:border-teal-500 appearance-none cursor-pointer min-w-[190px]"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <Stethoscope size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-400 pointer-events-none" />
                  <select
                    value={filterSpec}
                    onChange={(e) => setFilterSpec(e.target.value)}
                    className="bg-[#090f1d] border border-slate-700/80 rounded-xl pl-10 pr-8 py-3 text-sm text-slate-200 outline-none focus:border-teal-500 appearance-none cursor-pointer min-w-[190px]"
                  >
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc) => (
                <DoctorCard 
                  key={doc._id} 
                  doctor={doc} 
                  onSelect={handleSelectDoctor} 
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-[#0e172c]/90 border border-dashed border-slate-800 rounded-2xl backdrop-blur-sm">
                <div className="inline-flex p-4 rounded-2xl bg-teal-500/10 text-teal-400 mb-4 border border-teal-500/20">
                  <Search size={28} />
                </div>
                <h3 className="text-base font-bold text-white">No doctors found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Try adjusting your filters or search keywords to find an available specialist.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-10">
          {/* Step 1 & 2: Doctor Details & Date Selection */}
          <DoctorDetailsPanel 
            doctor={selectedDoctor} 
            onBack={resetFlow}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            availability={allAvailability.filter(a => a.businessId?._id === selectedDoctor.userId?._id)}
          />

          {/* Step 3: Time Selection */}
          {selectedDate && (
            <TimeSlotPicker 
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
              availability={allAvailability.filter(a => a.businessId?._id === selectedDoctor.userId?._id)}
            />
          )}

          {/* Step 4: Summary & Booking */}
          {selectedTime && (
            <div className="max-w-2xl mx-auto">
              {bookMutation.isSuccess && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-center gap-3 text-emerald-300 animate-in fade-in slide-in-from-top-4 shadow-lg">
                  <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                  <p className="font-semibold text-sm">Appointment confirmed successfully! Redirecting...</p>
                </div>
              )}
              {bookMutation.isError && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex items-center gap-3 text-rose-300 animate-in fade-in slide-in-from-top-4 shadow-lg">
                  <XCircle size={20} className="text-rose-400 shrink-0" />
                  <p className="font-semibold text-sm">{bookMutation.error.response?.data?.message || "Booking failed. Please try another slot."}</p>
                </div>
              )}
              
              <BookingSummary 
                doctor={selectedDoctor}
                date={selectedDate}
                time={selectedTime}
                notes={notes}
                setNotes={setNotes}
                onConfirm={handleConfirmBooking}
                isBooking={bookMutation.isPending}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
