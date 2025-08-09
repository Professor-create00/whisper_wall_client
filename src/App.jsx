
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useLocation
// } from "react-router-dom";
// import OrgAccess from "./pages/OrgAccess.jsx";
// import AdminDashboard from "./pages/AdminDashboard.jsx";
// import UserDashboard from "./pages/UserDashboard.jsx";
// function Header() {
//   const user = JSON.parse(localStorage.getItem("user"));
//   return (
//     <header className="w-full bg-white shadow p-4 flex justify-between items-center">
//       <h1 className="text-xl font-semibold text-purple-600 flex items-center gap-2">
//         <span>💬</span> Whisper Wall
//       </h1>
//       {user?.role === "admin" && (
//         <div className="flex gap-2">
//           <button
//             onClick={() => (window.location.href = "/user-dashboard")}
//             className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
//           > 
//           App
//           </button>
//           <button
//             onClick={() => (window.location.href = "/admin")}
//             className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
//             Admin Panel
//           </button>
//         </div>
//       )}
//     </header>
//   );
// }
// function AppLayout() {
//   const location = useLocation();
//   const hideHeaderOn = ["/"];
//   const user = JSON.parse(localStorage.getItem("user"));
//   const showHeader =
//   user?.role === "admin" && !hideHeaderOn.includes(location.pathname);
//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center">
//       {showHeader && <Header />}
//       <main className="flex-1 w-full p-4">
//         <Routes>
//           <Route path="/" element={<OrgAccess />} />
//           <Route path="/admin" element={<AdminDashboard />} />
//           <Route path="/user-dashboard" element={<UserDashboard />} />
//         </Routes>
//       </main>
//     </div>
//   );
// }
// export default function App() {
//   return (
//     <Router>
//       <AppLayout />
//     </Router>
//   );
// };



import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import OrgAccess from "./pages/OrgAccess.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";

function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white shadow p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
      {/* Logo / Title */}
      <h1 className="text-xl font-semibold text-purple-600 flex items-center gap-2">
        <span>💬</span> Whisper Wall
      </h1>

      {/* Admin Buttons */}
      {user?.role === "admin" && (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => navigate("/user-dashboard")}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 w-full sm:w-auto"
          >
            App
          </button>
          <button
            onClick={() => navigate("/admin")}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 w-full sm:w-auto"
          >
            Admin Panel
          </button>
        </div>
      )}
    </header>
  );
}
function AppLayout() {
  const location = useLocation();
  const hideHeaderOn = ["/"];
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const showHeader =
    user?.role === "admin" && !hideHeaderOn.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {showHeader && <Header />}
      <main className="flex-1 w-full p-4">
        <Routes>
          <Route
            path="/"
            element={
              token ? (
                user?.role === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/user-dashboard" replace />
                )
              ) : (
                <OrgAccess />
              )
            }
          />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
