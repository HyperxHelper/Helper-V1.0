import React from "react";
import { 
  Plus, 
  Globe, 
  Share2, 
  ArrowLeft, 
  ListPlus, 
  Trash2, 
  Pin, 
  PinOff, 
  Edit, 
  Eye, 
  BookMarked, 
  ExternalLink, 
  Sparkles, 
  ChevronRight, 
  LogOut, 
  Save, 
  Clock,
  Sparkle,
  X,
  RefreshCw
} from "lucide-react";
import { motion } from "motion/react";

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
  role: "student" | "teacher" | "admin";
}

interface InteractiveNotebookProps {
  lang: "en" | "ar";
  activeVideo: VideoDoc | null;
  setActiveVideo: (video: VideoDoc | null) => void;
  isAddVideoOpen: boolean;
  setIsAddVideoOpen: (open: boolean) => void;
  translateAllNotes: () => void;
  playlistSidebarView: "videos" | "playlists";
  setPlaylistSidebarView: (view: "videos" | "playlists") => void;
  activePlaylist: PlaylistDoc | null;
  setActivePlaylist: (playlist: PlaylistDoc | null) => void;
  videos: VideoDoc[];
  playlists: PlaylistDoc[];
  showToast: (msg: string, type: "success" | "info" | "error") => void;
  user: UserSession | null;
  handleDeleteVideo: (id: string) => void;
  setIsCreatePlaylistOpen: (open: boolean) => void;
  handleResetStudySession: () => void;
  playerCurrentTime: number;
  isPlaying: boolean;
  activeTab: "notes" | "diary" | "transcript" | "resources" | "discussion";
  setActiveTab: (tab: "notes" | "diary" | "transcript" | "resources" | "discussion") => void;
  newNoteText: string;
  setNewNoteText: (text: string) => void;
  newCommentText: string;
  setNewCommentText: (text: string) => void;
  handleAddNote: (e?: React.FormEvent) => void;
  handleDeleteNote: (id: string) => void;
  isDraftingNote: boolean;
  handleDraftNoteWithAI: () => void;
  attachedFileName: string;
  setAttachedFileName: (name: string) => void;
  attachedFileSize: string;
  setAttachedFileSize: (size: string) => void;
  notes: NoteDoc[];
  diaries: DiaryDoc[];
  diaryTitle: string;
  setDiaryTitle: (title: string) => void;
  diaryContent: string;
  setDiaryContent: (content: string) => void;
  activeDiaryId: string | null;
  setActiveDiaryId: (id: string | null) => void;
  isDiaryPublicWiki: boolean;
  setIsDiaryPublicWiki: (pub: boolean) => void;
  diarySubTab: "editor" | "history" | "wikis";
  setDiarySubTab: (tab: "editor" | "history" | "wikis") => void;
  isDiarySaving: boolean;
  handleDeleteDiary: (id: string) => void;
  handleSaveDiary: (e?: React.FormEvent) => void;
  handleShareDiary: (d: DiaryDoc) => void;
  handleTogglePinNote: (id: string, current: boolean) => void;
  wikis: DiaryDoc[];
  transcript: { time: number; text: string }[];
  seekTo: (seconds: number) => void;
  resources: ResourceDoc[];
  resTitle: string;
  setResTitle: (title: string) => void;
  resType: "pdf" | "link" | "image" | "excel";
  setResType: (type: "pdf" | "link" | "image" | "excel") => void;
  resUrl: string;
  setResUrl: (url: string) => void;
  handleAddResource: (e?: React.FormEvent) => void;
  isAddResourceOpen: boolean;
  setIsAddResourceOpen: (open: boolean) => void;
  handleAttachFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  comments: CommentDoc[];
  handleAddComment: (e?: React.FormEvent) => void;
  aiAnswer: string;
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
  handleAskAI: (e?: React.FormEvent) => void;
  isAiLoading: boolean;
  formatTime: (seconds: number) => string;
}

