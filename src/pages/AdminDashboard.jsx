
import { useEffect, useState } from "react";
import axios from "axios";
import {
  MessageCircle,
  Users,
  FileText,
  Settings,
  Clock,
  PieChart as PieIcon,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [orgInfo, setOrgInfo] = useState({});
  const [recentPosts, setRecentPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [sentimentData, setSentimentData] = useState([]);
  

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [orgRes, postsRes, sentimentRes] = await Promise.all([
        axios.get("https://whisper-wall-server.onrender.com/api/org/info", { headers }),
        axios.get("https://whisper-wall-server.onrender.com/api/posts", { headers }),
        axios.get("https://whisper-wall-server.onrender.com/api/posts/sentiment-distribution", {
          headers,
        }),
      ]);

      setOrgInfo(orgRes.data);
      setRecentPosts(postsRes.data.slice(0, 5));
      setTotalPosts(postsRes.data.length);
      setTotalUsers(orgRes.data.users?.length || 0);

      const { positive, negative, neutral } = sentimentRes.data;
      setSentimentData([
        { name: "Positive", value: parseFloat(positive) },
        { name: "Negative", value: parseFloat(negative) },
        { name: "Neutral", value: parseFloat(neutral) },
      ]);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    }
  };

  const COLORS = ["#22c55e", "#ef4444", "#facc15"];

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">🛠️ Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
        <StatCard 
          icon={<FileText className="text-blue-400 w-5 h-5" />} 
          title="Total Feedback" 
          value={totalPosts} 
          color="text-blue-300" 
        />
        <StatCard 
          icon={<Users className="text-green-400 w-5 h-5" />} 
          title="Total Users" 
          value={totalUsers} 
          color="text-green-300" 
        />
        <StatCard 
          icon={<Settings className="text-purple-400 w-5 h-5" />} 
          title="Join Code" 
          value={orgInfo.joinCode || "N/A"} 
          color="text-purple-300" 
        />
      </div>

      {/* Sentiment Chart */}
      <div className="bg-zinc-900 rounded-xl p-4 sm:p-6 border border-zinc-700 shadow-lg mb-8 sm:mb-10">
        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <PieIcon className="text-yellow-300 w-5 h-5" />
          <h2 className="text-lg sm:text-xl font-bold text-white">📊 Sentiment Breakdown</h2>
        </div>
        {sentimentData.length > 0 ? (
          <div className="h-[200px] sm:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={70}
                  label
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-400 text-sm sm:text-base">No sentiment data yet.</p>
        )}
      </div>

      {/* Recent Feedback */}
      <div className="bg-zinc-900 rounded-xl p-4 sm:p-6 border border-zinc-700 shadow-lg mb-8 sm:mb-10">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">🗣️ Recent Feedback</h2>
        {recentPosts.length > 0 ? (
          <ul className="space-y-3 sm:space-y-4">
            {recentPosts.map((post) => (
              <li
                key={post._id}
                className="bg-zinc-800 rounded-lg p-3 sm:p-4 border border-zinc-700"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                  <span className="text-gray-200 text-sm sm:text-base">{post.content}</span>
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full capitalize self-start sm:self-auto">
                    {post.category}
                  </span>
                </div>
                <div className="flex items-center text-gray-400 text-xs gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(post.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm sm:text-base">No feedback submitted yet.</p>
        )}
      </div>

      {/* Organization Info */}
      <div className="bg-zinc-900 rounded-xl p-4 sm:p-6 border border-zinc-700 shadow-lg">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">🏢 Organization Details</h2>
        <div className="space-y-2">
          <p className="text-sm sm:text-base">
            <strong className="text-gray-400">Name:</strong> {orgInfo.orgName || "N/A"}
          </p>
          <p className="text-sm sm:text-base">
            <strong className="text-gray-400">Email:</strong> {orgInfo.email || "N/A"}
          </p>
          <p className="text-sm sm:text-base">
            <strong className="text-gray-400">Type:</strong> {orgInfo.type || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-zinc-900 rounded-xl p-4 sm:p-6 border border-zinc-700 shadow-lg">
      <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
        {icon}
        <h2 className="text-base sm:text-lg font-semibold">{title}</h2>
      </div>
      <p className={`text-2xl sm:text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}