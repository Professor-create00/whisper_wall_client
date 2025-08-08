

import { useEffect, useState } from "react";
import {
  Send,
  Clock,
  MessageCircle,
  Trash2,
  Bell,
  User,
  Lightbulb,
  AlertTriangle,
  Frown,
  Heart,
  MoreHorizontal,
  FileText,
  Menu,
  BookOpen,
  X
} from "lucide-react";

export default function UserDashboard() {
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [category, setCategory] = useState("other");
  const [charCount, setCharCount] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchPosts();
    if (user?.role !== "admin") {
      fetchMyPosts();
    }
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("https://whisper-wall-server.onrender.com/api/posts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPosts(data.map(p => ({ ...p, userId: String(p.userId) })))
    } catch (err) {
      console.error("Error fetching posts:", err);
      setAlertMessage("Failed to load posts");
      setShowAlert(true);
    }
  };

  const fetchMyPosts = async () => {
    try {
      const res = await fetch("https://whisper-wall-server.onrender.com/api/posts/my-posts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMyPosts(data.map(p => ({ ...p, userId: String(p.userId) })))
    } catch (err) {
      console.error("Error fetching my posts:", err);
      setAlertMessage("Failed to load your posts");
      setShowAlert(true);
    }
  };

  const handlePostSubmit = async () => {
    if (!newPost.trim()) {
      setAlertMessage("Please write something before posting.");
      setShowAlert(true);
      return;
    }
    setIsPosting(true);
    try {
      const res = await fetch("https://whisper-wall-server.onrender.com/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newPost, category })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to post feedback");
      }

      const newPostData = await res.json();

      setNewPost("");
      setCharCount(0);
      setPosts(prev => [newPostData, ...prev]);
      fetchMyPosts();
    } catch (err) {
      console.error("Error creating post:", err);
      setAlertMessage(err.message || "Failed to post feedback");
      setShowAlert(true);
    } finally {
      setIsPosting(false);
    }
  };

  const handleTextChange = (e) => {
    setNewPost(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleDeleteClick = (id) => {
    setPostToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirmed = async (id) => {
    try {
      const res = await fetch(`https://whisper-wall-server.onrender.com/api/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete post");
      }

      setPosts(prev => prev.filter(p => p._id !== id));
      fetchMyPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
      setAlertMessage(err.message || "Failed to delete post");
      setShowAlert(true);
    }
  };

  const counts = {
    all: posts.length,
    my: myPosts.length,
    complaint: posts.filter(p => p.category === "complaint").length,
    suggestion: posts.filter(p => p.category === "suggestion").length,
    dissatisfaction: posts.filter(p => p.category === "dissatisfaction").length,
    appreciation: posts.filter(p => p.category === "appreciation").length,
    other: posts.filter(p => p.category === "other").length
  };

  const navItems = [
    { id: "all", label: "All Posts", icon: FileText, count: counts.all },
    { id: "suggestion", label: "Suggestions", icon: Lightbulb, count: counts.suggestion },
    { id: "complaint", label: "Complaints", icon: AlertTriangle, count: counts.complaint },
    { id: "dissatisfaction", label: "Dissatisfaction", icon: Frown, count: counts.dissatisfaction },
    { id: "appreciation", label: "Appreciation", icon: Heart, count: counts.appreciation },
    { id: "other", label: "Others", icon: MoreHorizontal, count: counts.other },
    { id: "policy", label: "Policy & Guidelines", icon: BookOpen, count: 0 }
  ];

  if (user?.role !== "admin") {
    navItems.splice(1, 0, { id: "my", label: "My Posts", icon: User, count: counts.my });
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Alert Modal */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={() => setShowAlert(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
   
            <div className="flex justify-end">
              <button
                onClick={() => setShowAlert(false)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mb-4">Are you sure you want to delete this post?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteConfirmed(postToDelete);
                  setShowDeleteConfirm(false);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}





      <div className="bg-white border-b border-gray-300 px-4 md:px-6 py-4">
  <div className="flex items-center justify-between">
    {/* Left side - Whisper Wall with logo */}
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-purple-600 rounded-lg flex items-center justify-center">
        <MessageCircle className="w-5 h-5 text-white" />
      </div>
      <span className="text-lg md:text-xl font-semibold text-gray-900">
        Whisper Wall
      </span>
    </div>

    {/* Right side - Hamburger menu (mobile only) */}
    {isMobile && (
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="flex-shrink-0"
      >
        <Menu className="w-6 h-6 text-gray-500" />
      </button>
    )}
  </div>
</div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        {!isMobile && (
          <div className="w-64 bg-white border-r border-gray-300 min-h-[calc(100vh-68px)] sticky top-0">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Feedback Hub</h2>
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                        isActive
                          ? "bg-purple-50 text-purple-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-5 h-5 ${
                            isActive ? "text-purple-600" : "text-gray-400"
                          }`}
                        />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.count > 0 && (
                        <span
                          className={`text-sm px-2 py-1 rounded-full ${
                            isActive
                              ? "bg-purple-100 text-purple-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Mobile Sidebar */}
        {isMobile && isMobileMenuOpen && (
          <div className="fixed inset-0 z-40">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50" 
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            <div className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 shadow-lg overflow-y-auto">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Feedback Hub</h2>
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                          isActive
                            ? "bg-purple-50 text-purple-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-5 h-5 ${
                              isActive ? "text-purple-600" : "text-gray-400"
                            }`}
                          />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {item.count > 0 && (
                          <span
                            className={`text-sm px-2 py-1 rounded-full ${
                              isActive
                                ? "bg-purple-100 text-purple-600"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8">
          {activeTab === "my" ? (
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 gap-6 md:gap-8">
              {/* Welcome and Share Feedback */}
              <div className="bg-white rounded-xl border border-gray-300 p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-semibold mb-2">Welcome {user.name.toUpperCase()}</h2>
                <h2 className="text-base md:text-lg font-semibold mb-4">Share Your Thoughts</h2>
                <textarea
                  value={newPost}
                  onChange={handleTextChange}
                  placeholder="Write your feedback anonymously..."
                  className="w-full p-3 md:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none resize-none text-gray-700 placeholder-gray-400"
                  rows="4"
                  maxLength="500"
                ></textarea>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none bg-white text-gray-700"
                  >
                    <option value="other">Other</option>
                    <option value="complaint">Complaint</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="dissatisfaction">Dissatisfaction</option>
                    <option value="appreciation">Appreciation</option>
                  </select>
                </div>

                <div className="flex justify-between items-center mt-3 md:mt-4">
                  <span className="text-xs md:text-sm text-gray-400">{charCount}/500</span>
                  <button
                    onClick={handlePostSubmit}
                    disabled={isPosting}
                    className="bg-purple-600 text-white px-4 py-2 md:px-6 md:py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 text-sm md:text-base"
                  >
                    <Send className="w-3 h-3 md:w-4 md:h-4" />
                    {isPosting ? "Posting..." : "Post Anonymously"}
                  </button>
                </div>
              </div>

              {/* My Feedback */}
              <div className="bg-white rounded-xl border border-gray-300 p-4 md:p-6">
                <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6">My Thoughts</h2>
                {myPosts.length > 0 ? (
                  <div className="space-y-3 md:space-y-4 overflow-y-auto max-h-[500px] pr-2">
                    {myPosts.map((post, index) => (
                      <div key={post._id} className="border border-gray-100 rounded-lg p-3 md:p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2 md:mb-3">
                          <p className="text-gray-700 flex-1 pr-2 md:pr-4 text-sm md:text-base">{post.content}</p>
                          <span className="text-xs text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full">
                            #{index + 1}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs">
                              {new Date(post.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteClick(post._id)}
                            className="flex items-center text-red-500 text-xs hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3 mr-1" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No feedback yet</p>
                )}
              </div>
            </div>
          ) : activeTab === "policy" ? (
         <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 p-6 sm:p-8">
    <h2 className="text-2xl font-semibold mb-6 text-purple-700 dark:text-purple-400 flex items-center gap-2">
      <BookOpen className="w-6 h-6" />
      Whisper Wall: Policy & Guidelines
    </h2>

    <div className="space-y-6 text-gray-800 dark:text-gray-200 text-sm sm:text-base">
      {/* What is Whisper Wall */}
      <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
        <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">🤔 What is Whisper Wall?</h3>
        <p>
          Whisper Wall is an anonymous feedback platform designed for schools, colleges, and organizations. 
          It empowers users to voice their opinions, concerns, and ideas freely—without fear of judgment or exposure.
        </p>
      </div>

      {/* Why should I use it */}
      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">🌟 Why should I use Whisper Wall?</h3>
        <ul className="list-disc pl-4 space-y-2">
          <li>To share honest feedback, suggestions, or concerns.</li>
          <li>To improve your institution or workplace through constructive dialogue.</li>
          <li>To remain completely anonymous and safe while doing so.</li>
        </ul>
      </div>

      {/* How does AI moderation work */}
      <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">🛡️ How does AI moderation work?</h3>
        <p>
          Whisper Wall uses AI moderation to automatically filter out hate speech, spam, offensive content, and abusive language. 
          This ensures a respectful environment for all users.
        </p>
      </div>

      {/* How is my identity protected? */}
      <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
        <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">🔒 Is my identity really protected?</h3>
        <p>
          Yes. Your identity is never shared with other users. Even administrators cannot view who posted what.
          The system is built to protect anonymity at all times.
        </p>
      </div>

      {/* Posting Rules */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">📋 Posting Rules</h3>
        <ul className="list-disc pl-4 space-y-2">
          <li>Stay respectful — no hate, harassment, or abuse.</li>
          <li>Posts must be under 500 characters.</li>
          <li>Choose the right category (complaint, suggestion, appreciation, etc).</li>
          <li>Admins may remove posts that violate guidelines.</li>
          <li>You may delete your own posts, but not others'.</li>
        </ul>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
        🚫 Violations of these policies may lead to post removal or temporary bans.
        Let's keep this space honest, safe, and productive for everyone.
        <br></br>
        iss app ke karta dharta - Lakhan sharan
      </p>
    </div>
  </div>
</div>

          ) : (
            <div className="max-w-[1400px] mx-auto">
              <div className="bg-white rounded-xl border border-gray-300 p-4 md:p-6">
                <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Community Thoughts</h2>
                {posts.filter(p =>
                  activeTab === "all" ? true : p.category === activeTab
                ).length > 0 ? (
                  <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
                    {posts
                      .filter(p => activeTab === "all" ? true : p.category === activeTab)
                      .map((post, index) => (
                        <div key={post._id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          {/* Desktop View - Side by side */}
                          <div className="hidden md:block">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-gray-700 flex-1 pr-4">{post.content}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full capitalize">
                                  {post.category}
                                </span>
                                <span className="text-xs text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full">
                                  #{index + 1}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span className="text-xs">
                                {new Date(post.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </span>
                            </div>
                          </div>

                          {/* Mobile View - Stacked */}
                          <div className="md:hidden">
                            <p className="text-gray-700 mb-3">{post.content}</p>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1 text-gray-400">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs">
                                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full capitalize">
                                  {post.category}
                                </span>
                                <span className="text-xs text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full">
                                  #{index + 1}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No feedback yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}