export default function InteractiveNotebook({
  lang,
  activeVideo,
  setActiveVideo,
  isAddVideoOpen,
  setIsAddVideoOpen,
  translateAllNotes,
  playlistSidebarView,
  setPlaylistSidebarView,
  activePlaylist,
  setActivePlaylist,
  videos,
  playlists,
  showToast,
  user,
  handleDeleteVideo,
  setIsCreatePlaylistOpen,
  handleResetStudySession,
  playerCurrentTime,
  isPlaying,
  activeTab,
  setActiveTab,
  newNoteText,
  setNewNoteText,
  newCommentText,
  setNewCommentText,
  handleAddNote,
  handleDeleteNote,
  isDraftingNote,
  handleDraftNoteWithAI,
  attachedFileName,
  setAttachedFileName,
  attachedFileSize,
  setAttachedFileSize,
  notes,
  diaries,
  diaryTitle,
  setDiaryTitle,
  diaryContent,
  setDiaryContent,
  activeDiaryId,
  setActiveDiaryId,
  isDiaryPublicWiki,
  setIsDiaryPublicWiki,
  diarySubTab,
  setDiarySubTab,
  isDiarySaving,
  handleDeleteDiary,
  handleSaveDiary,
  handleShareDiary,
  handleTogglePinNote,
  wikis,
  transcript,
  seekTo,
  resources,
  resTitle,
  setResTitle,
  resType,
  setResType,
  resUrl,
  setResUrl,
  handleAddResource,
  isAddResourceOpen,
  setIsAddResourceOpen,
  handleAttachFile,
  comments,
  handleAddComment,
  aiAnswer,
  aiPrompt,
  setAiPrompt,
  handleAskAI,
  isAiLoading,
  formatTime
}: InteractiveNotebookProps) {
  return (
    <div className="bg-white border border-[#e8e2d9] rounded-3xl overflow-hidden shadow-2xl min-h-[640px]" id="v1-workspace-root">
      
      {/* Workspace Header Quick Actions */}
      <div className="bg-[#fcfbf9] border-b border-[#e8e2d9] px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
          <h3 className="ml-2 rtl:ml-0 rtl:mr-2 font-black text-[#1a1612] text-sm">
            {lang === "ar" ? "مساحة التعلم الذكي التفاعلية" : "Interactive Notebook Stage"}
          </h3>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setIsAddVideoOpen(true)}
            className="px-4 py-2 bg-[#5a8a6e] hover:bg-[#5a8a6e]/90 text-white font-extrabold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            {lang === "ar" ? "استيراد فيديو يوتيوب" : "Import YouTube Video"}
          </button>
          
          <button 
            onClick={translateAllNotes}
            className="px-4 py-2 bg-gradient-to-r from-[#c45a3a] to-[#d97b5c] text-white font-extrabold text-xs rounded-xl shadow-sm hover:opacity-95 transition flex items-center gap-1.5 active:scale-95"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === "ar" ? "ترجمة جميع الملاحظات فورياً" : "AI Translate all notes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x lg:divide-[#e8e2d9] rtl:divide-x-reverse min-h-[640px]">
        
        {/* PANE 1: Playlist & Lecture Selection (Left) */}
        <div className="lg:col-span-3 p-5 bg-[#fffdf9] flex flex-col justify-between">
          <div>
            {/* View sub-switcher inside Pane 1 */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
              <button
                onClick={() => setPlaylistSidebarView("videos")}
                className={`flex-1 py-2 text-center text-xs font-black rounded-lg transition ${
                  playlistSidebarView === "videos" 
                    ? "bg-white text-[#c45a3a] shadow-sm" 
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                📹 {lang === "ar" ? "جميع الفيديوهات" : "Videos"}
              </button>
              <button
                onClick={() => setPlaylistSidebarView("playlists")}
                className={`flex-1 py-2 text-center text-xs font-black rounded-lg transition ${
                  playlistSidebarView === "playlists" 
                    ? "bg-white text-[#c45a3a] shadow-sm" 
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                📚 {lang === "ar" ? "قوائم التشغيل" : "Playlists"}
              </button>
            </div>

            {playlistSidebarView === "videos" ? (
              <>
                <div className="mb-4">
                  {activePlaylist ? (
                    <div className="bg-[#c45a3a]/5 border border-[#c45a3a]/20 p-3 rounded-2xl flex items-center justify-between">
                      <div className="text-left rtl:text-right">
                        <span className="text-[9px] font-black uppercase text-[#c45a3a] tracking-wider block">
                          {lang === "ar" ? "قائمة التشغيل النشطة" : "Active Playlist"}
                        </span>
                        <h4 className="text-xs font-black text-[#1a1612] line-clamp-1">{activePlaylist.title}</h4>
                      </div>
                      <button 
                        onClick={() => setActivePlaylist(null)}
                        className="p-1 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-gray-600 transition"
                        title={lang === "ar" ? "إلغاء تصفية قائمة التشغيل" : "Exit playlist filter"}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase text-[#8a8278] tracking-wider">
                        {lang === "ar" ? "قائمة الدروس المتاحة" : "Playlist Lectures"}
                      </h4>
                      <span className="text-[10px] bg-[#f0ebe4] px-2.5 py-1 rounded-full text-gray-600 font-bold">
                        {videos.length} {lang === "ar" ? "دروس" : "videos"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Filtered/Display Videos list */}
                <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1 rtl:pr-0 rtl:pl-1">
                  {(activePlaylist ? videos.filter(v => activePlaylist.videoIds.includes(v.id)) : videos).map((vid) => (
                    <div 
                      key={vid.id}
                      onClick={() => setActiveVideo(vid)}
                      className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border ${
                        activeVideo?.id === vid.id 
                          ? "bg-[#c45a3a]/5 border-[#c45a3a]/30 text-[#c45a3a]" 
                          : "bg-white border-transparent hover:bg-gray-100 text-[#5c554d]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          vid.category === "Physics" ? "bg-[#3b6ea5]/10 text-[#3b6ea5]" :
                          vid.category === "Mathematics" ? "bg-[#c45a3a]/10 text-[#c45a3a]" :
                          "bg-[#5a8a6e]/10 text-[#5a8a6e]"
                        }`}>
                          {vid.category}
                        </span>
                        {user?.role === "teacher" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(lang === "ar" ? "هل أنت متأكد من حذف هذا الدرس؟" : "Are you sure you want to delete this lecture video?")) {
                                handleDeleteVideo(vid.id);
                              }
                            }}
                            className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="font-extrabold text-xs text-[#1a1612] line-clamp-2">
                        {vid.title}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1">
                        {vid.channelTitle} · {formatTime(vid.duration)}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Playlists Header */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b">
                  <h4 className="text-xs font-black uppercase text-[#8a8278] tracking-wider flex items-center gap-1.5">
                    <ListPlus className="w-3.5 h-3.5 text-[#c45a3a]" />
                    {lang === "ar" ? "قوائم التشغيل المشتركة" : "Shareable Playlists"}
                  </h4>
                  <button
                    onClick={() => setIsCreatePlaylistOpen(true)}
                    className="px-2.5 py-1 bg-[#c45a3a] hover:bg-[#c45a3a]/90 text-white font-bold text-[10px] rounded-lg transition"
                  >
                    {lang === "ar" ? "➕ جديدة" : "➕ Create"}
                  </button>
                </div>

                {/* Playlists List */}
                <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1 rtl:pr-0 rtl:pl-1">
                  {playlists.length === 0 ? (
                    <div className="text-center py-12 text-xs text-gray-400">
                      {lang === "ar"
                        ? "لا توجد قوائم تشغيل منشأة بعد. أنشئ قائمتك الأولى!"
                        : "No shareable playlists created yet. Create your first one!"}
                    </div>
                  ) : (
                    playlists.map((pl) => (
                      <div
                        key={pl.id}
                        onClick={() => {
                          setActivePlaylist(pl);
                          setPlaylistSidebarView("videos");
                          // Auto-select first video in playlist if available
                          const playlistVideos = videos.filter(v => pl.videoIds.includes(v.id));
                          if (playlistVideos.length > 0) {
                            setActiveVideo(playlistVideos[0]);
                          }
                        }}
                        className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border ${
                          activePlaylist?.id === pl.id
                            ? "bg-[#c45a3a]/5 border-[#c45a3a]/30 text-[#c45a3a]"
                            : "bg-white border border-[#e8e2d9] hover:bg-[#c45a3a]/5 text-[#5c554d]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#3b6ea5]/10 text-[#3b6ea5]">
                            {pl.category}
                          </span>
                          <span className="text-[9px] text-gray-400 font-mono">
                            {pl.videoIds.length} {lang === "ar" ? "دروس" : "videos"}
                          </span>
                        </div>
                        <div className="font-extrabold text-xs text-[#1a1612] line-clamp-1">{pl.title}</div>
                        {pl.description && (
                          <p className="text-[10px] text-gray-500 mt-1 line-clamp-1 leading-tight">{pl.description}</p>
                        )}
                        <div className="text-[9px] text-gray-400 mt-1.5">
                          {lang === "ar" ? "بواسطة" : "By"} {pl.createdBy}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* Sidebar bottom guide */}
          <div className="pt-4 border-t border-[#e8e2d9] mt-6">
            <div className="p-4 bg-[#f5f0ea] rounded-2xl">
              <h5 className="font-bold text-xs text-[#1a1612] mb-1">
                {lang === "ar" ? "قائمة ويكي للدرس" : "Playlist Wiki"}
              </h5>
              <p className="text-[10px] text-[#5c554d] leading-relaxed">
                {lang === "ar"
                  ? "دليل شامل مصمم للتعليم المدمج في المدارس والجامعات التونسية."
                  : "A complete synchronized knowledge guide built for flipped classrooms."
                }
              </p>
              <button
                onClick={handleResetStudySession}
                className="mt-3 text-[10px] font-black text-red-500 hover:text-red-600 flex items-center gap-1 bg-white border border-red-200 px-2.5 py-1.5 rounded-lg w-full justify-center shadow-sm transition active:scale-95"
              >
                🔄 {lang === "ar" ? "إعادة تعيين الجلسة وتفريغ الملاحظات" : "Reset Session & Clear Workspace"}
              </button>
            </div>
          </div>
        </div>

        {/* PANE 2: Interactive Player & Multi-tab Notes (Center) */}
        <div className="lg:col-span-6 p-6 flex flex-col gap-6">
          
          {/* Actual YouTube Embed Iframe */}
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg relative border border-[#e8e2d9]">
            <div id="youtube-iframe-container" className="w-full h-full" />
            
            {/* Control bar overlay inside player */}
            <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 bg-black/75 px-3 py-1.5 rounded-lg text-[10px] font-mono text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {formatTime(playerCurrentTime)} / {formatTime(activeVideo?.duration || 2700)}
            </div>
          </div>

          {/* Tabs list */}
          <div className="flex border-b border-[#e8e2d9] overflow-x-auto whitespace-nowrap">
            {[
              { id: "notes", label_en: "Notes", label_ar: "الملاحظات" },
              { id: "diary", label_en: "Diary Notepad", label_ar: "مذكرة اليوميات" },
              { id: "transcript", label_en: "Transcript", label_ar: "النص الكامل" },
              { id: "resources", label_en: "Resources", label_ar: "المراجع" },
              { id: "discussion", label_en: "Discussion", label_ar: "المناقشات" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 pb-3 text-xs font-black transition-all relative ${
                  activeTab === tab.id 
                    ? "text-[#c45a3a]" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {lang === "ar" ? tab.label_ar : tab.label_en}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c45a3a]" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="flex-1 min-h-[300px]">
            
            {/* NOTES TAB */}
            {activeTab === "notes" && (
              <div className="flex flex-col gap-4">
                {/* Add note inline form */}
                <form onSubmit={handleAddNote} className="flex gap-2 bg-[#f5f0ea] p-2 rounded-2xl">
                  <div className="bg-white text-[#c45a3a] font-mono font-black text-[11px] px-3.5 py-2.5 rounded-xl flex items-center justify-center border">
                    {formatTime(playerCurrentTime)}
                  </div>
                  <input 
                    type="text" 
                    placeholder={lang === "ar" ? "اكتب ملاحظة لتثبيتها في هذه اللحظة..." : "Type a note pinned to current second..."}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 bg-transparent px-2 outline-none text-xs text-[#1a1612]"
                  />
                  <button type="submit" className="px-4 py-2 bg-[#c45a3a] text-white font-bold text-xs rounded-xl hover:bg-[#c45a3a]/90 shrink-0">
                    {lang === "ar" ? "تثبيت" : "Add"}
                  </button>
                </form>

                {/* AI Draft Suggestion Trigger */}
                <div className="flex justify-between items-center bg-[#c45a3a]/5 border border-[#c45a3a]/20 px-3.5 py-2 rounded-xl text-[11px]">
                  <span className="text-[#5c554d] font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#c45a3a]" />
                    {lang === "ar" ? "دع هيلبر الذكي يكتب الملاحظة بناءً على توقيت الفيديو وسياقه" : "Let Helper AI draft a study note based on current timestamp lecture context"}
                  </span>
                  <button
                    type="button"
                    onClick={handleDraftNoteWithAI}
                    disabled={isDraftingNote}
                    className="px-3 py-1 bg-white hover:bg-[#c45a3a]/10 border border-[#c45a3a]/30 text-[#c45a3a] font-black rounded-lg transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50 shrink-0"
                  >
                    {isDraftingNote ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        {lang === "ar" ? "جاري الكتابة..." : "Drafting..."}
                      </>
                    ) : (
                      <>
                        <Sparkle className="w-3 h-3 text-[#c45a3a]" />
                        {lang === "ar" ? "صياغة الملاحظة" : "Draft Note"}
                      </>
                    )}
                  </button>
                </div>

                {/* Notes List with Pin Feature */}
                <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1 rtl:pr-0 rtl:pl-1">
                  {notes.length === 0 ? (
                    <div className="text-center py-12 text-xs text-gray-400">
                      {lang === "ar" ? "لا توجد ملاحظات مسجلة بعد. كن أول من يكتب ملاحظة!" : "No notes taken yet. Write your first note above!"}
                    </div>
                  ) : (
                    [...notes]
                      .sort((a, b) => {
                        if (a.isPinned && !b.isPinned) return -1;
                        if (!a.isPinned && b.isPinned) return 1;
                        return a.timestamp - b.timestamp;
                      })
                      .map((note) => (
                        <div 
                          key={note.id}
                          onClick={() => seekTo(note.timestamp)}
                          className={`p-3 border rounded-2xl flex items-start gap-3 hover:bg-[#c45a3a]/5 transition cursor-pointer group relative ${
                            note.isPinned 
                              ? "bg-amber-50/50 border-amber-200" 
                              : "bg-white border-[#e8e2d9]"
                          }`}
                        >
                          <span className="text-[10px] font-mono font-bold bg-[#c45a3a]/10 text-[#c45a3a] px-2 py-0.5 rounded-full shrink-0">
                            {formatTime(note.timestamp)}
                          </span>
                          <div className="flex-1 text-xs">
                            <span className="font-bold text-gray-600 block mb-0.5 flex items-center gap-1">
                              {note.userDisplayName}
                              {note.isPinned && (
                                <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-0.5 shrink-0">
                                  <Pin className="w-2.5 h-2.5 fill-amber-700 text-amber-700" />
                                  {lang === "ar" ? "مثبت" : "Pinned"}
                                </span>
                              )}
                            </span>
                            <p className="text-[#1a1612] font-medium leading-relaxed">{note.text}</p>
                          </div>

                          <div className="flex items-center gap-1 absolute top-2 right-2 rtl:right-auto rtl:left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Pin Toggle Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTogglePinNote(note.id, !!note.isPinned);
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#c45a3a]"
                              title={note.isPinned ? (lang === "ar" ? "إلغاء تثبيت الملاحظة" : "Unpin note") : (lang === "ar" ? "تثبيت الملاحظة في الأعلى" : "Pin note to top")}
                            >
                              <Pin className={`w-3.5 h-3.5 ${note.isPinned ? "fill-[#c45a3a] text-[#c45a3a]" : ""}`} />
                            </button>
                            {/* Delete Note Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(lang === "ar" ? "هل تريد حذف هذه الملاحظة؟" : "Delete this note?")) {
                                  handleDeleteNote(note.id);
                                }
                              }}
                              className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"
                              title={lang === "ar" ? "حذف الملاحظة" : "Delete note"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            {/* DIARY NOTEPAD TAB */}
            {activeTab === "diary" && (
              <div className="flex flex-col gap-4">
                {/* Sub navigation header */}
                <div className="flex gap-2 border-b border-[#e8e2d9] pb-3 overflow-x-auto whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => setDiarySubTab("editor")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      diarySubTab === "editor"
                        ? "bg-[#c45a3a] text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    📝 {lang === "ar" ? "محرر المذكرة" : "Notepad Editor"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiarySubTab("history")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      diarySubTab === "history"
                        ? "bg-[#c45a3a] text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    📜 {lang === "ar" ? "السجل وتاريخي" : "Accessible History"}
                    <span className="text-[10px] bg-black/10 px-1.5 py-0.5 rounded-full font-bold">
                      {diaries.length}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiarySubTab("wikis")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      diarySubTab === "wikis"
                        ? "bg-[#c45a3a] text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    🌐 {lang === "ar" ? "ويكي مجتمعي" : "Community Wikis"}
                    <span className="text-[10px] bg-black/10 px-1.5 py-0.5 rounded-full font-bold">
                      {wikis.length}
                    </span>
                  </button>
                </div>

                {/* Editor View */}
                {diarySubTab === "editor" && (
                  <form onSubmit={(e) => { e.preventDefault(); handleSaveDiary(); }} className="flex flex-col gap-3">
                    <div className="p-3 bg-[#c45a3a]/5 border border-[#c45a3a]/20 rounded-xl text-[11px] text-[#5c554d] leading-relaxed">
                      📌 {lang === "ar" 
                        ? "اكتب مذكرتك الدراسية هنا. يمكنك مزامنة الملاحظات الطويلة مع الفيديو مباشرة ومشاركتها كـ ويكي عام للمجتمع!" 
                        : "Type your study notebook/diary here. You can sync long notes, restore them from history, or publish as collaborative public Wikis!"}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-400">
                        {lang === "ar" ? "عنوان المذكرة" : "Diary Title"}
                      </label>
                      <input
                        type="text"
                        placeholder={lang === "ar" ? "مثال: مراجعة نهايات التفاضل والتكامل" : "E.g., Newton's Law of Universal Gravitation Key Points"}
                        value={diaryTitle}
                        onChange={(e) => setDiaryTitle(e.target.value)}
                        className="bg-white border border-[#e8e2d9] p-3 text-xs rounded-xl outline-none focus:border-[#c45a3a]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black uppercase text-gray-400">
                          {lang === "ar" ? "المحتوى" : "Content / Diary Text"}
                        </label>
                        {/* Insert Timestamp link button */}
                        <button
                          type="button"
                          onClick={() => {
                            const timestampLink = `[@${formatTime(playerCurrentTime)}] `;
                            setDiaryContent(diaryContent + timestampLink);
                            showToast(
                              lang === "ar" ? "تم إدراج توقيت الفيديو!" : "Inserted current timestamp link!",
                              "info"
                            );
                          }}
                          className="text-[10px] text-[#c45a3a] hover:underline font-bold flex items-center gap-1"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          {lang === "ar" ? "ربط بالتوقيت الحالي" : "Link Current Time"} ({formatTime(playerCurrentTime)})
                        </button>
                      </div>
                      <textarea
                        placeholder={lang === "ar" 
                          ? "اكتب مذكراتك المستمرة هنا... اضغط على زر 'ربط بالتوقيت الحالي' لإدراج توقيت الفيديو في مذكرتك." 
                          : "Write your continuous study thoughts here... Use 'Link Current Time' to insert synchronized bookmarks inside your notebook."}
                        value={diaryContent}
                        onChange={(e) => setDiaryContent(e.target.value)}
                        className="bg-white border border-[#e8e2d9] p-3.5 text-xs rounded-2xl outline-none focus:border-[#c45a3a] min-h-[180px] font-sans"
                      />
                    </div>

                    {/* Public Wiki checkbox */}
                    <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-50 border rounded-xl hover:bg-gray-100 transition">
                      <input
                        type="checkbox"
                        checked={isDiaryPublicWiki}
                        onChange={(e) => setIsDiaryPublicWiki(e.target.checked)}
                        className="rounded text-[#c45a3a] focus:ring-[#c45a3a] w-4 h-4"
                      />
                      <div className="text-left rtl:text-right">
                        <span className="text-xs font-black text-[#1a1612] block">
                          🌐 {lang === "ar" ? "مشاركة كـ ويكي عام للمجتمع" : "Publish as Public wiki"}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {lang === "ar" 
                            ? "اجعل هذه المذكرة نسخة معيارية يستفيد منها جميع الطلبة في هذا الدرس."
                            : "Make this study summary a standardized public Wiki version for everyone to learn from."}
                        </span>
                      </div>
                    </label>

                    {/* Save / Reset actions */}
                    <div className="flex gap-2 justify-end">
                      {activeDiaryId && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveDiaryId(null);
                            setDiaryTitle("");
                            setDiaryContent("");
                            setIsDiaryPublicWiki(false);
                          }}
                          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs rounded-xl transition"
                        >
                          {lang === "ar" ? "مذكرة فارغة جديدة" : "New Blank Notepad"}
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={isDiarySaving}
                        className="px-6 py-2.5 bg-[#c45a3a] hover:bg-[#c45a3a]/90 text-white font-bold text-xs rounded-xl transition flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {isDiarySaving 
                          ? (lang === "ar" ? "جاري الحفظ..." : "Saving...")
                          : (lang === "ar" ? "حفظ ومزامنة مع السحابة" : "Save Diary & Sync")}
                      </button>
                    </div>
                  </form>
                )}

                {/* History View (Accessible History) */}
                {diarySubTab === "history" && (
                  <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto">
                    {diaries.length === 0 ? (
                      <div className="text-center py-12 text-xs text-gray-400">
                        📭 {lang === "ar" 
                          ? "سجل مذكراتك فارغ حالياً. اكتب واحفظ مذكرتك الأولى!" 
                          : "Your study diary history is empty. Write and save your first note!"}
                      </div>
                    ) : (
                      diaries.map((diary) => (
                        <div key={diary.id} className="p-3 bg-white border border-[#e8e2d9] rounded-2xl flex flex-col gap-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-extrabold text-xs text-[#1a1612] line-clamp-1">{diary.title}</h5>
                              <span className="text-[9px] text-gray-400 font-mono block">
                                {new Date(diary.createdAt).toLocaleDateString()} · {diary.videoTitle || (lang === "ar" ? "لا يوجد فيديو مرتبط" : "No linked video")}
                              </span>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setDiaryTitle(diary.title);
                                  setDiaryContent(diary.content);
                                  setActiveDiaryId(diary.id);
                                  setIsDiaryPublicWiki(diary.isPublicWiki);
                                  setDiarySubTab("editor");
                                  showToast(
                                    lang === "ar" ? "تم استرجاع المذكرة للمحرر!" : "Diary loaded to editor!",
                                    "success"
                                  );
                                }}
                                className="px-2 py-1 bg-gray-100 hover:bg-[#c45a3a]/10 hover:text-[#c45a3a] text-gray-600 font-bold text-[10px] rounded-lg transition"
                                title={lang === "ar" ? "استرجاع اليومية إلى المحرر" : "Restore diary to editor"}
                              >
                                {lang === "ar" ? "استرجاع" : "Restore"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleShareDiary(diary)}
                                className="p-1 text-gray-400 hover:text-[#3b6ea5] transition"
                                title={lang === "ar" ? "مشاركة اليومية" : "Share diary"}
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteDiary(diary.id)}
                                className="p-1 text-gray-400 hover:text-red-500 transition"
                                title={lang === "ar" ? "حذف اليومية" : "Delete diary"}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed bg-[#fffdf9] p-2 rounded-xl border border-dashed border-[#e8e2d9] whitespace-pre-wrap text-left rtl:text-right">
                            {diary.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Wikis View */}
                {diarySubTab === "wikis" && (
                  <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[10px] text-amber-800 leading-relaxed text-left rtl:text-right">
                      💡 {lang === "ar"
                        ? "هذه قائمة بالملخصات والويكي المعيارية المنشورة من قبل زملائك في الفصل والجمهور لهذا الدرس. يمكنك نسخها لمذكرتك الشخصية والبدء في التعديل عليها."
                        : "These are public standard Wikis crafted by classroom classmates and other learners for this video. Copy them to your notepad to customize or contribute."}
                    </div>

                    {wikis.length === 0 ? (
                      <div className="text-center py-12 text-xs text-gray-400">
                        🌐 {lang === "ar" 
                          ? "لا توجد ملخصات ويكي عامة منشورة لهذا الدرس بعد. كن أول من ينشر!" 
                          : "No standardized public wikis created for this video yet. Be the first!"}
                      </div>
                    ) : (
                      wikis.map((wiki) => (
                        <div key={wiki.id} className="p-3 bg-white border border-[#e8e2d9] rounded-2xl flex flex-col gap-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-extrabold text-xs text-[#1a1612] flex items-center gap-1">
                                <Globe className="w-3.5 h-3.5 text-[#5a8a6e]" />
                                {wiki.title}
                              </h5>
                              <span className="text-[9px] text-gray-400 block">
                                {lang === "ar" ? "بواسطة" : "By"} {wiki.userDisplayName} · {new Date(wiki.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setDiaryTitle(wiki.title);
                                setDiaryContent(wiki.content);
                                setActiveDiaryId(null); // Save as new personal copy
                                setIsDiaryPublicWiki(false);
                                setDiarySubTab("editor");
                                showToast(
                                  lang === "ar" ? "تم نسخ الويكي إلى مذكرتك!" : "Copied public Wiki to your editor!",
                                  "success"
                                );
                              }}
                              className="px-2.5 py-1 bg-[#5a8a6e]/10 text-[#5a8a6e] hover:bg-[#5a8a6e]/20 font-bold text-[10px] rounded-lg transition shrink-0"
                            >
                              📥 {lang === "ar" ? "نسخ إلى المحرر" : "Copy to editor"}
                            </button>
                          </div>
                          <p className="text-[11px] text-gray-500 whitespace-pre-wrap leading-relaxed max-h-[120px] overflow-y-auto bg-gray-50 p-2.5 rounded-xl border border-[#e8e2d9] text-left rtl:text-right">
                            {wiki.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TRANSCRIPT TAB */}
            {activeTab === "transcript" && (
              <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1 rtl:pr-0 rtl:pl-1">
                <div className="p-3 bg-[#f5f0ea] rounded-xl text-[10px] text-[#5c554d] flex items-center gap-2 mb-2 text-left rtl:text-right">
                  <Sparkles className="w-3.5 h-3.5 text-[#c45a3a]" />
                  {lang === "ar" ? "اضغط على أي جملة لنقل مشغل الفيديو إلى توقيتها المباشر." : "Click any phrase to jump the video lecture straight to that point."}
                </div>

                {transcript.map((line, index) => (
                  <div 
                    key={index}
                    onClick={() => seekTo(line.time)}
                    className={`p-2.5 rounded-xl cursor-pointer transition flex items-start gap-3 hover:bg-gray-100 ${
                      playerCurrentTime >= line.time && (index === transcript.length - 1 || playerCurrentTime < transcript[index+1].time)
                        ? "bg-[#5a8a6e]/5 border border-[#5a8a6e]/30" 
                        : ""
                    }`}
                  >
                    <span className="text-[10px] font-mono text-[#5a8a6e] font-black shrink-0 w-10">
                      {formatTime(line.time)}
                    </span>
                    <p className="text-xs text-[#5c554d] hover:text-[#1a1612] text-left rtl:text-right">
                      {line.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* RESOURCES TAB */}
            {activeTab === "resources" && (
              <div className="flex flex-col gap-4">
                {/* Inline Add Resource trigger */}
                <div className="bg-[#f5f0ea] p-4 rounded-2xl">
                  {!isAddResourceOpen ? (
                    <button 
                      onClick={() => setIsAddResourceOpen(true)}
                      className="w-full py-2.5 bg-white border border-[#e8e2d9] font-bold text-xs text-[#5c554d] hover:text-[#c45a3a] hover:border-[#c45a3a] rounded-xl flex items-center justify-center gap-2 transition"
                    >
                      <Plus className="w-4 h-4" />
                      {lang === "ar" ? "إرفاق ملف أو مرجع تعليمي جديد" : "Attach file or learning resource"}
                    </button>
                  ) : (
                    <form onSubmit={(e) => { e.preventDefault(); handleAddResource(); }} className="flex flex-col gap-3">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="text-xs font-black">{lang === "ar" ? "مرجع عند التوقيت:" : "Resource at:"} {formatTime(playerCurrentTime)}</h5>
                        <button type="button" onClick={() => { setIsAddResourceOpen(false); setAttachedFileName(""); setAttachedFileSize(""); }} className="text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Drag and Drop Zone or Manual File Upload */}
                      <div className="border-2 border-dashed border-[#e8e2d9] hover:border-[#c45a3a]/60 rounded-xl p-4 bg-white text-center cursor-pointer transition relative group">
                        <input 
                          type="file" 
                          onChange={handleAttachFile}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                        />
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <span className="text-2xl">📁</span>
                          <span className="text-[11px] font-extrabold text-[#1a1612]">
                            {attachedFileName ? attachedFileName : (lang === "ar" ? "اسحب وأفلت الملفات هنا أو انقر للاختيار" : "Drag & drop file here, or click to browse")}
                          </span>
                          <span className="text-[9px] text-gray-400">
                            {attachedFileSize ? attachedFileSize : (lang === "ar" ? "يدعم ملفات PDF، الصور، ملفات Excel وغيرها" : "Supports PDF, Images, Excel sheets, etc.")}
                          </span>
                        </div>
                      </div>

                      <input 
                        type="text" 
                        placeholder={lang === "ar" ? "عنوان المرجع (مثال: ملخص الدرس الثاني)" : "Resource title (e.g., Newton Notes PDF)"}
                        value={resTitle}
                        onChange={(e) => setResTitle(e.target.value)}
                        className="bg-white border p-2.5 rounded-xl text-xs outline-none focus:border-[#c45a3a]"
                        required
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select 
                          value={resType}
                          onChange={(e) => setResType(e.target.value as any)}
                          className="bg-white border p-2.5 rounded-xl text-xs outline-none"
                        >
                          <option value="pdf">{lang === "ar" ? "مستند PDF" : "PDF Document"}</option>
                          <option value="link">{lang === "ar" ? "رابط ويب" : "Website Link"}</option>
                          <option value="image">{lang === "ar" ? "صورة لقطة شاشة" : "Screenshot Image"}</option>
                          <option value="excel">{lang === "ar" ? "جدول بيانات" : "Excel/Sheet"}</option>
                        </select>
                        <input 
                          type="text" 
                          placeholder="https://..."
                          value={resUrl}
                          onChange={(e) => setResUrl(e.target.value)}
                          className="bg-white border p-2.5 rounded-xl text-xs outline-none focus:border-[#c45a3a]"
                          required
                        />
                      </div>
                      <button type="submit" className="py-2.5 bg-[#c45a3a] text-white font-bold text-xs rounded-xl hover:bg-[#c45a3a]/90">
                        {lang === "ar" ? "تأكيد الإضافة" : "Confirm addition"}
                      </button>
                    </form>
                  )}
                </div>

                {/* Resources List */}
                <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto">
                  {resources.length === 0 ? (
                    <div className="text-center py-12 text-xs text-gray-400">
                      {lang === "ar" ? "لا توجد مراجع تعليمية مرفقة بعد." : "No attached learning resources yet."}
                    </div>
                  ) : (
                    resources.map((res) => (
                      <a 
                        key={res.id}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3.5 bg-[#fffdf9] border hover:border-[#c45a3a] rounded-2xl flex items-center justify-between hover:shadow-md transition text-[#1a1612] decoration-transparent"
                      >
                        <div className="flex items-center gap-3">
                          <span className="p-2 bg-gray-100 rounded-xl">
                            {res.type === "pdf" ? "📄" : res.type === "link" ? "🔗" : res.type === "image" ? "🖼️" : "📊"}
                          </span>
                          <div className="text-left rtl:text-right">
                            <h5 className="font-extrabold text-xs">{res.title}</h5>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {lang === "ar" ? "مرفق عند التوقيت" : "Attached at"} {formatTime(res.timestamp)}
                            </p>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 animate-pulse" />
                      </a>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* DISCUSSION TAB */}
            {activeTab === "discussion" && (
              <div className="flex flex-col gap-4">
                {/* Add comment inline form */}
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder={lang === "ar" ? "اكتب مشاركة في النقاش الجماعي..." : "Type your classroom comment..."}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="flex-1 bg-white border px-4 py-3 text-xs rounded-2xl outline-none focus:border-[#c45a3a]"
                    required
                  />
                  <button type="submit" className="px-5 bg-[#c45a3a] text-white font-bold text-xs rounded-2xl hover:bg-[#c45a3a]/90">
                    {lang === "ar" ? "إرسال" : "Send"}
                  </button>
                </form>

                {/* Comments List */}
                <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1 rtl:pr-0 rtl:pl-1">
                  {comments.length === 0 ? (
                    <div className="text-center py-12 text-xs text-gray-400">
                      {lang === "ar" ? "لا توجد مشاركات في النقاش." : "No classroom discussions yet."}
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#c45a3a] to-[#e07a5f] text-white font-black text-xs flex items-center justify-center shrink-0">
                          {comment.userDisplayName.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="bg-[#f5f0ea]/50 p-3 rounded-2xl flex-1 text-left rtl:text-right">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-extrabold text-[11px] text-[#1a1612]">{comment.userDisplayName}</span>
                            <span className="text-[9px] text-gray-400">{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-xs text-[#5c554d] leading-relaxed">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* PANE 3: Academic AI Co-Pilot & Activity Tracker (Right) */}
        <div className="lg:col-span-3 border-l border-r border-[#e8e2d9] p-5 bg-[#fffdf9] flex flex-col justify-between">
          
          {/* Co-Pilot Q&A UI */}
          <div className="flex flex-col h-full justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkle className="w-4 h-4 text-[#c45a3a]" />
                <h4 className="text-xs font-black uppercase text-[#8a8278] tracking-wider">
                  {lang === "ar" ? "مساعدك الأكاديمي الذكي" : "Academic AI Co-Pilot"}
                </h4>
              </div>

              <div className="bg-white p-4 border rounded-2xl mb-4 shadow-sm text-left rtl:text-right">
                <p className="text-[11px] text-[#5c554d] leading-relaxed">
                  {lang === "ar"
                    ? "مرحباً! اسألني أي سؤال حول درس الفيديو وسأقوم بتحليل النص الكامل والملاحظات المحفوظة لإجابتك في سياق الدرس."
                    : "Ask me any academic question. I'll read the lecture transcript and notebook entries to provide a highly contextual answer!"
                  }
                </p>
              </div>

              {/* AI Output box */}
              {(isAiLoading || aiAnswer) && (
                <div className="bg-[#c45a3a]/5 border border-[#c45a3a]/20 p-4 rounded-2xl text-xs max-h-[300px] overflow-y-auto mb-4 text-left rtl:text-right">
                  {isAiLoading ? (
                    <div className="flex items-center gap-2 text-gray-500 font-bold justify-start">
                      <span className="w-2 h-2 rounded-full bg-[#c45a3a] animate-ping shrink-0" />
                      {lang === "ar" ? "مساعد هيلبر يفكر..." : "Helper AI is thinking..."}
                    </div>
                  ) : (
                    <p className="leading-relaxed text-[#1a1612] whitespace-pre-line font-medium">
                      {aiAnswer}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* AI input form */}
            <form onSubmit={handleAskAI} className="flex gap-2">
              <input 
                type="text"
                placeholder={lang === "ar" ? "اسأل هيلبر الذكي..." : "Ask Helper AI..."}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="flex-1 bg-white border p-3 text-xs rounded-xl outline-none focus:border-[#c45a3a]"
                required
              />
              <button type="submit" disabled={isAiLoading} className="p-3 bg-[#c45a3a] text-white rounded-xl hover:bg-[#c45a3a]/90 transition">
                <Sparkles className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
