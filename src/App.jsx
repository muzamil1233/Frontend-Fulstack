import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import Signup from "./component/Signup";
import Dashboard from "./component/Dashboard/Dashboard";
import CategoryClothes from "./component/Section/CategoryClothes";
import MainLayout from "./component/Sidebar/MainLayout";
import Admin from "./component/Admin";
import AdminDashboard from "./component/AdminDashboard/AdminDashboard";
import DetailProf from "./component/DetailedProfile/DetailProf";
import Payment from "./component/Payment/Payment";
// import MainLayout from "./component/Layout/MainLayout"; // ✅ import layout

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />

        {/* Private / layout pages */}
        <Route
          path="/home"
          element={
            <MainLayout>
              <Dashboard />
              </MainLayout >
            // </MainLayout>
          }
        />
        <Route
          path="/Admin"
          element={
          //  <Admin />
          <AdminDashboard />
          }
        />
     
          <Route path="/admin/edit/:id" element={<Admin />} />
          <Route path="/payment/:id" element={<Payment />} />

          <Route path="/payment" element={<Payment />} />
        
          
        <Route
          path="/category/:category"
          element={
            <MainLayout>
              <CategoryClothes />
            </MainLayout>
          }
        />
        <Route path="/detailprof/:id" element={<DetailProf />} />
      </Routes>
    </Router>
  );
}

export default App;
