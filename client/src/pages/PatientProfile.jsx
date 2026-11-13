import { useState, useEffect } from "react";
import { usePatientProfile, useUpdatePatientProfile } from "../hooks/usePatient";
import { User, Mail, Phone, MapPin, Hash, UserCircle, Droplets, Save, Edit3, X, CheckCircle2 } from "lucide-react";

const PatientProfile = () => {
  const { data: profile, isLoading, isError } = usePatientProfile();
  const updateMutation = useUpdatePatientProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    address: "",
  });

  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        age: profile.age || "",
        gender: profile.gender || "",
        bloodGroup: profile.bloodGroup || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData, {
      onSuccess: () => {
        setIsEditing(false);
        setSuccessMsg("Profile updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3500);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <div className="w-10 h-10 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Loading patient profile...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-rose-400 bg-rose-500/5 border border-rose-500/20 rounded-2xl p-8">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <User className="text-teal-400" size={28} />
            Patient Health Profile
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Maintain your health demographics, emergency contact, and clinical attributes
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-teal-600/25 hover:shadow-teal-500/35 transition-all hover:-translate-y-0.5"
          >
            <Edit3 size={16} />
            Edit Profile
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-3.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-[#0e172c]/90 rounded-2xl border border-slate-800/80 p-6 shadow-xl sticky top-8 text-center backdrop-blur-sm">
            <div className="w-20 h-20 bg-teal-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-teal-500/20 shadow-lg shadow-teal-500/10">
              <User size={40} className="text-teal-400" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{profile.userId?.name}</h2>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-teal-300 bg-teal-500/10 border border-teal-500/20 mt-1.5">
              Verified Patient
            </span>
            <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3 text-left">
              <div className="flex items-center gap-3 text-slate-400 text-xs">
                <Mail size={15} className="text-teal-400 shrink-0" />
                <span className="truncate">{profile.userId?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-xs">
                <Hash size={15} className="text-teal-400 shrink-0" />
                <span className="font-mono text-teal-300 font-semibold">{profile.patientId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-[#0e172c]/90 rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden backdrop-blur-sm">
            <div className="p-5 border-b border-slate-800/80 bg-[#090f1d] flex items-center justify-between">
              <h3 className="text-base font-bold text-white tracking-tight">Clinical & Contact Demographics</h3>
              {isEditing && (
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider animate-pulse">Editing Mode</span>
              )}
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <UserCircle size={14} className="text-teal-400" /> Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-[#090f1d] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-40 transition-all"
                    placeholder="e.g. 28"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <User size={14} className="text-teal-400" /> Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-[#090f1d] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500 disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Droplets size={14} className="text-teal-400" /> Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-[#090f1d] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500 disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Phone size={14} className="text-teal-400" /> Contact Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-[#090f1d] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-40 transition-all"
                    placeholder="+251 ..."
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <MapPin size={14} className="text-teal-400" /> Permanent Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows="3"
                  className="w-full bg-[#090f1d] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-40 transition-all resize-none"
                  placeholder="Street, District, City"
                />
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4 border-t border-slate-800/80">
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                  >
                    <Save size={16} />
                    {updateMutation.isPending ? "Saving..." : "Save Profile Details"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl border border-slate-700 transition-all text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
