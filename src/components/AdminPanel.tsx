import React, { useState, useEffect } from "react";
import { 
  X, 
  Users, 
  Video, 
  Settings, 
  Database, 
  RefreshCw, 
  Trash2, 
  Edit, 
  Check, 
  AlertCircle, 
  Clock, 
  Shield, 
  Info, 
  Search,
  Eye,
  FileText,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface UserDoc {
  uid: string;
  email: string;
  displayName: string;
  role: "student" | "teacher" | "admin";
  createdAt: string;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  lang: "en" | "ar";
  showToast: (msg: string, type?: "success" | "info" | "error") => void;
  onRefreshVideos: () => void;
}

export default function AdminPanel({
  isOpen,
  onClose,
  currentUser,
  lang,
  showToast,
  onRefreshVideos
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "videos" | "settings">("overview");
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [systemSettings, setSystemSettings] = useState<any>({
    aiTranscriptEnabled: true,
    publicCommentsEnabled: true,
    maintenanceMode: false,
    categories: ["Biology", "Physics", "Mathematics", "Computer Science", "Chemistry"]
  });

  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);
  
  // Search and Filter States
  const [userSearch, setUserSearch] = useState("");
  const [videoSearch, setVideoSearch] = useState("");

  // Edit Modals State
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [editVideoTitle, setEditVideoTitle] = useState("");
  const [editVideoCategory, setEditVideoCategory] = useState("");
  const [isReseedConfirmOpen, setIsReseedConfirmOpen] = useState(false);

  // Load all required data
  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/admin/stats", {
        headers: {
          "x-user-role": "admin",
          "Authorization": "Bearer token_admin"
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Failed to load admin stats:", e);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/admin/users", {
        headers: {
          "x-user-role": "admin",
          "Authorization": "Bearer token_admin"
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error("Failed to load users:", e);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadVideos = async () => {
    setLoadingVideos(true);
    try {
      const res = await fetch("/api/videos");
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (e) {
      console.error("Failed to load videos:", e);
    } finally {
      setLoadingVideos(false);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/admin/system/settings");
      if (res.ok) {
        const data = await res.json();
        setSystemSettings(data);
      }
    } catch (e) {
      console.error("Failed to load system settings:", e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadStats();
      loadUsers();
      loadVideos();
      loadSettings();
    }
  }, [isOpen]);

  // Actions
  const handleUpdateUserRole = async (uid: string, newRole: "student" | "teacher" | "admin") => {
    try {
      const res = await fetch(`/api/admin/users/${uid}/role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "admin",
          "Authorization": "Bearer token_admin"
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        showToast(
          lang === "ar" ? "تم تحديث صلاحية المستخدم بنجاح" : "User role updated successfully", 
          "success"
        );
        loadUsers();
        loadStats();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to update role", "error");
      }
    } catch (e) {
      showToast("Error updating user role", "error");
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (uid === "admin") {
      showToast("Cannot delete root admin account", "error");
      return;
    }
    if (!window.confirm(lang === "ar" ? "هل أنت متأكد من حذف هذا المستخدم نهائياً؟" : "Are you sure you want to permanently delete this user?")) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${uid}`, {
        method: "DELETE",
        headers: {
          "x-user-role": "admin",
          "Authorization": "Bearer token_admin"
        }
      });
      if (res.ok) {
        showToast(
          lang === "ar" ? "تم حذف حساب المستخدم بنجاح" : "User deleted successfully", 
          "success"
        );
        loadUsers();
        loadStats();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to delete user", "error");
      }
    } catch (e) {
      showToast("Error deleting user", "error");
    }
  };

  const handleEditVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;
    try {
      const res = await fetch(`/api/admin/videos/${editingVideo.id}/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "admin",
          "Authorization": "Bearer token_admin"
        },
        body: JSON.stringify({
          title: editVideoTitle,
          category: editVideoCategory
        })
      });
      if (res.ok) {
        showToast(
          lang === "ar" ? "تم تعديل بيانات الفيديو بنجاح" : "Video details edited successfully", 
          "success"
        );
        setEditingVideo(null);
        loadVideos();
        loadStats();
        onRefreshVideos();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to edit video", "error");
      }
    } catch (e) {
      showToast("Error editing video details", "error");
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!window.confirm(lang === "ar" ? "تحذير: سيؤدي حذف الفيديو إلى إزالة كافة الملاحظات والتعليقات والملفات المرتبطة به. هل تريد المتابعة؟" : "Warning: Deleting this video will permanently remove all associated student notes, resources, and comments. Proceed?")) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/videos/${videoId}`, {
        method: "DELETE",
        headers: {
          "x-user-role": "admin",
          "Authorization": "Bearer token_admin"
        }
      });
      if (res.ok) {
        showToast(
          lang === "ar" ? "تم حذف الفيديو وكافة بياناته بنجاح" : "Video and all connected child records deleted successfully", 
          "success"
        );
        loadVideos();
        loadStats();
        onRefreshVideos();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to delete video", "error");
      }
    } catch (e) {
      showToast("Error deleting video", "error");
    }
  };

  const handleUpdateSettings = async (field: string, val: any) => {
    const updated = { ...systemSettings, [field]: val };
    setSystemSettings(updated);
    try {
      const res = await fetch("/api/admin/system/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "admin",
          "Authorization": "Bearer token_admin"
        },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        showToast(lang === "ar" ? "تم تحديث الإعدادات الفنية" : "System preferences updated", "success");
      }
    } catch (e) {
      showToast("Error saving preferences", "error");
    }
  };

  const handleReseedDatabase = async () => {
    setIsReseedConfirmOpen(false);
    try {
      const res = await fetch("/api/admin/system/reseed", {
        method: "POST",
        headers: {
          "x-user-role": "admin",
          "Authorization": "Bearer token_admin"
        }
      });
      if (res.ok) {
        showToast(
          lang === "ar" ? "تمت إعادة تهيئة قواعد البيانات بنجاح" : "Database successfully reseeded to standard blueprint", 
          "success"
        );
        loadStats();
        loadUsers();
        loadVideos();
        onRefreshVideos();
      } else {
        showToast("Reseed failed", "error");
      }
    } catch (e) {
      showToast("Error triggering reseed", "error");
    }
  };

  // Search filter implementations
  const filteredUsers = users.filter(u => {
    const term = userSearch.toLowerCase();
    return (
      (u.displayName || "").toLowerCase().includes(term) ||
      (u.email || "").toLowerCase().includes(term) ||
      (u.role || "").toLowerCase().includes(term)
    );
  });

  const filteredVideos = videos.filter(v => {
    const term = videoSearch.toLowerCase();
    return (
      (v.title || "").toLowerCase().includes(term) ||
      (v.category || "").toLowerCase().includes(term) ||
      (v.channelTitle || "").toLowerCase().includes(term)
    );
  });

  const isRtl = lang === "ar";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2500] bg-black/60 backdrop-blur-md flex items-center justify-end rtl:justify-start font-sans overflow-hidden">
      <motion.div 
        initial={{ x: isRtl ? "-100%" : "100%" }}
        animate={{ x: 0 }}
        exit={{ x: isRtl ? "-100%" : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 180 }}
        className="bg-[#faf8f5] w-full max-w-5xl h-full shadow-2xl flex flex-col relative border-l rtl:border-l-0 rtl:border-r border-[#e8e2d9]"
      >
        {/* Header Block */}
        <div className="p-6 border-b border-[#e8e2d9] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#c45a3a]/10 rounded-xl text-[#c45a3a]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#1a1612]">
                {lang === "ar" ? "لوحة التحكم الإدارية" : "Administrator Dashboard"}
              </h2>
              <p className="text-xs text-gray-500">
                {lang === "ar" ? "الإشراف والتحكم وإدارة بيانات المستخدمين والمناهج" : "Oversee student analytics, system properties, and content moderation."}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 text-[#5c554d] hover:text-red-500 hover:bg-red-50 rounded-xl transition duration-200"
            id="close-admin-panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Layout with Sub-Navigation and Main Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Side Navigation Rail */}
          <div className="w-64 border-r rtl:border-r-0 rtl:border-l border-[#e8e2d9] bg-white p-4 flex flex-col gap-1.5 justify-between">
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 ${
                  activeTab === "overview" 
                    ? "bg-[#c45a3a] text-white shadow-md shadow-[#c45a3a]/20" 
                    : "text-[#5c554d] hover:bg-[#faf8f5]"
                }`}
              >
                <Database className="w-4 h-4" />
                {lang === "ar" ? "نظرة عامة والتحليلات" : "Overview & Analytics"}
              </button>

              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 ${
                  activeTab === "users" 
                    ? "bg-[#c45a3a] text-white shadow-md shadow-[#c45a3a]/20" 
                    : "text-[#5c554d] hover:bg-[#faf8f5]"
                }`}
              >
                <Users className="w-4 h-4" />
                {lang === "ar" ? "إدارة المستخدمين" : "Users Directory"}
              </button>

              <button
                onClick={() => setActiveTab("videos")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 ${
                  activeTab === "videos" 
                    ? "bg-[#c45a3a] text-white shadow-md shadow-[#c45a3a]/20" 
                    : "text-[#5c554d] hover:bg-[#faf8f5]"
                }`}
              >
                <Video className="w-4 h-4" />
                {lang === "ar" ? "المحتوى والفيديوهات" : "Curated Course Material"}
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 ${
                  activeTab === "settings" 
                    ? "bg-[#c45a3a] text-white shadow-md shadow-[#c45a3a]/20" 
                    : "text-[#5c554d] hover:bg-[#faf8f5]"
                }`}
              >
                <Settings className="w-4 h-4" />
                {lang === "ar" ? "إعدادات المنصة" : "System Settings"}
              </button>
            </div>

            <div className="bg-[#f5f0ea] p-4 rounded-2xl border border-[#e8e2d9] text-center">
              <Shield className="w-6 h-6 text-[#c45a3a] mx-auto mb-1.5" />
              <h4 className="text-[11px] font-black text-[#1a1612]">System Operator</h4>
              <p className="text-[9px] text-[#5c554d] mt-0.5 truncate">{currentUser?.email || "admin@helper.com"}</p>
            </div>
          </div>

          {/* Sub-View Content Container */}
          <div className="flex-1 p-8 overflow-y-auto">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Statistics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-[#e8e2d9] shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        {lang === "ar" ? "إجمالي الطلاب" : "Total Students"}
                      </p>
                      <h3 className="text-xl font-black text-[#1a1612] mt-0.5">
                        {loadingStats ? "..." : stats?.students ?? 0}
                      </h3>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#e8e2d9] shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        {lang === "ar" ? "المعلمين" : "Total Educators"}
                      </p>
                      <h3 className="text-xl font-black text-[#1a1612] mt-0.5">
                        {loadingStats ? "..." : stats?.teachers ?? 0}
                      </h3>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#e8e2d9] shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        {lang === "ar" ? "الفيديوهات" : "Video Lessons"}
                      </p>
                      <h3 className="text-xl font-black text-[#1a1612] mt-0.5">
                        {loadingStats ? "..." : stats?.totalVideos ?? 0}
                      </h3>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#e8e2d9] shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        {lang === "ar" ? "ملاحظات الطلاب" : "Total Notes Taken"}
                      </p>
                      <h3 className="text-xl font-black text-[#1a1612] mt-0.5">
                        {loadingStats ? "..." : stats?.totalNotes ?? 0}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Engagement Graphic & Categories distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Styled SVG Chart (Engagement timeline) */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#e8e2d9] shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs font-black text-[#1a1612] uppercase tracking-wide">
                        {lang === "ar" ? "مؤشر التفاعل والمشاركة الساعي" : "Hourly Engagement (Last 6 Hours)"}
                      </h3>
                      <div className="flex gap-3 text-[10px] font-bold text-gray-500">
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#c45a3a] rounded-sm"></span>Notes</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-yellow-400 rounded-sm"></span>Comments</span>
                      </div>
                    </div>

                    {loadingStats ? (
                      <div className="h-44 flex items-center justify-center text-xs text-gray-400">
                        <RefreshCw className="w-5 h-5 animate-spin me-2" /> Loading timeline...
                      </div>
                    ) : (
                      <div className="relative pt-4">
                        <div className="h-40 flex items-end justify-between gap-4 px-2">
                          {stats?.timelineData?.map((item: any, idx: number) => {
                            const maxVal = Math.max(...stats.timelineData.map((d: any) => d.notes + d.comments)) || 10;
                            const notesHeight = (item.notes / maxVal) * 100;
                            const commentsHeight = (item.comments / maxVal) * 100;
                            return (
                              <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                                <div className="w-full flex items-end justify-center gap-1.5 h-32">
                                  <div 
                                    style={{ height: `${Math.max(15, notesHeight)}%` }} 
                                    className="w-3 bg-[#c45a3a] rounded-t-sm hover:opacity-80 transition-all duration-300 relative group cursor-pointer"
                                  >
                                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white font-mono text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition z-10">
                                      {item.notes}
                                    </span>
                                  </div>
                                  <div 
                                    style={{ height: `${Math.max(10, commentsHeight)}%` }} 
                                    className="w-3 bg-yellow-400 rounded-t-sm hover:opacity-80 transition-all duration-300 relative group cursor-pointer"
                                  >
                                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white font-mono text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition z-10">
                                      {item.comments}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-[9px] font-mono font-bold text-gray-400 mt-1">{item.time}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Course categories distribution */}
                  <div className="bg-white p-6 rounded-3xl border border-[#e8e2d9] shadow-sm flex flex-col justify-between">
                    <h3 className="text-xs font-black text-[#1a1612] uppercase tracking-wide mb-4">
                      {lang === "ar" ? "توزيع المواد الدراسية" : "Subject Distribution"}
                    </h3>

                    {loadingStats ? (
                      <div className="h-44 flex items-center justify-center text-xs text-gray-400">
                        Loading...
                      </div>
                    ) : (
                      <div className="space-y-3.5 flex-1 flex flex-col justify-center">
                        {Object.entries(stats?.categoryDistribution || {}).map(([cat, count]: any, idx) => {
                          const total = stats?.totalVideos || 1;
                          const pct = Math.round((count / total) * 100);
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-[11px] font-bold text-[#5c554d]">
                                <span>{cat}</span>
                                <span className="font-mono text-gray-400">{count} ({pct}%)</span>
                              </div>
                              <div className="w-full bg-[#f5f0ea] h-2 rounded-full overflow-hidden">
                                <div 
                                  style={{ width: `${pct}%` }} 
                                  className={`h-full rounded-full ${
                                    idx % 3 === 0 ? "bg-[#c45a3a]" : idx % 3 === 1 ? "bg-amber-500" : "bg-teal-500"
                                  }`}
                                />
                              </div>
                            </div>
                          );
                        })}
                        {Object.keys(stats?.categoryDistribution || {}).length === 0 && (
                          <div className="text-center py-6 text-xs text-gray-400 italic">
                            No subject data yet
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Platform Activities Audit */}
                <div className="bg-white p-6 rounded-3xl border border-[#e8e2d9] shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4.5 h-4.5 text-[#c45a3a]" />
                    <h3 className="text-xs font-black text-[#1a1612] uppercase tracking-wide">
                      {lang === "ar" ? "سجل الرقابة والأحداث الفوري" : "Live Audit Log & Engagement stream"}
                    </h3>
                  </div>

                  <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto pr-2 rtl:pr-0 rtl:pl-2 space-y-1">
                    {stats?.recentActivities?.map((act: any, idx: number) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between text-xs text-[#5c554d] hover:bg-[#faf8f5] px-2 rounded-xl transition duration-150">
                        <div className="flex items-center gap-3">
                          <span className="w-1.5 h-1.5 bg-[#c45a3a] rounded-full" />
                          <div>
                            <span className="font-bold text-[#1a1612] me-1">{act.userDisplayName}</span>
                            <span className="text-gray-500 text-[11px]">
                              {act.action === "add_note" && (lang === "ar" ? "أضاف ملاحظة جديدة" : "noted down details")}
                              {act.action === "ask_ai" && (lang === "ar" ? "استشار المساعد الذكي" : "consulted the Helper AI co-pilot")}
                              {act.action === "add_comment" && (lang === "ar" ? "كتب تعليقاً في المناقشة" : "posted a public comment")}
                              {act.action === "add_resource" && (lang === "ar" ? "شارك ملفاً مرجعياً" : "uploaded an educational reference link")}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-gray-400">
                          {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                    ))}
                    {(!stats?.recentActivities || stats.recentActivities.length === 0) && (
                      <div className="text-center py-8 text-xs text-gray-400 italic">
                        {lang === "ar" ? "لا توجد نشاطات مسجلة حالياً" : "No recent events recorded."}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === "users" && (
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={lang === "ar" ? "البحث عن طالب، معلم، بريد إلكتروني..." : "Search user directory by display name, email, or credentials..."}
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-white border border-[#e8e2d9] rounded-2xl pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-3 text-xs outline-none focus:border-[#c45a3a] transition shadow-sm"
                  />
                </div>

                {/* Users Table */}
                <div className="bg-white border border-[#e8e2d9] rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-start text-xs">
                      <thead>
                        <tr className="bg-[#f5f0ea] border-b border-[#e8e2d9] text-[#5c554d] font-bold">
                          <th className="px-6 py-4">{lang === "ar" ? "الاسم" : "Display Name"}</th>
                          <th className="px-6 py-4">{lang === "ar" ? "البريد الإلكتروني" : "Email Address"}</th>
                          <th className="px-6 py-4">{lang === "ar" ? "الصلاحية الحالية" : "Role Status"}</th>
                          <th className="px-6 py-4">{lang === "ar" ? "تاريخ الانضمام" : "Registered"}</th>
                          <th className="px-6 py-4 text-end">{lang === "ar" ? "إجراءات" : "Moderation"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map((u) => (
                          <tr key={u.uid} className="hover:bg-[#faf8f5] transition">
                            <td className="px-6 py-4 font-bold text-[#1a1612]">
                              <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${
                                  u.role === "admin" ? "bg-red-500" : u.role === "teacher" ? "bg-purple-500" : "bg-blue-500"
                                }`} />
                                {u.displayName}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-500 font-mono text-[11px]">{u.email}</td>
                            <td className="px-6 py-4">
                              <select
                                value={u.role}
                                onChange={(e) => handleUpdateUserRole(u.uid, e.target.value as any)}
                                className="bg-[#faf8f5] border border-[#e8e2d9] rounded-lg px-2 py-1 text-[11px] font-bold outline-none focus:border-[#c45a3a]"
                                disabled={u.uid === "admin"}
                              >
                                <option value="student">Student</option>
                                <option value="teacher">Educator</option>
                                <option value="admin">Administrator</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 text-gray-400 font-mono text-[11px]">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Prior"}
                            </td>
                            <td className="px-6 py-4 text-end">
                              <button
                                onClick={() => handleDeleteUser(u.uid)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                                disabled={u.uid === "admin"}
                                title="Delete user profile"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                          <tr>
                            <td colSpan={5} className="text-center py-8 text-xs text-gray-400 italic">
                              No matching user accounts discovered
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIDEOS TAB */}
            {activeTab === "videos" && (
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={lang === "ar" ? "البحث في عناوين المناهج والفيديوهات..." : "Filter lecture videos by title, channel or classification..."}
                    value={videoSearch}
                    onChange={(e) => setVideoSearch(e.target.value)}
                    className="w-full bg-white border border-[#e8e2d9] rounded-2xl pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-3 text-xs outline-none focus:border-[#c45a3a] transition shadow-sm"
                  />
                </div>

                {/* Videos Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredVideos.map((video) => (
                    <div key={video.id} className="bg-white border border-[#e8e2d9] p-5 rounded-3xl shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2.5 py-1 bg-[#c45a3a]/10 text-[#c45a3a] font-bold text-[9px] uppercase tracking-wider rounded-full">
                            {video.category}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400">ID: {video.id}</span>
                        </div>
                        <h4 className="text-xs font-black text-[#1a1612] line-clamp-2 leading-relaxed">
                          {video.title}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-1">Creator: {video.channelTitle}</p>
                      </div>

                      <div className="border-t border-gray-100 pt-4 mt-4 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-gray-400">
                          Duration: {Math.floor(video.duration / 60)}m {video.duration % 60}s
                        </span>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingVideo(video);
                              setEditVideoTitle(video.title);
                              setEditVideoCategory(video.category);
                            }}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition"
                            title="Edit metadata"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteVideo(video.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                            title="Delete lesson"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredVideos.length === 0 && (
                    <div className="col-span-2 text-center py-12 text-xs text-gray-400 italic">
                      No curated lecture videos matching selection
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="bg-white border border-[#e8e2d9] p-6 rounded-3xl shadow-sm space-y-6">
                  <h3 className="text-xs font-black text-[#1a1612] uppercase tracking-wide border-b border-gray-100 pb-3">
                    {lang === "ar" ? "مفاتيح ميزات المنصة العامة" : "Global Feature Gates"}
                  </h3>

                  <div className="space-y-5">
                    {/* Toggle AI Transcript */}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-[#1a1612]">{lang === "ar" ? "المساعد الأكاديمي الذكي (Gemini API)" : "Gemini AI Academic Assistant"}</h4>
                        <p className="text-[11px] text-gray-500">{lang === "ar" ? "تفعيل الترجمة وتلخيص الفيديوهات التلقائي باستخدام نموذج الذكاء الاصطناعي" : "Enable real-time AI notes summaries and question answers via Gemini-3.5-flash."}</p>
                      </div>
                      <button
                        onClick={() => handleUpdateSettings("aiTranscriptEnabled", !systemSettings.aiTranscriptEnabled)}
                        className={`w-12 h-6.5 rounded-full p-0.5 transition duration-200 focus:outline-none ${
                          systemSettings.aiTranscriptEnabled ? "bg-[#c45a3a]" : "bg-gray-300"
                        }`}
                      >
                        <div className={`w-5.5 h-5.5 bg-white rounded-full shadow-md transform transition duration-200 ${
                          systemSettings.aiTranscriptEnabled ? (lang === "ar" ? "-translate-x-5.5" : "translate-x-5.5") : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    {/* Toggle Comments */}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-[#1a1612]">{lang === "ar" ? "حلقات النقاش العامة للطلاب" : "Public Classroom Discussions"}</h4>
                        <p className="text-[11px] text-gray-500">{lang === "ar" ? "السماح للطلاب بطرح أسئلة ومشاركة تعليقات عامة حول المحاضرات" : "Allow students to publish questions and answers in video public discussion feeds."}</p>
                      </div>
                      <button
                        onClick={() => handleUpdateSettings("publicCommentsEnabled", !systemSettings.publicCommentsEnabled)}
                        className={`w-12 h-6.5 rounded-full p-0.5 transition duration-200 focus:outline-none ${
                          systemSettings.publicCommentsEnabled ? "bg-[#c45a3a]" : "bg-gray-300"
                        }`}
                      >
                        <div className={`w-5.5 h-5.5 bg-white rounded-full shadow-md transform transition duration-200 ${
                          systemSettings.publicCommentsEnabled ? (lang === "ar" ? "-translate-x-5.5" : "translate-x-5.5") : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    {/* Toggle Maintenance */}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-[#1a1612]">{lang === "ar" ? "وضع الصيانة الفنية" : "Developer Maintenance Lock"}</h4>
                        <p className="text-[11px] text-gray-500">{lang === "ar" ? "حظر دخول جميع الطلاب والمعلمين لإجراء فحوصات وتحديثات" : "Temporarily lock student workspaces for structural server upgrades."}</p>
                      </div>
                      <button
                        onClick={() => handleUpdateSettings("maintenanceMode", !systemSettings.maintenanceMode)}
                        className={`w-12 h-6.5 rounded-full p-0.5 transition duration-200 focus:outline-none ${
                          systemSettings.maintenanceMode ? "bg-[#c45a3a]" : "bg-gray-300"
                        }`}
                      >
                        <div className={`w-5.5 h-5.5 bg-white rounded-full shadow-md transform transition duration-200 ${
                          systemSettings.maintenanceMode ? (lang === "ar" ? "-translate-x-5.5" : "translate-x-5.5") : "translate-x-0"
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bulk Maintenance Tools */}
                <div className="bg-white border border-[#e8e2d9] p-6 rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-xs font-black text-[#1a1612] uppercase tracking-wide border-b border-gray-100 pb-3 text-red-500">
                    {lang === "ar" ? "أدوات الصيانة وقواعد البيانات الخطيرة" : "Database Maintenance & Reseeding Options"}
                  </h3>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-red-50/50 p-4 rounded-2xl border border-red-100">
                    <div>
                      <h4 className="text-xs font-bold text-red-900">{lang === "ar" ? "إعادة تعبئة قواعد البيانات بالنموذج المثالي" : "Reset System Database & Curriculums"}</h4>
                      <p className="text-[11px] text-red-700">{lang === "ar" ? "تنبيه: سيؤدي هذا الإجراء إلى حذف كافة الملاحظات والبيانات المسجلة وإعادة تهيئة المحاضرات الافتراضية للتطبيق." : "Resets entire system state. Restores curated Physics, Maths and Biology curriculum blueprints."}</p>
                    </div>
                    
                    <button
                      onClick={() => setIsReseedConfirmOpen(true)}
                      className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition whitespace-nowrap shadow-md shadow-red-600/10"
                    >
                      <Database className="w-4 h-4" />
                      {lang === "ar" ? "إعادة التعبئة الشاملة" : "Execute Reseed"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* EDIT VIDEO METADATA MODAL */}
      <AnimatePresence>
        {editingVideo && (
          <div className="fixed inset-0 z-[3500] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border rounded-3xl w-full max-w-md p-8 relative shadow-2xl"
            >
              <button 
                onClick={() => setEditingVideo(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-extrabold text-[#1a1612] mb-4">
                {lang === "ar" ? "تعديل معلومات الدرس" : "Edit Lecture Details"}
              </h3>

              <form onSubmit={handleEditVideoSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Title</label>
                  <input 
                    type="text" 
                    value={editVideoTitle}
                    onChange={(e) => setEditVideoTitle(e.target.value)}
                    className="w-full bg-[#faf8f5] border p-3 rounded-xl text-xs outline-none focus:border-[#c45a3a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Category / Classification</label>
                  <input 
                    type="text" 
                    value={editVideoCategory}
                    onChange={(e) => setEditVideoCategory(e.target.value)}
                    className="w-full bg-[#faf8f5] border p-3 rounded-xl text-xs outline-none focus:border-[#c45a3a]"
                    required
                  />
                </div>

                <button type="submit" className="w-full py-3 bg-[#c45a3a] hover:bg-[#c45a3a]/90 text-white font-bold text-xs rounded-xl shadow-lg mt-2 transition">
                  {lang === "ar" ? "حفظ التغييرات" : "Save Changes"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM DATABASE RESEED MODAL */}
      <AnimatePresence>
        {isReseedConfirmOpen && (
          <div className="fixed inset-0 z-[3500] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border rounded-3xl w-full max-w-sm p-6 relative shadow-2xl text-center"
            >
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className="text-sm font-black text-[#1a1612] uppercase mb-2">
                {lang === "ar" ? "تأكيد إعادة التعبئة الفورية" : "Confirm Database Blueprint Reseed"}
              </h3>
              <p className="text-xs text-[#5c554d] mb-6 leading-relaxed">
                {lang === "ar" ? "تحذير: سيؤدي هذا الإجراء إلى حذف كافة بيانات الملاحظات والنشاطات والحسابات المسجلة للطلاب وإرجاعها لنموذج المعاينة الأساسي. لا يمكن التراجع عن هذا الإجراء." : "Danger: This will wipe all user-created notes, comments, resources, and custom teacher videos. This operation cannot be undone."}
              </p>

              <div className="flex gap-3">
                <button 
                  onClick={() => setIsReseedConfirmOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#1a1612] font-bold text-xs rounded-xl transition"
                >
                  {lang === "ar" ? "إلغاء الأمر" : "Cancel"}
                </button>
                <button 
                  onClick={handleReseedDatabase}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-red-600/10"
                >
                  {lang === "ar" ? "نعم، أعد التعبئة!" : "Yes, Reseed!"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
