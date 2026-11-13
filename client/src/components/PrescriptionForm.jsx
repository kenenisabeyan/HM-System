import { useState } from "react";
import { useCreatePrescription } from "../hooks/useDoctor";
import { X, FilePlus, Plus, Trash2, Pill, Save } from "lucide-react";

const PrescriptionForm = ({ appointment, onClose }) => {
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", duration: "", instructions: "" }
  ]);

  const createMutation = useCreatePrescription();

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...medicines];
    newMedicines[index][field] = value;
    setMedicines(newMedicines);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", duration: "", instructions: "" }]);
  };

  const removeMedicine = (index) => {
    const newMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(newMedicines);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const isValid = medicines.every(med => med.name && med.dosage && med.duration);
    if (!isValid) {
      alert("Medicine name, dosage, and duration are required for all entries.");
      return;
    }

    createMutation.mutate({
      appointmentId: appointment._id,
      patientId: appointment.patientId?._id,
      medicines
    }, {
      onSuccess: () => {
        alert("Prescription issued successfully!");
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0d162b] rounded-2xl shadow-2xl w-full max-w-3xl mx-auto overflow-hidden border border-slate-800 animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-[#090f1d]">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FilePlus size={18} className="text-teal-400" />
            Issue Digital Prescription
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[85vh]">
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-[#090f1d] rounded-xl border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-lg font-bold text-teal-300">
                {appointment.patientId?.name?.[0]?.toUpperCase() || "P"}
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Patient Profile</p>
                <p className="text-white font-bold text-sm">{appointment.patientId?.name || "Patient"}</p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Prescribed Medications
                </label>
                <button 
                  type="button" 
                  onClick={addMedicine}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/10 text-teal-300 text-xs font-semibold rounded-xl hover:bg-teal-500/20 transition-all border border-teal-500/20"
                >
                  <Plus size={13} /> Add Medicine
                </button>
              </div>

              <div className="space-y-3">
                {medicines.map((med, index) => (
                  <div key={index} className="p-4 bg-[#090f1d] rounded-xl border border-slate-700/80 relative group animate-in slide-in-from-right-4 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-1 space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase ml-0.5">Medicine Name *</label>
                        <div className="relative">
                          <Pill size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400" />
                          <input
                            type="text"
                            value={med.name}
                            onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                            placeholder="e.g. Amoxicillin"
                            className="w-full bg-[#070c18] border border-slate-700/80 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase ml-0.5">Dosage *</label>
                        <input
                          type="text"
                          value={med.dosage}
                          onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                          placeholder="e.g. 500mg, 1 tablet"
                          className="w-full bg-[#070c18] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase ml-0.5">Duration *</label>
                        <input
                          type="text"
                          value={med.duration}
                          onChange={(e) => handleMedicineChange(index, "duration", e.target.value)}
                          placeholder="e.g. 5 days, 2 weeks"
                          className="w-full bg-[#070c18] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                        />
                      </div>
                    </div>
                    <div className="mt-2.5 space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase ml-0.5">Usage Instructions</label>
                      <input
                        type="text"
                        value={med.instructions}
                        onChange={(e) => handleMedicineChange(index, "instructions", e.target.value)}
                        placeholder="e.g. Take after meals, twice daily with water"
                        className="w-full bg-[#070c18] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>

                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicine(index)}
                        className="absolute -top-2 -right-2 p-1.5 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-all"
                        title="Remove Medicine"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-800/80">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
              >
                <Save size={16} />
                {createMutation.isPending ? "Issuing..." : "Issue Prescription"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-all border border-slate-700 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionForm;
