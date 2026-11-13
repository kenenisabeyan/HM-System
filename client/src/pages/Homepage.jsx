import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import {
  Calendar,
  LayoutDashboard,
  User,
  Clock,
  CheckCircle,
  FileText,
  Activity,
  Users,
  Stethoscope,
  Lock,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  Award,
  ChevronRight
} from "lucide-react";

const Homepage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b1224] font-sans text-slate-200 antialiased selection:bg-teal-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-16 lg:py-24 border-b border-slate-900 bg-gradient-to-b from-[#0e172e] to-[#0b1224]">
          {/* Subtle grid pattern & glowing orbs */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-teal-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#1e293b]/30 via-transparent to-transparent rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Call to Action */}
              <div className="lg:col-span-6 text-center lg:text-left space-y-8 max-w-2xl mx-auto lg:mx-0">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider shadow-md">
                  <ShieldCheck size={14} className="text-teal-400" />
                  HIPAA-Compliant Secure Infrastructure
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
                  Smart Healthcare <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400">
                    Management Platform
                  </span>
                </h1>

                <p className="text-lg text-slate-400 leading-relaxed font-light">
                  A comprehensive, high-performance medical operations ecosystem. Empowering patient networks, healthcare specialists, and administration through secure health history, shift workflows, and smart clinical booking.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link
                    to="/login"
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold shadow-lg shadow-teal-500/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                  >
                    <User size={18} />
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-extrabold border border-slate-700/80 hover:border-teal-500/40 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                  >
                    <CheckCircle size={18} />
                    Register
                    <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                {/* Stat badges */}
                <div className="pt-8 border-t border-slate-800 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                  <div>
                    <p className="text-2xl font-black text-teal-400">99.9%</p>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Uptime</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-teal-400">AES-256</p>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Security</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-teal-400">24/7</p>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Support</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Custom Modern Dashboard Mockup */}
              <div className="lg:col-span-6 relative hidden lg:block animate-fade-in">
                <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-[3rem] blur-2xl transform rotate-1 opacity-70"></div>
                
                <div className="relative bg-[#0d1527] border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden min-h-[500px]">
                  <div className="grid grid-cols-[200px_1fr] h-full min-h-[500px]">
                    {/* Mock Sidebar */}
                    <div className="border-r border-slate-800/80 p-5 bg-[#090e1b] flex flex-col justify-between">
                      <div className="space-y-8">
                        <div className="flex items-center gap-2 px-2">
                          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                            <Activity size={16} className="text-teal-400 font-bold" />
                          </div>
                          <span className="font-extrabold text-white text-sm tracking-tight">
                            HealthFlow
                          </span>
                        </div>

                        <div className="space-y-1">
                          <MockNavItem icon={<LayoutDashboard size={16} />} active>
                            Dashboard
                          </MockNavItem>
                          <MockNavItem icon={<User size={16} />}>
                            Profile
                          </MockNavItem>
                          <MockNavItem icon={<Calendar size={16} />}>
                            Book Appointment
                          </MockNavItem>
                          <MockNavItem icon={<Clock size={16} />}>
                            My Appointments
                          </MockNavItem>
                          <MockNavItem icon={<FileText size={16} />}>
                            My Records
                          </MockNavItem>
                          <MockNavItem icon={<Stethoscope size={16} />}>
                            My Prescriptions
                          </MockNavItem>
                        </div>
                      </div>
                    </div>

                    {/* Mock Dashboard content */}
                    <div className="p-6 bg-[#0c1222] flex flex-col justify-between">
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-base font-bold text-white tracking-tight">Hospital Dashboard</h3>
                            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Daily operations overview</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700/60"></div>
                        </div>

                        <div className="space-y-3">
                          <ActivityCard
                            icon={<Users size={14} />}
                            title="New Patient Registered"
                            time="Just now"
                            color="bg-teal-500/10 text-teal-400 border border-teal-500/20"
                          />
                          <ActivityCard
                            icon={<Calendar size={14} />}
                            title="Doctor Availability Updated"
                            time="10 mins ago"
                            color="bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          />
                          <ActivityCard
                            icon={<CheckCircle size={14} />}
                            title="Appointment Confirmed"
                            time="25 mins ago"
                            color="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          />
                          <ActivityCard
                            icon={<FileText size={14} />}
                            title="Medical Record Added"
                            time="1 hour ago"
                            color="bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATISTICS SECTION */}
        <section className="py-16 bg-[#090e1a] border-y border-slate-900">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800">
              <StatCard value="250+" label="Patients Served" />
              <StatCard value="40+" label="Specialist Doctors" />
              <StatCard value="500+" label="Appointments" />
              <StatCard value="24/7" label="Emergency Support" />
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-24 bg-[#0b1224] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3">Capabilities</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                Everything Needed for Modern Hospital Operations
              </h3>
              <p className="text-lg text-slate-400 font-light">
                Our comprehensive platform streamlines every aspect of hospital management, from patient check-in to clinical documentation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Users />}
                title="Manage Patients"
                desc="Comprehensive patient profiles, history tracking, and demographic management in a secure environment."
              />
              <FeatureCard
                icon={<Clock />}
                title="Doctor Scheduling"
                desc="Manage complex shifts, leave requests, and real-time clinic availability instantly."
              />
              <FeatureCard
                icon={<Calendar />}
                title="Appointment Management"
                desc="Intelligent self-booking system with automated reminders and instant scheduling workflows."
              />
              <FeatureCard
                icon={<FileText />}
                title="Medical Records"
                desc="Secure digital records for diagnoses, lab results, and seamless clinical documentation."
              />
              <FeatureCard
                icon={<LayoutDashboard />}
                title="Admin Dashboard"
                desc="Full visibility into hospital metrics, staff performance, and patient flow dynamics."
              />
              <FeatureCard
                icon={<Activity />}
                title="Centralized Operations"
                desc="Keep all hospital data perfectly synchronized across medical departments and devices."
              />
            </div>
          </div>
        </section>

        {/* TEAM PORTRAITS SECTION */}
        <section className="py-24 bg-[#090e1a] border-t border-slate-900">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider">
                <Award size={14} /> Team Creators
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Project Creators & Developers
              </h2>
              <p className="text-slate-400 font-light text-lg">
                CSE ASTU Student Web Programming Team Project
              </p>
            </div>

            {/* Premium Compact Team Pill Grid */}
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
              <TeamCard name="Bekam Genene" id="UGR/30253/15" github="Bekamgenene" initials="BG" />
              <TeamCard name="Begonet Debebe" id="UGR/30244/15" github="bego-net" initials="BD" />
              <TeamCard name="Endrias Eshetu" id="UGR/30469/15" github="EndriasEshetu" initials="EE" />
              <TeamCard name="Kenenisa Beyan" id="UGR/30772/15" github="kenenisabeyan" initials="KB" />
              <TeamCard name="Yeabsira Goitom" id="UGR/31390/15" github="yeabsira23" initials="YG" />
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 bg-[#0b1224]">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="bg-gradient-to-r from-teal-600/90 to-blue-700/90 rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full"></div>
              
              <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight leading-tight">
                  Start Managing Your Hospital Smarter Today
                </h2>
                <p className="text-slate-100 text-lg font-light leading-relaxed">
                  Join our network of modern healthcare providers and experience the future of clinical management.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  <Link
                    to="/register"
                    className="bg-white text-slate-950 font-black px-8 py-4 rounded-xl hover:bg-slate-100 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group"
                  >
                    Get Started for Free
                    <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => {
  return (
    <div className="bg-[#0e162a]/60 border border-slate-800/80 rounded-[2rem] p-8 hover:shadow-2xl hover:shadow-teal-500/5 transition-all duration-500 hover:border-teal-500/20 group hover:-translate-y-1">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 border bg-teal-500/10 text-teal-400 border-teal-500/20 group-hover:bg-teal-500 group-hover:text-slate-950 group-hover:border-teal-500">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed font-light text-sm">{desc}</p>
    </div>
  );
};

const StatCard = ({ value, label }) => (
  <div className="text-center px-4 py-2">
    <p className="text-4xl md:text-5xl font-black text-teal-400 mb-2 tracking-tight">{value}</p>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
      {label}
    </p>
  </div>
);

const MockNavItem = ({ icon, children, active }) => (
  <div
    className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 cursor-pointer transition-all duration-300 ${
      active
        ? "bg-teal-500/20 text-teal-400 border border-teal-500/30 font-bold"
        : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
    }`}
  >
    <div className="shrink-0">{icon}</div>
    <span className="text-xs">{children}</span>
  </div>
);

const ActivityCard = ({ icon, title, time, color }) => (
  <div className="bg-[#090e1b] border border-slate-850 rounded-xl p-3 flex items-center gap-3 shadow-sm hover:border-slate-800 transition-colors">
    <div
      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs ${color}`}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-slate-250 text-xs font-semibold truncate">{title}</h4>
      <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">
        {time}
      </p>
    </div>
  </div>
);

const TeamCard = ({ name, id, github, initials }) => (
  <div className="bg-[#0e162a]/80 border border-slate-800/80 rounded-full p-2 pr-5 flex items-center gap-4 hover:shadow-lg hover:shadow-teal-500/10 hover:bg-[#111c34] hover:border-teal-500/30 transition-all duration-300 group min-w-[240px]">
    <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center font-black text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all duration-300 shrink-0">
      {initials}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors truncate">{name}</h4>
      <p className="text-[10px] text-slate-400 font-medium truncate">{id}</p>
    </div>
    <a
      href={`https://github.com/${github}`}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-teal-500 hover:text-slate-950 text-slate-200 flex items-center justify-center transition-all duration-300 border border-slate-700/50 hover:border-teal-500 shrink-0"
    >
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    </a>
  </div>
);

export default Homepage;
