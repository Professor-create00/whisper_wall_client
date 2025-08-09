


// import { useState } from "react";
// import { MessageSquare, Moon } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function OrgAccess() {
//   const [tab, setTab] = useState("join");
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     orgName: "",
//     orgType: "company",
//     joinCode: ""
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // ✅ Join as member (role: member)
//   const handleJoin = async () => {
//     try {
//       setLoading(true);
//       if (!formData.joinCode.trim()) {
//         alert("Please enter a join code");
//         return;
//       }
//       const res = await axios.post("https://whisper-wall-server.onrender.com/api/users/join", {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//         joinCode: formData.joinCode
//       });

//       if (res.data.token) {
//         localStorage.setItem("token", res.data.token);
//         localStorage.setItem(
//           "user",
//           JSON.stringify({
//             name: res.data.user.name,
//             role: "member" // ✅ Force role as member
//           })
//         );
//         localStorage.setItem("org", JSON.stringify(res.data.org));
//       }
//       navigate("/user-dashboard");
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to join organization");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Create Org (role: admin)
//   const handleCreate = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.post("https://whisper-wall-server.onrender.com/api/org/register", {
//         orgName: formData.orgName,
//         orgType: formData.orgType,
//         email: formData.email,
//         password: formData.password
//       });

//       if (res.data.token) {
//         localStorage.setItem("token", res.data.token);
//         localStorage.setItem(
//           "user",
//           JSON.stringify({
//             name: res.data.org.name,
//             role: "admin" // ✅ Force role as admin
//           })
//         );
//         localStorage.setItem("org", JSON.stringify(res.data.org));
//       }
//       navigate("/admin");
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to create organization");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Admin login (role: admin)
//   const handleAdminLogin = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.post("https://whisper-wall-server.onrender.com/api/org/login", {
//         email: formData.email,
//         password: formData.password
//       });
//       if (res.data.token) {
//         localStorage.setItem("token", res.data.token);
//         localStorage.setItem(
//           "user",
//           JSON.stringify({
//             name: res.data.name,
//             role: "admin" // ✅ Save admin role
//           })
//         );
//         localStorage.setItem("org", JSON.stringify(res.data.org));
//       }
//       navigate("/admin");
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to login as admin");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       {/* Dark mode toggle */}
//       <div className="absolute top-4 right-4">
//         <button className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md">
//           <Moon className="h-5 w-5 text-gray-600" />
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-lg mb-4">
//             <MessageSquare className="h-8 w-8 text-indigo-600" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">Whisper Wall</h1>
//           <p className="text-gray-500">Anonymous feedback platform</p>
//         </div>

//         {/* Tabs */}
//         <div className="grid grid-cols-3 gap-1 bg-gray-100 rounded-lg p-1 mb-6">
//           <button
//             onClick={() => setTab("join")}
//             className={`py-2 px-3 rounded-md text-sm font-medium ${
//               tab === "join" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
//             }`}
//           >
//             Join
//           </button>
//           <button
//             onClick={() => setTab("create")}
//             className={`py-2 px-3 rounded-md text-sm font-medium ${
//               tab === "create" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
//             }`}
//           >
//             Create
//           </button>
//           <button
//             onClick={() => setTab("login")}
//             className={`py-2 px-3 rounded-md text-sm font-medium ${
//               tab === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
//             }`}
//           >
//             Admin Login
//           </button>
//         </div>

//         {/* JOIN */}
//         {tab === "join" && (
//           <div className="space-y-4">
//             <input type="text" name="name" placeholder="Your Name" onChange={handleChange} className="w-full p-3 border rounded-lg" />
//             <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-3 border rounded-lg" />
//             <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-3 border rounded-lg" />
//             <input type="text" name="joinCode" placeholder="Join Code" onChange={handleChange} className="w-full p-3 border rounded-lg" />
//             <button onClick={handleJoin} disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg">
//               {loading ? "Joining..." : "Join Organization"}
//             </button>
//           </div>
//         )}

//         {/* CREATE */}
//         {tab === "create" && (
//           <div className="space-y-4">
//             <input type="text" name="orgName" placeholder="Organization Name" onChange={handleChange} className="w-full p-3 border rounded-lg" />
//             <select name="orgType" onChange={handleChange} value={formData.orgType} className="w-full p-3 border rounded-lg">
//               <option value="company">Company</option>
//               <option value="university">University</option>
//               <option value="school">School</option>
//             </select>
//             <input type="email" name="email" placeholder="Admin Email" onChange={handleChange} className="w-full p-3 border rounded-lg" />
//             <input type="password" name="password" placeholder="Admin Password" onChange={handleChange} className="w-full p-3 border rounded-lg" />
//             <button onClick={handleCreate} disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg">
//               {loading ? "Creating..." : "Create Organization"}
//             </button>
//           </div>
//         )}

