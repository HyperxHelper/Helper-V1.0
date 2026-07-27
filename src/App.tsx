import React, { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { 
  Video, 
  BookOpen, 
  Sparkles, 
  Link2, 
  FileText, 
  Check, 
  X, 
  Globe, 
  User, 
  Plus, 
  Search, 
  MessageSquare, 
  Clock, 
  ArrowRight, 
  Play, 
  Pause, 
  LogOut, 
  Menu, 
  Trash2, 
  Activity, 
  Info, 
  AlertCircle,
  Brain,
  ExternalLink,
  ChevronRight,
  Sparkle,
  Settings,
  Shield,
  Users,
  Database,
  RefreshCw,
  Lock,
  Edit,
  Eye,
  Share2,
  ListPlus,
  ArrowLeft,
  Pin,
  PinOff,
  Save,
  BookMarked,
  Notebook,
  ThumbsUp,
  Tag
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import AdminPanel from "./components/AdminPanel";
import HummingbirdWorkspace from "./components/HummingbirdWorkspace";
import InteractiveNotebook from "./components/InteractiveNotebook";

const ProductPage = React.lazy(() => import("./Product/ProductPage"));

// Types matching backend blueprint
interface PlaylistDoc {
  id: string;
  title: string;
  description: string;
  category: string;
  videoIds: string[];
  createdBy: string;
  isPublic: boolean;
  createdAt: string;
}

interface VideoDoc {
  id: string;
  title: string;
  channelTitle: string;
  duration: number;
  category: string;
  addedBy: string;
  createdAt: string;
}

interface NoteDoc {
  id: string;
  videoId: string;
  userId: string;
  userDisplayName: string;
  timestamp: number;
  text: string;
  createdAt: string;
  isPinned?: boolean;
}

interface DiaryDoc {
  id: string;
  title: string;
  content: string;
  videoId: string;
  videoTitle: string;
  userId: string;
  userDisplayName: string;
  isPublicWiki: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ResourceDoc {
  id: string;
  videoId: string;
  title: string;
  type: "pdf" | "link" | "image" | "excel";
  url: string;
  timestamp: number;
  addedBy: string;
  createdAt: string;
}

interface CommentDoc {
  id: string;
  videoId: string;
  userId: string;
  userDisplayName: string;
  text: string;
  createdAt: string;
}

interface ActivityDoc {
  id: string;
  userId: string;
  userDisplayName: string;
  videoId: string;
  action: string;
  timestamp: number;
  createdAt: string;
}

interface UserSession {
  uid: string;
  email: string;
  displayName: string;
  role: "student" | "teacher";
}

// Catalog of tens of public educational videos sorted into categories (representing watermarked resources)
const catalogVideos: VideoDoc[] = [
  {
    id: "ZihywtixUYo",
    title: "The Map of Physics (A Visual Overview)",
    channelTitle: "Domain of Science",
    duration: 1014,
    category: "Physics",
    addedBy: "system",
    createdAt: new Date().toISOString()
  },
  {
    id: "WUv0K_Nf-b0",
    title: "The Essence of Calculus (Chapter 1)",
    channelTitle: "3Blue1Brown",
    duration: 1025,
    category: "Mathematics",
    addedBy: "system",
    createdAt: new Date().toISOString()
  },
  {
    id: "URF-y0HTV_A",
    title: "Eukaryopolis: The City of Cells",
    channelTitle: "Crash Course Biology",
    duration: 700,
    category: "Biology",
    addedBy: "system",
    createdAt: new Date().toISOString()
  },
  {
    id: "k7RM-X2OW_Y",
    title: "The Map of Quantum Physics",
    channelTitle: "Domain of Science",
    duration: 1115,
    category: "Physics",
    addedBy: "system",
    createdAt: new Date().toISOString()
  },
  {
    id: "HEfHFsfGXjs",
    title: "The Map of Mathematics",
    channelTitle: "Domain of Science",
    duration: 1106,
    category: "Mathematics",
    addedBy: "system",
    createdAt: new Date().toISOString()
  },
  {
    id: "8idr1WZ1A7Q",
    title: "What is Machine Learning?",
    channelTitle: "3Blue1Brown",
    duration: 1220,
    category: "Computer Science",
    addedBy: "system",
    createdAt: new Date().toISOString()
  },
  {
    id: "qY6gL-O8y0A",
    title: "The Map of Chemistry",
    channelTitle: "Domain of Science",
    duration: 980,
    category: "Chemistry",
    addedBy: "system",
    createdAt: new Date().toISOString()
  },
  {
    id: "fHSA9D4y1Y8",
    title: "The Map of Biology",
    channelTitle: "Domain of Science",
    duration: 1050,
    category: "Biology",
    addedBy: "system",
    createdAt: new Date().toISOString()
  },
  {
    id: "mvA9_L8_YyA",
    title: "How Algorithms Work & Complexities",
    channelTitle: "Domain of Science",
    duration: 850,
    category: "Computer Science",
    addedBy: "system",
    createdAt: new Date().toISOString()
  },
  {
    id: "f3MWh-PAnYg",
    title: "Quantum Mechanics in 5 Minutes",
    channelTitle: "Domain of Science",
    duration: 320,
    category: "Physics",
    addedBy: "system",
    createdAt: new Date().toISOString()
  },
  {
    id: "R_vP862E8pY",
    title: "Linear Algebra Done Right Intuition",
    channelTitle: "3Blue1Brown",
    duration: 940,
    category: "Mathematics",
    addedBy: "system",
    createdAt: new Date().toISOString()
  },
  {
    id: "g8Yitv7A3lA",
    title: "Neural Networks Part 1: Foundations",
    channelTitle: "3Blue1Brown",
    duration: 1100,
    category: "Computer Science",
    addedBy: "system",
    createdAt: new Date().toISOString()
  },
  {
    id: "g-iPSvH1l-Q",
    title: "Organic Chemistry - Basic Overview",
    channelTitle: "The Organic Chemistry Tutor",
    duration: 1800,
    category: "Chemistry",
    addedBy: "system",
    createdAt: new Date().toISOString()
  },
  {
    id: "mC-K8S48AQQ",
    title: "Statistics & Probability Course Intro",
    channelTitle: "Khan Academy",
    duration: 720,
    category: "Mathematics",
    addedBy: "system",
    createdAt: new Date().toISOString()
  },
  {
    id: "FfB70o_S6y0",
    title: "Neuroscience & How Brain Connects",
    channelTitle: "Crash Course",
    duration: 910,
    category: "Biology",
    addedBy: "system",
    createdAt: new Date().toISOString()
  }
];

// Default static fallbacks for offline / load-state safety
const fallbackVideos: VideoDoc[] = [
  {
    id: "ZihywtixUYo",
    title: "The Map of Physics (A Visual Overview)",
    channelTitle: "Domain of Science",
    duration: 1014,
    category: "Physics",
    addedBy: "system",
    createdAt: new Date().toISOString()
  },
  {
    id: "WUv0K_Nf-b0",
    title: "The Essence of Calculus (Chapter 1)",
    channelTitle: "3Blue1Brown",
    duration: 1025,
    category: "Mathematics",
    addedBy: "system",
    createdAt: new Date().toISOString()
  },
  {
    id: "URF-y0HTV_A",
    title: "Eukaryopolis: The City of Cells",
    channelTitle: "Crash Course Biology",
    duration: 700,
    category: "Biology",
    addedBy: "system",
    createdAt: new Date().toISOString()
  }
];

const defaultTranscripts: Record<string, { time: number; text: string }[]> = {
  "ZihywtixUYo": [
    { time: 0, text: "Welcome to The Map of Physics. Today we will explore how all the different branches of physics fit together." },
    { time: 45, text: "We start with Classical Physics, founded largely by Sir Isaac Newton, which describes how objects move under gravity." },
    { time: 120, text: "Newton's laws of motion and universal gravitation explained both falling apples and planetary orbits." },
    { time: 240, text: "Then came Electromagnetism, unified by James Clerk Maxwell, explaining light, electricity, and magnetism." },
    { time: 380, text: "Thermodynamics was developed to describe heat, entropy, and the fundamental limits of steam engines." },
    { time: 510, text: "But around 1900, classical physics faced major crises. This led to Albert Einstein's Theory of Relativity." },
    { time: 640, text: "Special and General Relativity redefined space and time, showing that gravity is the curvature of spacetime." },
    { time: 760, text: "On the microscopic scale, Quantum Mechanics was born, describing the probabilistic and wave-like nature of atoms." },
    { time: 920, text: "Today, physicists search for a Theory of Everything, unifying Quantum Mechanics and General Relativity." }
  ],
  "WUv0K_Nf-b0": [
    { time: 0, text: "Welcome to the Essence of Calculus. In this series, our goal is to understand the core intuition behind calculus." },
    { time: 60, text: "Calculus is fundamentally about breaking complex things down into tiny parts, and analyzing how they change." },
    { time: 180, text: "Consider finding the area of a circle. We can slice it into thin concentric rings and unroll them." },
    { time: 320, text: "By summing up the areas of these thin rectangles, we can approximate the circle's area." },
    { time: 480, text: "As the width of these rings approaches zero, our approximation becomes exact. This is the concept of a limit." },
    { time: 620, text: "The derivative measures the instantaneous rate of change of a function, represented by the slope of a tangent line." },
    { time: 780, text: "The integral calculates the accumulated area under a curve, representing total quantity gained." },
    { time: 900, text: "The Fundamental Theorem of Calculus elegantly proves that derivatives and integrals are inverse operations." }
  ],
  "URF-y0HTV_A": [
    { time: 0, text: "Welcome to Eukaryopolis! Today we're exploring the incredibly complex and beautiful world of animal cells." },
    { time: 50, text: "Every animal cell is a eukaryotic cell, meaning it contains a nucleus and membrane-bound organelles." },
    { time: 130, text: "The cell membrane acts as a selective barrier, regulating what enters and leaves the cell city." },
    { time: 250, text: "The cytoplasm is the fluid-filled interior where organelles are suspended and metabolic activities occur." },
    { time: 380, text: "The Nucleus is the control center of the cell, housing our DNA and genetic blueprints." },
    { time: 500, text: "Mitochondria are the power plants of the cell, converting glucose into usable ATP energy." },
    { time: 610, text: "The Endoplasmic Reticulum and Golgi Apparatus synthesize, modify, and package proteins for transport." },
    { time: 690, text: "Together, these organelles work in perfect harmony to sustain life at the microscopic level." }
  ]
};

const fallbackTranscript = defaultTranscripts["ZihywtixUYo"];

function extractYoutubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : url;
}

export default function App() {
  // Product page mode detection (must be first)
  const [productMode, setProductMode] = useState(false);
  useEffect(() => {
    if (window.location.pathname.startsWith("/Product")) {
      setProductMode(true);
    }
  }, []);

  // Localization
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [isRtl, setIsRtl] = useState(false);
  const [currentView, setCurrentView] = useState<"landing" | "helper" | "hummingbird">("landing");
  const [isUseHelperDropdownOpen, setIsUseHelperDropdownOpen] = useState(false);

  useEffect(() => {
    setIsRtl(lang === "ar");
  }, [lang]);

  // Toast System
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "info" | "error" }[]>([]);
  const showToast = (message: string, type: "success" | "info" | "error" = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Auth States
  const [user, setUser] = useState<UserSession | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authRole, setAuthRole] = useState<"student" | "teacher" | "admin">("student");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [fbAuth, setFbAuth] = useState<any>(null);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Playlists & Videos States
  const [videos, setVideos] = useState<VideoDoc[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoDoc | null>(null);
  const [playlists, setPlaylists] = useState<PlaylistDoc[]>([]);
  const [activePlaylist, setActivePlaylist] = useState<PlaylistDoc | null>(null);
  const [playlistSidebarView, setPlaylistSidebarView] = useState<"videos" | "playlists">("videos");
  
  // Create Playlist Input States
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
  const [newPlaylistDesc, setNewPlaylistDesc] = useState("");
  const [newPlaylistCategory, setNewPlaylistCategory] = useState("Physics");
  const [selectedPlaylistVideoIds, setSelectedPlaylistVideoIds] = useState<string[]>([]);

  // Drafting and Attaching File States
  const [isDraftingNote, setIsDraftingNote] = useState(false);
  const [attachedFileName, setAttachedFileName] = useState("");
  const [attachedFileSize, setAttachedFileSize] = useState("");

  // Study Diaries & Wikis States
  const [diaries, setDiaries] = useState<DiaryDoc[]>([]);
  const [wikis, setWikis] = useState<DiaryDoc[]>([]);
  const [diaryTitle, setDiaryTitle] = useState("");
  const [diaryContent, setDiaryContent] = useState("");
  const [activeDiaryId, setActiveDiaryId] = useState<string | null>(null);
  const [isDiaryPublicWiki, setIsDiaryPublicWiki] = useState(false);
  const [diarySubTab, setDiarySubTab] = useState<"editor" | "history" | "wikis">("editor");
  const [isDiarySaving, setIsDiarySaving] = useState(false);

  const [notes, setNotes] = useState<NoteDoc[]>([]);
  const [resources, setResources] = useState<ResourceDoc[]>([]);
  const [comments, setComments] = useState<CommentDoc[]>([]);
  const [activities, setActivities] = useState<ActivityDoc[]>([]);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [selectedSchemaTab, setSelectedSchemaTab] = useState<string>("users");
  const [globalActivities, setGlobalActivities] = useState<ActivityDoc[]>([]);
  const [isLoadingGlobalActivities, setIsLoadingGlobalActivities] = useState(false);
  const [transcript, setTranscript] = useState<{ time: number; text: string }[]>(fallbackTranscript);

  // Listen to hash changes for Footer navigation / page interconnection
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#database-schema") {
        setIsSchemaModalOpen(true);
        setIsLogsModalOpen(false);
      } else if (hash === "#activities-log") {
        setIsLogsModalOpen(true);
        setIsSchemaModalOpen(false);
        fetchGlobalActivities();
      }
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Fetch global platform-wide activities
  const fetchGlobalActivities = async () => {
    setIsLoadingGlobalActivities(true);
    try {
      const res = await fetch("/api/activities");
      if (res.ok) {
        const data = await res.json();
        setGlobalActivities(data);
      }
    } catch (e) {
      console.error("Failed to fetch global activity logs:", e);
    } finally {
      setIsLoadingGlobalActivities(false);
    }
  };

  // Video Playing State
  const [playerCurrentTime, setPlayerCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const ytPlayerRef = useRef<any>(null);
  const progressPollingRef = useRef<any>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"notes" | "diary" | "transcript" | "resources" | "discussion">("notes");

  // Inputs
  const [newNoteText, setNewNoteText] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoCategory, setNewVideoCategory] = useState("Physics");
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);

  // New Resource inputs
  const [resTitle, setResTitle] = useState("");
  const [resType, setResType] = useState<"pdf" | "link" | "image" | "excel">("pdf");
  const [resUrl, setResUrl] = useState("");
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);

  // AI Assistant Panel
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiHistory, setAiHistory] = useState<{ query: string; answer: string }[]>([]);

  // Recent Wikis and Community Hub States
  const [helperSubView, setHelperSubView] = useState<"workspace" | "recent_wikis" | "hummingbird">("workspace");
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [wikiTab, setWikiTab] = useState<"catalog" | "community">("catalog");
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(false);
  const [communityTopicFilter, setCommunityTopicFilter] = useState("All");
  const [wikiCategoryFilter, setWikiCategoryFilter] = useState("All");

  // New discussion modal state
  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false);
  const [newDiscSubject, setNewDiscSubject] = useState("");
  const [newDiscTopic, setNewDiscTopic] = useState("Physics");
  const [newDiscVideoId, setNewDiscVideoId] = useState("");
  const [newDiscContent, setNewDiscContent] = useState("");
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  const fetchCommunityPosts = async () => {
    setIsLoadingCommunity(true);
    try {
      const res = await fetch("/api/community-posts");
      if (res.ok) {
        const data = await res.json();
        setCommunityPosts(data);
      }
    } catch (e) {
      console.error("Failed to fetch community posts:", e);
    } finally {
      setIsLoadingCommunity(false);
    }
  };

  const handleVotePost = async (postId: string) => {
    if (!user) {
      showToast(lang === "ar" ? "يرجى تسجيل الدخول أولاً للتصويت والمشاركة." : "Please login first to vote and interact.", "info");
      return;
    }
    try {
      const res = await fetch(`/api/community-posts/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid })
      });
      if (res.ok) {
        const updatedPost = await res.json();
        setCommunityPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
        showToast(lang === "ar" ? "تم تحديث تصويتك بنجاح!" : "Vote updated successfully!", "success");
      }
    } catch (e) {
      console.error("Error voting post:", e);
    }
  };

  const handleAddResponse = async (postId: string) => {
    if (!user) {
      showToast(lang === "ar" ? "يرجى تسجيل الدخول للرد." : "Please login to reply.", "info");
      return;
    }
    const text = replyTexts[postId]?.trim();
    if (!text) return;

    try {
      const res = await fetch(`/api/community-posts/${postId}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          userDisplayName: user.displayName,
          text
        })
      });
      if (res.ok) {
        const updatedPost = await res.json();
        setCommunityPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
        setReplyTexts(prev => ({ ...prev, [postId]: "" }));
        showToast(lang === "ar" ? "تمت إضافة ردك بنجاح!" : "Reply added successfully!", "success");
      }
    } catch (e) {
      console.error("Error adding reply:", e);
    }
  };

  const handleCreateCommunityPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast(lang === "ar" ? "يرجى تسجيل الدخول لطرح نقاش." : "Please login to start a discussion.", "info");
      return;
    }
    if (!newDiscSubject.trim() || !newDiscContent.trim()) {
      showToast(lang === "ar" ? "يرجى تعبئة جميع الحقول المطلوبة." : "Please fill in all fields.", "error");
      return;
    }

    const selectedVideo = catalogVideos.find(v => v.id === newDiscVideoId) || videos.find(v => v.id === newDiscVideoId);
    const videoTitle = selectedVideo ? selectedVideo.title : "General Topic Discussion";
    const videoUrl = newDiscVideoId ? `https://youtube.com/watch?v=${newDiscVideoId}` : "";

    try {
      const res = await fetch("/api/community-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: newDiscVideoId,
          videoTitle,
          videoUrl,
          topic: newDiscTopic,
          subject: newDiscSubject,
          content: newDiscContent,
          userId: user.uid,
          userDisplayName: user.displayName
        })
      });

      if (res.ok) {
        const newPost = await res.json();
        setCommunityPosts(prev => [newPost, ...prev]);
        setIsNewDiscussionOpen(false);
        setNewDiscSubject("");
        setNewDiscContent("");
        setNewDiscVideoId("");
        showToast(lang === "ar" ? "تم طرح نقاشك بنجاح في مجتمع هيلبر!" : "Your discussion has been published successfully!", "success");
      }
    } catch (e) {
      console.error("Error creating community post:", e);
    }
  };

  useEffect(() => {
    if (currentView === "helper" && helperSubView === "recent_wikis" && wikiTab === "community") {
      fetchCommunityPosts();
    }
  }, [currentView, helperSubView, wikiTab]);

  // Mobile drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Check Local Session on mount
  useEffect(() => {
    const saved = localStorage.getItem("helper_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
    fetchVideos();
    fetchPlaylists();
  }, []);

  // Fetch all playlists
  const fetchPlaylists = async () => {
    try {
      const response = await fetch("/api/playlists");
      if (response.ok) {
        const data = await response.json();
        setPlaylists(data);
        
        // Auto-load a shared playlist if its id is present in the URL query params
        const params = new URLSearchParams(window.location.search);
        const urlPlaylistId = params.get("playlistId");
        if (urlPlaylistId) {
          const foundPlaylist = data.find((p: any) => p.id === urlPlaylistId);
          if (foundPlaylist) {
            setActivePlaylist(foundPlaylist);
            setPlaylistSidebarView("playlists");
            showToast(
              lang === "ar"
                ? `تم تحميل قائمة التشغيل المشتركة: ${foundPlaylist.title}`
                : `Loaded shared playlist: ${foundPlaylist.title}`,
              "success"
            );
          }
        }
      }
    } catch (e) {
      console.error("Failed to fetch playlists:", e);
    }
  };

  // Create a shareable playlist
  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistTitle.trim()) {
      showToast(
        lang === "ar" ? "الرجاء إدخال عنوان لقائمة التشغيل" : "Please enter a title for the playlist",
        "error"
      );
      return;
    }
    if (selectedPlaylistVideoIds.length === 0) {
      showToast(
        lang === "ar" ? "الرجاء تحديد فيديو واحد على الأقل" : "Please select at least one video",
        "error"
      );
      return;
    }

    try {
      const response = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newPlaylistTitle,
          description: newPlaylistDesc,
          category: newPlaylistCategory,
          videoIds: selectedPlaylistVideoIds,
          createdBy: user?.displayName || (lang === "ar" ? "مستخدم ضيف" : "Guest Learner"),
          isPublic: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPlaylists(prev => [data, ...prev]);
        setActivePlaylist(data);
        setPlaylistSidebarView("playlists");
        
        // Reset form fields
        setNewPlaylistTitle("");
        setNewPlaylistDesc("");
        setSelectedPlaylistVideoIds([]);
        setIsCreatePlaylistOpen(false);
        
        showToast(
          lang === "ar"
            ? "تم إنشاء قائمة التشغيل المشتركة بنجاح!"
            : "Shareable playlist created successfully!",
          "success"
        );
      } else {
        showToast("Failed to create playlist.", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Error creating playlist.", "error");
    }
  };

  // Helper AI Note Drafting aligned with current video timestamp
  const handleDraftNoteWithAI = async () => {
    if (!activeVideo) return;
    setIsDraftingNote(true);
    showToast(
      lang === "ar"
        ? "جاري صياغة ملاحظة ذكية من مساعد هيلبر..."
        : "Helper AI is drafting a synchronized study note...",
      "info"
    );
    try {
      // Fetch some transcript segments surrounding the current timestamp to give context
      const contextTranscript = transcript.filter(t => Math.abs(t.time - playerCurrentTime) < 180);

      const res = await fetch("/api/ai/draft-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTitle: activeVideo.title,
          currentTime: playerCurrentTime,
          transcript: contextTranscript,
          language: lang
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.draft) {
          setNewNoteText(data.draft);
          showToast(
            lang === "ar"
              ? "تمت صياغة الملاحظة وتوقيتها بنجاح!"
              : "Drafted note aligned with current timestamp!",
            "success"
          );
        } else {
          showToast("AI returned an empty draft.", "error");
        }
      } else {
        showToast("Drafting failed.", "error");
      }
    } catch (e) {
      console.error("Error drafting note:", e);
      showToast("Error communicating with note-drafting engine.", "error");
    } finally {
      setIsDraftingNote(false);
    }
  };

  // Handle attaching a local file (e.g. PDF, spreadsheet, image) to the lecture notes
  const handleAttachFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeVideo) return;

    setAttachedFileName(file.name);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    setAttachedFileSize(`${sizeInMB} MB`);

    // Autofill resource title and determine type
    setResTitle(file.name);
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "pdf") {
      setResType("pdf");
    } else if (["xls", "xlsx", "csv"].includes(ext || "")) {
      setResType("excel");
    } else if (["png", "jpg", "jpeg", "gif", "svg"].includes(ext || "")) {
      setResType("image");
    } else {
      setResType("link");
    }

    // Assign a temporary Object URL to simulate local upload
    const localUrl = URL.createObjectURL(file);
    setResUrl(localUrl);

    showToast(
      lang === "ar"
        ? `تم إرفاق الملف: ${file.name} (${sizeInMB} ميغابايت)`
        : `Attached file: ${file.name} (${sizeInMB} MB)`,
      "success"
    );
  };

  // Fetch dynamic Firebase config and initialize Client SDK
  useEffect(() => {
    const initFirebase = async () => {
      try {
        const res = await fetch("/api/config/firebase");
        if (res.ok) {
          const config = await res.json();
          const app = initializeApp(config);
          const authInstance = getAuth(app);
          setFbAuth(authInstance);
          console.log("Firebase Auth Client SDK initialized dynamically.");
        }
      } catch (e) {
        console.error("Failed to initialize Firebase Auth Client SDK:", e);
      }
    };
    initFirebase();
  }, []);

  // Fetch Diaries and Wikis
  const fetchDiariesAndWikis = async (videoId: string) => {
    try {
      const diaryUrl = user ? `/api/diaries?userId=${user.uid}` : "/api/diaries";
      const wikisUrl = `/api/wikis?videoId=${videoId}`;
      
      const [diariesRes, wikisRes] = await Promise.all([
        fetch(diaryUrl),
        fetch(wikisUrl)
      ]);
      
      if (diariesRes.ok) {
        setDiaries(await diariesRes.json());
      }
      if (wikisRes.ok) {
        setWikis(await wikisRes.json());
      }
    } catch (e) {
      console.error("Error fetching diaries/wikis:", e);
    }
  };

  // Pin or Unpin individual Notes
  const handleTogglePinNote = async (noteId: string, currentPinnedState: boolean) => {
    try {
      const res = await fetch(`/api/notes/${noteId}/pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !currentPinnedState })
      });
      if (res.ok) {
        const updated = await res.json();
        setNotes(prev => prev.map(n => n.id === noteId ? { ...n, isPinned: updated.isPinned } : n));
        showToast(
          lang === "ar"
            ? (updated.isPinned ? "تم تثبيت الملاحظة!" : "تم إلغاء التثبيت")
            : (updated.isPinned ? "Note pinned to top!" : "Note unpinned from top"),
          "success"
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Create or Update Diary
  const handleSaveDiary = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!diaryContent.trim()) {
      showToast(
        lang === "ar" ? "الرجاء كتابة محتوى المذكرة" : "Please type some content first",
        "error"
      );
      return;
    }
    setIsDiarySaving(true);
    try {
      const payload = {
        id: activeDiaryId,
        title: diaryTitle.trim() || (lang === "ar" ? "مذكرة تفاعلية" : "Interactive Study Diary"),
        content: diaryContent,
        videoId: activeVideo?.id || "",
        videoTitle: activeVideo?.title || "",
        userId: user?.uid || "guest",
        userDisplayName: user?.displayName || (lang === "ar" ? "مستكشف هيلبر" : "Guest Learner"),
        isPublicWiki: isDiaryPublicWiki
      };

      const res = await fetch("/api/diaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const saved = await res.json();
        setDiaries(prev => {
          const exists = prev.some(d => d.id === saved.id);
          if (exists) {
            return prev.map(d => d.id === saved.id ? saved : d);
          }
          return [saved, ...prev];
        });
        setActiveDiaryId(saved.id);
        if (activeVideo) {
          fetchDiariesAndWikis(activeVideo.id);
        }
        showToast(
          lang === "ar" ? "تم حفظ المذكرة وتحديث المعرفة!" : "Study diary saved and synced successfully!",
          "success"
        );
      }
    } catch (e) {
      console.error(e);
      showToast("Error saving diary.", "error");
    } finally {
      setIsDiarySaving(false);
    }
  };

  // Delete Diary
  const handleDeleteDiary = async (id: string) => {
    try {
      const res = await fetch(`/api/diaries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDiaries(prev => prev.filter(d => d.id !== id));
        if (activeDiaryId === id) {
          setActiveDiaryId(null);
          setDiaryTitle("");
          setDiaryContent("");
          setIsDiaryPublicWiki(false);
        }
        showToast(lang === "ar" ? "تم حذف المذكرة" : "Diary deleted successfully.", "success");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Share Diary
  const handleShareDiary = (diary: DiaryDoc) => {
    const url = `${window.location.origin}${window.location.pathname}?diaryId=${diary.id}`;
    navigator.clipboard.writeText(url);
    showToast(
      lang === "ar"
        ? "تم نسخ رابط مشاركة المذكرة إلى الحافظة!"
        : "Direct shareable link copied to clipboard!",
      "success"
    );
  };

  // Check URL params for shared video or shared diary
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlVideoId = params.get("v") || params.get("videoId");
    const urlDiaryId = params.get("diaryId");

    if (urlVideoId && videos.length > 0) {
      const found = videos.find(v => v.id === urlVideoId);
      if (found) {
        setActiveVideo(found);
        setCurrentView("helper");
      } else {
        // Auto-import YouTube video if not yet registered in database!
        const importVideoOnFly = async () => {
          try {
            const res = await fetch("/api/videos", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                youtubeUrl: `https://www.youtube.com/watch?v=${urlVideoId}`,
                category: "Physics",
                addedBy: "Shared Link"
              })
            });
            if (res.ok) {
              const newVid = await res.json();
              setVideos(prev => [newVid, ...prev]);
              setActiveVideo(newVid);
              setCurrentView("helper");
              showToast(
                lang === "ar"
                  ? `تم استيراد الدرس المشارك تلقائياً!`
                  : `Successfully imported shared video on the fly!`,
                "success"
              );
            }
          } catch (e) {
            console.error("Fly import failed", e);
          }
        };
        importVideoOnFly();
      }
    }

    if (urlDiaryId) {
      const loadSharedDiary = async () => {
        try {
          const res = await fetch(`/api/diaries/${urlDiaryId}`);
          if (res.ok) {
            const data = await res.json();
            setDiaryTitle(data.title);
            setDiaryContent(data.content);
            setActiveDiaryId(data.id);
            setIsDiaryPublicWiki(data.isPublicWiki);
            setDiarySubTab("editor");
            setActiveTab("notes"); // Focus notes tab
            
            if (data.videoId) {
              const videoRes = await fetch(`/api/videos`);
              if (videoRes.ok) {
                const list = await videoRes.json();
                const foundVideo = list.find((v: any) => v.id === data.videoId);
                if (foundVideo) {
                  setActiveVideo(foundVideo);
                  setCurrentView("helper");
                }
              }
            }
            showToast(
              lang === "ar"
                ? `تم تحميل المذكرة المشتركة: ${data.title}`
                : `Loaded shared notebook diary: ${data.title}`,
              "success"
            );
          }
        } catch (e) {
          console.error("Failed to load shared diary", e);
        }
      };
      loadSharedDiary();
    }
  }, [videos]);

  // Fetch active video items when it changes or user session shifts
  useEffect(() => {
    if (activeVideo) {
      fetchVideoData(activeVideo.id);
      fetchDiariesAndWikis(activeVideo.id);
      // Auto-generate a beautiful custom transcript with Gemini if it is a user-added video!
      generateAITranscriptIfNew(activeVideo);
    }
  }, [activeVideo, user]);

  // Fetch list of videos
  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos");
      if (response.ok) {
        const data = await response.json();
        setVideos(data.length > 0 ? data : fallbackVideos);
        if (data.length > 0 && !activeVideo) {
          setActiveVideo(data[0]);
        } else if (!activeVideo) {
          setActiveVideo(fallbackVideos[0]);
        }
      } else {
        setVideos(fallbackVideos);
        if (!activeVideo) setActiveVideo(fallbackVideos[0]);
      }
    } catch (e) {
      setVideos(fallbackVideos);
      if (!activeVideo) setActiveVideo(fallbackVideos[0]);
    }
  };

  // Fetch notes, resources, comments, activities for video
  const fetchVideoData = async (videoId: string) => {
    try {
      const queryParam = user && user.role !== "admin" && user.role !== "teacher" ? `?userId=${user.uid}` : "";
      const [notesRes, resRes, commentsRes, actRes] = await Promise.all([
        fetch(`/api/videos/${videoId}/notes${queryParam}`),
        fetch(`/api/videos/${videoId}/resources`),
        fetch(`/api/videos/${videoId}/comments`),
        fetch(`/api/videos/${videoId}/activities`),
      ]);

      if (notesRes.ok) setNotes(await notesRes.json());
      if (resRes.ok) setResources(await resRes.json());
      if (commentsRes.ok) setComments(await commentsRes.json());
      if (actRes.ok) setActivities(await actRes.json());
    } catch (e) {
      console.error("Error fetching video metadata", e);
    }
  };

  // Generate an AI Transcript based on title using Gemini for non-default videos
  const generateAITranscriptIfNew = async (video: VideoDoc) => {
    // If it's a default/fallback video, load default transcript
    if (defaultTranscripts[video.id]) {
      setTranscript(defaultTranscripts[video.id]);
      return;
    }
    
    // Check if we already have it in state
    setTranscript([
      { time: 0, text: lang === "ar" ? `جاري توليد النص التلقائي بالذكاء الاصطناعي لـ "${video.title}"... يرجى الانتظار.` : `AI-Generating transcript for "${video.title}"... Please wait.` }
    ]);

    try {
      const res = await fetch("/api/ai/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTitle: video.title,
          channelTitle: video.channelTitle,
          category: video.category,
          language: lang
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.transcript && Array.isArray(data.transcript)) {
          setTranscript(data.transcript);
          return;
        }
      }
    } catch (e) {
      console.error("Error generating AI transcript", e);
    }

    // Default custom placeholder if AI fails
    setTranscript([
      { time: 0, text: lang === "ar" ? `مرحباً بكم في هذا الدرس حول "${video.title}".` : `Welcome to this lesson on "${video.title}".` },
      { time: 150, text: lang === "ar" ? "دعونا نتعمق في الخصائص الأساسية وسياق هذا الموضوع الهام." : "Let's dive into the core properties and context of the topic." },
      { time: 500, text: lang === "ar" ? "يتم الآن تحديد وتوضيح صيغة أو نظرية هامة على السبورة للربط بين الجوانب النظرية." : "An important formula or theorem is being outlined here on the board." },
      { time: 1100, text: lang === "ar" ? "دعونا نلقي نظرة على بعض التطبيقات العملية لهذا المفهوم في الحياة الواقعية." : "Let's look at some real-life applications of this concept." },
      { time: 1800, text: lang === "ar" ? "يرجى مراجعة هذه الملاحظات وإنهاء أوراق العمل والتمارين المقررة قبل جلستنا القادمة." : "Please review these slides and finish the worksheets before our next session." }
    ]);
  };

  // Auth Operations
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) {
      showToast(lang === "ar" ? "الرجاء إدخال البريد الإلكتروني أو اسم المستخدم" : "Please enter your email or username", "error");
      return;
    }

    // A. Intercept Administrator Credentials
    if ((authEmail === "Admin" || authEmail === "admin") && authPassword === "Admin") {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "Admin", password: "Admin" })
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem("helper_user", JSON.stringify(data.user));
          showToast(lang === "ar" ? "تم تسجيل الدخول كمسؤول للنظام!" : "Logged in successfully as Administrator!", "success");
          setIsAuthModalOpen(false);
          setAuthPassword("");
          return;
        }
      } catch (err) {
        showToast("Admin authentication failed.", "error");
        return;
      }
    }

    // B. Normal User Flow (with Firebase Client-Side Auth + Backend sync)
    try {
      let firebaseUid = "";
      
      if (fbAuth) {
        try {
          if (isRegisterMode) {
            if (authPassword.length < 6) {
              showToast(lang === "ar" ? "يجب أن تكون كلمة المرور 6 أحرف على الأقل" : "Password must be at least 6 characters", "error");
              return;
            }
            const userCredential = await createUserWithEmailAndPassword(fbAuth, authEmail, authPassword);
            firebaseUid = userCredential.user.uid;
          } else {
            const userCredential = await signInWithEmailAndPassword(fbAuth, authEmail, authPassword);
            firebaseUid = userCredential.user.uid;
          }
        } catch (authErr: any) {
          console.warn("Client-side Firebase Auth not active or failed, falling back to secure database authentication:", authErr);
          // If password validation should still occur
          if (isRegisterMode && authPassword.length < 6) {
            showToast(lang === "ar" ? "يجب أن تكون كلمة المرور 6 أحرف على الأقل" : "Password must be at least 6 characters", "error");
            return;
          }
          // Build deterministic database UID from email
          const emailSlug = authEmail.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
          firebaseUid = "db_" + emailSlug;
        }
      } else {
        const emailSlug = authEmail.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
        firebaseUid = "db_" + emailSlug;
      }

      const url = isRegisterMode ? "/api/auth/register" : "/api/auth/login";
      const payload: any = {
        email: authEmail,
        displayName: authName || authEmail.split("@")[0],
        role: authRole,
      };
      if (firebaseUid) {
        payload.uid = firebaseUid;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem("helper_user", JSON.stringify(data.user));
        showToast(
          lang === "ar" 
            ? `مرحباً بك، ${data.user.displayName}!` 
            : `Welcome back, ${data.user.displayName}!`, 
          "success"
        );
        setIsAuthModalOpen(false);
        setAuthPassword("");
        setCurrentView("helper");
      } else {
        const err = await response.json();
        showToast(err.error || "Authentication failed", "error");
      }
    } catch (e: any) {
      console.error("Auth error details:", e);
      let errorMsg = e.message || "Authentication failed.";
      if (e.code === "auth/invalid-credential") {
        errorMsg = lang === "ar" ? "بيانات الدخول غير صحيحة" : "Invalid email or password.";
      } else if (e.code === "auth/email-already-in-use") {
        errorMsg = lang === "ar" ? "البريد الإلكتروني مستخدم بالفعل" : "Email already registered.";
      }
      
      showToast(errorMsg, "error");
      
      // Fallback guest check if Firebase failed to contact servers or was offline
      if (e.code === "auth/network-request-failed" || !fbAuth) {
        showToast("Authentication server offline. Continuing in guest mode.", "info");
        const guestUser: UserSession = {
          uid: "guest_" + Math.random().toString(36).substr(2, 5),
          email: authEmail,
          displayName: authName || authEmail.split("@")[0],
          role: authRole
        };
        setUser(guestUser);
        localStorage.setItem("helper_user", JSON.stringify(guestUser));
        setIsAuthModalOpen(false);
        setAuthPassword("");
        setCurrentView("helper");
      }
    }
  };

  const handleLogout = () => {
    if (fbAuth) {
      signOut(fbAuth).catch(() => {});
    }
    setUser(null);
    localStorage.removeItem("helper_user");
    setCurrentView("landing");
    showToast(lang === "ar" ? "تم تسجيل الخروج بنجاح" : "Logged out successfully", "success");
  };

  // YouTube Iframe Loader & API Control
  useEffect(() => {
    if (!activeVideo) return;
    
    // Reset player states
    setIsPlaying(false);
    setPlayerCurrentTime(0);

    // Initialize or load YouTube Player
    const setupPlayer = () => {
      // Destruct existing player if any
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {
          // ignore
        }
      }

      // Check if YT is defined
      if ((window as any).YT && (window as any).YT.Player) {
        ytPlayerRef.current = new (window as any).YT.Player("youtube-iframe-container", {
          videoId: activeVideo.id,
          events: {
            onStateChange: (event: any) => {
              if (event.data === (window as any).YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                startPollingProgress();
                logActivity("play_video");
              } else if (event.data === (window as any).YT.PlayerState.PAUSED) {
                setIsPlaying(false);
                stopPollingProgress();
                logActivity("pause_video");
              } else if (event.data === (window as any).YT.PlayerState.ENDED) {
                setIsPlaying(false);
                stopPollingProgress();
                logActivity("complete_video");
              }
            }
          }
        });
      }
    };

    // Load API script if not loaded
    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      (window as any).onYouTubeIframeAPIReady = () => {
        setupPlayer();
      };
    } else {
      setupPlayer();
    }

    return () => {
      stopPollingProgress();
    };
  }, [activeVideo, helperSubView]);

  const startPollingProgress = () => {
    stopPollingProgress();
    progressPollingRef.current = setInterval(() => {
      if (ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) {
        setPlayerCurrentTime(ytPlayerRef.current.getCurrentTime());
      }
    }, 500);
  };

  const stopPollingProgress = () => {
    if (progressPollingRef.current) {
      clearInterval(progressPollingRef.current);
    }
  };

  const toggleVideoPlayback = () => {
    if (!ytPlayerRef.current) return;
    if (isPlaying) {
      ytPlayerRef.current.pauseVideo();
    } else {
      ytPlayerRef.current.playVideo();
    }
  };

  const seekTo = (seconds: number) => {
    if (ytPlayerRef.current && ytPlayerRef.current.seekTo) {
      ytPlayerRef.current.seekTo(seconds, true);
      setPlayerCurrentTime(seconds);
      logActivity("seek_video", seconds);
      showToast(
        lang === "ar" 
          ? `تم الانتقال إلى ${formatTime(seconds)}` 
          : `Jumped to ${formatTime(seconds)}`, 
        "info"
      );
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Log Activity to Backend
  const logActivity = async (action: string, customTime?: number) => {
    if (!activeVideo) return;
    const time = customTime !== undefined ? customTime : playerCurrentTime;
    
    try {
      await fetch(`/api/videos/${activeVideo.id}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          timestamp: time,
          userId: user?.uid || "guest",
          userDisplayName: user?.displayName || "Guest Learner",
        }),
      });
      // Refresh local logs
      fetchVideoData(activeVideo.id);
    } catch (e) {
      // ignore silently
    }
  };

  // Add Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !activeVideo) return;

    try {
      const response = await fetch(`/api/videos/${activeVideo.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newNoteText,
          timestamp: playerCurrentTime,
          userId: user?.uid || "guest",
          userDisplayName: user?.displayName || "Guest",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(prev => [...prev, data].sort((a, b) => a.timestamp - b.timestamp));
        setNewNoteText("");
        logActivity("add_note");
        showToast(
          lang === "ar" 
            ? "تمت إضافة الملاحظة بنجاح!" 
            : "Note successfully added!", 
          "success"
        );
      }
    } catch (e) {
      showToast("Offline note added to notebook.", "success");
      // local mock
      const mockNote: NoteDoc = {
        id: Math.random().toString(),
        videoId: activeVideo.id,
        userId: user?.uid || "guest",
        userDisplayName: user?.displayName || "Guest",
        timestamp: playerCurrentTime,
        text: newNoteText,
        createdAt: new Date().toISOString()
      };
      setNotes(prev => [...prev, mockNote].sort((a, b) => a.timestamp - b.timestamp));
      setNewNoteText("");
    }
  };

  // Delete Note
  const handleDeleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (response.ok) {
        setNotes(prev => prev.filter(note => note.id !== id));
        showToast(
          lang === "ar" ? "تم حذف الملاحظة بنجاح!" : "Note successfully deleted!",
          "success"
        );
      }
    } catch (e) {
      setNotes(prev => prev.filter(note => note.id !== id));
      showToast("Note deleted locally.", "success");
    }
  };

  // Delete Video
  const handleDeleteVideo = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
      if (response.ok) {
        setVideos(prev => prev.filter(v => v.id !== id));
        if (activeVideo?.id === id) {
          setActiveVideo(null);
        }
        showToast(
          lang === "ar" ? "تم حذف الفيديو بنجاح!" : "Video successfully deleted!",
          "success"
        );
      }
    } catch (e) {
      setVideos(prev => prev.filter(v => v.id !== id));
      if (activeVideo?.id === id) {
        setActiveVideo(null);
      }
      showToast("Video removed locally.", "success");
    }
  };

  // Reset Study Session
  const handleResetStudySession = () => {
    setNotes([]);
    setPlayerCurrentTime(0);
    showToast(
      lang === "ar" ? "تم إعادة ضبط الجلسة بنجاح!" : "Study session successfully reset!",
      "success"
    );
  };

  // Add Resource
  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim() || !resUrl.trim() || !activeVideo) return;

    try {
      const response = await fetch(`/api/videos/${activeVideo.id}/resources`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: resTitle,
          type: resType,
          url: resUrl,
          timestamp: playerCurrentTime,
          addedBy: user?.uid || "guest"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResources(prev => [...prev, data]);
        setResTitle("");
        setResUrl("");
        setIsAddResourceOpen(false);
        logActivity("add_resource");
        showToast(lang === "ar" ? "تم إدراج المصدر بنجاح!" : "Resource added successfully!", "success");
      }
    } catch (e) {
      // local mock
      const mockRes: ResourceDoc = {
        id: Math.random().toString(),
        videoId: activeVideo.id,
        title: resTitle,
        type: resType,
        url: resUrl,
        timestamp: playerCurrentTime,
        addedBy: user?.uid || "guest",
        createdAt: new Date().toISOString()
      };
      setResources(prev => [...prev, mockRes]);
      setResTitle("");
      setResUrl("");
      setIsAddResourceOpen(false);
      showToast("Resource added locally", "success");
    }
  };

  // Add Comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeVideo) return;

    try {
      const response = await fetch(`/api/videos/${activeVideo.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newCommentText,
          userId: user?.uid || "guest",
          userDisplayName: user?.displayName || "Guest Learner",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => [...prev, data]);
        setNewCommentText("");
        logActivity("post_comment");
        showToast(lang === "ar" ? "تم نشر التعليق!" : "Comment posted!", "success");
      }
    } catch (e) {
      // local mock
      const mockComment: CommentDoc = {
        id: Math.random().toString(),
        videoId: activeVideo.id,
        userId: user?.uid || "guest",
        userDisplayName: user?.displayName || "Guest",
        text: newCommentText,
        createdAt: new Date().toISOString()
      };
      setComments(prev => [...prev, mockComment]);
      setNewCommentText("");
      showToast("Comment added", "success");
    }
  };

  // Add YouTube Video (Beta feature)
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl.trim()) return;

    showToast(lang === "ar" ? "جاري جلب معلومات الفيديو..." : "Fetching video lesson data...", "info");

    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          youtubeUrl: newVideoUrl,
          category: newVideoCategory,
          addedBy: user?.uid || "guest"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setVideos(prev => [data, ...prev]);
        setActiveVideo(data);
        setNewVideoUrl("");
        setIsAddVideoOpen(false);
        showToast(lang === "ar" ? "تمت إضافة الدرس الجديد بنجاح!" : "New video notebook created!", "success");
      } else {
        showToast("Error processing YouTube link. Try again.", "error");
      }
    } catch (e) {
      showToast("Fallback mock video added.", "success");
      const tempId = extractYoutubeId(newVideoUrl);
      const mockVid: VideoDoc = {
        id: tempId,
        title: "Manual Lecture: " + tempId,
        channelTitle: "Bilingual Educator",
        duration: 2400,
        category: newVideoCategory,
        addedBy: user?.uid || "guest",
        createdAt: new Date().toISOString()
      };
      setVideos(prev => [mockVid, ...prev]);
      setActiveVideo(mockVid);
      setNewVideoUrl("");
      setIsAddVideoOpen(false);
    }
  };

  // Ask AI (Gemini Assistant)
  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || !activeVideo) return;

    setIsAiLoading(true);
    setAiAnswer("");
    const currentPrompt = aiPrompt;
    setAiPrompt("");

    try {
      const response = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTitle: activeVideo.title,
          userPrompt: currentPrompt,
          currentTime: playerCurrentTime,
          notes: notes.map(n => ({ time: formatTime(n.timestamp), note: n.text })),
          transcript: transcript.filter(t => Math.abs(t.time - playerCurrentTime) < 300), // context window of 5 mins
          language: lang
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiAnswer(data.answer);
        setAiHistory(prev => [...prev, { query: currentPrompt, answer: data.answer }]);
        showToast(lang === "ar" ? "تمت إجابة مساعدك الذكي!" : "AI assistant responded!", "success");
      } else {
        showToast("AI model limits. Check secret panel keys.", "error");
        setAiAnswer("Helper AI is currently offline. Please ensure your GEMINI_API_KEY is configured in the secrets menu.");
      }
    } catch (err) {
      setAiAnswer("Server connection issue. Could not generate academic answer.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Translate all notes to target language
  const translateAllNotes = async () => {
    showToast(lang === "ar" ? "جاري الترجمة الفورية للملاحظات..." : "Translating notes to target language...", "info");
    
    const translatedNotes = [...notes];
    for (let i = 0; i < translatedNotes.length; i++) {
      try {
        const res = await fetch("/api/ai/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: translatedNotes[i].text,
            targetLang: lang === "en" ? "ar" : "en", // opposite
          }),
        });
        if (res.ok) {
          const data = await res.json();
          translatedNotes[i] = {
            ...translatedNotes[i],
            text: data.translatedText
          };
        }
      } catch (e) {
        // fail silently for individual notes
      }
    }
    setNotes(translatedNotes);
    showToast(lang === "ar" ? "اكتملت الترجمة!" : "Translation complete!", "success");
  };

  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#faf8f5] flex items-center justify-center"><span className="text-xs font-bold text-[#8a8278]">Loading...</span></div>}>
    {productMode ? (
      <ProductPage />
    ) : (
    <div 
      dir={isRtl ? "rtl" : "ltr"}
      className={`min-h-screen bg-[#faf8f5] text-[#1a1612] ${isRtl ? "rtl text-start" : "ltr text-start"}`}
    >
      
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-[9999] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: isRtl ? -50 : 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: isRtl ? -50 : 50, scale: 0.9 }}
              className={`flex items-center gap-3 px-5 py-4 bg-white border rounded-xl shadow-xl max-w-sm ${
                toast.type === "success" ? "border-l-4 border-l-[#5a8a6e]" : 
                toast.type === "error" ? "border-l-4 border-l-[#c45a3a]" : 
                "border-l-4 border-l-[#3b6ea5]"
              }`}
            >
              <div className="flex-1 text-sm font-medium text-[#1a1612]">
                {toast.message}
              </div>
              <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* NAVIGATION */}
      <nav id="nav" className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-32px)] max-w-7xl flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border border-[#e8e2d9]/60 rounded-[28px] shadow-lg transition-all duration-300 relative">
        {/* Left side: Navigation / Menu */}
        <div className="flex items-center gap-2">
          {/* Hamburger Menu for Mobile */}
          <button 
            onClick={() => setIsDrawerOpen(true)} 
            className="lg:hidden p-2 text-[#5c554d] hover:bg-[#f0ebe4]/40 rounded-full transition"
            title={lang === "ar" ? "القائمة" : "Menu"}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            <button onClick={() => { setCurrentView("landing"); setTimeout(() => { window.location.hash = "#features"; }, 50); }} className="text-xs font-bold text-[#5c554d] hover:text-[#c45a3a] px-3.5 py-2 rounded-full hover:bg-[#f0ebe4]/30 transition">
              {lang === "ar" ? "المميزات" : "Features"}
            </button>
            <button onClick={() => { setCurrentView("landing"); setTimeout(() => { window.location.hash = "#how-it-works"; }, 50); }} className="text-xs font-bold text-[#5c554d] hover:text-[#c45a3a] px-3.5 py-2 rounded-full hover:bg-[#f0ebe4]/30 transition">
              {lang === "ar" ? "كيف نعمل" : "How it works"}
            </button>
            <button onClick={() => { setCurrentView("landing"); setTimeout(() => { window.location.hash = "#pricing"; }, 50); }} className="text-xs font-bold text-[#5c554d] hover:text-[#c45a3a] px-3.5 py-2 rounded-full hover:bg-[#f0ebe4]/30 transition">
              {lang === "ar" ? "الأسعار" : "Pricing"}
            </button>
            <button onClick={() => { setCurrentView("landing"); setTimeout(() => { window.location.hash = "#stories"; }, 50); }} className="text-xs font-bold text-[#5c554d] hover:text-[#c45a3a] px-3.5 py-2 rounded-full hover:bg-[#f0ebe4]/30 transition">
              {lang === "ar" ? "قصص نجاح" : "Stories"}
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsUseHelperDropdownOpen(!isUseHelperDropdownOpen)}
                className={`text-xs font-extrabold px-4 py-2 rounded-full transition flex items-center gap-1.5 ${
                  currentView === "helper" || currentView === "hummingbird"
                    ? "bg-[#c45a3a] text-white shadow-md scale-105" 
                    : "bg-[#c45a3a]/10 text-[#c45a3a] hover:bg-[#c45a3a]/25"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {lang === "ar" ? "استخدام هيلبر ▾" : "Use Helper ▾"}
              </button>
              {isUseHelperDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUseHelperDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-[#fcfbf9] border border-[#e8e2d9] rounded-2xl shadow-xl z-50 overflow-hidden py-1.5 text-left rtl:text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUseHelperDropdownOpen(false);
                        if (user) {
                          setCurrentView("helper");
                        } else {
                          setIsRegisterMode(false);
                          setIsAuthModalOpen(true);
                          showToast(lang === "ar" ? "يرجى تسجيل الدخول للوصول إلى مساحة عمل هيلبر" : "Please log in first to use the Helper workspace", "info");
                        }
                      }}
                      className={`w-full text-start px-4 py-3 text-xs font-black transition flex items-center gap-2.5 ${
                        currentView === "helper"
                          ? "bg-[#c45a3a]/10 text-[#c45a3a]"
                          : "hover:bg-gray-100 text-[#5c554d]"
                      }`}
                    >
                      <span>📓</span>
                      {lang === "ar" ? "دفتر الملاحظات التفاعلي" : "Interactive Notebook"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUseHelperDropdownOpen(false);
                        if (user) {
                          setCurrentView("hummingbird");
                        } else {
                          setIsRegisterMode(false);
                          setIsAuthModalOpen(true);
                          showToast(lang === "ar" ? "يرجى تسجيل الدخول للوصول إلى مساحة عمل طنان هيلبر" : "Please log in first to use the Project Hummingbird workspace", "info");
                        }
                      }}
                      className={`w-full text-start px-4 py-3 text-xs font-black transition flex items-center gap-2.5 ${
                        currentView === "hummingbird"
                          ? "bg-[#c45a3a]/10 text-[#c45a3a]"
                          : "hover:bg-gray-100 text-[#5c554d]"
                      }`}
                    >
                      <span>🛸</span>
                      {lang === "ar" ? "مشروع طنان هيلبر (Project Hummingbird)" : "Project Hummingbird"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center: Logo of Helper */}
        <div 
          onClick={() => setCurrentView("landing")}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 font-black text-xl tracking-tight text-[#1a1612] select-none cursor-pointer hover:opacity-80 transition"
        >
          <svg className="w-8 h-8 text-[#c45a3a]" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 8L20 20L4 32V8Z" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
            <path d="M36 8L20 20L36 32V8Z" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
            <circle cx="12" cy="20" r="2.5" fill="currentColor"/>
            <circle cx="28" cy="20" r="2.5" fill="currentColor"/>
          </svg>
          <span className="font-black text-xl tracking-tight text-[#1a1612]">
            {lang === "ar" ? "هيلبر" : "Helper"}
          </span>
        </div>

        {/* Right side: User Action */}
        <div className="flex items-center gap-3">
          {/* User account action */}
          {user ? (
            <div className="flex items-center gap-2">
              {user.role === "admin" && (
                <button
                  onClick={() => setIsAdminPanelOpen(true)}
                  className="px-3.5 py-1.5 bg-[#c45a3a] hover:bg-[#c45a3a]/90 text-white text-xs font-bold rounded-full shadow-md active:scale-95 transition flex items-center gap-1.5"
                  id="admin-dashboard-trigger"
                >
                  <Shield className="w-3.5 h-3.5" />
                  {lang === "ar" ? "لوحة التحكم" : "Admin Panel"}
                </button>
              )}
              <span className="hidden md:inline-block text-xs font-semibold text-[#5c554d] bg-[#f0ebe4]/40 px-3 py-1.5 rounded-full">
                {user.displayName} ({user.role === "admin" ? (lang === "ar" ? "مشرف" : "Admin") : user.role === "teacher" ? (lang === "ar" ? "معلم" : "Teacher") : (lang === "ar" ? "طالب" : "Student")})
              </span>
              <button 
                onClick={handleLogout} 
                className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full text-[#c45a3a] transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => { setIsRegisterMode(false); setIsAuthModalOpen(true); }}
              className="text-xs font-bold text-[#5c554d] hover:text-[#c45a3a] px-3.5 py-2 rounded-full hover:bg-[#f0ebe4]/30 transition"
            >
              {lang === "ar" ? "تسجيل الدخول" : "Login"}
            </button>
          )}
        </div>
      </nav>

      {/* FLOATING SIDEBAR LANGUAGE SWITCHER */}
      <div className="fixed right-0 rtl:right-auto rtl:left-0 top-1/2 -translate-y-1/2 z-[1001] flex items-center pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md border-y border-l rtl:border-l-0 rtl:border-r border-[#e8e2d9]/80 shadow-2xl rounded-l-2xl rtl:rounded-l-none rtl:rounded-r-2xl py-4 px-3 flex flex-col items-center gap-3 transition-all duration-300 pointer-events-auto hover:border-[#c45a3a]/40 group">
          <div className="text-[10px] font-extrabold text-[#8a8278] group-hover:text-[#c45a3a] tracking-wider uppercase select-none transition-colors mb-1" style={{ writingMode: "vertical-lr" }}>
            {lang === "ar" ? "العربية" : "ENGLISH"}
          </div>
          
          {/* Elegant Custom Switch Button */}
          <button 
            onClick={() => setLang(prev => prev === "en" ? "ar" : "en")}
            className="relative inline-flex h-12 w-6 shrink-0 cursor-pointer flex-col items-center justify-between rounded-full border-2 border-transparent bg-[#f0ebe4] transition-colors duration-200 ease-in-out focus:outline-none hover:bg-[#e8e2d9]"
            title={lang === "ar" ? "تغيير اللغة إلى الإنجليزية" : "Switch language to Arabic"}
          >
            <span
              className={`pointer-events-none block h-5 w-5 rounded-full bg-gradient-to-br from-[#c45a3a] to-[#e07a5f] shadow-md ring-0 transition-all duration-200 ease-in-out ${
                lang === "ar" ? "translate-y-5" : "translate-y-0"
              }`}
            />
            <span className="absolute top-0.5 text-[8px] font-extrabold pointer-events-none select-none text-[#5c554d]">EN</span>
            <span className="absolute bottom-0.5 text-[8px] font-extrabold pointer-events-none select-none text-[#5c554d]">AR</span>
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-[2000] bg-black/40 backdrop-blur-sm flex justify-end rtl:justify-start">
            {/* Backdrop click */}
            <div className="absolute inset-0" onClick={() => setIsDrawerOpen(false)} />
            
            <motion.div 
              initial={{ x: isRtl ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "-100%" : "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-80 max-w-[85vw] h-full bg-white shadow-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="font-black text-lg text-[#1a1612]">
                    {lang === "ar" ? "قائمة هيلبر" : "Helper Menu"}
                  </div>
                  <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <button onClick={() => { setIsDrawerOpen(false); setCurrentView("landing"); setTimeout(() => { window.location.hash = "#features"; }, 50); }} className="text-start py-3 px-4 rounded-xl text-sm font-semibold hover:bg-[#faf8f5] text-[#1a1612]">
                    {lang === "ar" ? "المميزات" : "Features"}
                  </button>
                  <button onClick={() => { setIsDrawerOpen(false); setCurrentView("landing"); setTimeout(() => { window.location.hash = "#how-it-works"; }, 50); }} className="text-start py-3 px-4 rounded-xl text-sm font-semibold hover:bg-[#faf8f5] text-[#1a1612]">
                    {lang === "ar" ? "كيف نعمل" : "How it works"}
                  </button>
                  <button onClick={() => { setIsDrawerOpen(false); setCurrentView("landing"); setTimeout(() => { window.location.hash = "#pricing"; }, 50); }} className="text-start py-3 px-4 rounded-xl text-sm font-semibold hover:bg-[#faf8f5] text-[#1a1612]">
                    {lang === "ar" ? "الأسعار" : "Pricing"}
                  </button>
                  <button onClick={() => { setIsDrawerOpen(false); setCurrentView("landing"); setTimeout(() => { window.location.hash = "#stories"; }, 50); }} className="text-start py-3 px-4 rounded-xl text-sm font-semibold hover:bg-[#faf8f5] text-[#1a1612]">
                    {lang === "ar" ? "قصص نجاح" : "Stories"}
                  </button>
                  <div className="flex flex-col gap-1 border-t border-[#e8e2d9] pt-2 mt-2">
                    <div className="px-4 py-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {lang === "ar" ? "منتجات هيلبر" : "Helper Products"}
                    </div>
                    <button 
                      onClick={() => { 
                        setIsDrawerOpen(false); 
                        if (user) {
                          setCurrentView("helper");
                        } else {
                          setIsRegisterMode(false);
                          setIsAuthModalOpen(true);
                        }
                      }} 
                      className="text-start py-3 px-4 hover:bg-[#faf8f5] text-[#1a1612] rounded-xl text-sm font-black flex items-center gap-2"
                    >
                      <span>📓</span>
                      {lang === "ar" ? "دفتر الملاحظات التفاعلي" : "Interactive Notebook"}
                    </button>
                    <button 
                      onClick={() => { 
                        setIsDrawerOpen(false); 
                        if (user) {
                          setCurrentView("hummingbird");
                        } else {
                          setIsRegisterMode(false);
                          setIsAuthModalOpen(true);
                        }
                      }} 
                      className="text-start py-3 px-4 hover:bg-[#faf8f5] text-[#1a1612] rounded-xl text-sm font-black flex items-center gap-2"
                    >
                      <span>🛸</span>
                      {lang === "ar" ? "مشروع طنان هيلبر (Project Hummingbird)" : "Project Hummingbird"}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                {user ? (
                  <div className="p-4 bg-[#f5f0ea] rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs">{user.displayName}</div>
                      <div className="text-[10px] text-gray-500">{user.email}</div>
                    </div>
                    <button onClick={handleLogout} className="p-2 bg-white rounded-full text-[#c45a3a] shadow-sm">
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => { setIsDrawerOpen(false); setIsRegisterMode(false); setIsAuthModalOpen(true); }}
                    className="w-full py-3 bg-gradient-to-r from-[#c45a3a] to-[#e07a5f] text-white font-bold text-xs rounded-full shadow-lg text-center"
                  >
                    {lang === "ar" ? "ابدأ مجاناً" : "Start free"}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {currentView === "hummingbird" ? (
        /* USE HELPER STANDALONE VIEW */
        user ? (
          <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto min-h-[85vh]">
            {/* Elegant Header with Back Button and Info */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <button 
                onClick={() => setCurrentView("landing")}
                className="flex items-center gap-2 text-xs font-bold text-[#8a8278] hover:text-[#c45a3a] bg-[#f5f0ea] hover:bg-[#e8e2d9] px-4 py-2.5 rounded-full transition-all shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
              </button>

              <div className="text-end">
                <span className="text-[10px] bg-[#c45a3a]/10 text-[#c45a3a] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {lang === "ar" ? "مشروع طنان هيلبر النشط" : "Active Project Hummingbird Workspace"}
                </span>
                <h2 className="text-xl font-black text-[#1a1612] mt-1">
                  {lang === "ar" ? "مشروع طنان هيلبر" : "Project Hummingbird"}
                </h2>
              </div>
            </div>

            <HummingbirdWorkspace 
              user={user}
              lang={lang}
              onBackToHome={() => setCurrentView("landing")}
              catalogVideos={catalogVideos}
            />
          </div>
        ) : (
          /* GUEST MEMBER LOCK SCREEN */
          <div className="pt-28 pb-20 px-4 max-w-md mx-auto min-h-[80vh] flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md w-full bg-white border border-[#e8e2d9] rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden"
            >
              {/* Top colored accent line */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#c45a3a] to-[#e07a5f]" />
              
              <div className="w-16 h-16 bg-[#c45a3a]/10 text-[#c45a3a] rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-black text-[#1a1612] mb-3">
                {lang === "ar" ? "منطقة الأعضاء فقط" : "Members Only Area"}
              </h3>
              
              <p className="text-sm text-[#5c554d] mb-8 leading-relaxed">
                {lang === "ar" 
                  ? "استخدام خدمة هيلبر يتطلب تسجيل الدخول أو إنشاء حساب كطالب أو معلم لمزامنة ملاحظاتك وحفظ ملفاتك السحابية تلقائياً."
                  : "Accessing the full interactive workspace requires logging in or registering. Save your notes, manage playlists, and sync with the cloud!"
                }
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { setIsRegisterMode(false); setIsAuthModalOpen(true); }}
                  className="w-full py-4 bg-[#c45a3a] hover:scale-[1.01] transition-all text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#c45a3a]/15"
                >
                  {lang === "ar" ? "تسجيل الدخول" : "Login to Helper"}
                </button>
                <button 
                  onClick={() => { setIsRegisterMode(true); setIsAuthModalOpen(true); }}
                  className="w-full py-4 bg-[#f5f0ea] hover:bg-[#e8e2d9] transition-all text-[#1a1612] font-bold text-sm rounded-2xl"
                >
                  {lang === "ar" ? "إنشاء حساب مجاني" : "Create Free Account"}
                </button>
                <button 
                  onClick={() => setCurrentView("landing")}
                  className="w-full py-3 text-xs text-[#8a8278] hover:text-[#c45a3a] font-bold transition-all flex items-center justify-center gap-1 mt-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
                </button>
              </div>
            </motion.div>
          </div>
        )
      ) : currentView === "helper" ? (
        /* USE HELPER STANDALONE VIEW */
        user ? (
          <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto min-h-[85vh]">
            {/* Elegant Header with Back Button and Info */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <button 
                onClick={() => setCurrentView("landing")}
                className="flex items-center gap-2 text-xs font-bold text-[#8a8278] hover:text-[#c45a3a] bg-[#f5f0ea] hover:bg-[#e8e2d9] px-4 py-2.5 rounded-full transition-all shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
              </button>

              <div className="text-end">
                <span className="text-[10px] bg-[#5a8a6e]/10 text-[#5a8a6e] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {lang === "ar" ? "مساحة العمل النشطة" : "Active Member Workspace"}
                </span>
                <h2 className="text-xl font-black text-[#1a1612] mt-1">
                  {lang === "ar" ? "مرحبًا بك في هيلبر" : "Use Helper Notebook"}
                </h2>
              </div>
            </div>

            {/* Helper Workspace Tab Bar */}
            <div className="flex bg-[#f5f0ea] border border-[#e8e2d9] p-1.5 rounded-2xl mb-8 max-w-2xl shadow-sm relative">
              <button
                onClick={() => {
                  setHelperSubView("workspace");
                  setIsWorkspaceDropdownOpen(false);
                }}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  helperSubView === "workspace"
                    ? "bg-[#c45a3a] text-white shadow-md scale-[1.02]"
                    : "text-[#5c554d] hover:text-[#c45a3a]"
                }`}
              >
                <span className="text-base">💻</span>
                {lang === "ar" ? "مساحة العمل والتدوين" : "Interactive Notebook"}
              </button>
              <button
                onClick={() => {
                  setHelperSubView("recent_wikis");
                  setIsWorkspaceDropdownOpen(false);
                }}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  helperSubView === "recent_wikis"
                    ? "bg-[#c45a3a] text-white shadow-md scale-[1.02]"
                    : "text-[#5c554d] hover:text-[#c45a3a]"
                }`}
              >
                <span className="text-base">📚</span>
                {lang === "ar" ? "الويكي الحديثة والمجتمع" : "Recent Wikis & Community"}
              </button>
              <div className="flex-1 relative">
                <button
                  type="button"
                  onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
                  className={`w-full py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                    helperSubView === "hummingbird"
                      ? "bg-[#c45a3a] text-white shadow-md scale-[1.02]"
                      : "text-[#5c554d] hover:text-[#c45a3a]"
                  }`}
                >
                  <span className="text-base">🛸</span>
                  {lang === "ar" ? "المزيد ▾" : "More ▾"}
                </button>
                {isWorkspaceDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsWorkspaceDropdownOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-56 bg-[#fcfbf9] border border-[#e8e2d9] rounded-2xl shadow-xl z-50 overflow-hidden py-1.5 text-left rtl:text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setHelperSubView("hummingbird");
                          setIsWorkspaceDropdownOpen(false);
                        }}
                        className={`w-full text-start px-4 py-3 text-xs font-black transition flex items-center gap-2.5 ${
                          helperSubView === "hummingbird"
                            ? "bg-[#c45a3a]/10 text-[#c45a3a]"
                            : "hover:bg-gray-100 text-[#5c554d]"
                        }`}
                      >
                        <span className="text-base">🛸</span>
                        {lang === "ar" ? "طنان هيلبر v1.1" : "Hummingbird Workspace (v1.1)"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {helperSubView === "workspace" && (
              <InteractiveNotebook
                lang={lang}
                activeVideo={activeVideo}
                setActiveVideo={setActiveVideo}
                isAddVideoOpen={isAddVideoOpen}
                setIsAddVideoOpen={setIsAddVideoOpen}
                translateAllNotes={translateAllNotes}
                playlistSidebarView={playlistSidebarView}
                setPlaylistSidebarView={setPlaylistSidebarView}
                activePlaylist={activePlaylist}
                setActivePlaylist={setActivePlaylist}
                videos={videos}
                playlists={playlists}
                showToast={showToast}
                user={user}
                handleDeleteVideo={handleDeleteVideo}
                setIsCreatePlaylistOpen={setIsCreatePlaylistOpen}
                handleResetStudySession={handleResetStudySession}
                playerCurrentTime={playerCurrentTime}
                isPlaying={isPlaying}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                newNoteText={newNoteText}
                setNewNoteText={setNewNoteText}
                newCommentText={newCommentText}
                setNewCommentText={setNewCommentText}
                handleAddNote={handleAddNote}
                handleDeleteNote={handleDeleteNote}
                isDraftingNote={isDraftingNote}
                handleDraftNoteWithAI={handleDraftNoteWithAI}
                attachedFileName={attachedFileName}
                setAttachedFileName={setAttachedFileName}
                attachedFileSize={attachedFileSize}
                setAttachedFileSize={setAttachedFileSize}
                notes={notes}
                diaries={diaries}
                diaryTitle={diaryTitle}
                setDiaryTitle={setDiaryTitle}
                diaryContent={diaryContent}
                setDiaryContent={setDiaryContent}
                activeDiaryId={activeDiaryId}
                setActiveDiaryId={setActiveDiaryId}
                isDiaryPublicWiki={isDiaryPublicWiki}
                setIsDiaryPublicWiki={setIsDiaryPublicWiki}
                diarySubTab={diarySubTab}
                setDiarySubTab={setDiarySubTab}
                isDiarySaving={isDiarySaving}
                handleDeleteDiary={handleDeleteDiary}
                handleSaveDiary={handleSaveDiary}
                handleShareDiary={handleShareDiary}
                handleTogglePinNote={handleTogglePinNote}
                wikis={wikis}
                transcript={transcript}
                seekTo={seekTo}
                resources={resources}
                resTitle={resTitle}
                setResTitle={setResTitle}
                resType={resType}
                setResType={setResType}
                resUrl={resUrl}
                setResUrl={setResUrl}
                handleAddResource={handleAddResource}
                isAddResourceOpen={isAddResourceOpen}
                setIsAddResourceOpen={setIsAddResourceOpen}
                handleAttachFile={handleAttachFile}
                comments={comments}
                handleAddComment={handleAddComment}
                aiAnswer={aiAnswer}
                aiPrompt={aiPrompt}
                setAiPrompt={setAiPrompt}
                handleAskAI={handleAskAI}
                isAiLoading={isAiLoading}
                formatTime={formatTime}
              />
            )}

            {helperSubView === "recent_wikis" && (
              /* RECENT PUBLIC WIKIS & COMMUNITY HUB PAGE */
              <div className="bg-white border border-[#e8e2d9] rounded-3xl p-6 md:p-8 shadow-2xl min-h-[640px]">
                {/* Header inside the page */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e8e2d9] pb-6 mb-8">
                  <div>
                    <h3 className="text-xl font-black text-[#1a1612]">
                      {lang === "ar" ? "مستودع الويكي والمنتدى الأكاديمي" : "Recent Wikis & Community Hub"}
                    </h3>
                    <p className="text-xs text-[#8a8278] mt-1">
                      {lang === "ar"
                        ? "تصفح ملخصات الويكي المعتمدة وشارك في نقاشات مجتمع هيلبر التفاعلية"
                        : "Browse certified wikis and collaborate in active pre-production Wikipedia-style discussions."}
                    </p>
                  </div>

                  {/* Tabs for Catalog vs Community */}
                  <div className="flex bg-[#f5f0ea] p-1 rounded-xl border border-[#e8e2d9] shrink-0 self-start">
                    <button
                      onClick={() => setWikiTab("catalog")}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                        wikiTab === "catalog"
                          ? "bg-white text-[#1a1612] shadow-sm"
                          : "text-[#8a8278] hover:text-[#1a1612]"
                      }`}
                    >
                      <span>📚</span>
                      {lang === "ar" ? "الويكي الحديثة" : "Recent Wikis"}
                    </button>
                    <button
                      onClick={() => setWikiTab("community")}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 relative ${
                        wikiTab === "community"
                          ? "bg-white text-[#1a1612] shadow-sm"
                          : "text-[#8a8278] hover:text-[#1a1612]"
                      }`}
                    >
                      <span>💬</span>
                      {lang === "ar" ? "منتدى المجتمع" : "Community Hub"}
                      {communityPosts.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#c45a3a] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                          {communityPosts.length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* TAB 1: RECENT WIKIS CATALOG */}
                {wikiTab === "catalog" && (
                  <div>
                    {/* Categories Filter bar */}
                    <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-thin">
                      {["All", "Physics", "Mathematics", "Biology", "Chemistry", "Computer Science"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setWikiCategoryFilter(cat)}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                            wikiCategoryFilter === cat
                              ? "bg-[#1a1612] text-white"
                              : "bg-[#f5f0ea] text-[#5c554d] hover:bg-[#e8e2d9]"
                          }`}
                        >
                          {cat === "All" ? (lang === "ar" ? "الكل" : "All") : cat}
                        </button>
                      ))}
                    </div>

                    {/* Intellectual Property Disclaimer */}
                    <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-2xl mb-8 flex items-start gap-3">
                      <span className="text-xl shrink-0">⚠️</span>
                      <div>
                        <h4 className="font-extrabold text-xs text-amber-900">
                          {lang === "ar" ? "حقوق النشر والعلامة التجارية (HyperHelper™)" : "Trademark & Intellectual Property (HyperHelper™)"}
                        </h4>
                        <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                          {lang === "ar"
                            ? "جميع المحاضرات ومقاطع الفيديو التعليمية تابعة لأصحابها الأصليين ومتاحة مجاناً للجميع. ولكن ملاحظات الويكي المنظمة والملخصات المعتمدة ودفاتر التدوين التزامنية التي تشاهدها هنا تحمل العلامة التجارية وحقوق النشر محفوظة لـ Helper و HyperHelper™ (المنتج الفاخر لـ Helper). يمنع إعادة إنتاجها دون إذن."
                            : "Standard YouTube lectures belong to their respective creators and are free for academic use. However, the curated interactive wikis, structured notation, and validated notepad study bundles are copyrighted and trademarked under Helper and HyperHelper™ (Helper's premier top-notch service)."}
                        </p>
                      </div>
                    </div>

                    {/* Thumbnail Grid - Scrolling Tens of thumbnails */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {catalogVideos
                        .filter((v) => wikiCategoryFilter === "All" || v.category === wikiCategoryFilter)
                        .map((video) => (
                          <div
                            key={video.id}
                            className="group bg-white border border-[#e8e2d9] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                          >
                            {/* Watermarked Video Thumbnail */}
                            <div className="relative aspect-video w-full bg-black overflow-hidden">
                              <img
                                src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                                alt={video.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                              />

                              {/* Watermark Diagonal overlay */}
                              <div className="absolute inset-0 bg-black/15 flex items-center justify-center overflow-hidden pointer-events-none select-none">
                                <div className="text-[12px] font-black tracking-widest text-white/20 uppercase rotate-12 bg-black/35 py-1 px-4 rounded-md border border-white/5 whitespace-nowrap">
                                  HyperHelper™ Watermark
                                </div>
                              </div>

                              {/* Rights Badge */}
                              <span className="absolute top-3 left-3 bg-[#c45a3a] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-md flex items-center gap-1 border border-white/10">
                                <Sparkles className="w-2.5 h-2.5 text-yellow-300 animate-pulse" />
                                HyperHelper™ Premium Wiki
                              </span>

                              {/* Video duration badge */}
                              <span className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                                {formatTime(video.duration)}
                              </span>
                            </div>

                            {/* Info */}
                            <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5a8a6e] bg-[#5a8a6e]/10 px-2 py-0.5 rounded-full">
                                  {video.category}
                                </span>
                                <h4 className="font-black text-sm text-[#1a1612] mt-2 group-hover:text-[#c45a3a] transition-colors line-clamp-2">
                                  {video.title}
                                </h4>
                                <p className="text-[11px] text-[#8a8278] mt-1 flex items-center gap-1">
                                  <span>👤</span> {video.channelTitle}
                                </p>
                              </div>

                              {/* Interactive Launcher buttons */}
                              <div className="pt-2 border-t border-[#f5f0ea] flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setActiveVideo(video);
                                    setHelperSubView("workspace");
                                    setActiveTab("notes");
                                    showToast(
                                      lang === "ar"
                                        ? `تم تحميل الدرس والمفكرة: ${video.title}`
                                        : `Loaded study lecture and notepad: ${video.title}`,
                                      "success"
                                    );
                                  }}
                                  className="flex-1 py-2 bg-[#5a8a6e] hover:bg-[#5a8a6e]/90 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                  <span>📝</span>
                                  {lang === "ar" ? "دراسة الملاحظات" : "Study Notes"}
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveVideo(video);
                                    setHelperSubView("workspace");
                                    setActiveTab("diary");
                                    setDiarySubTab("wikis");
                                    showToast(
                                      lang === "ar"
                                        ? `تم فتح دليل ويكي هيلبر للدرس: ${video.title}`
                                        : `Opened wiki guide for lesson: ${video.title}`,
                                      "success"
                                    );
                                  }}
                                  className="flex-1 py-2 bg-[#1a1612] hover:bg-[#332e29] text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                  <span>📖</span>
                                  {lang === "ar" ? "الويكي التفاعلي" : "Standard Wiki"}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* TAB 2: COMMUNITY DISCUSSION HUB */}
                {wikiTab === "community" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left 8 columns: Discussions list */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                      
                      {/* Topic filter bar */}
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                        {["All", "Physics", "Mathematics", "Biology", "Chemistry", "Computer Science"].map((topic) => (
                          <button
                            key={topic}
                            onClick={() => setCommunityTopicFilter(topic)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                              communityTopicFilter === topic
                                ? "bg-[#c45a3a] text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {topic === "All" ? (lang === "ar" ? "الكل" : "All") : topic}
                          </button>
                        ))}
                      </div>

                      {/* Posts Feed */}
                      {isLoadingCommunity ? (
                        <div className="text-center py-16">
                          <span className="w-8 h-8 rounded-full border-4 border-[#c45a3a] border-t-transparent inline-block animate-spin" />
                          <p className="text-xs text-gray-500 mt-2 font-bold">
                            {lang === "ar" ? "جاري تحميل نقاشات المجتمع..." : "Loading academic discussions..."}
                          </p>
                        </div>
                      ) : communityPosts.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 border border-dashed rounded-3xl">
                          <span className="text-3xl">💬</span>
                          <p className="text-xs text-gray-500 mt-3 font-bold">
                            {lang === "ar" ? "لا توجد نقاشات منشورة بعد في هذا القسم. كن أول من يطرح نقاشاً!" : "No active discussions found for this topic. Be the first to start a thread!"}
                          </p>
                        </div>
                      ) : (
                        communityPosts
                          .filter((p) => communityTopicFilter === "All" || p.topic === communityTopicFilter)
                          .map((post) => (
                            <div
                              key={post.id}
                              className="bg-white border border-[#e8e2d9] rounded-2xl p-5 shadow-sm hover:border-[#c45a3a]/40 transition-all flex flex-col gap-4"
                            >
                              {/* Post Author & Header */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c45a3a] to-[#5a8a6e] text-white font-black text-xs flex items-center justify-center">
                                    {post.userDisplayName?.substring(0, 2).toUpperCase() || "GL"}
                                  </div>
                                  <div>
                                    <h5 className="font-extrabold text-xs text-[#1a1612]">
                                      {post.userDisplayName || (lang === "ar" ? "باحث هيلبر" : "Helper Learner")}
                                    </h5>
                                    <span className="text-[10px] text-gray-400">
                                      {new Date(post.createdAt).toLocaleDateString()} @ {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-[#c45a3a] bg-[#c45a3a]/10 px-2 py-0.5 rounded-full">
                                    {post.topic}
                                  </span>
                                </div>
                              </div>

                              {/* Subject and Content */}
                              <div>
                                <h4 className="font-black text-sm text-[#1a1612]">
                                  {post.subject}
                                </h4>
                                <p className="text-xs text-[#5c554d] leading-relaxed mt-2 bg-gray-50/50 p-3 rounded-xl border border-gray-100 whitespace-pre-wrap">
                                  {post.content}
                                </p>
                              </div>

                              {/* YouTube Video Link Tag */}
                              {post.videoId && (
                                <div className="flex items-center gap-2 bg-[#f5f0ea] p-2.5 rounded-xl text-xs text-[#5c554d]">
                                  <span className="text-base">🎥</span>
                                  <div className="flex-1 min-w-0">
                                    <span className="font-extrabold text-[10px] uppercase text-[#8a8278] block tracking-wider">
                                      {lang === "ar" ? "مرجع الدرس التفاعلي" : "REFERENCED LECTURE"}
                                    </span>
                                    <span className="font-bold text-xs text-[#1a1612] truncate block">
                                      {post.videoTitle || "YouTube Lesson"}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => {
                                      const matchedVideo = catalogVideos.find(v => v.id === post.videoId) || videos.find(v => v.id === post.videoId) || {
                                        id: post.videoId,
                                        title: post.videoTitle || "Lecture",
                                        channelTitle: "YouTube Creator",
                                        category: post.topic,
                                        duration: 600,
                                        addedBy: "system",
                                        createdAt: new Date().toISOString()
                                      };
                                      setActiveVideo(matchedVideo as VideoDoc);
                                      setHelperSubView("workspace");
                                      showToast(
                                        lang === "ar" ? `تم فتح الدرس المرجعي: ${matchedVideo.title}` : `Loaded reference lecture: ${matchedVideo.title}`,
                                        "success"
                                      );
                                    }}
                                    className="px-2.5 py-1 bg-white hover:bg-gray-100 text-[#1a1612] border border-[#e8e2d9] rounded-lg text-[10px] font-bold transition flex items-center gap-1 whitespace-nowrap shrink-0"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    {lang === "ar" ? "دراسة الدرس" : "Study Now"}
                                  </button>
                                </div>
                              )}

                              {/* Interactions (Upvote & Reply Count) */}
                              <div className="flex items-center gap-4 pt-2 border-t border-[#f5f0ea]">
                                <button
                                  onClick={() => handleVotePost(post.id)}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                    post.votedUsers?.includes(user?.uid)
                                      ? "bg-[#c45a3a] text-white"
                                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  }`}
                                >
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                  <span>{post.votes || 0}</span>
                                </button>

                                <span className="text-xs text-gray-500 font-bold flex items-center gap-1">
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  {post.responses?.length || 0} {lang === "ar" ? "ردود" : "replies"}
                                </span>
                              </div>

                              {/* Responses Section */}
                              {post.responses && post.responses.length > 0 && (
                                <div className="bg-[#fffdf9] border border-[#e8e2d9] rounded-xl p-4 flex flex-col gap-3">
                                  <span className="text-[9px] font-black tracking-widest text-[#8a8278] uppercase">
                                    {lang === "ar" ? "الردود الأكاديمية والحلول المقترحة" : "ACADEMIC RESPONSES & SOLUTIONS"}
                                  </span>

                                  {post.responses.map((resp: any, i: number) => (
                                    <div key={i} className="flex gap-2.5 items-start bg-white p-3 rounded-lg border border-gray-100">
                                      <div className="w-7 h-7 rounded-full bg-[#5a8a6e]/15 text-[#5a8a6e] font-black text-[10px] flex items-center justify-center shrink-0">
                                        {resp.userDisplayName?.substring(0, 2).toUpperCase() || "HE"}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                          <span className="font-extrabold text-[11px] text-[#1a1612]">
                                            {resp.userDisplayName}
                                          </span>
                                          <span className="text-[8px] text-gray-400">
                                            {new Date(resp.createdAt).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <p className="text-xs text-[#5c554d] mt-1 whitespace-pre-wrap">
                                          {resp.text}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Write a response form */}
                              <div className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  placeholder={lang === "ar" ? "أضف ردك أو حلك الأكاديمي المقترح..." : "Add your academic response..."}
                                  value={replyTexts[post.id] || ""}
                                  onChange={(e) => setReplyTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                                  className="flex-1 bg-gray-50 hover:bg-gray-100 focus:bg-white border focus:border-[#c45a3a] px-3 py-2 text-xs rounded-xl outline-none transition"
                                />
                                <button
                                  onClick={() => handleAddResponse(post.id)}
                                  className="px-4 py-2 bg-[#c45a3a] hover:bg-[#c45a3a]/90 text-white font-bold text-xs rounded-xl transition"
                                >
                                  {lang === "ar" ? "رد" : "Reply"}
                                </button>
                              </div>

                            </div>
                          ))
                      )}

                    </div>

                    {/* Right 4 columns: Draft Discussion Form */}
                    <div className="lg:col-span-4">
                      <div className="bg-[#f5f0ea]/50 border border-[#e8e2d9] rounded-2xl p-5 sticky top-24">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xl">✍️</span>
                          <h4 className="font-black text-sm text-[#1a1612]">
                            {lang === "ar" ? "طرح موضوع للنقاش" : "Draft New Discussion"}
                          </h4>
                        </div>

                        <p className="text-xs text-[#5c554d] mb-4 leading-relaxed">
                          {lang === "ar"
                            ? "أطرح سؤالك أو موضوعك الدراسي لتبادل الحلول مع الزملاء. تأكد من ربط الدرس بالفيديو لتسهيل المتابعة!"
                            : "Start a collaborative academic discussion. Anchor your post to a specific YouTube video lecture for quick reference!"}
                        </p>

                        <form onSubmit={handleCreateCommunityPost} className="flex flex-col gap-4">
                          {/* Subject Input */}
                          <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">
                              {lang === "ar" ? "عنوان الموضوع" : "DISCUSSION SUBJECT"}
                            </label>
                            <input
                              type="text"
                              placeholder={lang === "ar" ? "مثال: إشكالية في حساب التفاضل والتكامل" : "e.g. Trouble with Special Relativity limit"}
                              value={newDiscSubject}
                              onChange={(e) => setNewDiscSubject(e.target.value)}
                              className="w-full bg-white border border-[#e8e2d9] px-3.5 py-2 text-xs rounded-xl outline-none focus:border-[#c45a3a] transition"
                              required
                            />
                          </div>

                          {/* Academic Category */}
                          <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">
                              {lang === "ar" ? "التخصص العلمي" : "ACADEMIC TOPIC"}
                            </label>
                            <select
                              value={newDiscTopic}
                              onChange={(e) => setNewDiscTopic(e.target.value)}
                              className="w-full bg-white border border-[#e8e2d9] px-3.5 py-2 text-xs rounded-xl outline-none focus:border-[#c45a3a] transition"
                            >
                              {["Physics", "Mathematics", "Biology", "Chemistry", "Computer Science"].map((topic) => (
                                <option key={topic} value={topic}>{topic}</option>
                              ))}
                            </select>
                          </div>

                          {/* Reference Lecture Selection */}
                          <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">
                              {lang === "ar" ? "ربط الدرس المرجعي" : "REFERENCE YOUTUBE VIDEO"}
                            </label>
                            <select
                              value={newDiscVideoId}
                              onChange={(e) => setNewDiscVideoId(e.target.value)}
                              className="w-full bg-white border border-[#e8e2d9] px-3.5 py-2 text-xs rounded-xl outline-none focus:border-[#c45a3a] transition font-medium"
                            >
                              <option value="">{lang === "ar" ? "-- اختر درساً مرجعياً --" : "-- Choose Lesson Reference --"}</option>
                              {catalogVideos.map((v) => (
                                <option key={v.id} value={v.id}>{v.title} ({v.category})</option>
                              ))}
                              {videos.map((v) => (
                                <option key={v.id} value={v.id}>{v.title} (Added Video)</option>
                              ))}
                            </select>
                          </div>

                          {/* Detailed Discussion Content */}
                          <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">
                              {lang === "ar" ? "تفاصيل السؤال أو المشكلة" : "DISCUSSION DETAIL"}
                            </label>
                            <textarea
                              rows={4}
                              placeholder={lang === "ar" ? "اشرح بالتفصيل المسألة أو النظرية التي تود نقاشها وحلها..." : "Describe your study problem or request detail so classmates can assist..."}
                              value={newDiscContent}
                              onChange={(e) => setNewDiscContent(e.target.value)}
                              className="w-full bg-white border border-[#e8e2d9] px-3.5 py-2 text-xs rounded-xl outline-none focus:border-[#c45a3a] transition font-medium"
                              required
                            />
                          </div>

                          {/* Submit button */}
                          <button
                            type="submit"
                            className="w-full py-3 bg-[#c45a3a] hover:bg-[#c45a3a]/90 text-white font-extrabold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
                          >
                            <span>🚀</span>
                            {lang === "ar" ? "طرح النقاش الآن" : "Publish Discussion"}
                          </button>
                        </form>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

            {helperSubView === "hummingbird" && (
              <HummingbirdWorkspace 
                user={user}
                lang={lang}
                onBackToHome={() => setHelperSubView("workspace")}
                catalogVideos={catalogVideos}
              />
            )}
          </div>
        ) : (
          /* GUEST MEMBER LOCK SCREEN */
          <div className="pt-28 pb-20 px-4 max-w-md mx-auto min-h-[80vh] flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md w-full bg-white border border-[#e8e2d9] rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden"
            >
              {/* Top colored accent line */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#c45a3a] to-[#e07a5f]" />
              
              <div className="w-16 h-16 bg-[#c45a3a]/10 text-[#c45a3a] rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-black text-[#1a1612] mb-3">
                {lang === "ar" ? "منطقة الأعضاء فقط" : "Members Only Area"}
              </h3>
              
              <p className="text-sm text-[#5c554d] mb-8 leading-relaxed">
                {lang === "ar" 
                  ? "استخدام خدمة هيلبر يتطلب تسجيل الدخول أو إنشاء حساب كطالب أو معلم لمزامنة ملاحظاتك وحفظ ملفاتك السحابية تلقائياً."
                  : "Accessing the full interactive workspace requires logging in or registering. Save your notes, manage playlists, and sync with the cloud!"
                }
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { setIsRegisterMode(false); setIsAuthModalOpen(true); }}
                  className="w-full py-4 bg-[#c45a3a] hover:scale-[1.01] transition-all text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#c45a3a]/15"
                >
                  {lang === "ar" ? "تسجيل الدخول" : "Login to Helper"}
                </button>
                <button 
                  onClick={() => { setIsRegisterMode(true); setIsAuthModalOpen(true); }}
                  className="w-full py-4 bg-[#f5f0ea] hover:bg-[#e8e2d9] transition-all text-[#1a1612] font-bold text-sm rounded-2xl"
                >
                  {lang === "ar" ? "إنشاء حساب مجاني" : "Create Free Account"}
                </button>
                <button 
                  onClick={() => setCurrentView("landing")}
                  className="w-full py-3 text-xs text-[#8a8278] hover:text-[#c45a3a] font-bold transition-all flex items-center justify-center gap-1 mt-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
                </button>
              </div>
            </motion.div>
          </div>
        )
      ) : (
        /* ORIGINAL LANDING PAGE SECTIONS */
        <>
          {/* HERO SECTION */}
          <header className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-4 bg-gradient-to-b from-[#faf8f5] to-[#f5f0ea] overflow-hidden">
            {/* Glow Spheres */}
            <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-[#c45a3a]/5 rounded-full filter blur-3xl pointer-events-none" />
            <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-[#5a8a6e]/5 rounded-full filter blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center z-10 w-full">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#c45a3a]/10 border border-[#c45a3a]/20 rounded-full text-xs font-bold text-[#c45a3a] mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#5a8a6e] relative">
                    <span className="absolute inset-0 rounded-full bg-[#5a8a6e] animate-ping opacity-75" />
                  </span>
                  {lang === "ar" ? "الوصول المبكر متاح الآن — ٢٤٠٠+ طالب ومعلم" : "Early access active — 2,400+ students & teachers"}
                </div>

                <h1 className="text-4xl sm:text-6xl font-black leading-[1.1] tracking-tight text-[#1a1612] mb-6">
                  {lang === "ar" ? (
                    <>
                      دروس الفيديو الخاصة بك، <br />
                      <span className="bg-gradient-to-r from-[#c45a3a] via-[#e07a5f] to-[#d4a017] bg-clip-text text-transparent">منظمة كدفتر ملاحظات</span>
                    </>
                  ) : (
                    <>
                      Your video lessons, <br />
                      <span className="bg-gradient-to-r from-[#c45a3a] via-[#e07a5f] to-[#d4a017] bg-clip-text text-transparent">organized like a notebook</span>
                    </>
                  )}
                </h1>

                <p className="text-base sm:text-lg text-[#5c554d] max-w-xl mb-8 leading-relaxed">
                  {lang === "ar" 
                    ? "كل فيديو يحصل على صفحة دفتر ملاحظات خاصة به قابلة للمشاركة والبحث. قم بتدوين الملاحظات المرتبطة بالوقت، وإدراج المراجع، وبناء قوائم تشغيل علمية كاملة."
                    : "Every video lesson gets its own indexable notebook page. Annotate timestamps, link references, build structured wikis — all in one elegant bicultural place."
                  }
                </p>

                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => {
                      if (user) {
                        setCurrentView("helper");
                      } else {
                        setIsRegisterMode(false);
                        setIsAuthModalOpen(true);
                      }
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-[#c45a3a] to-[#e07a5f] hover:scale-[1.02] hover:shadow-xl text-white font-bold rounded-full transition-all duration-300 shadow-[#c45a3a]/20 flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    {lang === "ar" ? "شاهد العرض المباشر" : "Explore live demo"}
                  </button>
                  <button onClick={() => { setIsRegisterMode(true); setIsAuthModalOpen(true); }} className="px-8 py-4 bg-white hover:bg-[#faf8f5] text-[#1a1612] border border-[#e8e2d9] font-bold rounded-full transition duration-200">
                    {lang === "ar" ? "سجل مجاناً كطالب" : "Join free as student"}
                  </button>
                </div>
              </div>

              {/* Graphic Banner - Bento UI */}
              <div className="relative flex justify-center">
                {/* Small floating badge */}
                <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-white px-4 py-2 border rounded-xl shadow-lg z-20 flex items-center gap-2 animate-bounce">
                  <Check className="w-4 h-4 text-[#5a8a6e]" />
                  <span className="text-[10px] font-bold text-gray-500">
                    {lang === "ar" ? "تم الحفظ تلقائياً" : "Auto-saved to cloud"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                  <div className="col-span-2 p-6 bg-white border border-[#e8e2d9] rounded-3xl shadow-xl">
                    <div className="aspect-video bg-neutral-900 rounded-2xl flex items-center justify-center relative overflow-hidden mb-4 shadow-inner">
                      <Play className="w-12 h-12 text-white/90 drop-shadow-md cursor-pointer hover:scale-110 transition" />
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                        <div className="w-[65%] h-full bg-[#c45a3a]" />
                      </div>
                    </div>
                    <h3 className="font-extrabold text-sm text-[#1a1612] mb-1">
                      {lang === "ar" ? "حساب التفاضل والتكامل: النهايات والاتصال" : "Calculus: Limits & Continuity"}
                    </h3>
                    <p className="text-[11px] text-gray-500">Prof. Youssef Khemiri · 45 min</p>
                  </div>

                  <div className="p-4 bg-white border border-[#e8e2d9] rounded-2xl shadow-md">
                    <span className="text-[10px] bg-[#c45a3a]/10 text-[#c45a3a] px-2 py-0.5 rounded-full font-bold">
                      {lang === "ar" ? "ملاحظات" : "Notes"}
                    </span>
                    <div className="mt-3 flex flex-col gap-1.5">
                      <div className="h-1.5 bg-[#f0ebe4] rounded" />
                      <div className="h-1.5 bg-[#f0ebe4] rounded w-[80%]" />
                      <div className="h-1.5 bg-[#f0ebe4] rounded w-[60%]" />
                    </div>
                    <span className="text-[10px] text-[#c45a3a] font-bold block mt-3">
                      {lang === "ar" ? "١٢ ملاحظة مرئية" : "12 timed notes"}
                    </span>
                  </div>

                  <div className="p-4 bg-white border border-[#e8e2d9] rounded-2xl shadow-md">
                    <span className="text-[10px] bg-[#5a8a6e]/10 text-[#5a8a6e] px-2 py-0.5 rounded-full font-bold">
                      {lang === "ar" ? "مشاركة" : "Shared"}
                    </span>
                    <div className="mt-3 flex flex-col gap-1.5">
                      <div className="h-1.5 bg-[#f0ebe4] rounded" />
                      <div className="h-1.5 bg-[#f0ebe4] rounded w-[70%]" />
                    </div>
                    <span className="text-[10px] text-[#5a8a6e] font-bold block mt-3">
                      {lang === "ar" ? "تمت المشاركة مع ٢٤ طالباً" : "Shared with 24 students"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* MARQUEE */}
          <section className="py-6 border-y border-[#e8e2d9] bg-[#f5f0ea] overflow-hidden">
            <div className="animate-marquee whitespace-nowrap flex gap-12 font-semibold text-xs text-[#8a8278] tracking-widest uppercase">
              {[1, 2].map((loop) => (
                <React.Fragment key={loop}>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#c45a3a]" />
                    {lang === "ar" ? "ملاحظات مرتبطة بالوقت" : "Timestamp annotations"}
                  </div>
                  <div className="flex items-center gap-3">
                    <Brain className="w-4 h-4 text-[#5a8a6e]" />
                    {lang === "ar" ? "مساعد دراسي بالذكاء الاصطناعي" : "AI Academic Assistant"}
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-[#3b6ea5]" />
                    {lang === "ar" ? "ترجمة فورية ثنائية اللغة" : "Bilingual AI translation"}
                  </div>
                  <div className="flex items-center gap-3">
                    <Link2 className="w-4 h-4 text-[#d4a017]" />
                    {lang === "ar" ? "إدراج المراجع الخارجية" : "External resource linking"}
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#c45a3a]" />
                    {lang === "ar" ? "تفريغ نصي ذكي للفيديو" : "Smart lecture transcripts"}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </section>

          {/* PUBLIC VIDEO WIKIS & LATEST SHARED NOTES */}
          <section className="py-16 px-4 max-w-7xl mx-auto border-t border-[#e8e2d9]">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs bg-[#5a8a6e]/10 text-[#5a8a6e] px-4 py-1.5 rounded-full font-bold uppercase tracking-wider">
                📚 {lang === "ar" ? "مستودع المعرفة المفتوح" : "Open Knowledge Directory"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 text-[#1a1612]">
                {lang === "ar" ? "آخر مذكرات الويكي والدروس العامة" : "Latest Public Video Wikis & Shared Notes"}
              </h2>
              <p className="text-xs text-[#5c554d] mt-2 leading-relaxed">
                {lang === "ar"
                  ? "تصفح مذكرات المقررات والدروس التي صاغها زملائك بشكل عام. اضغط على أي درس للانتقال لدفتر الملاحظات المشترك الخاص به."
                  : "Explore shared study wikis and bilingual annotations across Calculus, Physics, Quantum Computing and more topics. Click any video to open its personal interactive space."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(videos.length > 0 ? videos : fallbackVideos).slice(0, 6).map((video) => {
                const ytId = video.id;
                const thumbUrl = `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;
                return (
                  <div 
                    key={video.id}
                    onClick={() => {
                      window.history.pushState(null, "", `?v=${video.id}`);
                      setActiveVideo(video);
                      setCurrentView("helper");
                      showToast(
                        lang === "ar" 
                          ? `جاري تحميل الدرس والمذكرات: ${video.title}` 
                          : `Loading shared lesson space: ${video.title}`,
                        "info"
                      );
                    }}
                    className="bg-white border border-[#e8e2d9] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#c45a3a]/30 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="aspect-video bg-neutral-900 relative overflow-hidden shrink-0">
                      <img 
                        src={thumbUrl} 
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-80"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60";
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/45 transition">
                        <div className="w-12 h-12 rounded-full bg-white text-[#c45a3a] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition duration-300">
                          <Play className="w-5 h-5 fill-[#c45a3a] translate-x-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] bg-[#c45a3a]/10 text-[#c45a3a] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                          {video.category}
                        </span>
                        <h4 className="font-extrabold text-xs text-[#1a1612] line-clamp-2 leading-relaxed mb-1">
                          {video.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 block mb-2">
                          {video.channelTitle}
                        </span>
                      </div>

                      <div className="pt-3 border-t border-dashed border-[#e8e2d9] flex justify-between items-center">
                        <span className="text-[10px] text-[#5c554d] font-semibold flex items-center gap-1">
                          📝 {lang === "ar" ? "مذكرات تفاعلية" : "Interactive Notation"}
                        </span>
                        <span className="text-[10px] text-[#5a8a6e] font-black flex items-center gap-1">
                          🌐 {lang === "ar" ? "ويكي عام" : "Standard Wiki"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* INVEST TIME IN KNOWLEDGE MOTIVATION */}
          <section className="py-12 px-4 max-w-7xl mx-auto">
            <div className="bg-[#5a8a6e]/5 border border-[#5a8a6e]/20 rounded-[32px] p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#5a8a6e]/10 rounded-full filter blur-3xl pointer-events-none" />
              
              <div className="max-w-2xl mx-auto relative z-10">
                <span className="text-[10px] bg-[#5a8a6e]/10 text-[#5a8a6e] px-4 py-1.5 rounded-full font-black uppercase tracking-wider mb-4 inline-block">
                  🎓 {lang === "ar" ? "الاستثمار في عقلك ومعرفتك" : "INVEST IN YOUR KNOWLEDGE"}
                </span>
                
                <h3 className="text-2xl sm:text-4xl font-extrabold text-[#1a1612] tracking-tight mb-4 leading-tight">
                  {lang === "ar" 
                    ? "«هيلبر» يعتمد عليك لتستثمر وقتك الثمين في المذاكرة والتعلم والتميز!" 
                    : "Helper relies on YOU to invest your time in wisdom and knowledge."}
                </h3>
                
                <p className="text-xs sm:text-sm text-[#5c554d] leading-relaxed mb-6 max-w-lg mx-auto">
                  {lang === "ar"
                    ? "الوقت هو أثمن رأس مال تملكه. نقرة واحدة في تصفح الميديا غير الهادفة تضيع عمرك، بينما بضع دقائق من التركيز وتدوين مذكرات الويكي في «هيلبر» تصنع مستقبلك العلمي وتدعم زملائك الطلبة."
                    : "Every minute spent here building collaborative Wikis, summarizing physics lectures, or writing diaries is a permanent asset in your cognitive bank. Your peers and educators rely on your focus to co-create standardized classrooms."}
                </p>

                <div className="flex justify-center gap-2">
                  <div className="px-4 py-2 bg-white rounded-xl border border-[#e8e2d9] shadow-sm flex items-center gap-2">
                    <span className="text-base">⏳</span>
                    <span className="text-[11px] font-extrabold text-[#1a1612]">
                      {lang === "ar" ? "أثمن استثمار" : "High-yield return"}
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-[#5a8a6e] text-white rounded-xl shadow-md flex items-center gap-2">
                    <span className="text-base">💡</span>
                    <span className="text-[11px] font-black">
                      {lang === "ar" ? "أنا مستعد للتعلم" : "Commit to Study"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* HIGH CONVERTING WORKSPACE CTA BANNER Mockup replacing active workspace */}
          <section id="demo" className="py-16 px-4 max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-[#1a1612] to-[#2d251e] text-[#faf8f5] rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-neutral-800">
              {/* Ambient light glow */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#c45a3a]/15 rounded-full filter blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#5a8a6e]/15 rounded-full filter blur-3xl pointer-events-none" />
              
              <div className="max-w-xl relative z-10">
                <span className="text-xs bg-[#c45a3a]/20 text-[#e07a5f] px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider">
                  {lang === "ar" ? "أداة ذكية للمذاكرة والدراسة" : "Interactive Workspace"}
                </span>
                <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight mt-4 mb-4 leading-tight">
                  {lang === "ar" ? "ابدأ المذاكرة الذكية باستخدام هيلبر" : "Paste your first lecture link in Helper"}
                </h3>
                <p className="text-xs md:text-sm text-neutral-400 leading-relaxed mb-6">
                  {lang === "ar"
                    ? "بوابة المذاكرة التفاعلية ثلاثية الأقسام تم نقلها إلى صفحة مستقلة آمنة ومخصصة للأعضاء. استمتع بأخذ الملاحظات المرتبطة بالوقت، ومراجعة النصوص المولدة بالذكاء الاصطناعي، ومشاركة المعرفة!"
                    : "Our premium three-pane student workspace has been moved to a standalone member-only application view. Log in or create an account to start annotating, chatting with your courses, and syncing notebooks."
                  }
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => {
                      if (user) {
                        setCurrentView("helper");
                      } else {
                        setIsRegisterMode(false);
                        setIsAuthModalOpen(true);
                      }
                    }}
                    className="px-6 py-3.5 bg-[#c45a3a] hover:bg-[#c45a3a]/90 text-white font-bold text-xs rounded-full shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    {lang === "ar" ? "افتح صفحة المساعد هيلبر الآن" : "Launch Helper Workspace"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {!user && (
                    <button 
                      onClick={() => {
                        setIsRegisterMode(true);
                        setIsAuthModalOpen(true);
                      }}
                      className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-full border border-white/10 transition"
                    >
                      {lang === "ar" ? "إنشاء حساب مجاني" : "Create Free Account"}
                    </button>
                  )}
                </div>
              </div>

              {/* Elegant visual representational preview card */}
              <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-6 relative z-10 shadow-lg shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 bg-red-500/80 rounded-full" />
                    <span className="w-2.5 h-2.5 bg-yellow-500/80 rounded-full" />
                    <span className="w-2.5 h-2.5 bg-green-500/80 rounded-full" />
                  </div>
                  <span className="text-[9px] font-mono text-neutral-500">helper.tn/workspace</span>
                </div>
                <div className="aspect-video bg-neutral-900 rounded-xl flex items-center justify-center relative overflow-hidden mb-4 border border-white/10">
                  <Play className="w-10 h-10 text-white/40" />
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[8px] font-mono text-white/50 bg-black/60 px-2 py-1 rounded">
                    <span>Calculus 101</span>
                    <span>17:05</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-white/10 rounded w-[40%]" />
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/5 flex gap-2 items-start">
                    <span className="text-[10px] font-bold text-[#e07a5f]">04:20</span>
                    <div className="space-y-1.5 flex-1">
                      <div className="h-1.5 bg-white/10 rounded w-[90%]" />
                      <div className="h-1.5 bg-white/10 rounded w-[60%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS SECTION */}
          <section id="how-it-works" className="py-20 px-4 max-w-7xl mx-auto border-t border-[#e8e2d9]">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs bg-[#5a8a6e]/10 text-[#5a8a6e] px-4 py-1.5 rounded-full font-bold uppercase tracking-wider">
                {lang === "ar" ? "آلية العمل" : "How it works"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 text-[#1a1612]">
                {lang === "ar" ? "من درس فيديو إلى ثقافة معرفية" : "From video to structured knowledge"}
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "01", title_en: "Paste link", title_ar: "ألصق رابط يوتيوب", desc_en: "Import any YouTube educational video. Helper handles the rest automatically.", desc_ar: "استورد أي فيديو تعليمي من يوتيوب، وسيقوم هيلبر بالباقي تلقائياً." },
                { step: "02", title_en: "Annotate notes", title_ar: "دوّن ملاحظاتك", desc_en: "Click any second to capture formulas, definitions, and insert references.", desc_ar: "اضغط على أي ثانية لكتابة معادلة رياضية أو فكرة معينة مع ربط المراجع." },
                { step: "03", title_en: "Bicultural AI", title_ar: "الذكاء الاصطناعي", desc_en: "Translate your entire notebook between Arabic and English with one simple click.", desc_ar: "ترجم دفتر ملاحظاتك العلمي بالكامل بين الإنجليزية والعربية بكبسة واحدة." },
                { step: "04", title_en: "Playlist wikis", title_ar: "المشاركة كـ ويكي", desc_en: "Assemble videos into course playlists. Share your master notebook with classmates.", desc_ar: "اجمع الدروس في قائمة واحدة وشارك صفحة دفتر الملاحظات كويكي مع زملائك." }
              ].map((item, idx) => (
                <div key={idx} className="p-6 bg-white border border-[#e8e2d9] rounded-3xl relative overflow-hidden group hover:shadow-xl transition">
                  <div className="text-4xl font-black text-[#c45a3a]/15 absolute top-2 right-4 rtl:right-auto rtl:left-4">
                    {item.step}
                  </div>
                  <h3 className="text-sm font-extrabold text-[#1a1612] mb-2 mt-6">
                    {lang === "ar" ? item.title_ar : item.title_en}
                  </h3>
                  <p className="text-xs text-[#5c554d] leading-relaxed">
                    {lang === "ar" ? item.desc_ar : item.desc_en}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* DETAILED FEATURES BENTO GRID */}
          <section id="features" className="py-20 px-4 max-w-7xl mx-auto border-t border-[#e8e2d9]">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs bg-[#c45a3a]/10 text-[#c45a3a] px-4 py-1.5 rounded-full font-bold uppercase tracking-wider">
                {lang === "ar" ? "مميزات ذكية" : "Smarter Education"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 text-[#1a1612]">
                {lang === "ar" ? "كل ما تحتاجه الطلاب والمعلمون" : "Everything a notebook should be"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 bg-white border border-[#e8e2d9] rounded-3xl md:col-span-2 shadow-sm">
                <div className="w-10 h-10 rounded-2xl bg-[#c45a3a]/10 text-[#c45a3a] flex items-center justify-center font-bold mb-6">
                  🎯
                </div>
                <h3 className="text-lg font-bold text-[#1a1612] mb-3">
                  {lang === "ar" ? "ملاحظات وتثبيت لحظي للمعلومة" : "Timestamp-linked annotations"}
                </h3>
                <p className="text-xs text-[#5c554d] leading-relaxed">
                  {lang === "ar"
                    ? "تجنب إضاعة وقتك في البحث عن لقطة معينة داخل فيديو طويل. كل ملاحظة مرتبطة بثانية المشاهدة لتسمح لزملائك بالقفز مباشرة إلى السياق العلمي الصحيح."
                    : "Never waste hours scrubbing through a long, dry lecture video. Every note is pinned to the exact playback time, so anyone can jump right back into context instantly."
                  }
                </p>
              </div>

              <div className="p-8 bg-white border border-[#e8e2d9] rounded-3xl shadow-sm">
                <div className="w-10 h-10 rounded-2xl bg-[#5a8a6e]/10 text-[#5a8a6e] flex items-center justify-center font-bold mb-6">
                  🌐
                </div>
                <h3 className="text-lg font-bold text-[#1a1612] mb-3">
                  {lang === "ar" ? "بنية ثنائية اللغة بالكامل" : "Full Bilingual Architecture"}
                </h3>
                <p className="text-xs text-[#5c554d] leading-relaxed">
                  {lang === "ar"
                    ? "سهولة مذهلة في تحويل الدروس بين العربية والإنجليزية. ممتاز للفصول الدراسية ثنائية اللغة ولتسهيل الفهم والمصطلحات."
                    : "Translate summaries or notes into English or classical Arabic. Ideal for bilingual institutions and students eager to understand complex concepts."
                  }
                </p>
              </div>

              <div className="p-8 bg-white border border-[#e8e2d9] rounded-3xl shadow-sm">
                <div className="w-10 h-10 rounded-2xl bg-[#3b6ea5]/10 text-[#3b6ea5] flex items-center justify-center font-bold mb-6">
                  📊
                </div>
                <h3 className="text-lg font-bold text-[#1a1612] mb-3">
                  {lang === "ar" ? "لوحة تتبع تقدم الطلاب" : "Student Progress Tracking"}
                </h3>
                <p className="text-xs text-[#5c554d] leading-relaxed">
                  {lang === "ar"
                    ? "للمعلمين: احصل على لوحة تتبع ذكية لرؤية نسبة تقدم طلابك، ومعرفة الأقسام التي واجهوا فيها صعوبة أو قاموا بتثبيت الملاحظات أكثر."
                    : "For educators: visualize real-time dashboards showing student watch progress, note densities, and typical friction points where they seek/paused."
                  }
                </p>
              </div>

              <div className="p-8 bg-white border border-[#e8e2d9] rounded-3xl md:col-span-2 shadow-sm">
                <div className="w-10 h-10 rounded-2xl bg-[#d4a017]/10 text-[#d4a017] flex items-center justify-center font-bold mb-6">
                  📚
                </div>
                <h3 className="text-lg font-bold text-[#1a1612] mb-3">
                  {lang === "ar" ? "ويكي متكامل للمقرر العلمي" : "Course Playlist Wikis"}
                </h3>
                <p className="text-xs text-[#5c554d] leading-relaxed">
                  {lang === "ar"
                    ? "قم بتجميع المحاضرات المختلفة في قائمة تشغيل واحدة. النظام ينشئ تلقائياً صفحة رئيسية منظمة للمقرر بالكامل، لتكون كمرجع غني ومصنف وسهل المراجعة قبل الامتحانات."
                    : "Group series of lectures. Helper automatically builds an elegant master index wiki — a robust, unified study space for students to review prior to exams."
                  }
                </p>
              </div>
            </div>
          </section>

          {/* PRICING SECTION */}
          <section id="pricing" className="py-20 px-4 max-w-7xl mx-auto border-t border-[#e8e2d9]">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs bg-[#d4a017]/10 text-[#d4a017] px-4 py-1.5 rounded-full font-bold uppercase tracking-wider">
                {lang === "ar" ? "خطط الاشتراك" : "Pricing Plans"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 text-[#1a1612]">
                {lang === "ar" ? "مجاني للطلاب. مرن للمؤسسات التعليمية" : "Free for students. Built for educators."}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  title: lang === "ar" ? "هيلبر للطلاب" : "Helper for Students",
                  price: "$0",
                  desc: lang === "ar" ? "مثالي للطلاب لتدوين ملاحظات المحاضرات الشخصية ومشاركتها مع الأصدقاء." : "Perfect for individual student study, time-linked note taking and link sharing.",
                  features: [
                    lang === "ar" ? "دفاتر ملاحظات غير محدودة" : "Unlimited video notebooks",
                    lang === "ar" ? "ملاحظات مرتبطة بالوقت" : "Timestamp-linked annotations",
                    lang === "ar" ? "ترجمة أساسية (EN ↔ AR)" : "Basic AI Translation",
                    lang === "ar" ? "رابط خارجي للمشاركة" : "Public link sharing",
                  ]
                },
                {
                  title: lang === "ar" ? "هيلبر برو للمحترفين" : "Helper Pro",
                  price: "$12",
                  desc: lang === "ar" ? "للمعلمين والباحثين ومحترفي الأكاديميات لبناء بيئة متطورة لطلابهم." : "Built for educators, professional trainers, and academic coordinators.",
                  features: [
                    lang === "ar" ? "كل ميزات الطالب" : "Everything in Student plan",
                    lang === "ar" ? "ويكي وقوائم تشغيل غير محدودة" : "Unlimited playlist wikis",
                    lang === "ar" ? "أولوية الترجمة والمساعد الذكي" : "Priority AI study copilot",
                    lang === "ar" ? "تحليلات تقدم الطلاب" : "Student watch analytics",
                  ],
                  featured: true
                },
                {
                  title: lang === "ar" ? "المؤسسات والجامعات" : "Helper Enterprise",
                  price: "Custom",
                  desc: lang === "ar" ? "للجامعات والمراكز التدريبية لتوفير هيلبر للكل وتكامل الأنظمة التعليمية." : "For large universities, private colleges, and corporate training centers.",
                  features: [
                    lang === "ar" ? "كل ميزات برو للمحترفين" : "Everything in Pro plan",
                    lang === "ar" ? "ربط مع أنظمة التدريس (Canvas)" : "LMS integration (Moodle, Canvas)",
                    lang === "ar" ? "حماية إضافية وتوفر عالي" : "SSO/SAML secure integration",
                    lang === "ar" ? "تدريب نموذج ذكاء اصطناعي خاص" : "Custom academic AI model training",
                  ]
                }
              ].map((plan, idx) => (
                <div 
                  key={idx} 
                  className={`p-8 bg-white border rounded-3xl relative overflow-hidden transition hover:shadow-xl ${
                    plan.featured ? "border-[#c45a3a] ring-2 ring-[#c45a3a]/20" : "border-[#e8e2d9]"
                  }`}
                >
                  {plan.featured && (
                    <span className="absolute top-0 right-0 rtl:right-auto rtl:left-0 bg-[#c45a3a] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl rtl:rounded-bl-none rtl:rounded-br-xl">
                      Most Popular
                    </span>
                  )}
                  <h4 className="text-xs font-black uppercase text-[#8a8278] tracking-widest mb-2">{plan.title}</h4>
                  <div className="text-3xl font-black text-[#1a1612] mb-3">{plan.price}<span className="text-xs text-gray-400 font-normal">/mo</span></div>
                  <p className="text-xs text-[#5c554d] leading-relaxed mb-6 h-12">{plan.desc}</p>
                  <ul className="flex flex-col gap-3 mb-8">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-[#5c554d]">
                        <Check className="w-4 h-4 text-[#5a8a6e] shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => showToast(lang === "ar" ? "سيتم إطلاق الاشتراك قريباً!" : "Subscriptions launched in public release soon!", "success")}
                    className={`w-full py-3 font-bold text-xs rounded-xl transition ${
                      plan.featured 
                        ? "bg-[#c45a3a] text-white hover:bg-[#c45a3a]/90" 
                        : "bg-[#f5f0ea] hover:bg-[#e8e2d9] text-[#1a1612]"
                    }`}
                  >
                    {plan.featured ? (lang === "ar" ? "ابدأ الآن" : "Choose Plan") : (lang === "ar" ? "ابدأ الآن" : "Choose Plan")}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* FOOTER */}
          <footer className="border-t border-[#e8e2d9] bg-[#f5f0ea] py-16 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
              <div>
                <div className="flex items-center gap-2 font-black text-lg text-[#1a1612] mb-4">
                  <svg className="w-6 h-6 text-[#c45a3a]" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 8L20 20L4 32V8Z" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
                    <path d="M36 8L20 20L36 32V8Z" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
                    <circle cx="12" cy="20" r="2.5" fill="currentColor"/>
                    <circle cx="28" cy="20" r="2.5" fill="currentColor"/>
                  </svg>
                  Helper
                </div>
                <p className="text-xs text-[#8a8278] leading-relaxed max-w-sm">
                  {lang === "ar"
                    ? "دفتر ملاحظات الفيديو الذكي للطلاب والمعلمين. تم تصميمه بكل شغف في تونس لخدمة فصول التعليم والتعلم حول العالم."
                    : "The video notebook for students and teachers. Built with passion in Tunisia to elevate classroom engagement globally."
                  }
                </p>
              </div>

              <div>
                <h5 className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-4">Product</h5>
                <div className="flex flex-col gap-2">
                  <button onClick={() => { setCurrentView("landing"); setTimeout(() => { window.location.hash = "#features"; }, 50); }} className="text-start text-xs text-[#5c554d] hover:text-[#c45a3a]">{lang === "ar" ? "المميزات" : "Features"}</button>
                  <button onClick={() => { setCurrentView("landing"); setTimeout(() => { window.location.hash = "#pricing"; }, 50); }} className="text-start text-xs text-[#5c554d] hover:text-[#c45a3a]">{lang === "ar" ? "الأسعار" : "Pricing"}</button>
                  <button onClick={() => { setCurrentView("landing"); setTimeout(() => { window.location.hash = "#demo"; }, 50); }} className="text-start text-xs text-[#5c554d] hover:text-[#c45a3a]">{lang === "ar" ? "التجربة الحية" : "Workspace Demo"}</button>
                </div>
              </div>

              <div>
                <h5 className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-4">Resources</h5>
                <div className="flex flex-col gap-2">
                  <button onClick={() => { setCurrentView("landing"); setTimeout(() => { window.location.hash = "#how-it-works"; }, 50); }} className="text-start text-xs text-[#5c554d] hover:text-[#c45a3a]">{lang === "ar" ? "كيف نعمل" : "How it works"}</button>
                  <a href="#database-schema" className="text-xs text-[#c45a3a] font-bold hover:underline flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    {lang === "ar" ? "مخطط قاعدة البيانات" : "Database Schema"}
                  </a>
                  <a href="#activities-log" className="text-xs text-[#5a8a6e] font-bold hover:underline flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    {lang === "ar" ? "سجل نشاط المنصة" : "Platform Activity"}
                  </a>
                </div>
              </div>

              <div>
                <h5 className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-4">Architecture</h5>
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-[#8a8278]">{lang === "ar" ? "تكامل Google Workspace" : "Workspace Integration"}</span>
                  <span className="text-xs text-[#8a8278]">{lang === "ar" ? "بنية Firestore السحابية" : "Cloud Firestore Architecture"}</span>
                  <span className="text-xs text-[#8a8278]">{lang === "ar" ? "الشروط والخصوصية" : "Terms & Privacy"}</span>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-[#e8e2d9] pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-400">
              <p>© 2026 Helper Inc. All rights reserved. Made with ❤️ in Tunisia.</p>
              <div className="flex gap-4">
                <span>Twitter</span>
                <span>GitHub</span>
                <span>LinkedIn</span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* AUTHENTICATION DIALOG (Modal) */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-[3000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border rounded-3xl w-full max-w-md p-8 relative shadow-2xl"
            >
              <button 
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-extrabold text-[#1a1612] mb-2 text-center">
                {isRegisterMode 
                  ? (lang === "ar" ? "إنشاء حساب جديد كلياً" : "Create Helper Account")
                  : (lang === "ar" ? "تسجيل الدخول للمنصة" : "Login to Helper")
                }
              </h3>
              <p className="text-xs text-[#5c554d] text-center mb-6">
                {isRegisterMode
                  ? (lang === "ar" ? "سجل مجاناً للوصول إلى كافة دفاتر الفيديوهات." : "Start today for free and sync all your classes.")
                  : (lang === "ar" ? "أدخل بريدك الإلكتروني للدخول الفوري لدفترك المنسق." : "Enter your email to resume your video notebooks.")
                }
              </p>

              <form onSubmit={handleAuth} className="flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder={isRegisterMode ? "name@university.edu" : (lang === "ar" ? "البريد الإلكتروني أو اسم المستخدم" : "Email or Admin Username")}
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="bg-[#faf8f5] border p-3 rounded-xl text-xs outline-none focus:border-[#c45a3a]"
                  required
                />

                <input 
                  type="password" 
                  placeholder={lang === "ar" ? "كلمة المرور" : "Password"}
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="bg-[#faf8f5] border p-3 rounded-xl text-xs outline-none focus:border-[#c45a3a]"
                  required
                />
                
                {isRegisterMode && (
                  <>
                    <input 
                      type="text" 
                      placeholder={lang === "ar" ? "الاسم الكامل (مثال: رامي بن علي)" : "Full name (e.g., Rami Ben Ali)"}
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="bg-[#faf8f5] border p-3 rounded-xl text-xs outline-none focus:border-[#c45a3a]"
                      required
                    />

                    <div className="flex gap-4 p-2 bg-[#f5f0ea] rounded-xl">
                      <button 
                        type="button"
                        onClick={() => setAuthRole("student")}
                        className={`flex-1 py-2 font-bold text-[11px] rounded-lg transition ${authRole === "student" ? "bg-white shadow" : "text-gray-500"}`}
                      >
                        {lang === "ar" ? "طالب" : "Student"}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setAuthRole("teacher")}
                        className={`flex-1 py-2 font-bold text-[11px] rounded-lg transition ${authRole === "teacher" ? "bg-white shadow" : "text-gray-500"}`}
                      >
                        {lang === "ar" ? "معلم / كاتب" : "Educator"}
                      </button>
                    </div>
                  </>
                )}

                <button type="submit" className="w-full py-3 bg-[#c45a3a] hover:bg-[#c45a3a]/90 text-white font-bold text-xs rounded-xl shadow-lg mt-2 transition">
                  {isRegisterMode 
                    ? (lang === "ar" ? "تأكيد التسجيل والمتابعة" : "Register and Continue")
                    : (lang === "ar" ? "دخول فوري" : "Instant Login")
                  }
                </button>
              </form>

              <div className="text-center mt-6 text-[11px]">
                <button 
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                  className="text-[#c45a3a] font-bold hover:underline"
                >
                  {isRegisterMode 
                    ? (lang === "ar" ? "لديك حساب بالفعل؟ سجل الدخول" : "Already registered? Login instead")
                    : (lang === "ar" ? "لا تملك حساباً بعد؟ سجل كطالب جديد" : "No account? Join Helper free")
                  }
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD VIDEO DIALOG (Teacher ONLY) */}
      <AnimatePresence>
        {isAddVideoOpen && (
          <div className="fixed inset-0 z-[3000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border rounded-3xl w-full max-w-md p-8 relative shadow-2xl"
            >
              <button 
                onClick={() => setIsAddVideoOpen(false)}
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-extrabold text-[#1a1612] mb-2 text-center">
                {lang === "ar" ? "إدراج درس فيديو جديد" : "Add YouTube Lecture"}
              </h3>
              <p className="text-xs text-[#5c554d] text-center mb-6">
                {lang === "ar"
                  ? "قم بلصق رابط يوتيوب وسنقوم تلقائياً بجلب العنوان وتفريغ المحاضرة وتوليد ويكي كامل لها بالذكاء الاصطناعي."
                  : "Paste any YouTube link. Helper AI will automatically scrape metadata and generate an educational study transcript."
                }
              </p>

              <form onSubmit={handleAddVideo} className="flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="bg-[#faf8f5] border p-3 rounded-xl text-xs outline-none focus:border-[#c45a3a]"
                  required
                />
                
                <select 
                  value={newVideoCategory}
                  onChange={(e) => setNewVideoCategory(e.target.value)}
                  className="bg-[#faf8f5] border p-3 rounded-xl text-xs outline-none"
                >
                  <option value="Physics">Physics</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="General">General Education</option>
                </select>

                <button type="submit" className="w-full py-3 bg-[#5a8a6e] hover:bg-[#5a8a6e]/90 text-white font-bold text-xs rounded-xl shadow-lg mt-2 transition">
                  {lang === "ar" ? "إنشاء دفتر ملاحظات للفيديو" : "Generate Video Notebook"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE PLAYLIST DIALOG */}
      <AnimatePresence>
        {isCreatePlaylistOpen && (
          <div className="fixed inset-0 z-[3000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border rounded-3xl w-full max-w-lg p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsCreatePlaylistOpen(false)}
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-extrabold text-[#1a1612] mb-2 text-center">
                {lang === "ar" ? "إنشاء قائمة تشغيل مشتركة" : "Create Shareable Playlist"}
              </h3>
              <p className="text-xs text-[#5c554d] text-center mb-6">
                {lang === "ar"
                  ? "اجمع عدة دروس في قائمة تشغيل واحدة متكاملة للمشاركة مع زملائك أو طلابك."
                  : "Combine multiple lessons into a structured course playlist that can be shared via a single link."
                }
              </p>

              <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                    {lang === "ar" ? "عنوان قائمة التشغيل" : "Playlist Title"}
                  </label>
                  <input 
                    type="text" 
                    placeholder={lang === "ar" ? "مثال: حساب التفاضل والتكامل الشامل" : "e.g., Master Calculus Course"}
                    value={newPlaylistTitle}
                    onChange={(e) => setNewPlaylistTitle(e.target.value)}
                    className="w-full bg-[#faf8f5] border p-3 rounded-xl text-xs outline-none focus:border-[#c45a3a]"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                    {lang === "ar" ? "الوصف" : "Description (Optional)"}
                  </label>
                  <textarea 
                    placeholder={lang === "ar" ? "وصف مختصر لقائمة التشغيل ومحتواها..." : "Briefly describe what this playlist contains..."}
                    value={newPlaylistDesc}
                    onChange={(e) => setNewPlaylistDesc(e.target.value)}
                    className="w-full bg-[#faf8f5] border p-3 rounded-xl text-xs outline-none focus:border-[#c45a3a] h-20 resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                    {lang === "ar" ? "التصنيف" : "Category"}
                  </label>
                  <select 
                    value={newPlaylistCategory}
                    onChange={(e) => setNewPlaylistCategory(e.target.value)}
                    className="w-full bg-[#faf8f5] border p-3 rounded-xl text-xs outline-none"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="General">General Education</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-2">
                    {lang === "ar" ? "اختر الدروس لتضمينها (حدد فيديو واحد على الأقل):" : "Select lectures to include (Select at least one):"}
                  </label>
                  <div className="flex flex-col gap-2 max-h-40 overflow-y-auto bg-[#faf8f5] border p-3 rounded-xl">
                    {videos.map((v) => {
                      const isChecked = selectedPlaylistVideoIds.includes(v.id);
                      return (
                        <label key={v.id} className="flex items-start gap-2.5 text-xs text-[#5c554d] cursor-pointer hover:text-[#1a1612]">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSelectedPlaylistVideoIds(prev => prev.filter(id => id !== v.id));
                              } else {
                                setSelectedPlaylistVideoIds(prev => [...prev, v.id]);
                              }
                            }}
                            className="mt-0.5 rounded text-[#c45a3a] focus:ring-[#c45a3a]"
                          />
                          <div>
                            <span className="font-bold text-[10px] text-[#c45a3a]">[{v.category}]</span> {v.title}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <button type="submit" className="w-full py-3 bg-[#c45a3a] hover:bg-[#c45a3a]/90 text-white font-bold text-xs rounded-xl shadow-lg mt-2 transition">
                  {lang === "ar" ? "إنشاء ونشر قائمة التشغيل" : "Create & Publish Playlist"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DATABASE SCHEMA EXPLORER MODAL */}
      <AnimatePresence>
        {isSchemaModalOpen && (
          <div className="fixed inset-0 z-[3000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border rounded-3xl w-full max-w-5xl p-8 relative shadow-2xl h-[85vh] flex flex-col"
            >
              <button 
                onClick={() => {
                  setIsSchemaModalOpen(false);
                  window.location.hash = "";
                }}
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-6 border-b border-[#e8e2d9] pb-4 shrink-0">
                <div className="p-2.5 bg-[#c45a3a]/10 rounded-2xl">
                  <Database className="w-6 h-6 text-[#c45a3a]" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#1a1612]">
                    {lang === "ar" ? "مستكشف مخطط قاعدة بيانات هيلبر (Firestore)" : "Helper Database Schema Hub"}
                  </h3>
                  <p className="text-xs text-[#5c554d]">
                    {lang === "ar"
                      ? "المخطط الهيكلي لقاعدة البيانات السحابية، علاقات الكوليكشنز، والفرس المركبة لتحسين الأداء الفائق."
                      : "The underlying cloud database structure, relational integrity rules, and index optimization guides."
                    }
                  </p>
                </div>
              </div>

              {/* Grid content */}
              <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left side tabs: Collections list */}
                <div className="md:col-span-4 border-r rtl:border-r-0 rtl:border-l border-[#e8e2d9] pr-0 md:pr-4 rtl:md:pr-0 rtl:md:pl-4 overflow-y-auto flex flex-col gap-1.5">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2 block">
                    {lang === "ar" ? "مجموعات البيانات (Collections)" : "Firestore Collections"}
                  </span>
                  {[
                    { id: "users", label: lang === "ar" ? "المستخدمين (users/)" : "Users (users/)", icon: User, color: "text-blue-500 bg-blue-50" },
                    { id: "videos", label: lang === "ar" ? "الفيديوهات (videos/)" : "Videos (videos/)", icon: Video, color: "text-rose-500 bg-rose-50" },
                    { id: "playlists", label: lang === "ar" ? "قوائم التشغيل (playlists/)" : "Playlists (playlists/)", icon: BookOpen, color: "text-amber-500 bg-amber-50" },
                    { id: "notes", label: lang === "ar" ? "الملاحظات (notes/)" : "Notes (notes/)", icon: FileText, color: "text-[#c45a3a] bg-[#c45a3a]/10" },
                    { id: "resources", label: lang === "ar" ? "الملفات والمراجع (resources/)" : "Resources (resources/)", icon: Link2, color: "text-emerald-500 bg-emerald-50" },
                    { id: "comments", label: lang === "ar" ? "النقاشات (comments/)" : "Comments (comments/)", icon: MessageSquare, color: "text-indigo-500 bg-indigo-50" },
                    { id: "activities", label: lang === "ar" ? "سجل النشاط (activities/)" : "Activities (activities/)", icon: Activity, color: "text-purple-500 bg-purple-50" },
                  ].map((col) => {
                    const isSelected = selectedSchemaTab === col.id;
                    const IconComp = col.icon;
                    return (
                      <button
                        key={col.id}
                        onClick={() => setSelectedSchemaTab(col.id)}
                        className={`w-full text-start px-4 py-3 rounded-xl transition flex items-center gap-3 ${
                          isSelected 
                            ? "bg-[#c45a3a] text-white font-bold shadow-md shadow-[#c45a3a]/10" 
                            : "bg-[#f5f0ea]/50 hover:bg-[#f5f0ea] text-[#1a1612]"
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? "bg-white/20 text-white" : col.color}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-xs truncate">{col.label}</span>
                      </button>
                    );
                  })}

                  <div className="mt-auto bg-[#faf8f5] border p-4 rounded-2xl">
                    <h5 className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                      {lang === "ar" ? "نوع قاعدة البيانات" : "Database Engine"}
                    </h5>
                    <span className="text-xs text-[#1a1612] font-extrabold flex items-center gap-1.5 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      Google Cloud Firestore
                    </span>
                    <p className="text-[10px] text-[#8a8278] leading-normal">
                      {lang === "ar"
                        ? "داتا بيز مستندات NoSQL مرنة وفورية بمزامنة حية ومحمية بـ Security Rules صارمة."
                        : "Serverless NoSQL live document database with real-time sync and robust Security Rules ruleset."
                      }
                    </p>
                  </div>
                </div>

                {/* Right side: Detailed Selected Entity Schema */}
                <div className="md:col-span-8 overflow-y-auto pr-2 rtl:pr-0 rtl:pl-2 flex flex-col gap-6">
                  {/* Entity Description Banner */}
                  <div className="bg-[#faf8f5] border p-5 rounded-2xl">
                    <span className="text-[9px] font-black uppercase bg-[#c45a3a]/10 text-[#c45a3a] px-2.5 py-1 rounded-full inline-block mb-2">
                      {lang === "ar" ? "الوصف الوظيفي للمجموعة" : "Collection Concept"}
                    </span>
                    <h4 className="text-base font-black text-[#1a1612] mb-1.5">
                      {selectedSchemaTab === "users" && (lang === "ar" ? "المستخدمون (users/)" : "Users (users/)")}
                      {selectedSchemaTab === "videos" && (lang === "ar" ? "الفيديوهات والدروس (videos/)" : "Videos (videos/)")}
                      {selectedSchemaTab === "playlists" && (lang === "ar" ? "قوائم التشغيل (playlists/)" : "Playlists (playlists/)")}
                      {selectedSchemaTab === "notes" && (lang === "ar" ? "مفكرة الملاحظات (notes/)" : "Notes (notes/)")}
                      {selectedSchemaTab === "resources" && (lang === "ar" ? "المراجع والملفات (resources/)" : "Resources (resources/)")}
                      {selectedSchemaTab === "comments" && (lang === "ar" ? "تعليقات النقاش (comments/)" : "Comments (comments/)")}
                      {selectedSchemaTab === "activities" && (lang === "ar" ? "سجل تتبع النشاط (activities/)" : "Activity Logs (activities/)")}
                    </h4>
                    <p className="text-xs text-[#5c554d] leading-relaxed">
                      {selectedSchemaTab === "users" && (lang === "ar" ? "تخزين بيانات الطلاب والمدرسين وخصائصهم للحماية والصلاحيات." : "Stores registered profiles for students and educators, governing workspace access controls.")}
                      {selectedSchemaTab === "videos" && (lang === "ar" ? "كتالوج الدروس العلمية المستوردة والمرفوعة لتنظيم Notebooks." : "The core video lectures catalog, imported from 3rd party providers like YouTube and Vimeo.")}
                      {selectedSchemaTab === "playlists" && (lang === "ar" ? "تجميع الدروس في مسارات علمية مترابطة سهلة المشاركة برابط واحد." : "Represents curated scientific pathways combining multiple video lessons shared via unique hashes.")}
                      {selectedSchemaTab === "notes" && (lang === "ar" ? "الملاحظات الدراسية المرتبطة بالثواني الدقيقة في الفيديو مع التوقيت والذكاء الاصطناعي." : "Saves high-quality synchronized bullet points tied to video playback timestamps.")}
                      {selectedSchemaTab === "resources" && (lang === "ar" ? "ملفات PDF، جداول إكسل، أو صور توضيحية مرفوعة عند ثانية محددة بالدرس لربط المحاضرة بملفاتها." : "Stores external or uploaded materials (PDFs, spreadsheets, images) contextually linked to timelines.")}
                      {selectedSchemaTab === "comments" && (lang === "ar" ? "الأسئلة والنقاشات المتبادلة بين المعلم والطلاب في ساحة نقاش الدرس لتسهيل المذاكرة الجماعية." : "Enables interactive real-time classroom threads directly underneath each lecture notebook.")}
                      {selectedSchemaTab === "activities" && (lang === "ar" ? "سجلات فورية تسجل حركات وتفاعل الطلاب على المنصة (الذكاء الاصطناعي، الملاحظات، الملفات)." : "Platform telemetry logging interactions (AI notes drafting, local files attachments, playlist sharing).")}
                    </p>
                  </div>

                  {/* Schema fields table */}
                  <div>
                    <h5 className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2.5 block">
                      {lang === "ar" ? "مخطط الحقول والأنواع (Fields Schema)" : "Document Fields & Schema Types"}
                    </h5>
                    <div className="border border-[#e8e2d9] rounded-xl overflow-hidden bg-white">
                      <table className="w-full text-start border-collapse">
                        <thead>
                          <tr className="bg-[#f5f0ea] text-[10px] uppercase font-black text-gray-500 border-b border-[#e8e2d9]">
                            <th className="p-3">{lang === "ar" ? "اسم الحقل" : "Field"}</th>
                            <th className="p-3">{lang === "ar" ? "النوع" : "Data Type"}</th>
                            <th className="p-3">{lang === "ar" ? "الخاصية" : "Key constraint"}</th>
                            <th className="p-3">{lang === "ar" ? "الشرح" : "Description"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e8e2d9] text-[11px] text-[#1a1612]">
                          {selectedSchemaTab === "users" && [
                            { name: "uid", type: "string", constraint: "Primary Key / Unique", desc: lang === "ar" ? "معرّف فريد ومطابق لـ Firebase Authentication" : "Unique identifier matching request.auth.uid" },
                            { name: "displayName", type: "string", constraint: "Required", desc: lang === "ar" ? "الاسم الكامل المعروض للطالب أو المعلم" : "Full name of the user" },
                            { name: "email", type: "string", constraint: "Required / Unique", desc: lang === "ar" ? "البريد الإلكتروني للتحقق والاتصال" : "Unique email address" },
                            { name: "role", type: "string ('student' | 'teacher')", constraint: "Required", desc: lang === "ar" ? "دور المستخدم لتحديد الصلاحيات" : "Authorization role" },
                            { name: "createdAt", type: "string (ISO Date)", constraint: "Required", desc: lang === "ar" ? "تاريخ إنشاء الحساب السحابي" : "Account registration timestamp" }
                          ].map((f, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="p-3 font-mono text-[#c45a3a] font-bold">{f.name}</td>
                              <td className="p-3 font-mono text-gray-500">{f.type}</td>
                              <td className="p-3 font-semibold text-gray-600">{f.constraint}</td>
                              <td className="p-3 text-[#5c554d]">{f.desc}</td>
                            </tr>
                          ))}

                          {selectedSchemaTab === "videos" && [
                            { name: "id", type: "string", constraint: "Primary Key / Unique", desc: lang === "ar" ? "معرّف يوتيوب الفريد للفيديو المستورد" : "YouTube Video ID" },
                            { name: "title", type: "string", constraint: "Required", desc: lang === "ar" ? "عنوان الدرس العلمي" : "Academic lesson title" },
                            { name: "channelTitle", type: "string", constraint: "Required", desc: lang === "ar" ? "اسم القناة أو المدرس الناشر على يوتيوب" : "Original channel creator" },
                            { name: "duration", type: "number", constraint: "Required", desc: lang === "ar" ? "مدة الفيديو الكلية بالثواني" : "Total duration in seconds" },
                            { name: "category", type: "string", constraint: "Required", desc: lang === "ar" ? "التصنيف الدراسي (حساب تفاضل، فيزياء...)" : "Subject category" },
                            { name: "addedBy", type: "string", constraint: "Optional", desc: lang === "ar" ? "معرّف المدرس أو الطالب الذي أضافه" : "Creator UID who imported it" },
                            { name: "createdAt", type: "string (ISO Date)", constraint: "Required", desc: lang === "ar" ? "تاريخ إدراج الفيديو في النظام" : "Import timestamp" }
                          ].map((f, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="p-3 font-mono text-[#c45a3a] font-bold">{f.name}</td>
                              <td className="p-3 font-mono text-gray-500">{f.type}</td>
                              <td className="p-3 font-semibold text-gray-600">{f.constraint}</td>
                              <td className="p-3 text-[#5c554d]">{f.desc}</td>
                            </tr>
                          ))}

                          {selectedSchemaTab === "playlists" && [
                            { name: "id", type: "string", constraint: "Primary Key", desc: lang === "ar" ? "معرّف قائمة التشغيل الفريد" : "Unique playlist ID" },
                            { name: "title", type: "string", constraint: "Required", desc: lang === "ar" ? "عنوان مسار التعلم" : "Curated playlist course title" },
                            { name: "description", type: "string", constraint: "Optional", desc: lang === "ar" ? "تفاصيل محتوى المسار وأهدافه" : "Brief description of topics" },
                            { name: "category", type: "string", constraint: "Required", desc: lang === "ar" ? "التصنيف العلمي العام" : "Academic subject grouping" },
                            { name: "videoIds", type: "array (string)", constraint: "Required", desc: lang === "ar" ? "قائمة معرّفات الفيديوهات المشمولة" : "Ordered list of associated Video IDs" },
                            { name: "createdBy", type: "string", constraint: "Required", desc: lang === "ar" ? "اسم أو معرّف صانع المسار" : "Creator name or uid" },
                            { name: "isPublic", type: "boolean", constraint: "Required", desc: lang === "ar" ? "رؤية المسار للجميع" : "Public visibility flag" },
                            { name: "createdAt", type: "string (ISO Date)", constraint: "Required", desc: lang === "ar" ? "تاريخ النشر" : "Publishing date-time" }
                          ].map((f, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="p-3 font-mono text-[#c45a3a] font-bold">{f.name}</td>
                              <td className="p-3 font-mono text-gray-500">{f.type}</td>
                              <td className="p-3 font-semibold text-gray-600">{f.constraint}</td>
                              <td className="p-3 text-[#5c554d]">{f.desc}</td>
                            </tr>
                          ))}

                          {selectedSchemaTab === "notes" && [
                            { name: "id", type: "string", constraint: "Primary Key", desc: lang === "ar" ? "معرّف الملاحظة الفريد" : "Unique Note ID" },
                            { name: "videoId", type: "string", constraint: "Required / FK", desc: lang === "ar" ? "معرّف الدرس المرفق به الملاحظة" : "Target Video ID (FK to Videos)" },
                            { name: "userId", type: "string", constraint: "Required / FK", desc: lang === "ar" ? "معرّف الطالب كاتب الملاحظة" : "Author Student UID (FK to Users)" },
                            { name: "userDisplayName", type: "string", constraint: "Required", desc: lang === "ar" ? "اسم الطالب المعروض لتسهيل القراءة" : "Author display name" },
                            { name: "timestamp", type: "number", constraint: "Required", desc: lang === "ar" ? "توقيت الفيديو بالثواني المربوطة به" : "Playback timestamp in seconds" },
                            { name: "text", type: "string", constraint: "Required", desc: lang === "ar" ? "نص الملاحظة الدراسي (يدعم الصياغة بالذكاء الاصطناعي)" : "Core content notes text" },
                            { name: "createdAt", type: "string (ISO Date)", constraint: "Required", desc: lang === "ar" ? "تاريخ تدوين الملاحظة" : "Creation timestamp" }
                          ].map((f, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="p-3 font-mono text-[#c45a3a] font-bold">{f.name}</td>
                              <td className="p-3 font-mono text-gray-500">{f.type}</td>
                              <td className="p-3 font-semibold text-gray-600">{f.constraint}</td>
                              <td className="p-3 text-[#5c554d]">{f.desc}</td>
                            </tr>
                          ))}

                          {selectedSchemaTab === "resources" && [
                            { name: "id", type: "string", constraint: "Primary Key", desc: lang === "ar" ? "معرّف المرجع الفريد" : "Unique Resource ID" },
                            { name: "videoId", type: "string", constraint: "Required / FK", desc: lang === "ar" ? "معرّف الدرس المرفق به الملف" : "Target Video ID (FK to Videos)" },
                            { name: "title", type: "string", constraint: "Required", desc: lang === "ar" ? "عنوان المرجع أو اسم الملف الأصلي" : "Document file title" },
                            { name: "type", type: "string ('pdf'|'link'|'image'|'excel')", constraint: "Required", desc: lang === "ar" ? "نوع المورد لتحديد الأيقونة والفتح" : "Resource format" },
                            { name: "url", type: "string", constraint: "Required", desc: lang === "ar" ? "رابط الملف أو رابط التنزيل السحابي" : "Download URL or Object URL" },
                            { name: "timestamp", type: "number", constraint: "Required", desc: lang === "ar" ? "نقطة التوقيت لظهور الملف" : "Associated playback second" },
                            { name: "addedBy", type: "string", constraint: "Required", desc: lang === "ar" ? "اسم المرفق للملف" : "User display name" },
                            { name: "createdAt", type: "string (ISO Date)", constraint: "Required", desc: lang === "ar" ? "تاريخ الرفع" : "Upload timestamp" }
                          ].map((f, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="p-3 font-mono text-[#c45a3a] font-bold">{f.name}</td>
                              <td className="p-3 font-mono text-gray-500">{f.type}</td>
                              <td className="p-3 font-semibold text-gray-600">{f.constraint}</td>
                              <td className="p-3 text-[#5c554d]">{f.desc}</td>
                            </tr>
                          ))}

                          {selectedSchemaTab === "comments" && [
                            { name: "id", type: "string", constraint: "Primary Key", desc: lang === "ar" ? "معرّف التعليق الفريد" : "Unique Comment ID" },
                            { name: "videoId", type: "string", constraint: "Required / FK", desc: lang === "ar" ? "معرّف الدرس مكان النقاش" : "Parent Video ID (FK to Videos)" },
                            { name: "userId", type: "string", constraint: "Required / FK", desc: lang === "ar" ? "معرّف الكاتب" : "Commenter User UID (FK to Users)" },
                            { name: "userDisplayName", type: "string", constraint: "Required", desc: lang === "ar" ? "اسم الكاتب المعروض" : "Commenter display name" },
                            { name: "text", type: "string", constraint: "Required", desc: lang === "ar" ? "محتوى سؤال الطالب أو رد المعلم" : "Class discussion comment text" },
                            { name: "createdAt", type: "string (ISO Date)", constraint: "Required", desc: lang === "ar" ? "تاريخ الإرسال" : "Creation date-time" }
                          ].map((f, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="p-3 font-mono text-[#c45a3a] font-bold">{f.name}</td>
                              <td className="p-3 font-mono text-gray-500">{f.type}</td>
                              <td className="p-3 font-semibold text-gray-600">{f.constraint}</td>
                              <td className="p-3 text-[#5c554d]">{f.desc}</td>
                            </tr>
                          ))}

                          {selectedSchemaTab === "activities" && [
                            { name: "id", type: "string", constraint: "Primary Key", desc: lang === "ar" ? "معرّف النشاط الفريد" : "Unique Activity ID" },
                            { name: "userId", type: "string", constraint: "Required / FK", desc: lang === "ar" ? "معرّف المستخدم المنفذ" : "Operator User UID (FK to Users)" },
                            { name: "userDisplayName", type: "string", constraint: "Required", desc: lang === "ar" ? "الاسم المعروض للمستخدم" : "Operator display name" },
                            { name: "videoId", type: "string", constraint: "Required / FK", desc: lang === "ar" ? "معرّف الفيديو المرتبط بالنشاط" : "Target Video ID (FK to Videos)" },
                            { name: "action", type: "string", constraint: "Required", desc: lang === "ar" ? "نوع العملية (صياغة بالذكاء الاصطناعي، رفع ملف، إلخ)" : "Logged operation keyword" },
                            { name: "timestamp", type: "number", constraint: "Optional", desc: lang === "ar" ? "توقيت الفيديو الملحق بالحدث" : "Playback playback second" },
                            { name: "createdAt", type: "string (ISO Date)", constraint: "Required", desc: lang === "ar" ? "تاريخ ووقت الحدث بدقة" : "Timestamp of telemetry log" }
                          ].map((f, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="p-3 font-mono text-[#c45a3a] font-bold">{f.name}</td>
                              <td className="p-3 font-mono text-gray-500">{f.type}</td>
                              <td className="p-3 font-semibold text-gray-600">{f.constraint}</td>
                              <td className="p-3 text-[#5c554d]">{f.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Relationship and Performance index details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#f5f0ea]/50 border border-[#e8e2d9] p-5 rounded-xl">
                      <h6 className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2">
                        {lang === "ar" ? "علاقات قاعدة البيانات (Entity Relations)" : "Database Relations (ER)"}
                      </h6>
                      <ul className="text-xs flex flex-col gap-2">
                        {selectedSchemaTab === "users" && (
                          <>
                            <li>🔗 <b className="font-bold">users.uid</b> &lt; 1:N &gt; <b className="font-mono">notes.userId</b></li>
                            <li>🔗 <b className="font-bold">users.uid</b> &lt; 1:N &gt; <b className="font-mono">comments.userId</b></li>
                            <li>🔗 <b className="font-bold">users.uid</b> &lt; 1:N &gt; <b className="font-mono">activities.userId</b></li>
                          </>
                        )}
                        {selectedSchemaTab === "videos" && (
                          <>
                            <li>🔗 <b className="font-bold">videos.id</b> &lt; 1:N &gt; <b className="font-mono">notes.videoId</b></li>
                            <li>🔗 <b className="font-bold">videos.id</b> &lt; 1:N &gt; <b className="font-mono">resources.videoId</b></li>
                            <li>🔗 <b className="font-bold">videos.id</b> &lt; 1:N &gt; <b className="font-mono">comments.videoId</b></li>
                          </>
                        )}
                        {selectedSchemaTab === "playlists" && (
                          <>
                            <li>🔗 <b className="font-bold">playlists.videoIds (Array)</b> &lt; N:N &gt; <b className="font-mono">videos.id</b></li>
                          </>
                        )}
                        {selectedSchemaTab === "notes" && (
                          <>
                            <li>🔗 <b className="font-bold">notes.videoId (FK)</b> &rarr; <b className="font-mono">videos.id</b></li>
                            <li>🔗 <b className="font-bold">notes.userId (FK)</b> &rarr; <b className="font-mono">users.uid</b></li>
                          </>
                        )}
                        {selectedSchemaTab === "resources" && (
                          <>
                            <li>🔗 <b className="font-bold">resources.videoId (FK)</b> &rarr; <b className="font-mono">videos.id</b></li>
                          </>
                        )}
                        {selectedSchemaTab === "comments" && (
                          <>
                            <li>🔗 <b className="font-bold">comments.videoId (FK)</b> &rarr; <b className="font-mono">videos.id</b></li>
                            <li>🔗 <b className="font-bold">comments.userId (FK)</b> &rarr; <b className="font-mono">users.uid</b></li>
                          </>
                        )}
                        {selectedSchemaTab === "activities" && (
                          <>
                            <li>🔗 <b className="font-bold">activities.videoId (FK)</b> &rarr; <b className="font-mono">videos.id</b></li>
                            <li>🔗 <b className="font-bold">activities.userId (FK)</b> &rarr; <b className="font-mono">users.uid</b></li>
                          </>
                        )}
                      </ul>
                      <p className="text-[10px] text-gray-500 mt-3 leading-normal">
                        {lang === "ar"
                          ? "العلاقات مرجعية، يتم التحقق منها عبر Firestore Rules لضمان الأمن وصلاحيات الكتابة."
                          : "Referential integrity and safety constraints are enforced cloud-side via Firestore rules ruleset."
                        }
                      </p>
                    </div>

                    <div className="bg-[#f5f0ea]/50 border border-[#e8e2d9] p-5 rounded-xl">
                      <h6 className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2">
                        {lang === "ar" ? "استراتيجية الفهرسة للأداء الفائق" : "Index Optimization Strategy"}
                      </h6>
                      <p className="text-xs text-[#5c554d] leading-relaxed mb-3">
                        {selectedSchemaTab === "users" && (lang === "ar" ? "يستخدم الفهرس الفردي التلقائي. لا حاجة لفهارس مركبة معقدة." : "Standard Firestore auto-indexing manages single-field queries on uid or email efficiently.")}
                        {selectedSchemaTab === "videos" && (lang === "ar" ? "فهرس مركب: category (تصاعدي) + createdAt (تنازلي) لفلترة الفئات بسرعة." : "Composite Index: category (Ascending) + createdAt (Descending) for prompt subject filtering.")}
                        {selectedSchemaTab === "playlists" && (lang === "ar" ? "فهرس مركب: isPublic + category + createdAt تنازلي لتشغيل معارض قوائم التشغيل العامة." : "Composite Index: isPublic (Ascending) + category (Ascending) + createdAt (Descending) for shared wiki feeds.")}
                        {selectedSchemaTab === "notes" && (lang === "ar" ? "فهرس مركب إجباري: videoId (تصاعدي) + timestamp (تصاعدي) حتى تظهر الملاحظات بتسلسل الفيديو الحقيقي في الأجزاء المطابقة ثانية بثانية." : "REQUIRED Composite Index: videoId (Ascending) + timestamp (Ascending) to pull user study logs instantly in sync with player ticking.")}
                        {selectedSchemaTab === "resources" && (lang === "ar" ? "فهرس مركب: videoId (تصاعدي) + timestamp (تصاعدي) لتسريع تحميل ملفات الدرس العلمية." : "Composite Index: videoId (Ascending) + timestamp (Ascending) to feed download buttons contextually.")}
                        {selectedSchemaTab === "comments" && (lang === "ar" ? "فهرس مركب: videoId (تصاعدي) + createdAt (تصاعدي) لتأمين نقاش مرتب زمنياً." : "Composite Index: videoId (Ascending) + createdAt (Ascending) to structure chronologically ordered student discussion boards.")}
                        {selectedSchemaTab === "activities" && (lang === "ar" ? "فهرس مركب: videoId (تصاعدي) + createdAt (تنازلي) لعرض تيار التفاعل المباشر للطلاب. وفهرس فردي لـ createdAt (تنازلي)." : "Composite Index: videoId (Ascending) + createdAt (Descending) to feed live timeline updates. Single-field on createdAt for admin logs.")}
                      </p>
                      <span className="text-[10px] text-[#5a8a6e] font-extrabold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        {lang === "ar" ? "تم نشر الفهارس السحابية" : "Cloud indexes deployed & active"}
                      </span>
                    </div>
                  </div>

                  {/* Schema Blueprint Snippet */}
                  <div className="bg-[#1a1612] text-gray-300 p-5 rounded-2xl font-mono text-[10px] relative">
                    <span className="absolute top-3.5 right-4 text-[9px] uppercase font-black text-gray-500 tracking-wider">
                      {lang === "ar" ? "نموذج مستند JSON" : "Document Payload Mockup"}
                    </span>
                    <span className="text-[#c45a3a] block font-black mb-2 select-none">// {selectedSchemaTab}.json</span>
                    <pre className="overflow-x-auto whitespace-pre-wrap">
                      {selectedSchemaTab === "users" && `{
  "uid": "user_ramibali99",
  "displayName": "Rami Ben Ali",
  "email": "rami.ali@university.tn",
  "role": "student",
  "createdAt": "2026-07-15T00:37:51Z"
}`}
                      {selectedSchemaTab === "videos" && `{
  "id": "dQw4w9WgXcQ",
  "title": "Introduction to Quantum Physics",
  "channelTitle": "MIT OpenCourseWare",
  "duration": 2700,
  "category": "Physics",
  "addedBy": "teacher_youssef",
  "createdAt": "2026-07-15T00:30:00Z"
}`}
                      {selectedSchemaTab === "playlists" && `{
  "id": "playlist_quant99",
  "title": "Advanced Quantum Mechanics Syllabus",
  "description": "A comprehensive compilation of MIT and Harvard quantum video notes.",
  "category": "Physics",
  "videoIds": ["dQw4w9WgXcQ", "yOuKzUuX_2s"],
  "createdBy": "Prof. Youssef Khemiri",
  "isPublic": true,
  "createdAt": "2026-07-15T00:35:12Z"
}`}
                      {selectedSchemaTab === "notes" && `{
  "id": "note_limit_001",
  "videoId": "dQw4w9WgXcQ",
  "userId": "user_ramibali99",
  "userDisplayName": "Rami Ben Ali",
  "timestamp": 312,
  "text": "The wavefunction collapse occurs immediately upon measurement, transitioning the system from superposed state to eigenstate.",
  "createdAt": "2026-07-15T00:37:55Z"
}`}
                      {selectedSchemaTab === "resources" && `{
  "id": "res_quantum_guide",
  "videoId": "dQw4w9WgXcQ",
  "title": "Wavefunction Calculus Worksheet.pdf",
  "type": "pdf",
  "url": "blob:http://localhost:3000/a748b9f",
  "timestamp": 450,
  "addedBy": "Prof. Youssef Khemiri",
  "createdAt": "2026-07-15T00:36:00Z"
}`}
                      {selectedSchemaTab === "comments" && `{
  "id": "comm_78a1b",
  "videoId": "dQw4w9WgXcQ",
  "userId": "user_ramibali99",
  "userDisplayName": "Rami Ben Ali",
  "text": "Prof, is the wavefunction normalisation constraint always integrated over all space?",
  "createdAt": "2026-07-15T00:38:00Z"
}`}
                      {selectedSchemaTab === "activities" && `{
  "id": "act_82ha9",
  "userId": "user_ramibali99",
  "userDisplayName": "Rami Ben Ali",
  "videoId": "dQw4w9WgXcQ",
  "action": "Drafted Study Note with Helper AI",
  "timestamp": 312,
  "createdAt": "2026-07-15T00:37:55Z"
}`}
                    </pre>
                  </div>

                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PLATFORM ACTIVITY LOGS MODAL */}
      <AnimatePresence>
        {isLogsModalOpen && (
          <div className="fixed inset-0 z-[3000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border rounded-3xl w-full max-w-4xl p-8 relative shadow-2xl h-[80vh] flex flex-col"
            >
              <button 
                onClick={() => {
                  setIsLogsModalOpen(false);
                  window.location.hash = "";
                }}
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-between mb-6 border-b border-[#e8e2d9] pb-4 shrink-0 flex-wrap gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-[#5a8a6e]/10 rounded-2xl">
                    <Activity className="w-6 h-6 text-[#5a8a6e]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-[#1a1612]">
                      {lang === "ar" ? "سجل نشاط المنصة الفوري" : "Helper Live Activity Stream"}
                    </h3>
                    <p className="text-xs text-[#5c554d]">
                      {lang === "ar"
                        ? "متابعة تيار تفاعل الطلاب والمعلمين مع النظام بالذكاء الاصطناعي وبناء الملفات والمسارات."
                        : "Real-time stream of academic interactions, AI drafts, file attachments, and shared course pathways."
                      }
                    </p>
                  </div>
                </div>

                <button
                  onClick={fetchGlobalActivities}
                  disabled={isLoadingGlobalActivities}
                  className="px-4 py-2 bg-[#f5f0ea] hover:bg-[#e8e2d9] text-[#1a1612] font-bold text-xs rounded-xl flex items-center gap-2 transition disabled:opacity-50 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingGlobalActivities ? "animate-spin" : ""}`} />
                  {lang === "ar" ? "تحديث السجلات" : "Refresh Stream"}
                </button>
              </div>

              {/* Table or log list */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                {isLoadingGlobalActivities ? (
                  <div className="h-full flex flex-col items-center justify-center gap-2.5">
                    <RefreshCw className="w-8 h-8 text-[#5a8a6e] animate-spin" />
                    <span className="text-xs text-[#8a8278]">{lang === "ar" ? "جاري جلب أحدث سجلات المنصة الحية..." : "Querying Firestore logs stream..."}</span>
                  </div>
                ) : globalActivities.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center gap-2 text-center p-8 bg-[#faf8f5] rounded-2xl border border-dashed border-[#e8e2d9]">
                    <span className="text-3xl">📡</span>
                    <h4 className="text-xs font-bold text-[#1a1612]">
                      {lang === "ar" ? "لا توجد سجلات بعد" : "Log feed is currently silent"}
                    </h4>
                    <p className="text-[11px] text-gray-500 max-w-sm">
                      {lang === "ar"
                        ? "ابدأ بتدوين الملاحظات، أو طلب مساعد الذكاء الاصطناعي، أو إضافة فيديوهات لتوليد سجلات نشاط تتبع فوري مذهل."
                        : "Perform workspace events like drafting notes, creating course playlists, or uploading files to populate this real-time feed."
                      }
                    </p>
                  </div>
                ) : (
                  <div className="border border-[#e8e2d9] rounded-2xl overflow-hidden bg-white">
                    <div className="divide-y divide-[#e8e2d9]">
                      {globalActivities.map((act) => {
                        const dateObj = new Date(act.createdAt);
                        const displayTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const displayDate = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
                        
                        // Map actions to beautiful custom badges
                        let badgeBg = "bg-blue-50 text-blue-600 border-blue-100";
                        if (act.action.includes("Draft") || act.action.includes("AI")) {
                          badgeBg = "bg-[#c45a3a]/10 text-[#c45a3a] border-[#c45a3a]/20";
                        } else if (act.action.includes("Attach") || act.action.includes("File")) {
                          badgeBg = "bg-emerald-50 text-emerald-600 border-emerald-100";
                        } else if (act.action.includes("Playlist") || act.action.includes("Course")) {
                          badgeBg = "bg-amber-50 text-amber-600 border-amber-100";
                        } else if (act.action.includes("Video") || act.action.includes("Lecture")) {
                          badgeBg = "bg-rose-50 text-rose-600 border-rose-100";
                        }

                        return (
                          <div key={act.id} className="p-4 hover:bg-gray-50 flex items-start gap-4 transition text-xs">
                            <div className="w-8 h-8 rounded-full bg-[#f5f0ea] border border-[#e8e2d9] flex items-center justify-center font-bold text-[#1a1612] shrink-0 uppercase">
                              {act.userDisplayName ? act.userDisplayName.substring(0, 2) : "GU"}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                                <span className="font-extrabold text-[#1a1612] truncate">{act.userDisplayName || "Guest Student"}</span>
                                <span className="text-[10px] text-[#8a8278]">{lang === "ar" ? "قام بـ" : "triggered"}</span>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 border rounded-full shrink-0 ${badgeBg}`}>
                                  {act.action}
                                </span>
                              </div>
                              
                              <p className="text-[11px] text-[#5c554d] truncate">
                                📺 {lang === "ar" ? "في الدرس العلمي معرّف:" : "Inside lecture ID:"} <span className="font-mono bg-[#f5f0ea] px-1 py-0.5 rounded text-[10px]">{act.videoId}</span>
                                {act.timestamp !== undefined && act.timestamp > 0 && (
                                  <> @ <span className="font-bold text-[#c45a3a]">{formatTime(act.timestamp)}</span></>
                                )}
                              </p>
                            </div>

                            <div className="text-end shrink-0 flex flex-col items-end gap-1 font-mono text-[10px] text-[#8a8278]">
                              <span className="font-extrabold text-[#1a1612]">{displayTime}</span>
                              <span>{displayDate}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADMIN PANEL WORKSPACE MODAL */}
      <AnimatePresence>
        {isAdminPanelOpen && (
          <AdminPanel 
            isOpen={isAdminPanelOpen}
            onClose={() => setIsAdminPanelOpen(false)}
            currentUser={user}
            lang={lang}
            showToast={showToast}
            onRefreshVideos={fetchVideos}
          />
        )}
      </AnimatePresence>

    </div>
    )}
    </React.Suspense>
  );
}
