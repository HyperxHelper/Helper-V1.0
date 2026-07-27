const videos = [
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
  }
];

const notes = [
  {
    id: "note1",
    videoId: "ZihywtixUYo",
    userId: "demo_user",
    userDisplayName: "Demo Student",
    timestamp: 45,
    text: "Classical Physics branch: Describes everyday motion of macro objects under Newton's gravitational and mechanics laws.",
    createdAt: new Date().toISOString(),
    isPinned: true
  },
  {
    id: "note2",
    videoId: "ZihywtixUYo",
    userId: "demo_user",
    userDisplayName: "Demo Student",
    timestamp: 240,
    text: "Electromagnetism branch: Maxwell unified electricity, magnetism, and light into a single theory.",
    createdAt: new Date().toISOString()
  },
  {
    id: "note3",
    videoId: "ZihywtixUYo",
    userId: "demo_user",
    userDisplayName: "Demo Student",
    timestamp: 380,
    text: "Thermodynamics: Deals with heat, temperature, and entropy. Leads to limits on power generation and efficiency.",
    createdAt: new Date().toISOString()
  },
  {
    id: "note4",
    videoId: "ZihywtixUYo",
    userId: "demo_user",
    userDisplayName: "Demo Student",
    timestamp: 640,
    text: "Albert Einstein's General Relativity: Redefined gravity as the geometric curvature of spacetime, not a force.",
    createdAt: new Date().toISOString()
  },
  {
    id: "note5",
    videoId: "ZihywtixUYo",
    userId: "demo_user",
    userDisplayName: "Demo Student",
    timestamp: 760,
    text: "Quantum Mechanics: Explores the subatomic world where objects display wave-particle duality and probabilistic behavior.",
    createdAt: new Date().toISOString()
  }
];

const resources = [
  {
    id: "res1",
    videoId: "ZihywtixUYo",
    title: "The Map of Physics Reference Guide.pdf",
    type: "pdf",
    url: "#",
    timestamp: 0,
    addedBy: "system",
    createdAt: new Date().toISOString()
  },
  {
    id: "res2",
    videoId: "ZihywtixUYo",
    title: "Domain of Science - Official Website",
    type: "link",
    url: "https://domainofscience.com",
    timestamp: 45,
    addedBy: "system",
    createdAt: new Date().toISOString()
  }
];

const comments = [
  {
    id: "comm1",
    videoId: "ZihywtixUYo",
    userId: "user_rania",
    userDisplayName: "Rania A.",
    text: "This video is the perfect visual overview. The way relativity bridges classical and quantum is so clear!",
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: "comm2",
    videoId: "ZihywtixUYo",
    userId: "user_youssef",
    userDisplayName: "Youssef K.",
    text: "The design and typography of Dominic's maps are stunning. Extremely easy to follow.",
    createdAt: new Date(Date.now() - 18000000).toISOString()
  }
];

const playlists = [
  {
    id: "playlist_demo1",
    title: "Physics Foundations",
    description: "Core physics concepts from classical to quantum.",
    category: "Physics",
    videoIds: ["ZihywtixUYo", "k7RM-X2OW_Y", "f3MWh-PAnYg"],
    createdBy: "Demo Teacher",
    isPublic: true,
    createdAt: new Date().toISOString()
  }
];

const diaries = [
  {
    id: "wiki_physics_overview",
    title: "The Unified Map of Physics: Classic to Quantum",
    videoId: "ZihywtixUYo",
    videoTitle: "The Map of Physics (A Visual Overview)",
    userId: "user_rania",
    userDisplayName: "Rania Al-Alawi",
    isPublicWiki: true,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    content: JSON.stringify({
      notepadText: "This video serves as a comprehensive visual ontology of physical sciences. It organizes physics into three primary pillars: Classical Physics, Relativity, and Quantum Mechanics.",
      annotations: [
        { time: 45, type: "note", text: "Classical Physics branch: Describes everyday motion of macro objects under Newton's gravitational and mechanics laws." },
        { time: 240, type: "highlight", text: "Maxwell's Equations: Unification of electricity, magnetism, and light into electrodynamics." },
        { time: 640, type: "note", text: "Einstein's General Relativity: Mass and energy bend the fabric of spacetime, manifesting as gravity." }
      ]
    })
  },
  {
    id: "wiki_calculus_essence",
    title: "The Foundational Essence of Calculus and Limits",
    videoId: "WUv0K_Nf-b0",
    videoTitle: "The Essence of Calculus (Chapter 1)",
    userId: "user_youssef",
    userDisplayName: "Youssef Kanaan",
    isPublicWiki: true,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    content: JSON.stringify({
      notepadText: "A collaborative breakdown of Chapter 1 of 3Blue1Brown's calculus. The core thesis of calculus is to analyze change by breaking curves into infinite, tiny straight segments.",
      annotations: [
        { time: 30, type: "note", text: "The Core Question: How do we measure instant rate of change when time difference is exactly zero?" },
        { time: 180, type: "highlight", text: "Visualizing Area under a curve: Breaking a circle into multiple concentric rings and unfolding them into a triangle." }
      ]
    })
  }
];

