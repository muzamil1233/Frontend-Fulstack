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


// 🔐 User Protected Route
const UserRoute = ({ children }) => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


// 🔐 Admin Protected Route
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};


function App() {
  return (
    <Router>
      <Routes>

        {/* 🔓 Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />


        {/* 🔐 User Protected Routes */}
        <Route 
          path="/" 
          element={
            <UserRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </UserRoute>
          } 
        />

        <Route 
          path="/home" 
          element={
            <UserRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </UserRoute>
          } 
        />

        <Route 
          path="/detailprof/:id" 
          element={
            <UserRoute>
              <DetailProf />
            </UserRoute>
          } 
        />

        <Route 
          path="/payment/:id" 
          element={
            <UserRoute>
              <Payment />
            </UserRoute>
          } 
        />

        <Route 
          path="/payment" 
          element={
            <UserRoute>
              <Payment />
            </UserRoute>
          } 
        />

        <Route 
          path="/category/:category" 
          element={
            <UserRoute>
              <MainLayout>
                <CategoryClothes />
              </MainLayout>
            </UserRoute>
          } 
        />


        {/* 🔒 Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />

        <Route 
          path="/admin/edit/:id" 
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } 
        />


        {/* ❌ Catch all */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;
