import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiBell, FiUsers, FiMessageCircle, FiDollarSign, FiSearch,
  FiEdit, FiEye, FiPlus, FiTrash2, FiCheck, FiChevronRight,
  FiBriefcase, FiActivity, FiShield, FiX, FiToggleLeft,
  FiToggleRight, FiAlertTriangle, FiStar, FiTrendingUp,
  FiGrid, FiList, FiLock, FiUnlock, FiSend, FiCheckCircle,
  FiSlash, FiAward, FiHome, FiLogOut, FiSettings, FiImage,
  FiRefreshCw, FiFlag,
} from "react-icons/fi";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);
/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const ls  = (key, fb = []) => { try { return JSON.parse(localStorage.getItem(key)) ?? fb; } catch { return fb; } };
const lsSet = (key, val) => localStorage.setItem(key, JSON.stringify(val));
const broadcast = (userId, message) => {
  const notifs = ls("notifications", []);
  notifs.unshift({ id: Date.now(), userId, message, date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: false });
  lsSet("notifications", notifs);
  window.dispatchEvent(new Event("storage"));
};

const TABS = ["Overview", "Gigs", "Users", "Applications", "Post Gig", "Reports", "Settings"];

const CATEGORIES = ["design", "web", "writing", "video", "marketing", "security", "audio", "other"];
/* ─────────────────────────────────────────────
   ADMIN COMPONENT
───────────────────────────────────────────── */
const Admin = () => {
  const { user, logout, isAdmin, loading } = useAuth();   // ← Added isAdmin & loading
  const navigate = useNavigate();

  // ── IMPROVED Auth guard ──
  useEffect(() => {
    if (loading) return;                    // Wait until auth is loaded

    if (!user) {
      navigate("/login");
      return;
    }

    if (!isAdmin) {                         // Use isAdmin from context
      // Optional: toast$("Access Denied: Admin only", "error");
      navigate("/dashboard");
    }
  }, [user, isAdmin, loading, navigate]);

  // ── State ──
const [tab, setTab]                   = useState("Overview");
  const [gigs, setGigs]                 = useState([]);
  const [users, setUsers]               = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch]             = useState("");
  const [gigFilter, setGigFilter]       = useState("all");
  const [userFilter, setUserFilter]     = useState("all");
  const [viewMode, setViewMode]         = useState("grid");
  const [selectedGig, setSelectedGig]   = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [toast, setToast]               = useState(null);
  const [confirm, setConfirm]           = useState(null);
  const [mobileMenu, setMobileMenu]     = useState(false);

  // Post Gig form
  const [gigForm, setGigForm] = useState({
    title: "", description: "", price: "", category: "web",
    owner: user?.name || "", 
    ownerAvatar: user?.profile?.avatar || "",
    image: "", featured: false,
  });
  const [gigImagePreview, setGigImagePreview] = useState("");
  const [postingGig, setPostingGig] = useState(false);
  const [aiInput, setAiInput] = useState("");

  // ── Load data ──