//         {/* ADMIN LOGIN */}
//         {tab === "login" && (
//           <div className="space-y-4">
//             <input type="email" name="email" placeholder="Admin Email" onChange={handleChange} className="w-full p-3 border rounded-lg" />
//             <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-3 border rounded-lg" />
//             <button onClick={handleAdminLogin} disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg">
//               {loading ? "Logging in..." : "Login as Admin"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { MessageSquare, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function OrgAccess() {
  const [tab, setTab] = useState("join");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    orgName: "",
    orgType: "company",
    joinCode: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Join as member (role: member)
  const handleJoin = async () => {
    try {
      setLoading(true);
      if (!formData.joinCode.trim()) {
        alert("Please enter a join code");
        return;
      }
      const res = await axios.post("https://whisper-wall-server.onrender.com/api/users/join", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        joinCode: formData.joinCode
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: res.data.user.name,
            role: "member" // ✅ Force role as member
          })
        );
        localStorage.setItem("org", JSON.stringify(res.data.org));
      }
      navigate("/user-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to join organization");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create Org (role: admin)
  const handleCreate = async () => {
    try {
      setLoading(true);
      const res = await axios.post("https://whisper-wall-server.onrender.com/api/org/register", {
        orgName: formData.orgName,
        orgType: formData.orgType,
        email: formData.email,
        password: formData.password
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: res.data.org.name,
            role: "admin" // ✅ Force role as admin
          })
        );
        localStorage.setItem("org", JSON.stringify(res.data.org));
      }
      navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Admin login (role: admin)
  const handleAdminLogin = async () => {
    try {
      setLoading(true);
      const res = await axios.post("https://whisper-wall-server.onrender.com/api/org/login", {
        email: formData.email,
        password: formData.password
      });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: res.data.name,
            role: "admin" // ✅ Save admin role
          })
        );
        localStorage.setItem("org", JSON.stringify(res.data.org));
      }
      navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to login as admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      {/* Dark mode toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <button className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md">
          <Moon className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-indigo-100 rounded-lg mb-3 sm:mb-4">
            <MessageSquare className="h-7 w-7 sm:h-8 sm:w-8 text-indigo-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Whisper Wall</h1>
          <p className="text-sm sm:text-base text-gray-500">Anonymous feedback platform</p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-gray-100 rounded-lg p-1 mb-4 sm:mb-6">
          <button
            onClick={() => setTab("join")}
            className={`py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium ${
              tab === "join" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
            }`}
          >
            Join
          </button>
          <button
            onClick={() => setTab("create")}
            className={`py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium ${
              tab === "create" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
            }`}
          >
            Create
          </button>
          <button
            onClick={() => setTab("login")}
            className={`py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium ${
              tab === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
            }`}
          >
            Admin Login
          </button>
        </div>

        {/* JOIN */}
        {tab === "join" && (
          <div className="space-y-3 sm:space-y-4">
            <input type="text" name="name" placeholder="Your Name" onChange={handleChange} className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base" />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base" />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base" />
            <input type="text" name="joinCode" placeholder="Join Code" onChange={handleChange} className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base" />
            <button onClick={handleJoin} disabled={loading} className="w-full bg-indigo-600 text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base">
              {loading ? "Joining..." : "Join Organization"}
            </button>
          </div>
        )}

        {/* CREATE */}
        {tab === "create" && (
          <div className="space-y-3 sm:space-y-4">
            <input type="text" name="orgName" placeholder="Organization Name" onChange={handleChange} className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base" />
            <select name="orgType" onChange={handleChange} value={formData.orgType} className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base">
              <option value="company">Company</option>
              <option value="university">University</option>
              <option value="school">School</option>
            </select>
            <input type="email" name="email" placeholder="Admin Email" onChange={handleChange} className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base" />
            <input type="password" name="password" placeholder="Admin Password" onChange={handleChange} className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base" />
            <button onClick={handleCreate} disabled={loading} className="w-full bg-indigo-600 text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base">
              {loading ? "Creating..." : "Create Organization"}
            </button>
          </div>
        )}

        {/* ADMIN LOGIN */}
        {tab === "login" && (
          <div className="space-y-3 sm:space-y-4">
            <input type="email" name="email" placeholder="Admin Email" onChange={handleChange} className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base" />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base" />
            <button onClick={handleAdminLogin} disabled={loading} className="w-full bg-indigo-600 text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base">
              {loading ? "Logging in..." : "Login as Admin"}
            </button>
          </div> 
        )}
      </div>
    </div>
  );
}