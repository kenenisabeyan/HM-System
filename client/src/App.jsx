import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/useAuthStore";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";

import { AdminRoute, DoctorRoute, PatientRoute } from "./components/RoleRoute";

import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import ManagePatients from "./pages/ManagePatients";
import ManageDoctors from "./pages/ManageDoctors";
import ManageAppointments from "./pages/ManageAppointments";

import DoctorLayout from "./components/DoctorLayout";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorMedicalRecords from "./pages/DoctorMedicalRecords";
import DoctorPrescriptions from "./pages/DoctorPrescriptions";
import AvailabilityManager from "./pages/AvailabilityManager";

import PatientLayout from "./components/PatientLayout";
import PatientDashboard from "./pages/PatientDashboard";
import PatientProfile from "./pages/PatientProfile";
import BookingCalendar from "./pages/BookingCalendar";
import MyAppointments from "./pages/MyAppointments";
import MyRecords from "./pages/MyRecords";
import MyPrescriptions from "./pages/MyPrescriptions";

function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#070c18] text-slate-100 selection:bg-teal-500/30 selection:text-teal-200">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="patients" element={<ManagePatients />} />
              <Route path="doctors" element={<ManageDoctors />} />
              <Route path="appointments" element={<ManageAppointments />} />
            </Route>
          </Route>

          <Route element={<DoctorRoute />}>
            <Route path="/doctor" element={<DoctorLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="appointments" element={<DoctorAppointments />} />
              <Route path="medical-records" element={<DoctorMedicalRecords />} />
              <Route path="prescriptions" element={<DoctorPrescriptions />} />
              <Route path="availability" element={<AvailabilityManager />} />
            </Route>
          </Route>

          <Route element={<PatientRoute />}>
            <Route path="/patient" element={<PatientLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="profile" element={<PatientProfile />} />
              <Route path="book" element={<BookingCalendar />} />
              <Route path="appointments" element={<MyAppointments />} />
              <Route path="records" element={<MyRecords />} />
              <Route path="prescriptions" element={<MyPrescriptions />} />
            </Route>
          </Route>

          <Route
            path="/"
            element={
              user ? (
                user.role === "admin" ? (
                  <Navigate to="/admin/dashboard" />
                ) : user.role === "doctor" ? (
                  <Navigate to="/doctor/dashboard" />
                ) : (
                  <Navigate to="/patient/dashboard" />
                )
              ) : (
                <Homepage />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