const loadAll = () => {
    if (!user) return;
    const storedGigs  = ls("gigs", []);
    const storedApps  = ls("applications", []);
    const storedUsers = ls("users", []);
    setGigs(storedGigs);
    setApplications(storedApps);
    const appUsers = storedApps.map(a => ({
      id: a.applicantId, 
      name: a.applicantName || "Unknown",
      email: a.applicantEmail || "—", 
      role: "user", 
      status: "active",
    }));
    const merged = [...storedUsers];
    appUsers.forEach(u => { 
      if (!merged.find(x => x.id === u.id)) merged.push(u); 
    });
    setUsers(merged);
  };

  useEffect(() => { 
    loadAll(); 
    window.addEventListener("storage", loadAll); 
    return () => window.removeEventListener("storage", loadAll); 
  }, [user]);

  // ── Toast ──
  const toast$ = (msg, type = "success") => { 
    setToast({ msg, type }); 
    setTimeout(() => setToast(null), 3200); 
  };

  // ── Confirm modal ──
  const confirm$ = (message, onOk) => setConfirm({ message, onOk });

  // ══════════════════════════════
  //  GIG ACTIONS
  // ══════════════════════════════
  const approveGig = (id) => {
    const updated = gigs.map(g => g.id === id ? { ...g, status: "approved" } : g);
    lsSet("gigs", updated); setGigs(updated);
    const gig = gigs.find(g => g.id === id);
    broadcast(user.id, `✅ Gig "${gig?.title}" approved and is now live on the platform.`);
    window.dispatchEvent(new Event("storage"));
    toast$("Gig approved ✓");
  };

  const rejectGig = (id) => {
    confirm$("Reject and remove this gig from the platform?", () => {
      const gig = gigs.find(g => g.id === id);
      const updated = gigs.filter(g => g.id !== id);
      lsSet("gigs", updated); setGigs(updated);
      broadcast(user.id, `❌ Gig "${gig?.title}" rejected and removed.`);
      window.dispatchEvent(new Event("storage"));
      toast$("Gig rejected", "error");
      setConfirm(null);
    });
  };

  const featureGig = (id) => {
    const updated = gigs.map(g => g.id === id ? { ...g, featured: !g.featured } : g);
    lsSet("gigs", updated); setGigs(updated);
    window.dispatchEvent(new Event("storage"));
    const gig = updated.find(g => g.id === id);
    toast$(gig.featured ? "⭐ Gig featured — visible on home page!" : "Feature removed");
  };

  const deleteGig = (id) => {
    confirm$("Permanently delete this gig? This cannot be undone.", () => {
      const gig = gigs.find(g => g.id === id);
      const updated = gigs.filter(g => g.id !== id);
      lsSet("gigs", updated); setGigs(updated);
      broadcast(user.id, `🗑 Asset "${gig?.title}" permanently deleted.`);
      window.dispatchEvent(new Event("storage"));
      toast$("Gig deleted", "error");
      setConfirm(null); setSelectedGig(null);
    });
  };
  

  // ══════════════════════════════
  //  USER ACTIONS
  // ══════════════════════════════
  const banUser = (id) => {
    confirm$("Ban this user? They will lose access to the platform.", () => {
      const updated = users.map(u => u.id === id ? { ...u, status: u.status === "banned" ? "active" : "banned" } : u);
      lsSet("users", updated); setUsers(updated);
      const u = updated.find(x => x.id === id);
      broadcast(user.id, `🚫 User "${u?.name}" ${u?.status === "banned" ? "banned" : "unbanned"}.`);
      toast$(u?.status === "banned" ? "User banned" : "User unbanned", u?.status === "banned" ? "error" : "success");
      setConfirm(null);
    });
  };

  const promoteUser = (id) => {
    const updated = users.map(u => u.id === id ? { ...u, role: u.role === "admin" ? "user" : "admin" } : u);
    lsSet("users", updated); setUsers(updated);
    const u = updated.find(x => x.id === id);
    toast$(`${u?.name} is now ${u?.role}`);
  };

  // ══════════════════════════════
  //  APPLICATION ACTIONS
  // ══════════════════════════════
  const updateApp = (id, status) => {
    const updated = applications.map(a => a.id === id ? { ...a, status } : a);
    lsSet("applications", updated); setApplications(updated);
    const app = applications.find(a => a.id === id);
    // Notify the applicant
    const notifs = ls("notifications", []);
    notifs.unshift({
      id: Date.now(), userId: app?.applicantId,
      message: `Your application for "${app?.gigTitle}" has been ${status}.`,
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: false,
    });
    lsSet("notifications", notifs);
    window.dispatchEvent(new Event("storage"));
    toast$(`Application ${status}`);
  };

  // ══════════════════════════════
  //  BROADCAST
  // ══════════════════════════════
  const sendBroadcast = () => {
    if (!broadcastMsg.trim()) return;
    const allUsers = ls("users", []);
    const notifs = ls("notifications", []);
    allUsers.forEach(u => {
      notifs.unshift({
        id: Date.now() + Math.random(), userId: u.id,
        message: `📢 Admin: ${broadcastMsg}`,
        date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: false,
      });
    });
    lsSet("notifications", notifs);
    window.dispatchEvent(new Event("storage"));
    setBroadcastMsg(""); setShowBroadcast(false);
    toast$("Broadcast sent to all users ✓");
  };

  // ══════════════════════════════
  //  POST GIG (ADMIN CREATE)
  // ══════════════════════════════
  const handleGigImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setGigForm(f => ({ ...f, image: reader.result }));
      setGigImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const generateWithAI = () => {
    if (!aiInput.trim()) return;
    const skill = aiInput.toLowerCase();
    const catMap = { logo: "design", brand: "design", web: "web", app: "web", react: "web", site: "web", blog: "writing", content: "writing", article: "writing", video: "video", edit: "video", market: "marketing", seo: "marketing" };
    const cat = Object.keys(catMap).find(k => skill.includes(k)) ? catMap[Object.keys(catMap).find(k => skill.includes(k))] : "other";
    const priceMap = { design: 5500, web: 12000, writing: 3500, video: 15000, marketing: 7500 };
    setGigForm(f => ({
      ...f,
      title: `Professional ${aiInput} Service`,
      description: `High-quality ${aiInput} delivered with precision and speed. Includes revisions, full source files, and dedicated support throughout the project.`,
      price: String(priceMap[cat] || 8000),
      category: cat,
    }));
    toast$("AI generated gig details ✓");
  };

  const submitGig = () => {
    if (!gigForm.title || !gigForm.description || !gigForm.price) {
      toast$("Please fill all required fields", "error"); return;
    }
    setPostingGig(true);
    setTimeout(() => {
      const existing = ls("gigs", []);
      const newGig = {
        id: Date.now(),
        title: gigForm.title,
        description: gigForm.description,
        price: Number(gigForm.price),
        category: gigForm.category,
        owner: gigForm.owner || user?.name,
        ownerAvatar: gigForm.ownerAvatar || user?.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`,
        ownerId: user?.id,
        image: gigForm.image || "",
        featured: gigForm.featured,
        status: "approved",   // Admin gigs are auto-approved & immediately live
        views: 0,
        rating: 5.0,
        createdAt: new Date().toISOString(),
      };
      const updated = [newGig, ...existing];
      lsSet("gigs", updated);
      setGigs(updated);
      window.dispatchEvent(new Event("storage")); // trigger home page refresh
      broadcast(user.id, `✅ New gig "${newGig.title}" published live on the platform.`);
      setGigForm({ title: "", description: "", price: "", category: "web", owner: user?.name || "", ownerAvatar: "", image: "", featured: false });
      setGigImagePreview("");
      setAiInput("");
      setPostingGig(false);
      toast$("🚀 Gig published live on home page!");
      setTab("Gigs");
    }, 800);
  };

  // ══════════════════════════════
  //  SETTINGS TOGGLES
  // ══════════════════════════════
  const SETTINGS = [
    { label: "Allow New Registrations",  key: "allowRegistrations", def: true },
    { label: "Enable Gig Auto-Approval", key: "autoApprove",        def: false },
    { label: "Maintenance Mode",         key: "maintenance",        def: false },
    { label: "Show Featured Gigs First", key: "featuredFirst",      def: true },
    { label: "Enable Chat System",       key: "chatEnabled",        def: true },
    { label: "Show Live Activity Badge", key: "liveActivity",       def: true },
  ];

  // ══════════════════════════════
  //  FILTERED DATA
  // ══════════════════════════════
  const fGigs = gigs
    .filter(g => (g.title || "").toLowerCase().includes(search.toLowerCase()) || (g.category || "").toLowerCase().includes(search.toLowerCase()))
    .filter(g => gigFilter === "all" ? true : gigFilter === "featured" ? g.featured : (g.status || "pending") === gigFilter);

  const fUsers = users
    .filter(u => (u.name || "").toLowerCase().includes(search.toLowerCase()) || (u.email || "").toLowerCase().includes(search.toLowerCase()))
    .filter(u => userFilter === "all" ? true : userFilter === "admin" ? u.role === "admin" : (u.status || "active") === userFilter);

  const fApps = applications.filter(a => (a.gigTitle || "").toLowerCase().includes(search.toLowerCase()));

  // ══════════════════════════════
  //  STATS
  // ══════════════════════════════
  const totalRevenue = gigs.reduce((s, g) => s + (Number(g.price) || 0), 0);
  const pendingCount = gigs.filter(g => !g.status || g.status === "pending").length;
  const approvedCount = gigs.filter(g => g.status === "approved").length;
  const bannedCount = users.filter(u => u.status === "banned").length;
  const activeUsersCount = users.filter(u => u.status !== "banned").length;

  // ══════════════════════════════
  //  CHARTS
  // ══════════════════════════════
  const baseOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };
  const lineOpts = { ...baseOpts, scales: { y: { display: false }, x: { grid: { display: false }, ticks: { color: "#52525b", font: { size: 10 } } } } };
  const dOpts = { ...baseOpts, cutout: "75%" };

  const revChart = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ fill: true, data: [12000, 28000, 45000, 31000, 68000, 82000, Math.max(totalRevenue, 95000)], borderColor: "#A855F7", backgroundColor: "rgba(168,85,247,0.06)", borderWidth: 3, tension: 0.4 }],
  };

  const catChart = (() => {
    const cats = {};
    gigs.forEach(g => { const c = g.category || "other"; cats[c] = (cats[c] || 0) + 1; });
    return { labels: Object.keys(cats), datasets: [{ data: Object.values(cats), backgroundColor: ["#A855F7","#6366f1","#ec4899","#f59e0b","#10b981","#06b6d4","#f97316","#8b5cf6"], borderWidth: 0 }] };
  })();

  const appChart = {
    labels: ["Pending", "Accepted", "Rejected"],
    datasets: [{ data: [
      applications.filter(a => !a.status || a.status === "pending" || a.status === "Pending").length,
      applications.filter(a => a.status === "Accepted" || a.status === "accepted").length,
      applications.filter(a => a.status === "Rejected" || a.status === "rejected").length,
    ], backgroundColor: ["#f59e0b","#10b981","#ef4444"], borderWidth: 0 }],
  };

  // ══════════════════════════════
  //  RENDER
  // ══════════════════════════════
  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-zinc-400">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans">

      {/* Ambient BG */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-purple-600/[0.08] blur-[160px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/[0.08] blur-[130px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-fuchsia-600/[0.05] blur-[120px] rounded-full" />
      </div>

      {/* ── TOP HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center">
              <FiShield className="text-white text-sm" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-white hidden sm:block">Admin <span className="text-zinc-600">/ Control</span></span>
          </div>

          {/* Desktop Tabs */}
          <nav className="hidden xl:flex items-center gap-1 bg-zinc-900/40 p-1 rounded-2xl border border-white/5 flex-shrink-0">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  tab === t ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
                }`}
              >
                {t}
                {t === "Gigs" && pendingCount > 0 && <span className="ml-1 bg-amber-500 text-black text-[8px] px-1.5 py-0.5 rounded-full">{pendingCount}</span>}
              </button>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {pendingCount > 0 && (
              <button onClick={() => { setTab("Gigs"); setGigFilter("pending"); }}
                className="hidden sm:flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-[10px] font-black hover:bg-amber-500/20 transition-all">
                <FiAlertTriangle className="text-xs" /> {pendingCount} PENDING
              </button>
            )}
            <button onClick={() => setShowBroadcast(true)}
              className="p-2.5 bg-zinc-900/60 border border-white/5 rounded-xl text-zinc-400 hover:text-purple-400 transition-all">
              <FiSend className="text-sm" />
            </button>
            <button onClick={() => navigate("/")}
              className="p-2.5 bg-zinc-900/60 border border-white/5 rounded-xl text-zinc-400 hover:text-emerald-400 transition-all" title="View Home Page">
              <FiHome className="text-sm" />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-zinc-900/40 border border-white/5 rounded-2xl">
              <img src={user?.profile?.avatar || user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                className="w-6 h-6 rounded-full ring-2 ring-purple-500/30" alt="" />
              <span className="text-xs font-black text-zinc-400 hidden md:block">{user?.name || "Admin"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <button onClick={() => { logout(); navigate("/login"); }}
              className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-all" title="Logout">
              <FiLogOut className="text-sm" />
            </button>
            {/* Mobile menu toggle */}
            <button onClick={() => setMobileMenu(!mobileMenu)} className="xl:hidden p-2.5 bg-zinc-900/60 border border-white/5 rounded-xl text-zinc-400">
              <FiGrid className="text-sm" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Menu */}
        {mobileMenu && (
          <div className="xl:hidden border-t border-white/5 bg-[#050505]/95 px-4 py-3 grid grid-cols-4 gap-2">
            {TABS.map(t => (
              <button key={t} onClick={() => { setTab(t); setMobileMenu(false); }}
                className={`px-2 py-2 rounded-xl text-[9px] font-black uppercase tracking-wide transition-all text-center ${
                  tab === t ? "bg-purple-600 text-white" : "text-zinc-500 bg-zinc-900/40 border border-white/5"
                }`}
              >{t}</button>
            ))}
          </div>
        )}
      </header>

      {/* ── MAIN ── */}
      <main className="max-w-[1600px] mx-auto px-4 lg:px-6 pt-24 pb-20 relative z-10">

        {/* Page Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Root Access · Admin Terminal</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none bg-gradient-to-b from-white via-white to-zinc-600 bg-clip-text text-transparent">
              {tab.toUpperCase()}<br /><span className="text-zinc-800">CONTROL</span>
            </h1>
          </div>
          <div className="relative w-full lg:w-80">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm" />
            <input type="text" placeholder={`Search ${tab.toLowerCase()}…`}
              className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl py-3 pl-11 pr-5 text-sm outline-none focus:border-purple-500/50 transition-all placeholder:text-zinc-600"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* ══════════════════════
            OVERVIEW
        ══════════════════════ */}
        {tab === "Overview" && (
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-12 gap-4">
              <div className="col-span-2 md:col-span-5 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-[1px] rounded-[2rem]">
                <div className="bg-[#09090b] h-full rounded-[1.9rem] p-6 flex flex-col justify-between min-h-[160px]">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Platform Revenue</p>
                      <h2 className="text-4xl font-black text-white tracking-tighter">₦{totalRevenue.toLocaleString()}</h2>
                    </div>
                    <FiDollarSign className="text-2xl text-white/20" />
                  </div>
                  <div className="mt-4 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${Math.min((totalRevenue / 500000) * 100, 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-1 font-bold uppercase">Target: ₦500,000</p>
                </div>
              </div>

              {[
                { icon: <FiUsers className="text-blue-400" />, label: "Total Users", val: users.length, sub: `${activeUsersCount} active` },
                { icon: <FiBriefcase className="text-purple-400" />, label: "Total Gigs", val: gigs.length, sub: `${pendingCount} pending` },
                { icon: <FiActivity className="text-fuchsia-400" />, label: "Applications", val: applications.length, sub: `${applications.filter(a=>a.status==="Accepted"||a.status==="accepted").length} accepted` },
                { icon: <FiStar className="text-yellow-400" />, label: "Featured Gigs", val: gigs.filter(g=>g.featured).length, sub: "on home page" },
              ].map((s, i) => (
                <div key={i} className="md:col-span-2 bg-zinc-900/20 border border-white/5 p-5 rounded-[2rem]">
                  <div className="text-xl mb-4">{s.icon}</div>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">{s.label}</p>
                  <h2 className="text-3xl font-black mt-1 tracking-tighter">{s.val}</h2>
                  <p className="text-[10px] text-emerald-500 mt-1 font-bold">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 bg-zinc-900/10 border border-white/5 p-6 rounded-[2rem]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-base tracking-tight">Revenue Trajectory</h3>
                  <span className="text-[10px] font-bold text-zinc-600 uppercase">7 Day View</span>
                </div>
                <div className="h-[220px]"><Line data={revChart} options={lineOpts} /></div>
              </div>
              <div className="bg-zinc-900/10 border border-white/5 p-6 rounded-[2rem]">
                <h3 className="font-black text-base tracking-tight mb-5">Gig Categories</h3>
                {gigs.length > 0 ? (
                  <div className="h-[180px] flex items-center justify-center"><Doughnut data={catChart} options={dOpts} /></div>
                ) : (
                  <div className="h-[180px] flex items-center justify-center text-zinc-700 text-xs font-bold uppercase">No gigs yet</div>
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-5">
              <div className="bg-zinc-900/10 border border-white/5 p-6 rounded-[2rem]">
                <h3 className="font-black text-base tracking-tight mb-5">Applications</h3>
                <div className="h-[160px] flex items-center justify-center"><Doughnut data={appChart} options={dOpts} /></div>
                <div className="flex gap-4 justify-center mt-3">
                  {["Pending","Accepted","Rejected"].map((s,i) => (
                    <div key={s} className="text-center">
                      <div className="text-[9px] font-bold text-zinc-500 uppercase">{s}</div>
                      <div className="text-lg font-black">{appChart.datasets[0].data[i]}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="lg:col-span-2 bg-zinc-900/10 border border-white/5 p-6 rounded-[2rem]">
                <h3 className="font-black text-base tracking-tight mb-5">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Review Pending",    icon: <FiAlertTriangle/>, color: "text-amber-400 bg-amber-500/10 border-amber-500/20", action: () => { setTab("Gigs"); setGigFilter("pending"); } },
                    { label: "Post New Gig",      icon: <FiPlus/>,          color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/40", action: () => setTab("Post Gig") },
                    { label: "Manage Users",      icon: <FiUsers/>,         color: "text-blue-400 bg-blue-500/10 border-blue-500/20", action: () => setTab("Users") },
                    { label: "Applications",      icon: <FiActivity/>,      color: "text-purple-400 bg-purple-500/10 border-purple-500/20", action: () => setTab("Applications") },
                    { label: "Broadcast",         icon: <FiSend/>,          color: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20", action: () => setShowBroadcast(true) },
                    { label: "View Home Page",    icon: <FiHome/>,          color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20", action: () => navigate("/") },
                  ].map((q,i) => (
                    <button key={i} onClick={q.action}
                      className={`flex items-center gap-2 p-4 rounded-2xl border ${q.color} text-left hover:scale-[1.02] transition-all`}>
                      <span className="text-lg">{q.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-wide leading-tight">{q.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════
            GIGS
        ══════════════════════ */}
        {tab === "Gigs" && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              {["all","pending","approved","featured"].map(f => (
                <button key={f} onClick={() => setGigFilter(f)}
                  className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                    gigFilter === f ? "bg-purple-600 border-purple-600 text-white" : "bg-zinc-900/40 border-white/5 text-zinc-500 hover:text-zinc-200"
                  }`}>
                  {f}
                  {f === "pending" && pendingCount > 0 && <span className="ml-1 bg-amber-500 text-black text-[8px] px-1.5 py-0.5 rounded-full">{pendingCount}</span>}
                </button>
              ))}
              <button onClick={() => setTab("Post Gig")}
                className="ml-auto px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-emerald-500/30 transition-all flex items-center gap-2">
                <FiPlus /> Post Gig
              </button>
              <div className="flex gap-2">
                <button onClick={() => setViewMode("grid")} className={`p-2.5 rounded-xl border ${viewMode==="grid"?"bg-purple-600 border-purple-600 text-white":"bg-zinc-900/40 border-white/5 text-zinc-500"}`}><FiGrid /></button>
                <button onClick={() => setViewMode("list")} className={`p-2.5 rounded-xl border ${viewMode==="list"?"bg-purple-600 border-purple-600 text-white":"bg-zinc-900/40 border-white/5 text-zinc-500"}`}><FiList /></button>
              </div>
            </div>

            {fGigs.length === 0 && <div className="text-center py-20 text-zinc-700 font-bold uppercase text-xs tracking-widest">No gigs found.</div>}

            {viewMode === "grid" ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {fGigs.map(gig => (
                  <GigCard key={gig.id} gig={gig}
                    onApprove={() => approveGig(gig.id)}
                    onReject={() => rejectGig(gig.id)}
                    onFeature={() => featureGig(gig.id)}
                    onDelete={() => deleteGig(gig.id)}
                    onView={() => setSelectedGig(gig)} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {fGigs.map(gig => (
                  <GigRow key={gig.id} gig={gig}
                    onApprove={() => approveGig(gig.id)}
                    onReject={() => rejectGig(gig.id)}
                    onFeature={() => featureGig(gig.id)}
                    onDelete={() => deleteGig(gig.id)}
                    onView={() => setSelectedGig(gig)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════
            USERS
        ══════════════════════ */}
        {tab === "Users" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {["all","active","banned","admin"].map(f => (
                <button key={f} onClick={() => setUserFilter(f)}
                  className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                    userFilter === f ? "bg-purple-600 border-purple-600 text-white" : "bg-zinc-900/40 border-white/5 text-zinc-500 hover:text-zinc-200"
                  }`}>{f}</button>
              ))}
            </div>
            {fUsers.length === 0 && <div className="text-center py-20 text-zinc-700 font-bold uppercase text-xs tracking-widest">No users found.</div>}
            <div className="space-y-3">
              {fUsers.map(u => (
                <div key={u.id} className="flex items-center gap-4 p-5 bg-zinc-900/20 border border-white/5 rounded-[2rem] hover:border-purple-500/20 transition-all group">
                  <img src={u.profile?.avatar || u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                    className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white/5 flex-shrink-0" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-black text-sm tracking-tight">{u.name || "Unknown"}</p>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                        u.role === "admin" || u.role === "Admin" ? "bg-purple-500/10 border-purple-500/30 text-purple-400" : "bg-zinc-900 border-white/5 text-zinc-500"
                      }`}>{u.role || "user"}</span>
                      {u.status === "banned" && <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-red-500/10 border border-red-500/30 text-red-400">BANNED</span>}
                    </div>
                    <p className="text-xs text-zinc-600 mt-0.5">{u.email || "No email"}</p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => promoteUser(u.id)}
                      className={`p-2.5 rounded-xl border transition-all text-sm ${u.role==="admin"||u.role==="Admin" ? "bg-zinc-950 border-white/5 text-zinc-400 hover:text-amber-400" : "bg-zinc-950 border-white/5 text-zinc-400 hover:text-purple-400"}`}
                      title={u.role==="admin"||u.role==="Admin" ? "Demote" : "Promote to Admin"}>
                      <FiAward />
                    </button>
                    <button onClick={() => banUser(u.id)}
                      className={`p-2.5 rounded-xl border transition-all text-sm ${u.status==="banned" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-zinc-950 border-white/5 text-zinc-400 hover:text-red-400"}`}>
                      {u.status==="banned" ? <FiUnlock /> : <FiLock />}
                    </button>
                    <button onClick={() => setSelectedUser(u)}
                      className="p-2.5 bg-zinc-950 rounded-xl border border-white/5 text-zinc-400 hover:text-blue-400 transition-all text-sm">
                      <FiEye />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════
            APPLICATIONS
        ══════════════════════ */}
        {tab === "Applications" && (
          <div className="space-y-3">
            {fApps.length === 0 && <div className="text-center py-20 text-zinc-700 font-bold uppercase text-xs tracking-widest">No applications yet.</div>}
            {fApps.map(app => (
              <div key={app.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-zinc-900/20 border border-white/5 rounded-[2rem] hover:border-purple-500/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center font-black text-zinc-600 text-xs flex-shrink-0">
                  #{String(app.gigId||"000").slice(-3)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm tracking-tight">{app.gigTitle || "Untitled Gig"}</p>
                  <p className="text-xs text-zinc-600 mt-0.5">by {app.applicantName || "Anonymous"}</p>
                  {app.message && <p className="text-xs text-zinc-500 mt-1 italic line-clamp-1">"{app.message}"</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border ${
                    app.status==="Accepted"||app.status==="accepted" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                    app.status==="Rejected"||app.status==="rejected" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                    "bg-amber-500/10 border-amber-500/20 text-amber-400"
                  }`}>{app.status || "Pending"}</span>
                  {(!app.status || app.status==="pending" || app.status==="Pending") && (
                    <>
                      <button onClick={() => updateApp(app.id, "Accepted")}
                        className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 hover:bg-emerald-500/20 transition-all">
                        <FiCheck />
                      </button>
                      <button onClick={() => updateApp(app.id, "Rejected")}
                        className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-all">
                        <FiX />
                      </button>
                    </>
                  )}
                  <Link to={`/gig/${app.gigId}`}
                    className="w-9 h-9 rounded-full border border-white/5 flex items-center justify-center text-zinc-500 hover:bg-white hover:text-black transition-all">
                    <FiChevronRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══════════════════════
            POST GIG
        ══════════════════════ */}
        {tab === "Post Gig" && (
          <div className="max-w-3xl space-y-6">
            <div className="bg-zinc-900/20 border border-white/5 p-6 rounded-[2rem]">
              <h3 className="font-black text-base tracking-tight mb-1">AI Gig Generator</h3>
              <p className="text-xs text-zinc-500 mb-5">Enter a skill or service and AI will auto-fill the form</p>
              <div className="flex gap-3">
                <input type="text" placeholder="e.g. logo design, web development, video editing…"
                  className="flex-1 bg-zinc-950/60 border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:border-purple-500/50 transition-all placeholder:text-zinc-700"
                  value={aiInput} onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && generateWithAI()} />
                <button onClick={generateWithAI}
                  className="px-5 py-3 bg-purple-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-purple-500 transition-all flex items-center gap-2">
                  <FiRefreshCw className="text-xs" /> Generate
                </button>
              </div>
            </div>

            <div className="bg-zinc-900/20 border border-white/5 p-6 rounded-[2rem] space-y-5">
              <h3 className="font-black text-base tracking-tight">Gig Details</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Title *</label>
                  <input type="text" placeholder="Professional service title…"
                    className="w-full bg-zinc-950/60 border border-white/10 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-purple-500/50 transition-all placeholder:text-zinc-700"
                    value={gigForm.title} onChange={e => setGigForm(f => ({ ...f, title: e.target.value }))} />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Description *</label>
                  <textarea rows={4} placeholder="Describe the service in detail…"
                    className="w-full bg-zinc-950/60 border border-white/10 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-purple-500/50 transition-all resize-none placeholder:text-zinc-700"
                    value={gigForm.description} onChange={e => setGigForm(f => ({ ...f, description: e.target.value }))} />
                </div>

                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Price (₦) *</label>
                  <input type="number" placeholder="0"
                    className="w-full bg-zinc-950/60 border border-white/10 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-purple-500/50 transition-all placeholder:text-zinc-700"
                    value={gigForm.price} onChange={e => setGigForm(f => ({ ...f, price: e.target.value }))} />
                </div>

                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Category</label>
                  <select className="w-full bg-zinc-950/60 border border-white/10 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-purple-500/50 transition-all appearance-none"
                    value={gigForm.category} onChange={e => setGigForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-zinc-900">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Owner Name</label>
                  <input type="text"
                    className="w-full bg-zinc-950/60 border border-white/10 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-purple-500/50 transition-all"
                    value={gigForm.owner} onChange={e => setGigForm(f => ({ ...f, owner: e.target.value }))} />
                </div>

                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Feature on Home Page</label>
                  <button onClick={() => setGigForm(f => ({ ...f, featured: !f.featured }))}
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border text-sm font-black transition-all w-full ${
                      gigForm.featured ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" : "bg-zinc-950/60 border-white/10 text-zinc-500"
                    }`}>
                    <FiStar /> {gigForm.featured ? "Featured ★ (will show on home)" : "Not Featured"}
                  </button>
                </div>
              </div>

              {/* Image upload */}
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Gig Image</label>
                <div className="flex items-center gap-4">
                  {gigImagePreview && (
                    <img src={gigImagePreview} alt="preview" className="w-20 h-20 rounded-2xl object-cover ring-2 ring-white/10 flex-shrink-0" />
                  )}
                  <label className="flex-1 flex items-center gap-3 px-5 py-4 bg-zinc-950/60 border border-white/10 border-dashed rounded-2xl cursor-pointer hover:border-purple-500/40 transition-all">
                    <FiImage className="text-zinc-600 text-xl" />
                    <div>
                      <p className="text-sm font-bold text-zinc-400">Upload image</p>
                      <p className="text-xs text-zinc-600">PNG, JPG, WebP</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleGigImageUpload} />
                  </label>
                </div>
              </div>

              <button onClick={submitGig} disabled={postingGig}
                className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                {postingGig ? <><FiRefreshCw className="animate-spin" /> Publishing…</> : <><FiPlus /> Publish Gig Live on Platform</>}
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════
            REPORTS
        ══════════════════════ */}
        {tab === "Reports" && (
          <div className="space-y-5">
            <div className="grid lg:grid-cols-2 gap-5">
              <div className="bg-zinc-900/10 border border-white/5 p-6 rounded-[2rem]">
                <h3 className="font-black text-base tracking-tight mb-5">Weekly Gig Activity</h3>
                <div className="h-[260px]">
                  <Bar data={{ labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], datasets:[{ data:[2,5,3,8,6,10,gigs.length||4], backgroundColor:"rgba(168,85,247,0.4)", borderColor:"#A855F7", borderWidth:2, borderRadius:8 }] }}
                    options={{ ...baseOpts, scales:{ y:{display:false}, x:{grid:{display:false}, ticks:{color:"#52525b"}} } }} />
                </div>
              </div>
              <div className="bg-zinc-900/10 border border-white/5 p-6 rounded-[2rem]">
                <h3 className="font-black text-base tracking-tight mb-5">Revenue Overview</h3>
                <div className="h-[260px]"><Line data={revChart} options={lineOpts} /></div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label:"Approval Rate", value: gigs.length ? `${Math.round((approvedCount/gigs.length)*100)}%` : "0%", icon:<FiCheckCircle/>, color:"text-emerald-400" },
                { label:"Avg Gig Price", value: gigs.length ? `₦${Math.round(totalRevenue/gigs.length).toLocaleString()}` : "₦0", icon:<FiDollarSign/>, color:"text-purple-400" },
                { label:"Banned Users",  value: bannedCount,   icon:<FiSlash/>,  color:"text-red-400" },
                { label:"Featured Gigs", value: gigs.filter(g=>g.featured).length, icon:<FiStar/>, color:"text-yellow-400" },
              ].map((s,i) => (
                <div key={i} className="bg-zinc-900/20 border border-white/5 p-5 rounded-[2rem]">
                  <span className={`text-2xl ${s.color}`}>{s.icon}</span>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-4">{s.label}</p>
                  <h3 className="text-3xl font-black mt-1 tracking-tighter">{s.value}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════
            SETTINGS
        ══════════════════════ */}
        {tab === "Settings" && (
          <div className="max-w-2xl space-y-5">
            <div className="bg-zinc-900/20 border border-white/5 p-6 rounded-[2rem] space-y-2">
              <h3 className="font-black text-base tracking-tight mb-4">Platform Controls</h3>
              {SETTINGS.map(s => {
                const val = ls(`setting_${s.key}`, [s.def])[0] ?? s.def;
                return (
                  <div key={s.key} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                    <div>
                      <p className="font-black text-sm">{s.label}</p>
                      <p className="text-[10px] text-zinc-600 mt-0.5 uppercase font-bold">{val ? "Enabled" : "Disabled"}</p>
                    </div>
                    <button onClick={() => { lsSet(`setting_${s.key}`, [!val]); toast$(`${s.label} ${!val?"enabled":"disabled"}`); window.dispatchEvent(new Event("storage")); }}
                      className={`text-3xl transition-all ${val ? "text-purple-500" : "text-zinc-700"}`}>
                      {val ? <FiToggleRight /> : <FiToggleLeft />}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="bg-zinc-900/20 border border-white/5 p-6 rounded-[2rem] space-y-4">
              <h3 className="font-black text-base tracking-tight text-red-400">Danger Zone</h3>
              <button onClick={() => confirm$("Clear ALL gigs? This cannot be undone.", () => {
                  lsSet("gigs", []); setGigs([]);
                  window.dispatchEvent(new Event("storage"));
                  broadcast(user.id, "All gigs purged by admin.");
                  toast$("All gigs cleared", "error"); setConfirm(null);
                })}
                className="w-full py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center justify-center gap-2">
                <FiTrash2 /> Clear All Gigs
              </button>
              <button onClick={() => confirm$("Clear ALL applications?", () => {
                  lsSet("applications", []); setApplications([]);
                  toast$("Applications cleared", "error"); setConfirm(null);
                })}
                className="w-full py-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-400 text-[10px] font-black uppercase tracking-widest hover:bg-orange-500/20 transition-all flex items-center justify-center gap-2">
                <FiTrash2 /> Clear All Applications
              </button>
              <button onClick={() => confirm$("Clear ALL notifications?", () => {
                  lsSet("notifications", []);
                  toast$("Notifications cleared"); setConfirm(null);
                })}
                className="w-full py-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2">
                <FiBell /> Clear All Notifications
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ════════════════════════
          GIG DETAIL MODAL
      ════════════════════════ */}
      {selectedGig && (
        <Modal onClose={() => setSelectedGig(null)} title="Gig Detail">
          <div className="space-y-5">
            {selectedGig.image && <img src={selectedGig.image} alt="" className="w-full h-48 object-cover rounded-2xl" />}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-zinc-950 border border-white/5 rounded-full text-[9px] font-black uppercase text-zinc-400">{selectedGig.category||"General"}</span>
              {selectedGig.status==="approved" && <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase text-emerald-400">Live ✓</span>}
              {selectedGig.featured && <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[9px] font-black uppercase text-yellow-400">Featured ★</span>}
            </div>
            <h2 className="text-2xl font-black tracking-tighter">{selectedGig.title}</h2>
            <p className="text-zinc-500 text-sm leading-relaxed">{selectedGig.description}</p>
            <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-2xl border border-white/5">
              <div><p className="text-zinc-600 text-[10px] font-bold uppercase mb-1">Price</p><p className="text-2xl font-black">₦{Number(selectedGig.price).toLocaleString()}</p></div>
              <div><p className="text-zinc-600 text-[10px] font-bold uppercase mb-1">Owner</p><p className="font-black text-sm">{selectedGig.owner||"Unknown"}</p></div>
              <div><p className="text-zinc-600 text-[10px] font-bold uppercase mb-1">Views</p><p className="font-black">{selectedGig.views||0}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(!selectedGig.status || selectedGig.status==="pending") && (
                <button onClick={() => { approveGig(selectedGig.id); setSelectedGig(p => ({...p, status:"approved"})); }}
                  className="py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-[10px] font-black uppercase hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2">
                  <FiCheck /> Approve & Publish
                </button>
              )}
              <button onClick={() => featureGig(selectedGig.id)}
                className={`py-3 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 border ${
                  selectedGig.featured ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20" : "bg-zinc-950 border-white/5 text-zinc-400 hover:text-yellow-400"
                }`}>
                <FiStar /> {selectedGig.featured ? "Unfeature" : "Feature"}
              </button>
              <button onClick={() => { deleteGig(selectedGig.id); }}
                className="py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-black uppercase hover:bg-red-500/20 transition-all flex items-center justify-center gap-2">
                <FiTrash2 /> Delete
              </button>
              <Link to={`/gig/${selectedGig.id}`}
                className="py-3 bg-zinc-950 border border-white/5 rounded-2xl text-zinc-400 text-[10px] font-black uppercase hover:text-blue-400 transition-all flex items-center justify-center gap-2">
                <FiEye /> View Live
              </Link>
            </div>
          </div>
        </Modal>
      )}

      {/* ════════════════════════
          USER DETAIL MODAL
      ════════════════════════ */}
      {selectedUser && (
        <Modal onClose={() => setSelectedUser(null)} title="User Detail">
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-5 bg-zinc-950 rounded-2xl border border-white/5">
              <img src={selectedUser.profile?.avatar || selectedUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`}
                className="w-16 h-16 rounded-2xl ring-4 ring-white/5 object-cover" alt="" />
              <div>
                <h2 className="text-xl font-black tracking-tighter">{selectedUser.name}</h2>
                <p className="text-zinc-500 text-sm">{selectedUser.email}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${selectedUser.role==="admin"||selectedUser.role==="Admin" ? "bg-purple-500/10 border-purple-500/30 text-purple-400" : "bg-zinc-900 border-white/5 text-zinc-500"}`}>{selectedUser.role||"user"}</span>
                  {selectedUser.status==="banned" && <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-red-500/10 border border-red-500/30 text-red-400">BANNED</span>}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label:"Gigs", val: gigs.filter(g=>g.owner===selectedUser.name||g.ownerId===selectedUser.id).length },
                { label:"Applied", val: applications.filter(a=>a.applicantId===selectedUser.id).length },
                { label:"Alerts", val: ls("notifications",[]).filter(n=>n.userId===selectedUser.id).length },
              ].map((s,i) => (
                <div key={i} className="p-4 bg-zinc-950 rounded-2xl border border-white/5 text-center">
                  <p className="text-xl font-black">{s.val}</p>
                  <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { promoteUser(selectedUser.id); setSelectedUser(null); }}
                className="py-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400 text-[10px] font-black uppercase hover:bg-purple-500/20 transition-all">
                {selectedUser.role==="admin"||selectedUser.role==="Admin" ? "Demote" : "Promote to Admin"}
              </button>
              <button onClick={() => { banUser(selectedUser.id); setSelectedUser(null); }}
                className={`py-3 rounded-2xl text-[10px] font-black uppercase transition-all border ${selectedUser.status==="banned" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20" : "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"}`}>
                {selectedUser.status==="banned" ? "Unban" : "Ban User"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ════════════════════════
          BROADCAST MODAL
      ════════════════════════ */}
      {showBroadcast && (
        <Modal onClose={() => setShowBroadcast(false)} title="Broadcast to All Users">
          <div className="space-y-4">
            <p className="text-sm text-zinc-500">This message will be sent as a notification to every user on the platform.</p>
            <textarea rows={5}
              className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-purple-500 transition-all resize-none placeholder:text-zinc-700"
              placeholder="Write your broadcast message…"
              value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)} />
            <button onClick={sendBroadcast}
              className="w-full py-4 bg-white text-black hover:bg-purple-500 hover:text-white transition-all rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
              <FiSend /> Send to All {users.length} Users
            </button>
          </div>
        </Modal>
      )}

      {/* ════════════════════════
          CONFIRM MODAL
      ════════════════════════ */}
      {confirm && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
          <div className="bg-[#0c0c0e] border border-white/10 w-full max-w-sm rounded-[2rem] p-8 space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <FiAlertTriangle className="text-2xl text-red-400" />
            </div>
            <p className="font-black text-base">{confirm.message}</p>
            <div className="flex gap-3">
              <button onClick={confirm.onOk} className="flex-1 py-3.5 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all">Confirm</button>
              <button onClick={() => setConfirm(null)} className="flex-1 py-3.5 bg-zinc-900 border border-white/5 text-zinc-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-white transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════
          TOAST
      ════════════════════════ */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border font-black text-sm transition-all animate-in slide-in-from-bottom-4 duration-300 ${
          toast.type==="error" ? "bg-red-950 border-red-500/30 text-red-300" : "bg-zinc-900 border-white/10 text-white"
        }`}>
          {toast.type==="error" ? <FiX className="text-red-400" /> : <FiCheck className="text-emerald-400" />}
          {toast.msg}
        </div>
      )}

      {/* Floating post gig FAB */}
      {tab !== "Post Gig" && (
        <button onClick={() => setTab("Post Gig")}
          className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 text-black rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30 hover:scale-110 transition-all"
          title="Post New Gig">
          <FiPlus className="text-2xl" />
        </button>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   REUSABLE MODAL
───────────────────────────────────────────── */
const Modal = ({ onClose, title, children }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
    <div className="bg-[#0c0c0e] border border-white/10 w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
      <div className="p-6 border-b border-white/5 flex justify-between items-center flex-shrink-0">
        <h2 className="text-xl font-black uppercase tracking-tighter">{title}</h2>
        <button onClick={onClose} className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
          <FiX className="text-sm" />
        </button>
      </div>
      <div className="p-6 overflow-y-auto">{children}</div>
    </div>
  </div>
);
/* ─────────────────────────────────────────────
   GIG CARD (grid)
───────────────────────────────────────────── */
const GigCard = ({ gig, onApprove, onReject, onFeature, onDelete, onView }) => (
  <div className="relative bg-zinc-900/30 border border-white/5 rounded-[2rem] overflow-hidden hover:border-purple-500/20 transition-all group">
    <div className="h-36 overflow-hidden relative">
      {gig.image ? (
        <img src={gig.image} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-purple-900/30 to-zinc-900 flex items-center justify-center">
          <FiBriefcase className="text-4xl text-zinc-700" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      {gig.featured && <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center"><FiStar className="text-black text-xs" /></div>}
    </div>
    <div className="p-5">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="px-2.5 py-1 bg-zinc-950 text-zinc-400 text-[9px] font-black rounded-full uppercase border border-white/5">{gig.category||"General"}</span>
        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase border ${
          gig.status==="approved" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"
        }`}>{gig.status==="approved" ? "Live" : "Pending"}</span>
      </div>
      <h3 className="text-base font-black tracking-tighter mb-1 line-clamp-2">{gig.title}</h3>
      <p className="text-zinc-600 text-xs mb-4">by {gig.owner||"Unknown"}</p>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xl font-black tracking-tighter">₦{Number(gig.price).toLocaleString()}</span>
        <span className="text-zinc-600 text-xs">{gig.views||0} views</span>
      </div>
      <div className="flex gap-2">
        {(!gig.status||gig.status==="pending") && (
          <button onClick={onApprove} className="flex-1 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-[9px] font-black uppercase hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-1">
            <FiCheck className="text-xs" /> Approve
          </button>
        )}
        <button onClick={onView}    className="p-2.5 bg-zinc-950 border border-white/5 rounded-2xl text-zinc-400 hover:text-blue-400 transition-all"><FiEye className="text-sm" /></button>
        <button onClick={onFeature} className={`p-2.5 rounded-2xl border transition-all ${gig.featured?"bg-yellow-500/10 border-yellow-500/20 text-yellow-400":"bg-zinc-950 border-white/5 text-zinc-400 hover:text-yellow-400"}`}><FiStar className="text-sm" /></button>
        <button onClick={onDelete}  className="p-2.5 bg-zinc-950 border border-white/5 rounded-2xl text-zinc-400 hover:text-red-400 transition-all"><FiTrash2 className="text-sm" /></button>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   GIG ROW (list)
───────────────────────────────────────────── */
const GigRow = ({ gig, onApprove, onReject, onFeature, onDelete, onView }) => (
  <div className="flex items-center gap-4 p-4 bg-zinc-900/20 border border-white/5 rounded-[1.5rem] hover:border-purple-500/20 transition-all group">
    {gig.image ? (
      <img src={gig.image} alt="" className="w-12 h-12 rounded-2xl object-cover flex-shrink-0" />
    ) : (
      <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center text-zinc-700 flex-shrink-0"><FiBriefcase /></div>
    )}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <p className="font-black text-sm tracking-tight truncate">{gig.title}</p>
        {gig.featured && <FiStar className="text-yellow-400 text-xs flex-shrink-0" />}
      </div>
      <p className="text-xs text-zinc-600">{gig.category||"General"} · by {gig.owner||"Unknown"}</p>
    </div>
    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border flex-shrink-0 ${
      gig.status==="approved" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"
    }`}>{gig.status==="approved"?"Live":"Pending"}</span>
    <span className="text-base font-black flex-shrink-0">₦{Number(gig.price).toLocaleString()}</span>
    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
      {(!gig.status||gig.status==="pending") && (
        <button onClick={onApprove} className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 hover:bg-emerald-500/20 transition-all"><FiCheck className="text-xs" /></button>
      )}
      <button onClick={onView}    className="p-2 bg-zinc-950 border border-white/5 rounded-xl text-zinc-400 hover:text-blue-400 transition-all"><FiEye className="text-xs" /></button>
      <button onClick={onFeature} className={`p-2 rounded-xl border transition-all ${gig.featured?"bg-yellow-500/10 border-yellow-500/20 text-yellow-400":"bg-zinc-950 border-white/5 text-zinc-400 hover:text-yellow-400"}`}><FiStar className="text-xs" /></button>
      <button onClick={onDelete}  className="p-2 bg-zinc-950 border border-white/5 rounded-xl text-zinc-400 hover:text-red-400 transition-all"><FiTrash2 className="text-xs" /></button>
    </div>
  </div>
);

export default Admin;