const communityPosts = [
  {
    id: "post_demo1",
    videoId: "ZihywtixUYo",
    videoTitle: "The Map of Physics (A Visual Overview)",
    videoUrl: "",
    topic: "Physics",
    subject: "How does quantum entanglement fit into the Map of Physics?",
    content: "Dominic's map beautifully shows the branches, but where exactly does quantum entanglement bridge into relativity? Is there a visual overlap?",
    userId: "user_demo",
    userDisplayName: "Curious Scholar",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    votes: 5,
    votedUsers: ["u1", "u2", "u3", "u4", "u5"],
    responses: [
      {
        id: "resp_demo1",
        userId: "user_rania",
        userDisplayName: "Rania A.",
        text: "Great question! Entanglement sits at the intersection — it's quantum in nature but has implications for spacetime geometry, which is relativity territory.",
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ]
  }
];

let idCounter = 100;
function genId(prefix: string) {
  return prefix + "_" + (++idCounter);
}

type MockRoute = {
  pattern: RegExp;
  handler: (match: RegExpMatchArray, method: string, body?: any) => any;
};

const routes: MockRoute[] = [
  // Videos
  { pattern: /^\/api\/videos$/, handler: (_m, method, body) => {
    if (method === "POST" && body) {
      const id = body.youtubeUrl?.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1] || genId("vid");
      const v = { id, title: "Imported Video", channelTitle: "YouTube", duration: 600, category: body.category || "General", addedBy: body.addedBy || "guest", createdAt: new Date().toISOString() };
      videos.unshift(v);
      return v;
    }
    return [...videos];
  }},

  // Notes for a video
  { pattern: /^\/api\/videos\/([^/]+)\/notes$/, handler: (m, method, body) => {
    const vid = m[1];
    if (method === "POST" && body) {
      const n = { id: genId("note"), videoId: vid, userId: body.userId || "guest", userDisplayName: body.userDisplayName || "Guest", timestamp: body.timestamp || 0, text: body.text, createdAt: new Date().toISOString(), isPinned: false };
      notes.push(n);
      return n;
    }
    return notes.filter(n => n.videoId === vid).sort((a, b) => a.timestamp - b.timestamp);
  }},

  // Pin note
  { pattern: /^\/api\/notes\/([^/]+)\/pin$/, handler: (m, _method, body) => {
    const n = notes.find(n => n.id === m[1]);
    if (n) { n.isPinned = body?.isPinned ?? true; return n; }
    return { id: m[1], isPinned: body?.isPinned ?? true };
  }},

  // Delete note
  { pattern: /^\/api\/notes\/([^/]+)$/, handler: (m, method) => {
    if (method === "DELETE") {
      const idx = notes.findIndex(n => n.id === m[1]);
      if (idx >= 0) notes.splice(idx, 1);
      return { success: true };
    }
    return { success: true };
  }},

  // Resources
  { pattern: /^\/api\/videos\/([^/]+)\/resources$/, handler: (m, method, body) => {
    const vid = m[1];
    if (method === "POST" && body) {
      const r = { id: genId("res"), videoId: vid, title: body.title, type: body.type, url: body.url, timestamp: body.timestamp || 0, addedBy: body.addedBy || "guest", createdAt: new Date().toISOString() };
      resources.push(r);
      return r;
    }
    return resources.filter(r => r.videoId === vid);
  }},

  // Comments
  { pattern: /^\/api\/videos\/([^/]+)\/comments$/, handler: (m, method, body) => {
    const vid = m[1];
    if (method === "POST" && body) {
      const c = { id: genId("comm"), videoId: vid, userId: body.userId || "guest", userDisplayName: body.userDisplayName || "Guest", text: body.text, createdAt: new Date().toISOString() };
      comments.push(c);
      return c;
    }
    return comments.filter(c => c.videoId === vid);
  }},

  // Activities
  { pattern: /^\/api\/videos\/([^/]+)\/activities$/, handler: (m, method, body) => {
    if (method === "POST" && body) {
      return { id: genId("act"), userId: body.userId, userDisplayName: body.userDisplayName, videoId: m[1], action: body.action, timestamp: body.timestamp || 0, createdAt: new Date().toISOString() };
    }
    return [];
  }},

  // Global activities
  { pattern: /^\/api\/activities$/, handler: () => [] },

  // Playlists
  { pattern: /^\/api\/playlists$/, handler: (_m, method, body) => {
    if (method === "POST" && body) {
      const p = { id: genId("playlist"), title: body.title, description: body.description || "", category: body.category || "General", videoIds: body.videoIds || [], createdBy: body.createdBy || "guest", isPublic: body.isPublic ?? true, createdAt: new Date().toISOString() };
      playlists.push(p);
      return p;
    }
    return [...playlists];
  }},

  // Diaries
  { pattern: /^\/api\/diaries$/, handler: (_m, method, body) => {
    if (method === "POST" && body) {
      const d = { id: body.id || genId("diary"), title: body.title || "My Study Diary", content: body.content, videoId: body.videoId || "", videoTitle: body.videoTitle || "", userId: body.userId || "guest", userDisplayName: body.userDisplayName || "Guest", isPublicWiki: body.isPublicWiki ?? false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      const idx = diaries.findIndex(dd => dd.id === d.id);
      if (idx >= 0) diaries[idx] = d; else diaries.unshift(d);
      return d;
    }
    const user = new URLSearchParams(window.location.search).get("userId");
    let list = user ? diaries.filter(d => d.userId === user) : [...diaries];
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }},

  // Single diary
  { pattern: /^\/api\/diaries\/([^/]+)$/, handler: (m, method) => {
    if (method === "DELETE") {
      const idx = diaries.findIndex(d => d.id === m[1]);
      if (idx >= 0) diaries.splice(idx, 1);
      return { success: true };
    }
    return diaries.find(d => d.id === m[1]) || { id: m[1], title: "Not found", content: "", isPublicWiki: false };
  }},

  // Wikis
  { pattern: /^\/api\/wikis$/, handler: () => {
    return diaries.filter(d => d.isPublicWiki).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }},

  // Community posts
  { pattern: /^\/api\/community-posts$/, handler: (_m, method, body) => {
    if (method === "POST" && body) {
      const p = { id: genId("post"), videoId: body.videoId || "", videoTitle: body.videoTitle || "", videoUrl: body.videoUrl || "", topic: body.topic, subject: body.subject, content: body.content, userId: body.userId, userDisplayName: body.userDisplayName || "Anonymous Scholar", createdAt: new Date().toISOString(), votes: 1, votedUsers: [body.userId], responses: [] };
      communityPosts.unshift(p);
      return p;
    }
    return [...communityPosts];
  }},

  // Vote on post
  { pattern: /^\/api\/community-posts\/([^/]+)\/vote$/, handler: (m, _method, body) => {
    const p = communityPosts.find(p => p.id === m[1]);
    if (!p) return { error: "Not found" };
    const uid = body?.userId;
    if (!uid) return p;
    if (p.votedUsers.includes(uid)) {
      p.votes = Math.max(0, p.votes - 1);
      p.votedUsers = p.votedUsers.filter((u: string) => u !== uid);
    } else {
      p.votes += 1;
      p.votedUsers.push(uid);
    }
    return p;
  }},

  // Reply to post
  { pattern: /^\/api\/community-posts\/([^/]+)\/responses$/, handler: (m, _method, body) => {
    const p = communityPosts.find(p => p.id === m[1]);
    if (!p) return { error: "Not found" };
    const resp = { id: genId("resp"), userId: body?.userId || "guest", userDisplayName: body?.userDisplayName || "Anonymous", text: body?.text || "", createdAt: new Date().toISOString() };
    p.responses = [...(p.responses || []), resp];
    return p;
  }},

  // Auth
  { pattern: /^\/api\/auth\/register$/, handler: (_m, _method, body) => {
    const u = { uid: body?.uid || genId("user"), email: body?.email || "", displayName: body?.displayName || "Learner", role: body?.role || "student", createdAt: new Date().toISOString() };
    return { user: u, token: "mock_token" };
  }},
  { pattern: /^\/api\/auth\/login$/, handler: (_m, _method, body) => {
    if ((body?.email === "Admin" || body?.email === "admin") && body?.password === "Admin") {
      return { user: { uid: "admin", email: "admin@helper.com", displayName: "Administrator", role: "admin", createdAt: new Date().toISOString() }, token: "token_admin" };
    }
    const u = { uid: body?.uid || genId("user"), email: body?.email || "", displayName: body?.email?.split("@")[0] || "Learner", role: "student", createdAt: new Date().toISOString() };
    return { user: u, token: "mock_token" };
  }},

  // AI endpoints
  { pattern: /^\/api\/ai\/ask$/, handler: (_m, _method, body) => {
    const title = body?.videoTitle || "this lesson";
    const lang = body?.language;
    return { answer: lang === "ar"
      ? `مرحباً! هذه نسخة تجريبية من Helper تعمل على GitHub Pages. المساعد الذكي غير متاح في وضع العرض. استمتع بالاستكشاف!`
      : `Hello! This is a demo version of Helper running on GitHub Pages. The AI assistant is not available in demo mode. Feel free to explore the full UI!`
    };
  }},
  { pattern: /^\/api\/ai\/transcript$/, handler: (_m, _method, body) => {
    const lang = body?.language;
    return { transcript: [
      { time: 0, text: lang === "ar" ? `مرحباً بكم في هذا الدرس.` : `Welcome to this lesson.` },
      { time: 60, text: lang === "ar" ? `دعونا نتعمق في الموضوع.` : `Let's dive into the topic.` },
      { time: 200, text: lang === "ar" ? `هنا نرى المفاهيم الأساسية.` : `Here we see the core concepts.` },
      { time: 500, text: lang === "ar" ? `يتم الآن شرح النظرية.` : `The theory is being explained here.` },
      { time: 900, text: lang === "ar" ? `لخصنا أهم النقاط.` : `We've summarized the key points.` }
    ]};
  }},
  { pattern: /^\/api\/ai\/draft-note$/, handler: (_m, _method, _body) => {
    return { draft: "Auto-generated demo note: Review and summarize this lecture segment to highlight the core academic concepts discussed by the instructor." };
  }},
  { pattern: /^\/api\/ai\/translate$/, handler: (_m, _method, body) => {
    return { translatedText: body?.text || "" };
  }},

  // Config
  { pattern: /^\/api\/config\/firebase$/, handler: () => ({
    projectId: "demo-project", appId: "demo", apiKey: "demo", authDomain: "demo.firebaseapp.com", firestoreDatabaseId: "demo-db", storageBucket: "demo.appspot.com", messagingSenderId: "000"
  })},

  // Admin
  { pattern: /^\/api\/admin\/stats$/, handler: () => ({
    totalUsers: 3, students: 2, teachers: 1, admins: 1, totalVideos: videos.length, totalNotes: notes.length, totalComments: comments.length, totalResources: resources.length, categoryDistribution: { Physics: 3, Mathematics: 2, Biology: 2, "Computer Science": 1 }, timelineData: [], recentActivities: []
  })},
  { pattern: /^\/api\/admin\/users$/, handler: () => [
    { uid: "admin", email: "admin@helper.com", displayName: "Administrator", role: "admin", createdAt: new Date().toISOString() },
    { uid: "demo_student", email: "student@demo.com", displayName: "Demo Student", role: "student", createdAt: new Date().toISOString() },
    { uid: "demo_teacher", email: "teacher@demo.com", displayName: "Demo Teacher", role: "teacher", createdAt: new Date().toISOString() }
  ]},
  { pattern: /^\/api\/admin\/users\/([^/]+)\/role$/, handler: (m, _method, body) => {
    return { success: true, user: { uid: m[1], role: body?.role || "student" } };
  }},
  { pattern: /^\/api\/admin\/users\/([^/]+)$/, handler: () => ({ success: true })},
  { pattern: /^\/api\/admin\/videos\/([^/]+)\/edit$/, handler: () => ({ success: true })},
  { pattern: /^\/api\/admin\/videos\/([^/]+)$/, handler: () => ({ success: true })},
  { pattern: /^\/api\/admin\/system\/settings$/, handler: () => ({
    aiTranscriptEnabled: true, publicCommentsEnabled: true, maintenanceMode: false, categories: ["Biology", "Physics", "Mathematics", "Computer Science", "Chemistry"]
  })},
  { pattern: /^\/api\/admin\/system\/reseed$/, handler: () => ({ success: true })},
];

export const isDemoMode = { active: false };

export function installMockFetch() {
  isDemoMode.active = true;
  const originalFetch = window.fetch;

  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;

    if (!url.startsWith("/api/")) {
      return originalFetch.call(window, input, init);
    }

    const method = (init?.method || "GET").toUpperCase();
    let body: any = undefined;
    if (init?.body && typeof init.body === "string") {
      try { body = JSON.parse(init.body); } catch { body = undefined; }
    }

    for (const route of routes) {
      const match = url.split("?")[0].match(route.pattern);
      if (match) {
        const data = route.handler(match, method, body);
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    return new Response(JSON.stringify({ error: "Not found (demo mode)" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  };
}
