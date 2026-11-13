import { useState } from "react";
import { useCreatePrescription } from "../hooks/useDoctor";
import { Plus, Trash2, Pill, CheckCircle2, AlertCircle, X } from "lucide-react";

const IssuePrescriptionModal = ({ appointment, onClose }) => {
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", duration: "", instructions: "" }
  ]);
  
  const createPrescriptionMutation = useCreatePrescription();

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", duration: "", instructions: "" }]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const newMedicines = [...medicines];
    newMedicines[index][field] = value;
    setMedicines(newMedicines);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validMedicines = medicines.filter(m => m.name.trim() !== "");
    
    if (validMedicines.length === 0) {
      alert("Please add at least one medicine.");
      return;
    }

    createPrescriptionMutation.mutate(
      {
        patientId: appointment.patientId._id,
        appointmentId: appointment._id,
        medicines: validMedicines,
      },
      {
        onSuccess: () => {
          setTimeout(onClose, 1000);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0d162b] rounded-2xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden border border-slate-800 animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-teal-600 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2 text-white">
            <Pill size={18} />
            <h2 className="text-base font-bold tracking-tight">Issue Digital Prescription</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={handleAddMedicine} 
              className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus size={14} /> Add Medicine
            </button>
            <button onClick={onClose} className="text-teal-100 hover:text-white p-1 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {createPrescriptionMutation.isSuccess && (
            <div className="p-3 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Prescription issued successfully!</span>
            </div>
          )}

          {createPrescriptionMutation.isError && (
            <div className="p-3 text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-400 shrink-0" />
              <span>{createPrescriptionMutation.error.response?.data?.message || "Failed to issue prescription"}</span>
            </div>
          )}

          <div className="bg-[#090f1d] p-3.5 rounded-xl border border-slate-800 text-xs sticky top-0 z-10">
            <span className="text-slate-400">Patient: </span>
            <span className="font-semibold text-white">{appointment.patientId?.name}</span>
          </div>

          <div className="space-y-3">
            {medicines.map((med, index) => (
              <div key={index} className="p-4 bg-[#090f1d] border border-slate-700/80 rounded-xl relative group">
                {medicines.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveMedicine(index)} 
                    className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Medicine Name *</label>
                    <input
                      type="text"
                      value={med.name}
                      onChange={(e) => handleChange(index, 'name', e.target.value)}
                      required
                      placeholder="e.g. Amoxicillin"
                      className="w-full px-3.5 py-2 bg-[#070c18] border border-slate-700/80 text-slate-100 rounded-xl text-xs placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Dosage *</label>
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) => handleChange(index, 'dosage', e.target.value)}
                      required
                      placeholder="e.g. 500mg, 1 tablet"
                      className="w-full px-3.5 py-2 bg-[#070c18] border border-slate-700/80 text-slate-100 rounded-xl text-xs placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Duration *</label>
                    <input
                      type="text"
                      value={med.duration}
                      onChange={(e) => handleChange(index, 'duration', e.target.value)}
                      required
                      placeholder="e.g. 7 Days"
                      className="w-full px-3.5 py-2 bg-[#070c18] border border-slate-700/80 text-slate-100 rounded-xl text-xs placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Instructions</label>
                    <input
                      type="text"
                      value={med.instructions}
                      onChange={(e) => handleChange(index, 'instructions', e.target.value)}
                      placeholder="e.g. Take after meals, twice daily"
                      className="w-full px-3.5 py-2 bg-[#070c18] border border-slate-700/80 text-slate-100 rounded-xl text-xs placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-3 border-t border-slate-800/80">
            <button
              type="submit"
              disabled={createPrescriptionMutation.isPending || createPrescriptionMutation.isSuccess}
              className="flex-1 py-3 bg-teal-600 text-white text-xs font-semibold rounded-xl hover:bg-teal-500 disabled:opacity-50 transition-all shadow-lg shadow-teal-600/25"
            >
              {createPrescriptionMutation.isPending ? "Issuing..." : "Issue Prescription"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={createPrescriptionMutation.isPending}
              className="flex-1 py-3 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700 hover:text-white transition-all border border-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssuePrescriptionModal;
