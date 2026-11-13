import { useState } from "react";
import { useCreateMedicalRecord } from "../hooks/useDoctor";
import { ClipboardList, CheckCircle2, AlertCircle, X } from "lucide-react";

const AddRecordModal = ({ appointment, onClose }) => {
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  
  const createRecordMutation = useCreateMedicalRecord();

  const handleSubmit = (e) => {
    e.preventDefault();
    createRecordMutation.mutate(
      {
        patientId: appointment.patientId._id,
        appointmentId: appointment._id,
        symptoms: symptoms.split(",").map(s => s.trim()).filter(s => s),
        diagnosis,
        notes,
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
      <div className="bg-[#0d162b] rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden border border-slate-800 animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-teal-600 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 text-white">
            <ClipboardList size={18} />
            <h2 className="text-base font-bold tracking-tight">Add Medical Record</h2>
          </div>
          <button onClick={onClose} className="text-teal-100 hover:text-white p-1 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {createRecordMutation.isSuccess && (
            <div className="p-3 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Medical record added successfully!</span>
            </div>
          )}

          {createRecordMutation.isError && (
            <div className="p-3 text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-400 shrink-0" />
              <span>{createRecordMutation.error.response?.data?.message || "Failed to add record"}</span>
            </div>
          )}

          <div className="bg-[#090f1d] p-3.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">Patient: </span>
            <span className="font-semibold text-white">{appointment.patientId?.name}</span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Symptoms (comma-separated)</label>
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Fever, Cough, Fatigue"
              className="w-full px-3.5 py-2.5 bg-[#090f1d] border border-slate-700/80 text-slate-100 rounded-xl text-xs placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Diagnosis *</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
              placeholder="e.g. Acute Bronchitis"
              className="w-full px-3.5 py-2.5 bg-[#090f1d] border border-slate-700/80 text-slate-100 rounded-xl text-xs placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Clinical Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Clinical observations and advice..."
              className="w-full px-3.5 py-2.5 bg-[#090f1d] border border-slate-700/80 text-slate-100 rounded-xl text-xs placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 resize-none"
            ></textarea>
          </div>

          <div className="flex gap-3 pt-3 border-t border-slate-800/80">
            <button
              type="submit"
              disabled={createRecordMutation.isPending || createRecordMutation.isSuccess}
              className="flex-1 py-3 bg-teal-600 text-white text-xs font-semibold rounded-xl hover:bg-teal-500 disabled:opacity-50 transition-all shadow-lg shadow-teal-600/25"
            >
              {createRecordMutation.isPending ? "Saving..." : "Save Record"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={createRecordMutation.isPending}
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

export default AddRecordModal;
