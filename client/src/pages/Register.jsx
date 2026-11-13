import { useState } from "react";
import { useRegister } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  ArrowLeft,
  HeartPulse,
  Activity
} from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerMutation = useRegister();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    registerMutation.mutate({ name, email, password, role });
  };

  return (
    <div className="min-h-screen bg-[#0b1224] flex font-sans text-slate-200 antialiased">
      {/* Left side - Immersive Medical Background Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center border-r border-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950/90 via-[#0d162d]/95 to-slate-950/95 mix-blend-multiply"></div>
        
        <div className="relative z-10 max-w-lg text-center px-12 space-y-6 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-teal-500/10 border border-teal-500/20 mb-4 shadow-xl">
            <HeartPulse className="text-teal-400 animate-pulse" size={40} />
          </div>
          <h3 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
            Create Patient Account
          </h3>
          <p className="text-slate-400 text-lg leading-relaxed font-light">
            Set up your electronic medical profile in minutes to consult specialists, access real-time clinical calendars, and track medication prescriptions.
          </p>
          
          <div className="mt-8 p-4 rounded-2xl bg-teal-500/5 backdrop-blur-md border border-teal-500/10 text-left flex items-center gap-4 max-w-sm mx-auto shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/20 flex items-center justify-center shrink-0">
              <Activity className="text-teal-400" size={20} />
            </div>
            <div>
              <p className="text-white text-xs font-semibold uppercase tracking-wider">Fast Setup</p>
              <p className="text-slate-400 text-sm">Self-service digital onboarding in 3 steps.</p>
            </div>
          </div>
        </div>
        
        {/* Glow particles */}
        <div className="absolute top-0 left-0 -ml-32 -mt-32 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 -mr-32 -mb-32 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl"></div>
      </div>

      {/* Right side - Dark Mode Form Card */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 relative py-12 bg-[#0b1224]">
        <button
          onClick={() => navigate("/")}
          className="absolute top-8 right-8 sm:right-16 flex items-center gap-2 text-slate-500 hover:text-teal-400 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-semibold">Back to Home</span>
        </button>

        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <div className="flex justify-center lg:justify-start mb-6 lg:hidden">
              <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center border border-teal-500/20">
                <HeartPulse className="text-teal-400" size={28} />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
            <p className="text-slate-400 text-sm">
              Sign up and register your health panel.
            </p>
          </div>

          {registerMutation.isError && (
            <div className="p-4 text-sm text-red-400 bg-red-950/20 border border-red-900/50 rounded-2xl flex items-start gap-3 shadow-md">
              <Activity className="shrink-0 mt-0.5 text-red-400" size={16} />
              <span>{registerMutation.error.response?.data?.message || "An error occurred during registration. Please try again."}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-300">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                </div>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-2.5 bg-[#0e162a] border border-slate-800/80 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 text-white placeholder-slate-600 transition-all shadow-sm font-medium"
                  placeholder="Endrias"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-300">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-2.5 bg-[#0e162a] border border-slate-800/80 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 text-white placeholder-slate-600 transition-all shadow-sm font-medium"
                  placeholder="endrias@gmail.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-300">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                  </div>
                  <input
                    name="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-11 pr-10 py-2.5 bg-[#0e162a] border border-slate-800/80 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 text-white placeholder-slate-600 transition-all shadow-sm font-medium"
                    placeholder="Create password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-500 hover:text-slate-300 transition-colors" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500 hover:text-slate-300 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-300">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                  </div>
                  <input
                    name="confirm-password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full pl-11 pr-10 py-2.5 bg-[#0e162a] border border-slate-800/80 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 text-white placeholder-slate-600 transition-all shadow-sm font-medium"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-500 hover:text-slate-300 transition-colors" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500 hover:text-slate-300 transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-300">
                Account Type
              </label>
              <div className="relative group">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0e162a] border border-slate-800/80 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 text-white transition-all appearance-none shadow-sm cursor-pointer font-medium"
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Administrator</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="flex items-center text-sm pt-2 pb-3">
              <label className="flex items-center space-x-2 cursor-pointer text-slate-400">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                  className="w-4 h-4 rounded border-slate-800 bg-[#0e162a] text-teal-500 focus:ring-teal-500 focus:ring-offset-0"
                />
                <span>
                  I agree to the{" "}
                  <a href="#" className="font-semibold text-teal-400 hover:text-teal-300 hover:underline">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-semibold text-teal-400 hover:text-teal-300 hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Register button matches the exact blue accent button from the original screenshot! */}
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full py-3.5 font-extrabold text-slate-950 bg-teal-500 rounded-xl hover:bg-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-500/20 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 transition-all shadow-lg shadow-teal-500/10"
            >
              {registerMutation.isPending ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-sm text-center text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-teal-400 hover:text-teal-300 transition-colors"
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
