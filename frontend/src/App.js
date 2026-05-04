import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DriverDashboard from "./pages/driver/DriverDashboard";
import DriversPage from "./pages/admin/DriversPage";
import DriverVehicles from "./pages/driver/DriverVehicles";
import AuthGuard from "./components/AuthGuard";
import { GlobalStyle } from "./styles/GlobalStyle";
import AdminLayout from "./layouts/AdminLayout";
import DriverLayout from "./layouts/DriverLayout";
import VehiclesPage from "./pages/admin/VehiclesPage";
import EarningsPage from "./pages/admin/Earnings/EarningsPage";
import DriverEarningsPage from "./pages/driver/DriverEarningsPage";
import InvoicesPage from "./pages/admin/InvoicesPage";

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />

      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AuthGuard allowedRole="admin">
              <AdminLayout />
            </AuthGuard>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="drivers" element={<DriversPage />} />   {/* 👈 ADMIN DRIVER PAGE */}
          <Route path="vehicles" element={<VehiclesPage />} />
		  <Route path="earnings" element={<EarningsPage />} />
		  <Route path="invoices" element={<InvoicesPage />} />
/>
        </Route>

        {/* DRIVER – AYRI PANEL */}
        <Route path="/driver" element={ <DriverLayout /> } >
          <Route index element={<DriverDashboard />} />
		  <Route path="earnings" element={<DriverEarningsPage />} />
          <Route path="vehicles" element={<DriverVehicles />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;


