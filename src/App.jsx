import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./component/Login";
import Signup from "./component/Signup";
import Dashboard from "./component/Dashboard/Dashboard";
import CategoryClothes from "./component/Section/CategoryClothes";
import MainLayout from "./component/Sidebar/MainLayout";
import Admin from "./component/Admin";
import AdminDashboard from "./component/AdminDashboard/AdminDashboard";
import DetailProf from "./component/DetailedProfile/DetailProf";
import Payment from "./component/Payment/Payment";

// ✅ Admin protection component
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    return <Navigate to="/admin/login" replace />;  // ✅ redirect to admin login
  }
  return children;
}

function App() {
  return (
    <Router>
      <Routes>

        {/* ✅ Home opens directly without login */}
        <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />

        {/* ✅ Auth pages */}
      {/* ✅ Auth pages */}
<Route path="/login" element={<Login />} />
<Route path="/admin/login" element={<Login />} />
<Route path="/Signup" element={<Signup />} />

        {/* ✅ Public pages */}
        <Route path="/home" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/detailprof/:id" element={<DetailProf />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/category/:category" element={<MainLayout><CategoryClothes /></MainLayout>} />

        {/* 🔒 Admin only pages */}
        <Route path="/Admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/edit/:id" element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        } />

      </Routes>
    </Router>
  );
}

export default App;