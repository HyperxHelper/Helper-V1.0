import React, { useState, useEffect, useRef } from "react";
import { 
  Video, 
  FileText, 
  Sparkles, 
  ArrowLeft, 
  Play, 
  Pause, 
  Maximize, 
  Plus, 
  Clock, 
  Send, 
  Trash2, 
  Settings, 
  X, 
  Save, 
  HelpCircle, 
  Highlighter,
  Mic,
  Volume2,
  Check,
  CheckSquare,
  BookOpen,
  Globe,
  Search,
  Eye,
  Award,
  Activity,
  Link,
  File,
  ExternalLink,
  Paperclip
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VideoDoc {
  id: string;
  title: string;
  channelTitle: string;
  duration: number;
  category: string;
  addedBy: string;
  createdAt: string;
}

interface Annotation {
  time: number;
  type: "note" | "highlight" | "question";
  text: string;
}

interface HummingbirdWorkspaceProps {
  user: {
    uid: string;
    email: string;
    displayName: string;
    role: "student" | "teacher" | "admin";
  } | null;
  lang: "en" | "ar";
  onLangChange?: (lang: "en" | "ar") => void;
  onBackToHome: () => void;
  catalogVideos: VideoDoc[];
}

export default function HummingbirdWorkspace({ 
  user, 
  lang: initialLang, 
  onLangChange, 
  onBackToHome, 
  catalogVideos 
}: HummingbirdWorkspaceProps) {
  // ===== COMPONENT STATE =====
  const [lang, setLang] = useState<"en" | "ar">(initialLang);
  const [activeVideo, setActiveVideo] = useState<VideoDoc | null>(null); // Start fresh to show "Ready to learn"
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [activeTab, setActiveTab] = useState<"video" | "notes" | "add" | "ai" | "wikis">("video");
  const [currentMode, setCurrentMode] = useState<"video" | "notepad">("video");
  const [annotType, setAnnotType] = useState<"note" | "highlight" | "question">("note");
  
  // Wikis state management
  const [allSystemWikis, setAllSystemWikis] = useState<any[]>([]);
  const [isWikisLoading, setIsWikisLoading] = useState(false);
  const [wikiSearchQuery, setWikiSearchQuery] = useState("");
  const [wikiSelectedCategory, setWikiSelectedCategory] = useState("All");
  
  // Interactive Timeline / Video states
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(600);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Custom Notepad and Annotations
  const [notepadText, setNotepadText] = useState("");
  const [annotations, setAnnotations] = useState<Annotation[]>([
    { time: 42, type: "note", text: lang === "ar" ? "الفكرة الأساسية للدرس وكيفية تطبيقها." : "Core concept of the lesson and how to apply it." },
    { time: 145, type: "highlight", text: lang === "ar" ? "قانون رئيسي: انتبه للمعادلة المكتوبة على السبورة." : "Key formula alert: pay close attention to the board." },
    { time: 280, type: "question", text: lang === "ar" ? "هل هناك طريقة أسرع لحل هذا الاشتقاق؟" : "Is there a faster way to solve this derivation?" }
  ]);
  
  // Draft / Wiki actions
  const [draftTitle, setDraftTitle] = useState("");
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [recentWikis, setRecentWikis] = useState<any[]>([]);

  // AI Assistant states
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<any[]>([
    {
      role: "assistant",
      text: lang === "ar" 
        ? "مرحباً! أنا هيلبر الذكي ومساعدك الأكاديمي. اسألني أي سؤال حول هذا الدرس أو الملاحظات!" 
        : "Hello! I am your intelligent academic tutor. Ask me anything about this lecture, your notes, or click a helper chip below!"
    }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Multiple Notebooks & Linked Resources states
  const [userNotebooks, setUserNotebooks] = useState<any[]>([]);
  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
  const [notebookResources, setNotebookResources] = useState<any[]>([]);
  const [notebookSearchQuery, setNotebookSearchQuery] = useState("");
  const [notebookFilterType, setNotebookFilterType] = useState<"all" | "note" | "highlight" | "question">("all");
  const [isNotebookLoading, setIsNotebookLoading] = useState(false);

  // Modal / Inline forms for adding resources
  const [isLinkResourceOpen, setIsLinkResourceOpen] = useState(false);
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [newResourceType, setNewResourceType] = useState<"pdf" | "link" | "image" | "excel">("link");
  const [newResourceUrl, setNewResourceUrl] = useState("");
  const [newResourceLinkToTime, setNewResourceLinkToTime] = useState(false);
  
  // Create / rename notebook states
  const [isCreateNotebookOpen, setIsCreateNotebookOpen] = useState(false);
  const [newNotebookTitle, setNewNotebookTitle] = useState("");

  // Simulation overlays
  const [isSpeechActive, setIsSpeechActive] = useState(false);
  const [speechStage, setSpeechStage] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [studySpeed, setStudySpeed] = useState(1);

  // Bottom sheet for annotations
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetInput, setSheetInput] = useState("");
  const [sheetType, setSheetType] = useState<"note" | "highlight" | "question">("note");

  // Connectivity
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Ref handles
  const ytPlayerRef = useRef<any>(null);
  const progressPollingRef = useRef<any>(null);

  // Update language when prop changes
  useEffect(() => {
    setLang(initialLang);
  }, [initialLang]);

  // ===== OFFLINE MONITOR =====
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast(lang === "ar" ? "تم استعادة الاتصال بالإنترنت!" : "Online - Sync restored!", "success");
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast(lang === "ar" ? "أنت غير متصل بالإنترنت حالياً" : "Offline mode activated", "info");
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [lang]);

  // ===== TOAST EMULATOR =====
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Extract YouTube ID Helper
  const extractVideoId = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) return m[1];
    }
    return null;
  };

  // Load Video Trigger
  const handleLoadVideo = (urlStr?: string) => {
    const targetUrl = urlStr || videoUrlInput;
    const id = extractVideoId(targetUrl);
    if (!id) {
      showToast(lang === "ar" ? "يرجى إدخال رابط يوتيوب صحيح" : "Please enter a valid YouTube URL", "error");
      return;
    }

    const matched = catalogVideos.find(v => v.id === id) || {
      id,
      title: lang === "ar" ? "مقطع فيديو تعليمي مخصص" : "Custom Scientific Lecture",
      channelTitle: "YouTube Creator",
      duration: 600,
      category: "Mathematics",
      addedBy: user?.uid || "guest",
      createdAt: new Date().toISOString()
    };

    setActiveVideo(matched);
    setVideoUrlInput(`https://www.youtube.com/watch?v=${id}`);
    setActiveTab("video");
    setCurrentMode("video");
    setIsPasteModalOpen(false);
    showToast(
      lang === "ar" ? `تم تحميل الدرس: ${matched.title}` : `Successfully loaded: ${matched.title}`,
      "success"
    );
  };

  // ===== YOUTUBE IFRAME CONTROLLER =====
  useEffect(() => {
    if (!activeVideo) return;
    setIsPlaying(false);
    setCurrentTime(0);

    const setupPlayer = () => {
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {
          // ignore
        }
      }

      if ((window as any).YT && (window as any).YT.Player) {
        ytPlayerRef.current = new (window as any).YT.Player("hummingbird-iframe-player", {
          videoId: activeVideo.id,
          playerVars: {
            modestbranding: 1,
            rel: 0,
            enablejsapi: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event: any) => {
              setDuration(event.target.getDuration() || activeVideo.duration || 600);
            },
            onStateChange: (event: any) => {
              const state = event.data;
              if (state === (window as any).YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                startPolling();
              } else {
                setIsPlaying(false);
                stopPolling();
              }
            }
          }
        });
      }
    };

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
      stopPolling();
    };
  }, [activeVideo]);

  // Sync Drafts
  useEffect(() => {
    if (user && activeVideo) {
      loadUserNotebooks();
    }
    if (activeVideo) {
      fetchRecentWikis();
    }
  }, [user, activeVideo]);

  // Fetch all system-wide wikis on mount or when wikis tab is viewed
  useEffect(() => {
    fetchAllSystemWikis();
  }, [activeTab]);

  const startPolling = () => {
    if (progressPollingRef.current) return;
    progressPollingRef.current = setInterval(() => {
      if (ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) {
        setCurrentTime(ytPlayerRef.current.getCurrentTime());
      }
    }, 400);
  };

  const stopPolling = () => {
    if (progressPollingRef.current) {
      clearInterval(progressPollingRef.current);
      progressPollingRef.current = null;
    }
  };

  const togglePlay = () => {
    if (!ytPlayerRef.current) return;
    if (isPlaying) {
      ytPlayerRef.current.pauseVideo();
    } else {
      ytPlayerRef.current.playVideo();
    }
  };

  const jumpToTime = (seconds: number) => {
    if (ytPlayerRef.current && ytPlayerRef.current.seekTo) {
      ytPlayerRef.current.seekTo(seconds, true);
      setCurrentTime(seconds);
      if (!isPlaying) {
        ytPlayerRef.current.playVideo();
      }
    } else {
      setCurrentTime(seconds);
    }
    showToast(lang === "ar" ? `الانتقال للتوقيت: ${formatTime(seconds)}` : `Jumped to timestamp: ${formatTime(seconds)}`, "info");
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Add annotation
  const handleAddAnnotation = (textStr: string, type: "note" | "highlight" | "question") => {
    if (!textStr.trim()) return;
    const newAnnot: Annotation = {
      time: Math.round(currentTime),
      type,
      text: textStr.trim()
    };
    
    setAnnotations(prev => {
      const updated = [...prev, newAnnot];
      return updated.sort((a, b) => a.time - b.time);
    });
    showToast(lang === "ar" ? "تم إضافة الملاحظة للتوقيت الزمني!" : "Annotation successfully added to timeline!", "success");
  };

  // Keyboard shortcut binding & Paste trigger
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      } else if (e.key.toLowerCase() === "v") {
        setActiveTab("video");
        setCurrentMode("video");
      } else if (e.key.toLowerCase() === "n") {
        setActiveTab("notes");
        setCurrentMode("notepad");
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [isPlaying]);

  // Handle timeline click
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = clickX / rect.width;
    const targetSeconds = ratio * duration;
    jumpToTime(targetSeconds);
  };

  // Insert timestamp helper directly into text area
  const handleInsertTimestampLink = () => {
    const timestampStr = `[@${formatTime(currentTime)}] `;
    setNotepadText(prev => prev + timestampStr);
    showToast(lang === "ar" ? "تم إدراج رابط التوقيت المباشر" : "Inserted time-linked shorthand", "info");
  };

  // Quick Action triggers from Subheader
  const handleQuickAction = (type: "note" | "highlight" | "question" | "timestamp") => {
    if (type === "timestamp") {
      handleInsertTimestampLink();
    } else {
      setSheetType(type);
      setSheetInput("");
      setIsSheetOpen(true);
    }
  };

  // ===== FIREBASE SYNC: DRAFTS AND WIKIS =====
  const loadUserNotebooks = async (selectId?: string) => {
    if (!user || !activeVideo) return;
    setIsNotebookLoading(true);
    try {
      const res = await fetch(`/api/diaries?userId=${user.uid}&videoId=${activeVideo.id}`);
      if (res.ok) {
        const data = await res.json();
        setUserNotebooks(data);
        
        let selectedNotebook = null;
        if (selectId) {
          selectedNotebook = data.find((n: any) => n.id === selectId);
        } else if (activeNotebookId) {
          selectedNotebook = data.find((n: any) => n.id === activeNotebookId);
        }
        
        if (!selectedNotebook && data.length > 0) {
          selectedNotebook = data[0];
        }
        
        if (selectedNotebook) {
          setActiveNotebookId(selectedNotebook.id);
          setDraftTitle(selectedNotebook.title || "");
          try {
            const parsed = JSON.parse(selectedNotebook.content);
            setNotepadText(parsed.notepadText || "");
            setAnnotations(parsed.annotations || []);
            setNotebookResources(parsed.resources || []);
          } catch (e) {
            setNotepadText(selectedNotebook.content || "");
            setAnnotations([]);
            setNotebookResources([]);
          }
          setDraftSavedAt(selectedNotebook.updatedAt || selectedNotebook.createdAt);
        } else {
          // No notebooks found! Setup default notebook
          const defaultId = `draft_${user.uid}_${activeVideo.id}`;
          const defaultNotebook = {
            id: defaultId,
            title: lang === "ar" ? "دفتر المذكرات الرئيسي" : "Main Study Notebook",
            content: JSON.stringify({
              notepadText: "",
              annotations: [
                { time: 42, type: "note", text: lang === "ar" ? "الفكرة الأساسية للدرس وكيفية تطبيقها." : "Core concept of the lesson and how to apply it." },
                { time: 145, type: "highlight", text: lang === "ar" ? "قانون رئيسي: انتبه للمعادلة المكتوبة على السبورة." : "Key formula alert: pay close attention to the board." },
                { time: 280, type: "question", text: lang === "ar" ? "هل هناك طريقة أسرع لحل هذا الاشتقاق؟" : "Is there a faster way to solve this derivation?" }
              ],
              resources: []
            }),
            videoId: activeVideo.id,
            videoTitle: activeVideo.title,
            userId: user.uid,
            userDisplayName: user.displayName,
            isPublicWiki: false
          };
          
          setActiveNotebookId(defaultId);
          setDraftTitle(defaultNotebook.title);
          setNotepadText("");
          setAnnotations(JSON.parse(defaultNotebook.content).annotations);
          setNotebookResources([]);
          setUserNotebooks([defaultNotebook]);
        }
      }
    } catch (err) {
      console.error("Error loading user notebooks", err);
    } finally {
      setIsNotebookLoading(false);
    }
  };

  const handleSelectNotebook = (notebookId: string) => {
    const selected = userNotebooks.find(n => n.id === notebookId);
    if (selected) {
      setActiveNotebookId(selected.id);
      setDraftTitle(selected.title || "");
      try {
        const parsed = JSON.parse(selected.content);
        setNotepadText(parsed.notepadText || "");
        setAnnotations(parsed.annotations || []);
        setNotebookResources(parsed.resources || []);
      } catch (e) {
        setNotepadText(selected.content || "");
        setAnnotations([]);
        setNotebookResources([]);
      }
      setDraftSavedAt(selected.updatedAt || selected.createdAt);
      showToast(lang === "ar" ? `تم تحميل: ${selected.title}` : `Loaded: ${selected.title}`, "success");
    }
  };

  const handleCreateNotebook = async () => {
    if (!user || !activeVideo) return;
    if (!newNotebookTitle.trim()) {
      showToast(lang === "ar" ? "يرجى إدخال اسم للدفتر الجديد" : "Please enter a title for the new notebook", "error");
      return;
    }

    setIsNotebookLoading(true);
    const notebookId = `notebook_${user.uid}_${Date.now()}`;
    const newNotebook = {
      id: notebookId,
      title: newNotebookTitle.trim(),
      content: JSON.stringify({
        notepadText: "",
        annotations: [],
        resources: []
      }),
      videoId: activeVideo.id,
      videoTitle: activeVideo.title,
      userId: user.uid,
      userDisplayName: user.displayName,
      isPublicWiki: false
    };

    try {
      const res = await fetch("/api/diaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNotebook)
      });
      if (res.ok) {
        showToast(lang === "ar" ? "تم إنشاء دفتر المذكرات الجديد بنجاح!" : "New notebook created successfully!", "success");
        setNewNotebookTitle("");
        setIsCreateNotebookOpen(false);
        await loadUserNotebooks(notebookId);
      } else {
        showToast(lang === "ar" ? "خطأ في إنشاء الدفتر" : "Error creating notebook", "error");
      }
    } catch (err) {
      console.error("Error creating notebook", err);
    } finally {
      setIsNotebookLoading(false);
    }
  };

  const handleDeleteNotebook = async (notebookId: string) => {
    if (!user || !activeVideo) return;
    if (userNotebooks.length <= 1) {
      showToast(lang === "ar" ? "لا يمكنك حذف دفتر الملاحظات الأخير" : "You cannot delete your only notebook", "error");
      return;
    }
    const confirmDelete = window.confirm(lang === "ar" ? "هل أنت متأكد من رغبتك في حذف هذا الدفتر بجميع ملاحظاته وموارده؟" : "Are you sure you want to delete this notebook and all of its notes/resources?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/diaries/${notebookId}`, { method: "DELETE" });
      if (res.ok) {
        showToast(lang === "ar" ? "تم حذف دفتر الملاحظات بنجاح" : "Notebook deleted successfully", "success");
        await loadUserNotebooks();
      } else {
        showToast(lang === "ar" ? "خطأ في حذف الدفتر" : "Error deleting notebook", "error");
      }
    } catch (err) {
      console.error("Error deleting notebook", err);
    }
  };

  const handleAddResource = () => {
    if (!newResourceTitle.trim() || !newResourceUrl.trim()) {
      showToast(lang === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields", "error");
      return;
    }

    const timestampVal = newResourceLinkToTime ? Math.round(currentTime) : null;
    const newRes = {
      id: "res_" + Math.random().toString(36).substr(2, 9),
      title: newResourceTitle.trim(),
      type: newResourceType,
      url: newResourceUrl.trim(),
      timestamp: timestampVal,
      addedAt: new Date().toISOString()
    };

    const updatedResources = [...notebookResources, newRes];
    setNotebookResources(updatedResources);
    setIsLinkResourceOpen(false);
    setNewResourceTitle("");
    setNewResourceUrl("");
    setNewResourceLinkToTime(false);

    showToast(lang === "ar" ? "تم ربط المورد المساعد بنجاح" : "External resource linked successfully", "success");
    
    // Auto-save notebook to persist the new resource
    setTimeout(() => {
      handleSaveDraft();
    }, 500);
  };

  const handleDeleteResource = (resId: string) => {
    const updated = notebookResources.filter(r => r.id !== resId);
    setNotebookResources(updated);
    showToast(lang === "ar" ? "تم إزالة المورد المساعد" : "Resource removed", "info");
    
    // Auto-save
    setTimeout(() => {
      handleSaveDraft();
    }, 500);
  };

  const fetchRecentWikis = async () => {
    if (!activeVideo) return;
    try {
      const res = await fetch(`/api/diaries`);
      if (res.ok) {
        const data = await res.json();
        const publicWikis = data.filter((d: any) => d.isPublicWiki === true && d.videoId === activeVideo.id);
        setRecentWikis(publicWikis);
      }
    } catch (err) {
      console.error("Error loading wikis", err);
    }
  };

  const fetchAllSystemWikis = async () => {
    setIsWikisLoading(true);
    try {
      const res = await fetch(`/api/wikis`);
      if (res.ok) {
        const data = await res.json();
        setAllSystemWikis(data);
      }
    } catch (err) {
      console.error("Error loading all system wikis", err);
    } finally {
      setIsWikisLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!activeVideo) {
      showToast(lang === "ar" ? "يرجى تحميل فيديو أولاً لتتمكن من الحفظ" : "Please load a video first to save a draft", "error");
      return;
    }
    if (!user) {
      showToast(lang === "ar" ? "يرجى تسجيل الدخول لحفظ مسودتك" : "Please login to save your study draft", "error");
      return;
    }
    setIsDraftSaving(true);
    const draftId = activeNotebookId || `draft_${user.uid}_${activeVideo.id}`;
    
    const draftData = {
      id: draftId,
      title: draftTitle.trim() || (lang === "ar" ? `مذكرة: ${activeVideo.title}` : `Notebook: ${activeVideo.title}`),
      content: JSON.stringify({
        notepadText,
        annotations,
        resources: notebookResources
      }),
      videoId: activeVideo.id,
      videoTitle: activeVideo.title,
      userId: user.uid,
      userDisplayName: user.displayName,
      isPublicWiki: false
    };

    try {
      const res = await fetch("/api/diaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftData)
      });
      if (res.ok) {
        const saved = await res.json();
        setDraftSavedAt(saved.updatedAt);
        showToast(lang === "ar" ? "تم حفظ ومزامنة دفتر المذكرات بنجاح!" : "Study notebook saved & synced successfully!", "success");
        // Reload list to keep in sync
        const listRes = await fetch(`/api/diaries?userId=${user.uid}&videoId=${activeVideo.id}`);
        if (listRes.ok) {
          const listData = await listRes.json();
          setUserNotebooks(listData);
        }
      } else {
        showToast(lang === "ar" ? "خطأ في حفظ الدفتر على الخادم" : "Error saving notebook on the server", "error");
      }
    } catch (err) {
      console.error("Error saving notebook", err);
      showToast(lang === "ar" ? "خطأ في حفظ الدفتر متزامناً" : "Error saving notebook synchronously", "error");
    } finally {
      setIsDraftSaving(false);
    }
  };

  const handlePublishWiki = async () => {
    if (!activeVideo) {
      showToast(lang === "ar" ? "يرجى تحميل فيديو أولاً للنشر" : "Please load a video first to publish a wiki", "error");
      return;
    }
    if (!user) {
      showToast(lang === "ar" ? "يرجى تسجيل الدخول لنشر الويكي الخاص بك" : "Please login to publish your study wiki", "error");
      return;
    }
    setIsPublishing(true);
    const wikiId = "wiki_" + Math.random().toString(36).substr(2, 9);
    
    const wikiData = {
      id: wikiId,
      title: draftTitle.trim() || (lang === "ar" ? `ويكي هيلبر المعتمد: ${activeVideo.title}` : `Helper Certified Wiki: ${activeVideo.title}`),
      content: JSON.stringify({
        notepadText,
        annotations,
        resources: notebookResources
      }),
      videoId: activeVideo.id,
      videoTitle: activeVideo.title,
      userId: user.uid,
      userDisplayName: user.displayName,
      isPublicWiki: true
    };

    try {
      const res = await fetch("/api/diaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wikiData)
      });
      if (res.ok) {
        showToast(lang === "ar" ? "تم النشر! ملخصك متاح الآن في الويكي العام للطلاب!" : "Published! Your workbook is now active on public study wikis!", "success");
        fetchRecentWikis();
      } else {
        showToast(lang === "ar" ? "خطأ في نشر الويكي" : "Error publishing wiki", "error");
      }
    } catch (err) {
      console.error("Error publishing wiki", err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleLoadPublishedWiki = (wiki: any) => {
    try {
      const parsed = JSON.parse(wiki.content);
      if (parsed.notepadText !== undefined) {
        // Automatically switch the video if this wiki refers to a different video!
        if (wiki.videoId && (!activeVideo || activeVideo.id !== wiki.videoId)) {
          const matched = catalogVideos.find(v => v.id === wiki.videoId) || {
            id: wiki.videoId,
            title: wiki.videoTitle || (lang === "ar" ? "درس علمي مخصص" : "Custom Scientific Lecture"),
            channelTitle: "YouTube Creator",
            duration: 600,
            category: "General",
            addedBy: wiki.userId || "guest",
            createdAt: wiki.createdAt || new Date().toISOString()
          };
          setActiveVideo(matched);
          setVideoUrlInput(`https://www.youtube.com/watch?v=${wiki.videoId}`);
        }

        setNotepadText(parsed.notepadText);
        setAnnotations(parsed.annotations || []);
        setDraftTitle(wiki.title);
        
        // Take the user straight to the interactive study room
        setActiveTab("video");
        setCurrentMode("notepad");
        
        showToast(
          lang === "ar" 
            ? `تم تحميل ويكي الزميل: ${wiki.userDisplayName}` 
            : `Loaded public study wiki: ${wiki.title} (${wiki.userDisplayName})`,
          "success"
        );
      }
    } catch (e) {
      setNotepadText(wiki.content);
      showToast(lang === "ar" ? "تم تحميل محتوى الويكي النصي" : "Loaded wiki text contents", "info");
    }
  };

  // ===== GEMINI CHAT INTEGRATION =====
  const handleSendAiMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || aiInput;
    if (!promptToSend.trim()) return;

    const userMsg = {
      role: "user",
      text: promptToSend,
      time: activeVideo ? currentTime : undefined
    };

    setAiMessages(prev => [...prev, userMsg]);
    setAiInput("");
    setIsAiLoading(true);

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTitle: activeVideo ? activeVideo.title : "Ready to Learn General Assistant",
          userPrompt: promptToSend,
          currentTime,
          notes: annotations,
          language: lang
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiMessages(prev => [...prev, { role: "assistant", text: data.answer }]);
      } else {
        throw new Error("API call returned an error");
      }
    } catch (err) {
      console.error("Error communicating with Gemini", err);
      const fallbackMsg = lang === "ar" 
        ? `أهلاً بك! لم نتمكن من الاتصال بـ Gemini حالياً بسبب انقطاع الخدمة المؤقت. \n\nتعتبر ميزة "طنان هيلبر" ممتازة لمراجعة الملاحظات وتحليلها. دعنا نواصل تدوين ملخصاتك وسنقوم بالمزامنة والرد فور عودة الاتصال!`
        : `Greetings! We couldn't reach the Gemini AI model right now. \n\nThe Project Hummingbird interactive workstation is fully operational for writing, timeline marking, and local auto-saving. Let's keep compiling notes and we'll restore AI summaries shortly!`;
      setAiMessages(prev => [...prev, { role: "assistant", text: fallbackMsg }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const generateVideoSummary = async () => {
    if (!activeVideo) {
      showToast(lang === "ar" ? "يرجى تحميل فيديو أولاً لتتمكن من توليد التلخيص" : "Please load a video first to generate a summary", "error");
      return;
    }
    
    setIsGeneratingSummary(true);
    showToast(
      lang === "ar" 
        ? `جاري توليد التلخيص الذكي لـ: ${activeVideo.title}...` 
        : `Generating concise AI summary for: ${activeVideo.title}...`, 
      "info"
    );

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTitle: activeVideo.title,
          userPrompt: lang === "ar"
            ? "يرجى تقديم ملخص أكاديمي مفصل وموجز لأهم المفاهيم في هذا الفيديو على شكل نقاط مهمة (2-3 نقاط أساسية) لتضمينها في مذكراتي الدراسية."
            : "Please generate a highly professional, academic, and concise summary of the key concepts of this video. Make it 2-3 structured bullet points with important key terms, ideal for appending to my study notebook.",
          currentTime: Math.round(currentTime),
          notes: annotations,
          language: lang
        })
      });

      if (res.ok) {
        const data = await res.json();
        const summaryText = data.answer || "";
        
        if (summaryText) {
          // 1. Append to notepadText
          const header = lang === "ar" 
            ? `\n\n--- ملخص ذكي للفيديو (${formatTime(currentTime)}) ---\n` 
            : `\n\n--- AI-Generated Video Summary (${formatTime(currentTime)}) ---\n`;
          setNotepadText(prev => prev + header + summaryText + "\n");
          
          // 2. Add as a new annotation note at the current playback time
          const cleanSummaryTextForNote = summaryText.replace(/[*#`-]/g, "").trim();
          const previewText = cleanSummaryTextForNote.length > 120 
            ? cleanSummaryTextForNote.substring(0, 117) + "..." 
            : cleanSummaryTextForNote;

          const newAnnot: Annotation = {
            time: Math.round(currentTime),
            type: "note",
            text: lang === "ar" ? `ملخص ذكي: ${previewText}` : `AI Summary: ${previewText}`
          };

          setAnnotations(prev => {
            const updated = [...prev, newAnnot];
            return updated.sort((a, b) => a.time - b.time);
          });

          showToast(
            lang === "ar" 
              ? "تم توليد التلخيص وإرفاقه بنجاح في المفكرة والملاحظات!" 
              : "Concise summary generated and attached successfully to your notebook and timeline!", 
            "success"
          );
        } else {
          throw new Error("Empty summary received");
        }
      } else {
        throw new Error("Failed to call API");
      }
    } catch (err) {
      console.error("Error generating summary:", err);
      // Fallback
      const fallbackSummary = lang === "ar"
        ? "تلخيص الفيديو: يركز هذا الدرس العلمي على شرح وتوضيح المفاهيم الأساسية، والروابط بين النظرية والتطبيق العملي. يرجى مراجعة الجدول الزمني للوقوف على التفاصيل الدقيقة."
        : "Video summary: This educational lecture covers fundamental academic concepts, key parameters, and bridges the core theoretical and practical models. Review the timeline annotation flags for granular details.";
      
      const header = lang === "ar" 
        ? `\n\n--- ملخص ذكي للفيديو (${formatTime(currentTime)}) ---\n` 
        : `\n\n--- AI-Generated Video Summary (${formatTime(currentTime)}) ---\n`;
      setNotepadText(prev => prev + header + fallbackSummary + "\n");

      const newAnnot: Annotation = {
        time: Math.round(currentTime),
        type: "note",
        text: lang === "ar" ? `ملخص ذكي: ${fallbackSummary.substring(0, 117)}...` : `AI Summary: ${fallbackSummary.substring(0, 117)}...`
      };

      setAnnotations(prev => {
        const updated = [...prev, newAnnot];
        return updated.sort((a, b) => a.time - b.time);
      });

      showToast(
        lang === "ar" 
          ? "تم إرفاق ملخص المنهج الدراسي في المفكرة بنجاح!" 
          : "Study summary successfully drafted and attached to your notebook!", 
        "success"
      );
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleAiKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendAiMessage();
    }
  };

  // Simulate Mic Voice Mode
  const triggerMicSimulation = () => {
    setIsSpeechActive(true);
    setSpeechStage(1);
    
    setTimeout(() => {
      setSpeechStage(2); // "Transcribing..."
    }, 2000);

    setTimeout(() => {
      setSpeechStage(3); // "Finished"
      const simulatedText = lang === "ar" 
        ? "لخص لي هذا الدرس واشرح أهم المصطلحات فيه" 
        : "Can you summarize this lecture and explain the primary components?";
      setAiInput(simulatedText);
    }, 4500);
  };

  const confirmSpeechText = () => {
    setIsSpeechActive(false);
    handleSendAiMessage();
  };

  return (
    <div className="w-full h-[100dvh] bg-white flex flex-col select-none relative overflow-hidden font-sans">
      
      {/* Toast Alert Banner */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[2500]">
          <div className={`px-6 py-3 rounded-full shadow-xl border text-xs font-black flex items-center gap-2.5 ${
            toast.type === "success" 
              ? "bg-[#5a8a6e] border-[#7aad8f] text-white" 
              : toast.type === "error"
              ? "bg-[#c45a3a] border-[#e07a5f] text-white"
              : "bg-[#1a1612] border-gray-700 text-white"
          }`}>
            <span>{toast.type === "success" ? "💡" : "⚠️"}</span>
            {toast.message}
          </div>
        </div>
      )}

      {/* OFFLINE STATUS CHIP */}
      {!isOnline && (
        <div className="bg-[#c45a3a] text-white py-1 px-4 text-[10px] font-black tracking-widest text-center uppercase border-b border-[#e8e2d9]">
          {lang === "ar" ? "أنت خارج الشبكة - حفظ محلي نشط" : "OFFLINE STUDY WORKBOOK - LOCAL CACHE ACTIVE"}
        </div>
      )}

      {/* ================================================== */}
      {/* BRAND HEADER BAR (As in mockup screenshot) */}
      {/* ================================================== */}
      <div id="nav" className="bg-[#ffffff] border-b border-[#f0ebe4] px-4 md:px-6 py-3.5 flex items-center justify-between z-10">
        
        {/* Brand Logo and Name */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onBackToHome}>
          <div className="w-9 h-9 flex items-center justify-center shrink-0">
            {/* Reddish-orange hourglass infinite loop logo */}
            <svg viewBox="0 0 100 45" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 10 L48 22.5 L15 35 Z" stroke="#c45a3a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M81 10 L48 22.5 L81 35 Z" stroke="#c45a3a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="28" cy="22.5" r="4" fill="#c45a3a" />
              <circle cx="68" cy="22.5" r="4" fill="#c45a3a" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1.5 select-none">
            <span className="text-[17px] font-black text-[#1a1612]">Helper</span>
            <span className="text-[15px] font-bold text-[#c45a3a]">Hummingbird</span>
            <span className="text-[9px] font-black text-[#5c554d] bg-[#f5f0ea] border border-[#e8e2d9] rounded-full px-1.5 py-0.5 tracking-wide">v1.0</span>
          </div>
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-3">
          
          {/* Generate Summary Button */}
          <button
            onClick={generateVideoSummary}
            disabled={isGeneratingSummary || !activeVideo}
            className={`h-9 px-3.5 sm:px-4 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
              !activeVideo
                ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                : isGeneratingSummary
                ? "bg-[#2d8a6e]/10 text-[#2d8a6e] border border-[#2d8a6e]/20"
                : "bg-[#2d8a6e] text-white hover:bg-[#25725b] border border-[#2d8a6e]"
            }`}
            title={lang === "ar" ? "توليد تلخيص ذكي للمحاضرة" : "Generate concise AI summary"}
          >
            {isGeneratingSummary ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-[#2d8a6e] border-t-transparent animate-spin" />
                <span className="hidden sm:inline">{lang === "ar" ? "جاري التلخيص..." : "Summarizing..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                <span>{lang === "ar" ? "توليد تلخيص" : "Generate Summary"}</span>
              </>
            )}
          </button>

          {/* EN/AR language slider button */}
          <div className="bg-[#f5f0ea] border border-[#e8e2d9] rounded-full p-0.5 flex items-center w-24 h-9">
            <button 
              onClick={() => {
                setLang("en");
                onLangChange?.("en");
                showToast("English interface configured");
              }}
              className={`flex-1 text-center text-[10px] font-black py-1.5 rounded-full transition-all ${
                lang === "en" 
                  ? "bg-white text-[#1a1612] shadow-sm" 
                  : "text-[#8a8278] hover:text-[#1a1612]"
              }`}
            >
              EN
            </button>
            <button 
              onClick={() => {
                setLang("ar");
                onLangChange?.("ar");
                showToast("تم تحويل الواجهة للعربية");
              }}
              className={`flex-1 text-center text-[10px] font-black py-1.5 rounded-full transition-all`}
              style={{ fontFamily: "Noto Sans Arabic" }}
            >
              <span className={lang === "ar" ? "text-[#1a1612] font-black" : "text-[#8a8278]"}>عربي</span>
            </button>
          </div>

          {/* Voice Input Button */}
          <button 
            onClick={triggerMicSimulation}
            className={`w-9 h-9 rounded-full bg-white border border-[#e8e2d9] hover:bg-[#faf8f5] flex items-center justify-center text-[#5c554d] hover:text-[#c45a3a] transition shadow-sm relative`}
            title={lang === "ar" ? "التحدث إلى المساعد الذكي" : "Talk with AI Assistant"}
          >
            <Mic className="w-4 h-4" />
            {isSpeechActive && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            )}
          </button>

          {/* Settings button */}
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-9 h-9 rounded-full bg-white border border-[#e8e2d9] hover:bg-[#faf8f5] flex items-center justify-center text-[#5c554d] hover:text-[#1a1612] transition shadow-sm"
            title={lang === "ar" ? "الإعدادات" : "Study Speed & System Settings"}
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User profile identifier AS */}
          <div className="w-9 h-9 rounded-full bg-[#c45a3a] text-white font-black text-xs flex items-center justify-center shadow-md select-none border border-white/20">
            {user ? user.displayName?.substring(0, 2).toUpperCase() || "AS" : "AS"}
          </div>

        </div>
      </div>

      {/* ================================================== */}
      {/* SUB-HEADER SEGMENT BAR (As in mockup screenshot) */}
      {/* ================================================== */}
      <div className="bg-[#ffffff] border-b border-[#f0ebe4] px-4 md:px-6 py-2.5 flex items-center justify-between flex-wrap gap-3 z-10">
        
        {/* Toggle between player video and notepad sheet */}
        <div className="flex items-center gap-1.5">
          <div className="bg-[#f5f0ea] border border-[#e8e2d9] rounded-full p-0.5 flex items-center">
            <button
              onClick={() => {
                setActiveTab("video");
                setCurrentMode("video");
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 ${
                currentMode === "video" && activeTab === "video"
                  ? "bg-white text-[#1a1612] shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Video className="w-3.5 h-3.5 text-[#5c554d]" />
              <span>{lang === "ar" ? "فيديو" : "Video"}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("notes");
                setCurrentMode("notepad");
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 ${
                currentMode === "notepad" && activeTab === "notes"
                  ? "bg-white text-[#1a1612] shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#5c554d]" />
              <span>{lang === "ar" ? "المفكرة" : "Notepad"}</span>
            </button>
          </div>

          <span className="text-[#e8e2d9] font-light hidden sm:inline px-1">|</span>

          {/* Quick status message */}
          {activeVideo ? (
            <span className="text-[10px] font-extrabold text-[#5a8a6e] bg-[#5a8a6e]/10 px-3 py-1 rounded-full hidden sm:inline">
              ⚡ {lang === "ar" ? "الدرس محمل ومزامن" : "Lecture Synced"}
            </span>
          ) : (
            <span className="text-[10px] font-extrabold text-[#c45a3a] bg-[#c45a3a]/10 px-3 py-1 rounded-full hidden sm:inline">
              ⚠️ {lang === "ar" ? "بانتظار تحميل الدرس" : "Awaiting Lecture"}
            </span>
          )}
        </div>

        {/* Quick actions panel as shown in subheader */}
        <div className="flex items-center gap-2">
          
          {/* Note icon action */}
          <button
            onClick={() => handleQuickAction("note")}
            className="w-8 h-8 rounded-xl border border-[#c45a3a] bg-[#c45a3a]/5 hover:bg-[#c45a3a]/10 flex items-center justify-center text-[#c45a3a] transition-all active:scale-95"
            title={lang === "ar" ? "إضافة ملاحظة عند دقيقة" : "Pin Timed Note"}
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* Highlight action */}
          <button
            onClick={() => handleQuickAction("highlight")}
            className="w-8 h-8 rounded-xl border border-yellow-500 bg-yellow-500/5 hover:bg-yellow-500/10 flex items-center justify-center text-yellow-600 transition-all active:scale-95"
            title={lang === "ar" ? "تحديد فكرة هامة" : "Highlight Moment"}
          >
            <Highlighter className="w-4 h-4" />
          </button>

          {/* Question action */}
          <button
            onClick={() => handleQuickAction("question")}
            className="w-8 h-8 rounded-xl border border-blue-500 bg-blue-500/5 hover:bg-blue-500/10 flex items-center justify-center text-blue-600 transition-all active:scale-95"
            title={lang === "ar" ? "إضافة سؤال دراسي" : "Pin Study Question"}
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Insert current video timestamp action */}
          <button
            onClick={() => handleQuickAction("timestamp")}
            className="w-8 h-8 rounded-xl border border-gray-400 bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-all active:scale-95"
            title={lang === "ar" ? "إدراج التوقيت الحالي في المفكرة" : "Insert Active Timestamp Link"}
          >
            <Clock className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* ================================================== */}
      {/* MAIN VIEWPORT (With Deep Space Cosmic Blue Styling) */}
      {/* ================================================== */}
      <div className="flex-1 bg-gradient-to-b from-[#0e1628] to-[#060a15] min-h-[460px] relative flex flex-col p-4 md:p-6 text-white justify-center overflow-y-auto">
        
        {activeTab === "video" && (
          <div className="w-full h-full flex flex-col justify-between flex-1 gap-4">
            {!activeVideo ? (
              
              /* ================================================== */
              /* 100% FAITHFUL REPLICA OF THE "READY TO LEARN" MOCKUP */
              /* ================================================== */
              <div className="text-center py-20 flex flex-col items-center justify-center max-w-md mx-auto my-auto animate-fade-in">
                
                {/* Visual Grid Media Placeholder */}
                <div className="w-16 h-16 mx-auto mb-6 border-4 border-dashed border-[#ffffff]/20 rounded-2xl flex flex-col justify-between p-2.5 opacity-60">
                  <div className="flex justify-between">
                    <div className="w-2.5 h-2.5 bg-[#ffffff]/20 rounded" />
                    <div className="w-2.5 h-2.5 bg-[#ffffff]/20 rounded" />
                    <div className="w-2.5 h-2.5 bg-[#ffffff]/20 rounded" />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-2.5 h-2.5 bg-[#ffffff]/20 rounded" />
                    <div className="w-2.5 h-2.5 bg-[#ffffff]/20 rounded" />
                    <div className="w-2.5 h-2.5 bg-[#ffffff]/20 rounded" />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-2.5 h-2.5 bg-[#ffffff]/20 rounded" />
                    <div className="w-2.5 h-2.5 bg-[#ffffff]/20 rounded" />
                    <div className="w-2.5 h-2.5 bg-[#ffffff]/20 rounded" />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                  {lang === "ar" ? "جاهز للتعلم" : "Ready to learn"}
                </h3>
                
                <p className="text-sm text-[#76849e] mb-8 leading-relaxed max-w-xs font-semibold">
                  {lang === "ar" 
                    ? "الصق رابط يوتيوب في الأعلى واضغط على تحميل" 
                    : "Paste a YouTube URL above and hit Load"
                  }
                </p>

                {/* Dotted border trigger box */}
                <button
                  onClick={() => setIsPasteModalOpen(true)}
                  className="px-6 py-3.5 border-2 border-dashed border-[#ffffff]/15 rounded-2xl text-xs font-black text-[#8f9db5] hover:text-white hover:border-[#ffffff]/35 transition-all shadow-md"
                >
                  {lang === "ar" ? "أو اضغط على Ctrl+V في أي مكان" : "or press Ctrl+V anywhere"}
                </button>
              </div>

            ) : (

              /* ================================================== */
              /* ACTIVE VIDEO LECTURE PLAYER STAGE */
              /* ================================================== */
              <div className="flex-1 flex flex-col justify-between gap-4">
                
                {/* Study Guide Title header */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-black uppercase bg-[#c45a3a]/25 text-[#ff8c69] px-2.5 py-1 rounded-full">
                      {activeVideo.category}
                    </span>
                    <h4 className="text-sm font-black text-white mt-1.5 line-clamp-1">
                      {activeVideo.title}
                    </h4>
                  </div>
                  <button 
                    onClick={() => setActiveVideo(null)} 
                    className="text-xs text-gray-400 hover:text-white font-bold flex items-center gap-1 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full"
                  >
                    {lang === "ar" ? "إغلاق الدرس" : "Close player"}
                  </button>
                </div>

                {/* The main iframe player window */}
                <div className="bg-black/80 rounded-2xl aspect-video w-full relative overflow-hidden group shadow-2xl border border-white/5">
                  <div id="hummingbird-iframe-player" className="absolute inset-0 w-full h-full" />
                  
                  {/* Custom floating Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-3 z-10">
                    
                    {/* TIMELINE PROGRESS BAR */}
                    <div 
                      className="w-full h-2 bg-white/20 hover:h-2.5 rounded-full cursor-pointer relative transition-all flex items-center"
                      onClick={handleTimelineClick}
                    >
                      <div 
                        className="h-full bg-[#c45a3a] rounded-full relative"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />

                      {/* Timeline dot notation markers */}
                      {annotations.map((annot, idx) => {
                        const pct = (annot.time / duration) * 100;
                        return (
                          <div
                            key={idx}
                            className={`absolute w-3.5 h-3.5 rounded-full border-2 border-white -translate-x-1/2 cursor-pointer transition-transform hover:scale-150 ${
                              annot.type === "note" 
                                ? "bg-[#c45a3a]" 
                                : annot.type === "highlight"
                                ? "bg-[#d4a017]"
                                : "bg-[#3b6ea5]"
                            }`}
                            style={{ left: `${pct}%` }}
                            title={`${annot.type.toUpperCase()}: ${annot.text} (${formatTime(annot.time)})`}
                            onClick={(e) => {
                              e.stopPropagation();
                              jumpToTime(annot.time);
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* Timeline Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={togglePlay}
                          className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition active:scale-95"
                        >
                          {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                        </button>
                        <span className="text-[10px] font-mono text-white/80 font-bold">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            const iframe = document.getElementById("hummingbird-iframe-player");
                            if (iframe && iframe.requestFullscreen) {
                              iframe.requestFullscreen();
                            }
                          }}
                          className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition"
                        >
                          <Maximize className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Preloaded video selections inside play layout */}
                <div className="mt-2 bg-white/5 border border-white/10 rounded-2xl p-4">
                  <span className="text-[9px] font-black text-[#8f9db5] tracking-wider uppercase block mb-2">
                    {lang === "ar" ? "📚 حصص دراسية مقترحة للمراجعة والتدوين:" : "📚 CHOOSE ANOTHER LECTURE TO STUDY:"}
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
                    {catalogVideos.map((video) => (
                      <button
                        key={video.id}
                        onClick={() => {
                          setActiveVideo(video);
                          setVideoUrlInput(`https://www.youtube.com/watch?v=${video.id}`);
                          showToast(
                            lang === "ar" ? `تحميل الدرس المعتمد: ${video.title}` : `Study session configured: ${video.title}`,
                            "success"
                          );
                        }}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap border transition-all ${
                          activeVideo.id === video.id
                            ? "bg-[#c45a3a] text-white border-[#c45a3a]"
                            : "bg-white/5 hover:bg-white/10 text-gray-300 border-white/10"
                        }`}
                      >
                        {video.category}: {video.title.substring(0, 24)}...
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* TAB 2: LINED NOTEBOOK WRITER & TIMELINE ANNOTATIONS */}
        {/* ================================================== */}
        {activeTab === "notes" && (
          <div className="w-full h-full flex flex-col gap-5 text-gray-800 animate-fade-in">
            {/* INLINE FORM: Create Notebook */}
            {isCreateNotebookOpen && (
              <div className="bg-[#fcfbf9] border border-[#e8e2d9] rounded-2xl p-4 shadow-sm animate-fade-in text-left rtl:text-right">
                <h5 className="text-xs font-black text-[#1a1612] uppercase tracking-wider mb-2">
                  {lang === "ar" ? "📚 إنشاء دفتر مذكرات جديد للدرس:" : "📚 CREATE NEW STUDY NOTEBOOK FOR THIS LECTURE:"}
                </h5>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input 
                    type="text"
                    value={newNotebookTitle}
                    onChange={(e) => setNewNotebookTitle(e.target.value)}
                    placeholder={lang === "ar" ? "اسم الدفتر (مثال: ملخص الدرس الشامل)..." : "Notebook title (e.g., Lecture Deep-Dive)..."}
                    className="flex-1 px-3 py-2 border border-[#e8e2d9] rounded-xl text-xs outline-none focus:border-[#c45a3a] bg-white font-bold"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateNotebook}
                      className="px-4 py-2 bg-[#c45a3a] text-white text-xs font-black rounded-xl hover:bg-[#c45a3a]/90 transition-all flex-1 sm:flex-initial"
                    >
                      {lang === "ar" ? "إنشاء" : "Create"}
                    </button>
                    <button
                      onClick={() => {
                        setIsCreateNotebookOpen(false);
                        setNewNotebookTitle("");
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all flex-1 sm:flex-initial"
                    >
                      {lang === "ar" ? "إلغاء" : "Cancel"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* INLINE FORM: Link External Resource */}
            {isLinkResourceOpen && (
              <div className="bg-[#fcfbf9] border border-[#e8e2d9] rounded-2xl p-4 shadow-sm animate-fade-in text-left rtl:text-right">
                <h5 className="text-xs font-black text-[#1a1612] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span>🔗</span>
                  {lang === "ar" ? "ربط مرجع أكاديمي خارجي بالدفتر:" : "LINK EXTERNAL SCIENTIFIC REFERENCE:"}
                </h5>
                <div className="space-y-3.5">
                  <div>
                    <label className="text-[10px] font-black tracking-wider text-[#8a8278] block mb-1">
                      {lang === "ar" ? "عنوان المرجع العلمي" : "REFERENCE TITLE"}
                    </label>
                    <input 
                      type="text"
                      value={newResourceTitle}
                      onChange={(e) => setNewResourceTitle(e.target.value)}
                      placeholder={lang === "ar" ? "مثال: ورقة العمل المساعدة PDF..." : "e.g., Scientific Paper Reference..."}
                      className="w-full px-3 py-2 border border-[#e8e2d9] rounded-xl text-xs outline-none focus:border-[#c45a3a] bg-white font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-black tracking-wider text-[#8a8278] block mb-1">
                        {lang === "ar" ? "نوع الملف / المصدر" : "RESOURCE FILE TYPE"}
                      </label>
                      <select
                        value={newResourceType}
                        onChange={(e) => setNewResourceType(e.target.value as any)}
                        className="w-full px-2 py-2 border border-[#e8e2d9] rounded-xl text-xs outline-none bg-white font-bold"
                      >
                        <option value="link">🔗 {lang === "ar" ? "رابط إنترنت" : "Web Link / URL"}</option>
                        <option value="pdf">📄 PDF Document</option>
                        <option value="excel">📊 Spreadsheet / Dataset</option>
                        <option value="image">🖼️ Image Diagram / Diagram</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-black tracking-wider text-[#8a8278] block mb-1">
                        {lang === "ar" ? "رابط المصدر / المسار" : "RESOURCE WEB LOCATION"}
                      </label>
                      <input 
                        type="text"
                        value={newResourceUrl}
                        onChange={(e) => setNewResourceUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 border border-[#e8e2d9] rounded-xl text-xs outline-none focus:border-[#c45a3a] bg-white font-medium"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer select-none py-1">
                    <input 
                      type="checkbox"
                      checked={newResourceLinkToTime}
                      onChange={(e) => setNewResourceLinkToTime(e.target.checked)}
                      className="w-4 h-4 accent-[#c45a3a] rounded"
                    />
                    <span className="text-xs font-bold text-gray-700">
                      {lang === "ar" 
                        ? `ربط هذا المصدر بالتوقيت الحالي لتشغيل الفيديو (⏱️ ${formatTime(currentTime)})` 
                        : `Pin this resource to active video playback time (⏱️ ${formatTime(currentTime)})`}
                    </span>
                  </label>

                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      onClick={() => {
                        setIsLinkResourceOpen(false);
                        setNewResourceTitle("");
                        setNewResourceUrl("");
                        setNewResourceLinkToTime(false);
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all"
                    >
                      {lang === "ar" ? "إلغاء" : "Cancel"}
                    </button>
                    <button
                      onClick={handleAddResource}
                      className="px-4 py-2 bg-[#c45a3a] text-white text-xs font-black rounded-xl hover:bg-[#c45a3a]/90 transition-all"
                    >
                      {lang === "ar" ? "ربط المصدر" : "Link Resource"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Core Notebook Split Screen Layout */}
            <div className="flex flex-col lg:flex-row gap-5 items-stretch">
              
              {/* Left Column: Lined Notebook Document Sheet */}
              <div className="bg-white rounded-2xl border border-[#e8e2d9] shadow-sm p-4 flex-1 flex flex-col justify-between min-h-[460px] lg:w-[65%]">
                
                {/* Header: Notebook Select & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e8e2d9] pb-3.5 mb-3.5 gap-3">
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="bg-[#f0ede5] hover:bg-[#e8e2d9] transition-colors rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 border border-[#e8e2d9]">
                      <span className="text-sm">📒</span>
                      <select
                        value={activeNotebookId || ""}
                        onChange={(e) => handleSelectNotebook(e.target.value)}
                        className="bg-transparent border-none text-xs font-extrabold text-[#1a1612] outline-none cursor-pointer pr-1"
                      >
                        {userNotebooks.map((nb) => (
                          <option key={nb.id} value={nb.id}>
                            {nb.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => setIsCreateNotebookOpen(true)}
                      className="p-2 bg-[#c45a3a]/10 hover:bg-[#c45a3a]/20 text-[#c45a3a] rounded-xl transition-all text-xs font-bold flex items-center gap-1"
                      title={lang === "ar" ? "دفتر جديد" : "New Notebook"}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{lang === "ar" ? "جديد" : "New"}</span>
                    </button>

                    {activeNotebookId && (
                      <button
                        onClick={() => handleDeleteNotebook(activeNotebookId)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all text-xs font-bold"
                        title={lang === "ar" ? "حذف الدفتر" : "Delete Notebook"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      placeholder={lang === "ar" ? "عنوان الدفتر..." : "Rename Notebook..."}
                      className="font-bold text-xs text-[#1a1612] bg-[#faf8f3] border border-[#e8e2d9] rounded-lg px-2.5 py-1.5 outline-none focus:border-[#c45a3a] max-w-[160px] transition-all"
                    />
                    
                    <span className="text-[9px] font-mono text-[#8a8278] font-bold whitespace-nowrap">
                      {draftSavedAt 
                        ? `⏱️ ${new Date(draftSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
                        : lang === "ar" ? "غير محفوظ" : "Not backed up"}
                    </span>
                  </div>
                </div>

                {/* The notepad lined paper textarea */}
                <div 
                  className="flex-1 overflow-y-auto mb-4 p-4 relative rounded-xl border border-[#f0ede5] min-h-[240px]"
                  style={{
                    backgroundImage: "linear-gradient(#f0ede5 1px, transparent 1px)",
                    backgroundSize: "100% 28px",
                    backgroundColor: "#faf8f3",
                    lineHeight: "28px"
                  }}
                >
                  <textarea
                    value={notepadText}
                    onChange={(e) => setNotepadText(e.target.value)}
                    placeholder={lang === "ar" ? "اكتب مسودتك وخلاصة أفكارك هنا... استخدم الطوابع الزمنية للتنقل التلقائي بالفيديو!" : "Start drafting your notes here... use timestamps in your text to easily skip to parts of the lecture!"}
                    className="w-full min-h-[200px] bg-transparent border-none text-xs md:text-sm text-gray-800 outline-none resize-none font-medium leading-[28px]"
                    style={{ fontFamily: lang === "ar" ? "Noto Sans Arabic" : "Inter" }}
                  />
                </div>

                {/* Cloud save / publish controls */}
                <div className="flex gap-2.5 items-center pt-3 border-t border-[#e8e2d9]">
                  <button
                    onClick={handleSaveDraft}
                    disabled={isDraftSaving}
                    className="flex-1 py-3 bg-[#1a1612] hover:bg-[#332e29] disabled:bg-gray-400 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow active:scale-95"
                  >
                    {isDraftSaving ? (
                      <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    {lang === "ar" ? "مزامنة وحفظ سحابي" : "Sync & Cloud Save"}
                  </button>

                  <button
                    onClick={handlePublishWiki}
                    disabled={isPublishing}
                    className="flex-1 py-3 bg-[#c45a3a] hover:bg-[#c45a3a]/90 disabled:bg-gray-400 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                  >
                    {isPublishing ? (
                      <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    {lang === "ar" ? "نشر في الويكي التعاوني" : "Publish to Wiki"}
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive Timeline Flag Markers & Linked References */}
              <div className="flex flex-col gap-4 lg:w-[35%]">
                
                {/* Active Timeline Flag Markers Panel */}
                <div className="bg-white rounded-2xl border border-[#e8e2d9] shadow-sm p-4 flex flex-col justify-between flex-1 min-h-[220px]">
                  <div>
                    <div className="flex items-center justify-between border-b border-[#e8e2d9] pb-3 mb-3">
                      <span className="text-[10px] font-black text-[#1a1612] tracking-wider uppercase flex items-center gap-1.5">
                        <span>📌</span>
                        {lang === "ar" ? "الملاحظات الزمنية والمستندة:" : "TIMELINED STUDY ANNOTATIONS:"}
                      </span>
                      
                      {/* Filter selection pills */}
                      <select
                        value={notebookFilterType}
                        onChange={(e) => setNotebookFilterType(e.target.value as any)}
                        className="text-[10px] font-extrabold text-gray-500 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 outline-none cursor-pointer"
                      >
                        <option value="all">📁 {lang === "ar" ? "الكل" : "All Types"}</option>
                        <option value="note">✏️ {lang === "ar" ? "ملاحظات" : "Notes"}</option>
                        <option value="highlight">💡 {lang === "ar" ? "تظليلات" : "Highlights"}</option>
                        <option value="question">❓ {lang === "ar" ? "أسئلة" : "Questions"}</option>
                      </select>
                    </div>

                    {/* Search notes/annotations */}
                    <div className="relative mb-3">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                      <input 
                        type="text"
                        value={notebookSearchQuery}
                        onChange={(e) => setNotebookSearchQuery(e.target.value)}
                        placeholder={lang === "ar" ? "بحث في الملاحظات..." : "Search inside annotations..."}
                        className="w-full text-xs pl-8 pr-3 py-2 border border-[#e8e2d9] rounded-xl outline-none focus:border-[#c45a3a] bg-gray-50 font-bold"
                      />
                    </div>

                    {/* Annotations List */}
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {annotations.filter(annot => {
                        const matchSearch = annot.text.toLowerCase().includes(notebookSearchQuery.toLowerCase());
                        const matchType = notebookFilterType === "all" || annot.type === notebookFilterType;
                        return matchSearch && matchType;
                      }).length === 0 ? (
                        <p className="text-[11px] text-gray-400 text-center py-4 font-bold">
                          {lang === "ar" ? "لا توجد ملاحظات مطابقة" : "No annotations matched filter"}
                        </p>
                      ) : (
                        annotations.filter(annot => {
                          const matchSearch = annot.text.toLowerCase().includes(notebookSearchQuery.toLowerCase());
                          const matchType = notebookFilterType === "all" || annot.type === notebookFilterType;
                          return matchSearch && matchType;
                        }).map((annot, idx) => (
                          <div 
                            key={idx}
                            className={`p-2.5 rounded-xl border text-left rtl:text-right relative group cursor-pointer transition-all hover:bg-gray-50 hover:shadow-sm ${
                              annot.type === "note"
                                ? "bg-[#c45a3a]/5 border-[#c45a3a]/20"
                                : annot.type === "highlight"
                                ? "bg-[#d4a017]/5 border-[#d4a017]/20"
                                : "bg-[#3b6ea5]/5 border-[#3b6ea5]/20"
                            }`}
                            onClick={() => {
                              setActiveTab("video");
                              jumpToTime(annot.time);
                            }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-[8px] font-black px-2 py-0.5 rounded-full text-white ${
                                annot.type === "note"
                                  ? "bg-[#c45a3a]"
                                  : annot.type === "highlight"
                                  ? "bg-[#d4a017]"
                                  : "bg-[#3b6ea5]"
                              }`}>
                                ⏱️ {formatTime(annot.time)}
                              </span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAnnotations(prev => prev.filter((_, i) => i !== idx));
                                  showToast(lang === "ar" ? "تم حذف الملاحظة" : "Annotation removed", "info");
                                }}
                                className="text-gray-400 hover:text-red-500 transition-opacity"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-[10px] font-bold text-gray-800 leading-relaxed">
                              {annot.text}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Attached External Scientific Resources Panel */}
                <div className="bg-white rounded-2xl border border-[#e8e2d9] shadow-sm p-4 flex flex-col justify-between min-h-[220px]">
                  <div>
                    <div className="flex items-center justify-between border-b border-[#e8e2d9] pb-3 mb-3">
                      <span className="text-[10px] font-black text-[#1a1612] tracking-wider uppercase flex items-center gap-1.5">
                        <span>🔗</span>
                        {lang === "ar" ? "المراجع العلمية والمستندات:" : "LINKED ACADEMIC RESOURCES:"}
                      </span>
                      
                      <button
                        onClick={() => setIsLinkResourceOpen(true)}
                        className="text-[9px] font-black px-2 py-1 bg-[#c45a3a] text-white hover:bg-[#c45a3a]/90 rounded-lg flex items-center gap-1 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{lang === "ar" ? "ربط مصدر" : "Link Resource"}</span>
                      </button>
                    </div>

                    {/* Resources List */}
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {notebookResources.length === 0 ? (
                        <div className="text-center py-6 border border-dashed border-[#e8e2d9] rounded-xl bg-[#faf8f3]">
                          <span className="text-xl block mb-1">🔗</span>
                          <p className="text-[10px] font-extrabold text-gray-400 leading-relaxed px-4">
                            {lang === "ar" 
                              ? "لا يوجد مراجع مرتبطة بهذا الدفتر حالياً. اربط شرائح الدرس والـ PDFs والملفات المساعدة!" 
                              : "No external resources linked. Attach PDFs, slides, and learning links to your notebook!"}
                          </p>
                        </div>
                      ) : (
                        notebookResources.map((res) => (
                          <div 
                            key={res.id}
                            className="p-2.5 bg-[#faf8f3] border border-[#e8e2d9] hover:border-[#c45a3a]/50 rounded-xl flex items-center justify-between gap-3 text-left rtl:text-right group transition-all"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-sm select-none">
                                {res.type === "pdf" ? "📄" : res.type === "excel" ? "📊" : res.type === "image" ? "🖼️" : "🔗"}
                              </span>
                              <div className="min-w-0 flex-1">
                                <h6 className="font-extrabold text-[10px] text-gray-800 line-clamp-1">
                                  {res.title}
                                </h6>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <a 
                                    href={res.url} 
                                    target="_blank" 
                                    referrerPolicy="no-referrer"
                                    className="text-[9px] font-bold text-[#c45a3a] hover:underline flex items-center gap-0.5 truncate"
                                  >
                                    <span>{res.url.substring(0, 24)}...</span>
                                    <ExternalLink className="w-2.5 h-2.5 inline" />
                                  </a>
                                  {res.timestamp !== null && res.timestamp !== undefined && (
                                    <button
                                      onClick={() => {
                                        setActiveTab("video");
                                        jumpToTime(res.timestamp);
                                      }}
                                      className="text-[8px] font-black bg-[#c45a3a]/15 text-[#c45a3a] px-1.5 py-0.5 rounded-md hover:bg-[#c45a3a]/30 animate-pulse"
                                    >
                                      ⏱️ {formatTime(res.timestamp)}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button 
                              onClick={() => handleDeleteResource(res.id)}
                              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              title={lang === "ar" ? "حذف" : "Remove"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Public study wikis under lesson */}
            {recentWikis.length > 0 && (
              <div className="bg-white border border-[#e8e2d9] rounded-2xl p-4 shadow-sm text-left rtl:text-right">
                <span className="text-[10px] font-black text-[#1a1612] tracking-wider uppercase block mb-3 flex items-center gap-1.5">
                  <span>📚</span>
                  {lang === "ar" ? "الويكي التعاوني العام المتاح للطلاب لهذا الدرس:" : "SHARED PUBLIC WIKIS FOR THIS LECTURE:"}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recentWikis.map((wiki) => (
                    <div 
                      key={wiki.id} 
                      className="p-3 bg-gray-50 border border-[#e8e2d9] rounded-xl shadow-sm flex flex-col justify-between gap-3 hover:border-[#c45a3a] transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-gray-500 uppercase">
                            👤 {wiki.userDisplayName || "Helper Peer"}
                          </span>
                          <span className="text-[8px] font-bold text-gray-400">
                            {new Date(wiki.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h5 className="font-extrabold text-xs text-[#1a1612] mt-1 line-clamp-1">
                          {wiki.title}
                        </h5>
                      </div>

                      <button
                        onClick={() => handleLoadPublishedWiki(wiki)}
                        className="w-full py-1.5 bg-white border border-gray-200 hover:bg-[#c45a3a] hover:text-white text-[#1a1612] text-[10px] font-extrabold rounded-lg transition-all"
                      >
                        {lang === "ar" ? "دراسة هذا الويكي" : "Study this Wiki"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* TAB 3: LOAD LECTURE INPUT / SELECTOR PANEL */}
        {/* ================================================== */}
        {activeTab === "add" && (
          <div className="w-full h-full max-w-md mx-auto bg-white border border-[#e8e2d9] rounded-2xl p-5 text-gray-800 animate-fade-in my-auto">
            <h4 className="text-base font-black text-[#1a1612] mb-1.5 flex items-center gap-1.5">
              <span>🛸</span>
              {lang === "ar" ? "تحميل درس علمي جديد" : "Load New Scientific Lecture"}
            </h4>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed font-semibold">
              {lang === "ar" 
                ? "أدخل رابط يوتيوب أو اختر من المناهج المعتمدة للدراسة وبناء الملاحظات الذكية." 
                : "Enter any YouTube lesson URL or select from our preloaded catalog of STEM lectures."
              }
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  {lang === "ar" ? "رابط اليوتيوب:" : "YouTube URL or ID:"}
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={videoUrlInput}
                    onChange={(e) => setVideoUrlInput(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1 bg-gray-50 border border-[#e8e2d9] focus:border-[#c45a3a] rounded-xl px-3 py-2 text-xs outline-none font-semibold text-[#1a1612]"
                  />
                  <button 
                    onClick={() => handleLoadVideo()}
                    className="bg-[#c45a3a] hover:bg-[#c45a3a]/90 text-white text-xs font-black px-4 py-2 rounded-xl transition active:scale-95 shrink-0"
                  >
                    {lang === "ar" ? "تحميل" : "Load"}
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2">
                  {lang === "ar" ? "المناهج الجاهزة:" : "CURATED STEM CURRICULUMS:"}
                </span>
                <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto">
                  {catalogVideos.map((video) => (
                    <button
                      key={video.id}
                      onClick={() => {
                        setActiveVideo(video);
                        setVideoUrlInput(`https://www.youtube.com/watch?v=${video.id}`);
                        setActiveTab("video");
                        setCurrentMode("video");
                        showToast(lang === "ar" ? `تحميل: ${video.title}` : `Loaded catalog lecture: ${video.title}`);
                      }}
                      className="w-full text-start p-2.5 rounded-xl border border-gray-100 hover:border-[#c45a3a]/30 bg-gray-50/50 hover:bg-[#c45a3a]/5 transition text-xs font-bold text-gray-700 flex justify-between items-center"
                    >
                      <span className="truncate flex-1 pr-4">📚 {video.category}: {video.title}</span>
                      <span className="text-[9px] bg-gray-200 px-2 py-0.5 rounded-full text-gray-500 shrink-0">
                        {formatTime(video.duration)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* TAB 5: RECENT WIKIS - THE FUTURE OF WIKIPEDIA FOR VIDEOS */}
        {/* ================================================== */}
        {activeTab === "wikis" && (
          <div className="w-full h-full flex flex-col gap-4 text-gray-800 animate-fade-in flex-1 overflow-y-auto pb-4">
            {/* Wikipedia-style Header */}
            <div className="bg-gradient-to-br from-[#fffdfa] to-[#f9f4ec] border border-[#e8e2d9] rounded-2xl p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1.5 bg-[#c45a3a]/10 rounded-lg text-[#c45a3a]">
                      <Globe className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-extrabold text-[#c45a3a] uppercase tracking-wider">
                      {lang === "ar" ? "ترقية ويكيبيديا للفيديو" : "Wikipedia for Video"}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#1a1612] tracking-tight">
                    {lang === "ar" ? "موسوعة الويكي المرئية التعاونية" : "Recent Video-Linked Study Wikis"}
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold mt-1">
                    {lang === "ar"
                      ? "اكتشف وتصفح ملخصات المناهج الدراسية المصممة تعاونياً من قبل الطلاب والمعلمين ومدمجة مع الفيديوهات التعليمية."
                      : "Explore high-quality, student-compiled wiki workbooks linked to academic lectures. Click any wiki to load its video timeline instantly!"}
                  </p>
                </div>

                {/* Core statistics */}
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-100 p-3 rounded-xl shrink-0 shadow-sm">
                  <div className="text-center px-2 border-r border-gray-100">
                    <span className="block text-sm font-black text-[#c45a3a]">{allSystemWikis.length + 3}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">{lang === "ar" ? "موسوعة ويكي" : "Total Wikis"}</span>
                  </div>
                  <div className="text-center px-2 border-r border-gray-100">
                    <span className="block text-sm font-black text-[#2d8a6e]">120+</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">{lang === "ar" ? "علامة زمنية" : "Annotations"}</span>
                  </div>
                  <div className="text-center px-2">
                    <span className="block text-sm font-black text-[#1a1612]">4.8★</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">{lang === "ar" ? "تقييم الأقران" : "Peer Rating"}</span>
                  </div>
                </div>
              </div>

              {/* Spotlight Banner */}
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <span className="text-xl">💡</span>
                  <div className="flex-1">
                    <span className="text-[9px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {lang === "ar" ? "مقال الويكي المميز لليوم" : "Spotlight Video Wiki"}
                    </span>
                    <h4 className="text-xs font-black text-gray-800 mt-1">
                      {lang === "ar" ? "المخطط الموحد للفيزياء: من الكلاسيكية إلى الكمية" : "The Unified Map of Physics: Classic to Quantum"}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
                      {lang === "ar" ? "مراجعة شاملة لجميع فروع الفيزياء مدعومة بـ 5 علامات مرئية على الفيديو." : "A master-level summary mapping classical Newtonian gravity to Einstein's general relativity and quantum wave mechanics."}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const featured = allSystemWikis.find(w => w.id === "wiki_physics_overview") || {
                        id: "wiki_physics_overview",
                        title: "The Unified Map of Physics: Classic to Quantum",
                        videoId: "ZihywtixUYo",
                        videoTitle: "The Map of Physics (A Visual Overview)",
                        content: JSON.stringify({
                          notepadText: "This video serves as a comprehensive visual ontology of physical sciences. It organizes physics into three primary pillars: Classical Physics, Relativity, and Quantum Mechanics. It describes how Isaac Newton's laws govern macro behavior, James Clerk Maxwell unified light and electromagnetism, and Albert Einstein bridged classical concepts into spacetime curvature. Finally, it outlines the probabilistic universe of subatomic particles governed by the wave-particle duality equations.",
                          annotations: [
                            { time: 45, type: "note", text: "Classical Physics branch: Describes everyday motion of macro objects under Newton's gravitational and mechanics laws." },
                            { time: 240, type: "highlight", text: "Maxwell's Equations: Unification of electricity, magnetism, and light into electrodynamics." },
                            { time: 380, type: "question", text: "Does entropy always increase in isolated systems under thermodynamic limits?" },
                            { time: 640, type: "note", text: "Einstein's General Relativity: Mass and energy bend the fabric of spacetime, manifesting as gravity." },
                            { time: 760, type: "highlight", text: "Quantum Physics boundary: Shifting from deterministic tracks to probability waves and superposition." }
                          ]
                        }),
                        userDisplayName: "Rania Al-Alawi"
                      };
                      handleLoadPublishedWiki(featured);
                    }}
                    className="bg-[#c45a3a] hover:bg-[#b04a2c] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg shrink-0 transition"
                  >
                    {lang === "ar" ? "دراسة الويكي المميز" : "Study Spotlight Wiki"}
                  </button>
                </div>
              </div>
            </div>

            {/* Search and Category Filters */}
            <div className="flex flex-col gap-3 bg-white p-4 border border-[#e8e2d9] rounded-2xl shadow-sm">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={wikiSearchQuery}
                  onChange={(e) => setWikiSearchQuery(e.target.value)}
                  placeholder={lang === "ar" ? "بحث في مقالات الويكي والمواضيع والفيديوهات المرتبطة..." : "Search study wikis, custom lecture notes, subjects, or creators..."}
                  className="w-full bg-gray-50/80 border border-[#e8e2d9] focus:border-[#c45a3a] rounded-xl pl-9 pr-3 py-2 text-xs outline-none font-semibold text-[#1a1612] transition"
                />
              </div>

              {/* Subject Category Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {["All", "Physics", "Mathematics", "Biology", "Chemistry", "Computer Science"].map((cat) => {
                  const labelAr: any = {
                    "All": "الكل",
                    "Physics": "الفيزياء",
                    "Mathematics": "الرياضيات",
                    "Biology": "الأحياء",
                    "Chemistry": "الكيمياء",
                    "Computer Science": "علوم الحاسب"
                  };
                  return (
                    <button
                      key={cat}
                      onClick={() => setWikiSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-wide uppercase transition shrink-0 ${
                        wikiSelectedCategory === cat
                          ? "bg-[#c45a3a] text-white shadow-sm"
                          : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100"
                      }`}
                    >
                      {lang === "ar" ? labelAr[cat] || cat : cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Wiki List Grid */}
            {isWikisLoading ? (
              <div className="flex flex-col items-center justify-center p-12 text-gray-400 gap-2 bg-white rounded-2xl border border-gray-100">
                <div className="w-6 h-6 border-2 border-[#c45a3a] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold">{lang === "ar" ? "جاري تحميل المجلد المشترك للويكي..." : "Loading collaborative video wikis database..."}</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allSystemWikis
                  .filter((wiki) => {
                    const query = wikiSearchQuery.toLowerCase();
                    const matchesQuery = 
                      wiki.title.toLowerCase().includes(query) ||
                      (wiki.videoTitle && wiki.videoTitle.toLowerCase().includes(query)) ||
                      (wiki.userDisplayName && wiki.userDisplayName.toLowerCase().includes(query));
                    
                    if (wikiSelectedCategory === "All") return matchesQuery;
                    
                    const videoCat = catalogVideos.find(v => v.id === wiki.videoId)?.category || "General";
                    return matchesQuery && videoCat.toLowerCase() === wikiSelectedCategory.toLowerCase();
                  })
                  .map((wiki) => {
                    let parsedContent: any = { notepadText: wiki.content, annotations: [] };
                    try {
                      parsedContent = JSON.parse(wiki.content);
                    } catch (e) {
                      // fallback
                    }

                    const videoCat = catalogVideos.find(v => v.id === wiki.videoId)?.category || "General";
                    const formattedDate = new Date(wiki.createdAt).toLocaleDateString(
                      lang === "ar" ? "ar-EG" : "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    );

                    return (
                      <div
                        key={wiki.id}
                        className="bg-white border border-[#e8e2d9] rounded-2xl p-4 hover:border-[#c45a3a]/40 hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Category and Date Header */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-[#2d8a6e]/10 text-[#2d8a6e]">
                              📚 {videoCat}
                            </span>
                            <span className="text-[9px] text-gray-400 font-bold">{formattedDate}</span>
                          </div>

                          {/* Wiki Title */}
                          <h4 className="text-sm font-black text-[#1a1612] leading-snug mb-1">
                            {wiki.title}
                          </h4>

                          {/* Video Lecture Reference Card */}
                          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-2 mb-3 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center shrink-0 text-[#c45a3a]">
                              <Video className="w-4 h-4" />
                            </div>
                            <div className="overflow-hidden">
                              <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider block">
                                {lang === "ar" ? "الدرس العلمي المصاحب:" : "LINKED VIDEO LECTURE:"}
                              </span>
                              <span className="text-[10px] font-extrabold text-gray-700 truncate block">
                                {wiki.videoTitle || wiki.videoId}
                              </span>
                            </div>
                          </div>

                          {/* Wiki Snippet */}
                          <p className="text-xs text-gray-500 font-semibold line-clamp-3 mb-4 leading-relaxed">
                            {parsedContent.notepadText || wiki.content}
                          </p>
                        </div>

                        {/* Footer details & Action Buttons */}
                        <div className="border-t border-gray-100 pt-3 mt-auto">
                          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold mb-3">
                            <span className="flex items-center gap-1">
                              👤 {wiki.userDisplayName}
                            </span>
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[9px] font-extrabold shrink-0">
                              ⏱️ {parsedContent.annotations?.length || 0} {lang === "ar" ? "ملاحظة مدمجة" : "Interactive Pins"}
                            </span>
                          </div>

                          {/* Primary and secondary button actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleLoadPublishedWiki(wiki)}
                              className="flex-1 bg-[#c45a3a] hover:bg-[#b04a2c] text-white py-2 px-3 rounded-xl text-[10px] font-black transition flex items-center justify-center gap-1.5"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              {lang === "ar" ? "دراسة الويكي وتوصيل الفيديو" : "Study Wiki & Load Video"}
                            </button>

                            <button
                              onClick={async () => {
                                setActiveTab("ai");
                                setAiInput("");
                                const aiPrompt = lang === "ar"
                                  ? `يرجى تقديم ملخص دراسي مفصل وأكاديمي لويكي الزميل بعنوان "${wiki.title}" المصاحب لدرس "${wiki.videoTitle}". الويكي يحتوي على هذه الملاحظات والملخصات: \n\n ${parsedContent.notepadText}`
                                  : `Please provide a highly detailed academic summary and breakdown of this peer-compiled study wiki: "${wiki.title}" linked to the lecture "${wiki.videoTitle}". The wiki text is:\n\n ${parsedContent.notepadText}`;
                                
                                handleSendAiMessage(aiPrompt);
                                showToast(lang === "ar" ? "جاري تحضير التحليل الذكي للويكي..." : "Initiating AI Study-Wiki synthesis guide...", "info");
                              }}
                              className="bg-[#2d8a6e]/10 hover:bg-[#2d8a6e]/20 text-[#2d8a6e] p-2 rounded-xl text-[10px] font-black transition"
                              title={lang === "ar" ? "تلخيص الويكي بواسطة الذكاء الاصطناعي" : "Ask AI to Summarize"}
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {allSystemWikis.length === 0 && (
                  <div className="col-span-full bg-white border border-[#e8e2d9] rounded-2xl p-8 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">📚</span>
                    <h5 className="font-bold text-gray-700 text-sm">{lang === "ar" ? "لا توجد مقالات ويكي عامة حالياً" : "No Public Video-Wikis Yet"}</h5>
                    <p className="text-xs text-gray-400 max-w-sm">
                      {lang === "ar"
                        ? "كن أول من ينشر ويكي لدرس علمي! قم بتدوين بعض الملاحظات وانقر على زر 'نشر الويكي العام' لمشاركته."
                        : "Be the first to publish a collaborative study wiki! Annotate any video and click 'Publish Public Wiki' inside your notes tab to share it."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* TAB 4: INTELLIGENT ACADEMIC GEMINI CHATBOT */}
        {/* ================================================== */}
        {activeTab === "ai" && (
          <div className="w-full h-full flex flex-col justify-between flex-1 gap-4 text-gray-800 animate-fade-in">
            <div className="bg-white rounded-2xl border border-[#e8e2d9] shadow-sm flex flex-col justify-between flex-1 min-h-[440px] overflow-hidden">
              
              {/* Tutor header */}
              <div className="bg-[#fffdf9] border-b border-[#e8e2d9] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2d8a6e]" />
                  <div>
                    <h4 className="font-black text-xs text-[#1a1612]">
                      {lang === "ar" ? "مساعد هيلبر الأكاديمي الذكي" : "Helper Academic AI Tutor"}
                    </h4>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2d8a6e] animate-pulse" />
                      <span className="text-[8px] font-bold text-[#2d8a6e] uppercase tracking-wider">{lang === "ar" ? "موصل Gemini 1.5 Flash" : "Gemini 1.5 Flash Connected"}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setAiMessages([{
                      role: "assistant",
                      text: lang === "ar" ? "مرحباً! كيف يمكنني مساعدتك الأكاديمية اليوم؟" : "Hello! How can I assist your studies today?"
                    }]);
                    showToast(lang === "ar" ? "تم مسح سجل المحادثة" : "Chat history cleared");
                  }}
                  className="text-[9px] font-extrabold text-gray-400 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-lg px-2 py-1 transition"
                >
                  {lang === "ar" ? "مسح المحادثة" : "Clear Chat"}
                </button>
              </div>

              {/* Chat Message thread */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 max-h-[320px] min-h-[220px]">
                {aiMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex gap-2.5 items-start max-w-[85%] ${msg.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 select-none ${
                      msg.role === "user" ? "bg-[#c45a3a]/15 text-[#c45a3a]" : "bg-[#2d8a6e]/15 text-[#2d8a6e]"
                    }`}>
                      {msg.role === "user" ? (lang === "ar" ? "أنا" : "Me") : (lang === "ar" ? "الذكاء" : "AI")}
                    </div>
                    
                    <div className={`p-3 rounded-2xl text-[11px] font-semibold leading-relaxed text-left rtl:text-right ${
                      msg.role === "user" 
                        ? "bg-[#c45a3a] text-white rounded-tr-none shadow-sm" 
                        : "bg-[#f5f0ea] text-[#1a1612] rounded-tl-none border border-[#e8e2d9]"
                    }`}>
                      {msg.time !== undefined && msg.time > 0 && (
                        <button
                          onClick={() => {
                            setActiveTab("video");
                            jumpToTime(msg.time);
                          }}
                          className={`text-[9px] font-mono font-black tracking-wider px-2 py-0.5 rounded-lg mb-1.5 block select-none ${
                            msg.role === "user" ? "bg-white/25 text-white" : "bg-black/10 text-gray-800"
                          }`}
                        >
                          ⏱️ {formatTime(msg.time)}
                        </button>
                      )}
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}
                
                {isAiLoading && (
                  <div className="flex gap-2.5 items-center bg-gray-50/70 p-3 rounded-2xl border border-dashed border-[#e8e2d9] self-start">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2d8a6e] animate-ping" />
                    <span className="text-[10px] font-bold text-[#2d8a6e]">
                      {lang === "ar" ? "جاري تدوين الشرح وتحليله عبر المساعد..." : "Gemini is analyzing the context..."}
                    </span>
                  </div>
                )}
              </div>

              {/* Sugesstions bar and input form */}
              <div className="p-3 border-t border-[#e8e2d9] bg-[#fffdf9] flex flex-col gap-2">
                
                {/* Topic suggestion chips */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button 
                    onClick={() => handleSendAiMessage(lang === "ar" ? "لخص لي هذا الدرس بالتفصيل" : "Summarize this lesson")}
                    className="px-3 py-1.5 bg-white hover:bg-[#2d8a6e]/10 hover:text-[#2d8a6e] text-gray-600 border border-[#e8e2d9] rounded-full text-[9px] font-bold transition whitespace-nowrap active:scale-95"
                  >
                    📝 {lang === "ar" ? "لخص الدرس" : "Summarize"}
                  </button>
                  <button 
                    onClick={() => handleSendAiMessage(lang === "ar" ? "اشرح لي القوانين والمسائل الرئيسية هنا" : "Explain the key concepts")}
                    className="px-3 py-1.5 bg-white hover:bg-[#2d8a6e]/10 hover:text-[#2d8a6e] text-gray-600 border border-[#e8e2d9] rounded-full text-[9px] font-bold transition whitespace-nowrap active:scale-95"
                  >
                    🔬 {lang === "ar" ? "اشرح الأساسيات" : "Explain"}
                  </button>
                  <button 
                    onClick={() => handleSendAiMessage(lang === "ar" ? "اطرح علي سؤالاً لاختبار فهمي" : "Quiz me on this topic")}
                    className="px-3 py-1.5 bg-white hover:bg-[#2d8a6e]/10 hover:text-[#2d8a6e] text-gray-600 border border-[#e8e2d9] rounded-full text-[9px] font-bold transition whitespace-nowrap active:scale-95"
                  >
                    🎓 {lang === "ar" ? "اختبر فهمي" : "Quiz me"}
                  </button>
                </div>

                {/* Send input */}
                <div className="flex gap-2 items-center">
                  <textarea
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={handleAiKeyPress}
                    placeholder={lang === "ar" ? "اسأل هيلبر أي سؤال حول الشرح..." : "Ask Gemini about the study context..."}
                    rows={1}
                    className="flex-1 bg-white border border-[#e8e2d9] focus:border-[#2d8a6e] rounded-xl px-3 py-2 text-xs outline-none resize-none font-semibold text-gray-800"
                  />
                  <button
                    onClick={() => handleSendAiMessage()}
                    className="p-2.5 bg-[#2d8a6e] text-white rounded-xl hover:bg-[#4aa88a] transition active:scale-95 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* FLOATING ACTION BUTTON (FAB) (As in mockup screenshot) */}
        {/* ================================================== */}
        <button
          onClick={() => {
            setActiveTab("add");
            showToast(lang === "ar" ? "تحميل مقطع جديد" : "Ready to paste custom video URL");
          }}
          className="absolute bottom-5 right-5 w-12 h-12 bg-[#c45a3a] hover:bg-[#b04a2c] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all z-20"
          title={lang === "ar" ? "إضافة درس جديد" : "Add New Lecture"}
        >
          <Plus className="w-5 h-5" />
        </button>

      </div>

      {/* ================================================== */}
      {/* APP STICKY BOTTOM NAV BAR (As in mockup screenshot) */}
      {/* ================================================== */}
      <div className="bg-[#ffffff] border-t border-[#f0ebe4] h-16 flex items-center justify-around px-2 z-10 select-none">
        
        {/* Video tab button */}
        <button
          onClick={() => {
            setActiveTab("video");
            setCurrentMode("video");
          }}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-all ${
            activeTab === "video" 
              ? "text-[#c45a3a] font-extrabold" 
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          <Video className="w-5 h-5" />
          <span className="text-[10px] tracking-wide">{lang === "ar" ? "فيديو" : "Video"}</span>
        </button>

        {/* Notes tab button */}
        <button
          onClick={() => {
            setActiveTab("notes");
            setCurrentMode("notepad");
          }}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-all ${
            activeTab === "notes" 
              ? "text-[#c45a3a] font-extrabold" 
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] tracking-wide">{lang === "ar" ? "الملاحظات" : "Notes"}</span>
        </button>

        {/* Wikis tab button */}
        <button
          onClick={() => {
            setActiveTab("wikis");
          }}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-all ${
            activeTab === "wikis" 
              ? "text-[#c45a3a] font-extrabold" 
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] tracking-wide">{lang === "ar" ? "الويكي" : "Wikis"}</span>
        </button>

        {/* Add tab button */}
        <button
          onClick={() => {
            setActiveTab("add");
          }}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-all ${
            activeTab === "add" 
              ? "text-[#c45a3a] font-extrabold" 
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          <Plus className="w-5 h-5" />
          <span className="text-[10px] tracking-wide">{lang === "ar" ? "إضافة" : "Add"}</span>
        </button>

        {/* AI chat tab button */}
        <button
          onClick={() => {
            setActiveTab("ai");
          }}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-all ${
            activeTab === "ai" 
              ? "text-[#c45a3a] font-extrabold" 
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] tracking-wide">{lang === "ar" ? "الذكاء" : "AI"}</span>
        </button>

      </div>

      {/* ================================================== */}
      {/* SIMULATED DIALOGS & SHEET PREVIEWS */}
      {/* ================================================== */}
      
      {/* 1. Paste URL Dialog */}
      {isPasteModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[3000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-gray-800 animate-slide-up shadow-2xl relative">
            <button 
              onClick={() => setIsPasteModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <h4 className="text-sm font-black text-[#1a1612] mb-1.5 flex items-center gap-1">
              <span>📋</span>
              {lang === "ar" ? "لصق رابط يوتيوب المباشر" : "Paste YouTube study link"}
            </h4>
            <p className="text-[11px] text-gray-500 mb-4 leading-relaxed font-semibold">
              {lang === "ar" ? "الصق الرابط أدناه لبدء الدرس الفوري وتدوين الملاحظات الذكية." : "Insert YouTube URL to instantiate video lesson and link notations."}
            </p>

            <div className="flex flex-col gap-3">
              <input 
                type="text" 
                value={videoUrlInput}
                onChange={(e) => setVideoUrlInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#c45a3a] rounded-xl px-3 py-2 text-xs outline-none font-semibold text-[#1a1612]"
              />

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    const sampleUrl = "https://www.youtube.com/watch?v=0vK86uH9g4M";
                    setVideoUrlInput(sampleUrl);
                    handleLoadVideo(sampleUrl);
                  }}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-[#1a1612] text-[10px] font-black rounded-xl transition"
                >
                  {lang === "ar" ? "استخدم مثالاً" : "Use Sample"}
                </button>
                <button
                  onClick={() => handleLoadVideo()}
                  className="flex-1 py-2 bg-[#c45a3a] hover:bg-[#c45a3a]/95 text-white text-[10px] font-black rounded-xl transition shadow"
                >
                  {lang === "ar" ? "تحميل الدرس" : "Load Lecture"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Voice Mic Assistant Simulation popup */}
      {isSpeechActive && (
        <div className="fixed inset-0 bg-black/75 z-[3000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xs w-full p-6 text-center animate-scale-up shadow-2xl relative">
            <button 
              onClick={() => setIsSpeechActive(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 bg-[#c45a3a]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#c45a3a]">
              <Mic className={`w-8 h-8 ${speechStage === 1 ? "animate-pulse" : speechStage === 2 ? "animate-bounce" : ""}`} />
            </div>

            <h4 className="text-sm font-black text-[#1a1612] mb-1">
              {speechStage === 1 ? (lang === "ar" ? "جاري الاستماع..." : "Listening...") : 
               speechStage === 2 ? (lang === "ar" ? "جاري التعرف على الصوت..." : "Processing audio...") : 
               (lang === "ar" ? "اكتمل التسجيل!" : "Transcription Done!")}
            </h4>
            
            <p className="text-[11px] text-gray-500 mb-6 font-semibold">
              {speechStage === 1 ? (lang === "ar" ? "تحدث الآن بوضوح..." : "Speak now...") : 
               speechStage === 2 ? (lang === "ar" ? "تأكيد الكلمات والملخص..." : "Translating acoustics...") : 
               (lang === "ar" ? "اضغط موافق لإرسال السؤال" : "Click confirm to query AI")}
            </p>

            {speechStage === 3 && (
              <div className="bg-[#f5f0ea] border border-[#e8e2d9] rounded-xl p-3 mb-5 text-[11px] text-gray-700 font-bold text-left rtl:text-right">
                "{aiInput}"
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setIsSpeechActive(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-black rounded-xl transition"
              >
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={confirmSpeechText}
                disabled={speechStage < 3}
                className="flex-1 py-2.5 bg-[#c45a3a] disabled:bg-gray-300 hover:bg-[#c45a3a]/95 text-white text-[10px] font-black rounded-xl transition shadow"
              >
                {lang === "ar" ? "تأكيد وإرسال" : "Confirm & Send"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Settings preferences popup */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 z-[3000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-gray-800 animate-slide-up shadow-2xl relative">
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <h4 className="text-sm font-black text-[#1a1612] mb-1 flex items-center gap-1">
              <span>⚙️</span>
              {lang === "ar" ? "إعدادات المذاكرة والدراسة" : "Study Preferences"}
            </h4>
            <p className="text-[10px] text-gray-500 mb-5 font-semibold">
              {lang === "ar" ? "تعديل سرعة الدرس ومزامنة الملاحظات." : "Adjust playback attributes, and offline automatic recovery configuration."}
            </p>

            <div className="flex flex-col gap-4">
              
              {/* Playback speed slider */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  {lang === "ar" ? "سرعة التشغيل المقترحة:" : "Study Speed Ratio:"}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0.75, 1, 1.25, 1.5].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => {
                        setStudySpeed(speed);
                        if (ytPlayerRef.current && ytPlayerRef.current.setPlaybackRate) {
                          ytPlayerRef.current.setPlaybackRate(speed);
                        }
                        showToast(lang === "ar" ? `تم تغيير السرعة لـ ${speed}x` : `Study speed adjusted to ${speed}x`);
                      }}
                      className={`py-2 text-[10px] font-black rounded-xl transition-all border ${
                        studySpeed === speed
                          ? "bg-[#c45a3a] border-[#c45a3a] text-white"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Recovery backup toggle */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div>
                  <h5 className="text-xs font-extrabold text-[#1a1612]">
                    {lang === "ar" ? "الحفظ السحابي التلقائي" : "Cloud Auto-Sync Backup"}
                  </h5>
                  <p className="text-[9px] text-gray-400 font-semibold">
                    {lang === "ar" ? "حفظ الملاحظات تلقائياً كل 30 ثانية" : "Back up your timeline markings dynamically."}
                  </p>
                </div>
                <div className="w-10 h-6 rounded-full bg-[#5a8a6e] p-1 flex items-center justify-end cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </div>

              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-full py-3 bg-[#1a1612] hover:bg-[#332e29] text-white font-extrabold text-xs rounded-xl transition mt-3"
              >
                {lang === "ar" ? "حفظ الإعدادات" : "Save Preferences"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Annotations sheet */}
      {isSheetOpen && (
        <div className="fixed inset-0 bg-black/50 z-[2100] flex items-end justify-center animate-fade-in">
          <div className="absolute inset-0" onClick={() => setIsSheetOpen(false)} />
          <div className="bg-white rounded-t-3xl p-5 w-full max-w-xl z-10 animate-slide-up flex flex-col gap-4">
            
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto" />
            
            <div className="flex items-center justify-between">
              <h4 className="font-black text-xs text-[#1a1612]">
                {lang === "ar" ? "إضافة ملاحظة عند دقيقة: " : "Add Timed Notation at "} {formatTime(currentTime)}
              </h4>
              <button 
                onClick={() => setIsSheetOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSheetType("note")}
                className={`py-3 rounded-xl border text-xs font-black transition flex flex-col items-center gap-1.5 ${
                  sheetType === "note"
                    ? "bg-[#c45a3a]/10 border-[#c45a3a] text-[#c45a3a]"
                    : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-500"
                }`}
              >
                <FileText className="w-4 h-4" />
                {lang === "ar" ? "ملاحظة" : "Note"}
              </button>
              <button
                onClick={() => setSheetType("highlight")}
                className={`py-3 rounded-xl border text-xs font-black transition flex flex-col items-center gap-1.5 ${
                  sheetType === "highlight"
                    ? "bg-yellow-500/10 border-yellow-500 text-yellow-600"
                    : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-500"
                }`}
              >
                <Highlighter className="w-4 h-4" />
                {lang === "ar" ? "تحديد هام" : "Highlight"}
              </button>
              <button
                onClick={() => setSheetType("question")}
                className={`py-3 rounded-xl border text-xs font-black transition flex flex-col items-center gap-1.5 ${
                  sheetType === "question"
                    ? "bg-blue-500/10 border-blue-500 text-blue-600"
                    : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-500"
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                {lang === "ar" ? "سؤال دراسي" : "Question"}
              </button>
            </div>

            <textarea
              value={sheetInput}
              onChange={(e) => setSheetInput(e.target.value)}
              placeholder={lang === "ar" ? "ما الذي تود كتابته وحفظه في هذا التوقيت الزمني؟" : "What do you want to remember or ask at this specific moment?"}
              rows={4}
              className="w-full bg-gray-50 border border-[#e8e2d9] focus:border-[#c45a3a] rounded-2xl p-4 text-xs font-semibold outline-none"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setIsSheetOpen(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs rounded-xl transition active:scale-95"
              >
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={() => {
                  handleAddAnnotation(sheetInput, sheetType);
                  setSheetInput("");
                  setIsSheetOpen(false);
                }}
                className="flex-1 py-3 bg-[#c45a3a] hover:bg-[#c45a3a]/90 text-white font-extrabold text-xs rounded-xl transition shadow-md active:scale-95"
              >
                {lang === "ar" ? "إضافة وحفظ" : "Add Notation"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
