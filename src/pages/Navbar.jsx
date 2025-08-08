// // src/components/Navbar.jsx
// import { FileText, User, Lightbulb, AlertTriangle, Frown, Heart, MoreHorizontal } from "lucide-react";

// export default function Navbar({ activeTab, setActiveTab, counts }) {
//   const tabs = [
//     { key: "all", label: "All Posts", icon: FileText },
//     { key: "my", label: "My Posts", icon: User },
//     { key: "suggestion", label: "Suggestions", icon: Lightbulb },
//     { key: "complaint", label: "Complaints", icon: AlertTriangle },
//     { key: "dissatisfaction", label: "Dissatisfaction", icon: Frown },
//     { key: "appreciation", label: "Appreciation", icon: Heart },
//     { key: "other", label: "Others", icon: MoreHorizontal },
//   ];

//   return (
//     <div className="w-64 bg-white shadow-lg h-screen p-4 border-r">
//       <h2 className="text-lg font-bold mb-6">Feedback Hub</h2>
//       <nav className="space-y-2">
//         {tabs.map(tab => (
//           <button
//             key={tab.key}
//             onClick={() => setActiveTab(tab.key)}
//             className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${
//               activeTab === tab.key ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-100"
//             }`}
//           >
//             <div className="flex items-center space-x-2">
//               <tab.icon className="w-4 h-4" />
//               <span>{tab.label}</span>
//             </div>
//             <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
//               {counts[tab.key] || 0}
//             </span>
//           </button>
//         ))}
//       </nav>
//     </div>
//   );
// }


// src/components/Navbar.jsx
import { FileText, User, Lightbulb, AlertTriangle, Frown, Heart, MoreHorizontal } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, counts }) {
  const tabs = [
    { key: "all", label: "All Posts", icon: FileText },
    { key: "my", label: "My Posts", icon: User },
    { key: "suggestion", label: "Suggestions", icon: Lightbulb },
    { key: "complaint", label: "Complaints", icon: AlertTriangle },
    { key: "dissatisfaction", label: "Dissatisfaction", icon: Frown },
    { key: "appreciation", label: "Appreciation", icon: Heart },
    { key: "other", label: "Others", icon: MoreHorizontal },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen p-4 border-r">
      <h2 className="text-lg font-bold mb-6">Feedback Hub</h2>
      <nav className="space-y-2">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${
              activeTab === tab.key ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center space-x-2">
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </div>
            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
              {counts[tab.key] || 0}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
