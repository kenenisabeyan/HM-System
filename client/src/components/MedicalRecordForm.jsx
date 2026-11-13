import { useState } from "react";
import { useCreateMedicalRecord } from "../hooks/useDoctor";
import { X, ClipboardList, Plus, Trash2, Save } from "lucide-react";

const MedicalRecordForm = ({ appointment, onClose }) => {
  const [formData, setFormData] = useState({
    symptoms: [""],
    diagnosis: "",
    notes: ""
  });

  const createMutation = useCreateMedicalRecord();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSymptomChange = (index, value) => {
    const newSymptoms = [...formData.symptoms];
    newSymptoms[index] = value;
    setFormData(prev => ({ ...prev, symptoms: newSymptoms }));
  };

  const addSymptom = () => {
    setFormData(prev => ({ ...prev, symptoms: [...prev.symptoms, ""] }));
  };

  const removeSymptom = (index) => {
    const newSymptoms = formData.symptoms.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, symptoms: newSymptoms }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.diagnosis || !formData.notes) {
      alert("Diagnosis and Clinical Notes are required.");
      return;
    }

    createMutation.mutate({
      appointmentId: appointment._id,
      patientId: appointment.patientId?._id,
      symptoms: formData.symptoms.filter(s => s.trim() !== ""),
      diagnosis: formData.diagnosis,
      notes: formData.notes
    }, {
      onSuccess: () => {
        alert("Medical record created successfully!");
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0d162b] rounded-2xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden border border-slate-800 animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-[#090f1d]">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ClipboardList size={18} className="text-teal-400" />
            Create Medical Record
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
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

            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Reported Symptoms
                </label>
                <button 
                  type="button" 
                  onClick={addSymptom}
                  className="text-xs bg-teal-500/10 text-teal-300 px-2.5 py-1 rounded-lg hover:bg-teal-500/20 transition-all border border-teal-500/20 font-semibold inline-flex items-center gap-1"
                >
                  <Plus size={12} /> Add Symptom
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {formData.symptoms.map((symptom, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={symptom}
                      onChange={(e) => handleSymptomChange(index, e.target.value)}
                      placeholder={`Symptom #${index + 1}`}
                      className="flex-1 bg-[#090f1d] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                    />
                    {formData.symptoms.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeSymptom(index)}
                        className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Diagnosis *</label>
              <input
                type="text"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                required
                placeholder="Enter final physician diagnosis..."
                className="w-full bg-[#090f1d] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Clinical Observations & Notes *</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Detailed clinical evaluation, observations, and recommendations..."
                className="w-full bg-[#090f1d] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all resize-none"
              />
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-800/80">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
              >
                <Save size={16} />
                {createMutation.isPending ? "Saving..." : "Save Medical Record"}
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

export default MedicalRecordForm;
