import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { Menu, X, Calendar, LogOut, LayoutDashboard, FileText, Pill, User, PlusCircle, HeartPulse } from "lucide-react";

const navItems = [
  {
    to: "/patient/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    to: "/patient/profile",
    label: "Profile",
    icon: <User size={20} />,
  },
  {
    to: "/patient/book",
    label: "Book Appointment",
    icon: <PlusCircle size={20} />,
  },
  {
    to: "/patient/appointments",
    label: "My Appointments",
    icon: <Calendar size={20} />,
  },
  {
    to: "/patient/records",
    label: "My Records",
    icon: <FileText size={20} />,
  },
  {
    to: "/patient/prescriptions",
    label: "My Prescriptions",
    icon: <Pill size={20} />,
  },
];

const PatientLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-[#070c18] font-sans text-slate-100 relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-72 bg-[#0b1325]/95 backdrop-blur-xl shadow-2xl flex flex-col border-r border-slate-800/80 z-50 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex justify-between items-center bg-[#090f1d]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shadow-lg shadow-teal-500/10">
              <HeartPulse className="text-teal-400" size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white tracking-tight">
                  Health<span className="text-teal-400">Care</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/20">
                  Patient
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[150px]">
                {user?.name}
              </p>
            </div>
          </div>
          <button
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 mt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm shadow-teal-500/10 font-semibold"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-[#090f1d]/40 space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 text-xs font-bold shrink-0">
              {user?.name?.[0]?.toUpperCase() || "P"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-400 bg-rose-500/10 rounded-xl hover:bg-rose-500/20 border border-rose-500/20 transition-all hover:border-rose-500/40"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden bg-[#070c18]">
        {/* Mobile Header */}
        <header className="md:hidden bg-[#0b1325] p-4 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-lg"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2">
              <HeartPulse className="text-teal-400" size={18} />
              <span className="font-bold text-white text-sm">Health<span className="text-teal-400">Care</span></span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 text-xs font-bold">
            {user?.name?.[0]?.toUpperCase() || "P"}
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#070c18] relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PatientLayout;
