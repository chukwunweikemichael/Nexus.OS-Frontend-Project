import { useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBell, FiActivity, FiMessageSquare, FiDollarSign, FiSearch,
  FiSettings, FiPlus, FiHexagon, FiZap, FiGrid, FiLogOut,
  FiShield, FiChevronRight, FiCpu, FiX, FiArrowUpRight, FiUser,
  FiTerminal, FiGlobe, FiLock, FiCommand, FiPieChart, FiTrendingUp, FiCheckCircle, FiInfo, FiHome
} from "react-icons/fi";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const DashboardZero = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // --- CORE ENGINE STATE ---
  const [gigs, setGigs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("CORE_INTEL");
  const [isCommandMode, setIsCommandMode] = useState(false);
  const [systemUptime, setSystemUptime] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false); 

  // --- SYNCED IMAGE LOGIC ---
  const userDisplayImage = useMemo(() => {
    return user?.profile?.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.id || 'guest'}`;
  }, [user]);

  // --- REFINED DATA HYDRATION ---
  const loadSystemState = () => {
    const rawGigs = JSON.parse(localStorage.getItem("gigs")) || [];
    const rawApps = JSON.parse(localStorage.getItem("applications")) || [];
    const rawNotifs = JSON.parse(localStorage.getItem("notifications")) || [];

    setGigs(rawGigs);
    setApplications(isAdmin ? rawApps : rawApps.filter(a => a.applicantId === user?.id));
    
    const userNotifs = rawNotifs.filter(n => n.userId === user?.id).sort((a, b) => new Date(b.date) - new Date(a.date));
    setNotifications(userNotifs);
  };

  useEffect(() => {
    loadSystemState();
    const interval = setInterval(() => setSystemUptime(prev => prev + 1), 1000);
    window.addEventListener("storage", loadSystemState);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", loadSystemState);
    };
  }, []);

  // --- NOTIFICATION HANDLERS ---
  const markAsRead = (id) => {
    const allNotifs = JSON.parse(localStorage.getItem("notifications")) || [];
    const updated = allNotifs.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem("notifications", JSON.stringify(updated));
    loadSystemState();
  };

  const clearAllNotifs = () => {
    const allNotifs = JSON.parse(localStorage.getItem("notifications")) || [];
    const remaining = allNotifs.filter(n => n.userId !== user?.id);
    localStorage.setItem("notifications", JSON.stringify(remaining));
    loadSystemState();
  };

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  // --- INTELLIGENCE FILTER ---
  const nexusFeed = useMemo(() => {
    const pool = isAdmin ? gigs : applications;
    return pool.filter(item => 
      (item.title || item.gigTitle || "").toLowerCase().includes(searchQuery.toLowerCase())
    ).reverse();
  }, [searchQuery, gigs, applications, isAdmin]);

  const formatTime = (s) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div className="min-h-screen bg-[#020204] text-white font-sans selection:bg-violet-500/50 overflow-hidden flex">
      
      {/* --- LAYER 0: QUANTUM BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-violet-600/5 blur-[200px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-500/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
      </div>

      {/* --- LAYER 1: MONOLITH NAVIGATION --- */}
      <aside className="hidden lg:flex flex-col w-24 hover:w-80 transition-all duration-700 ease-[cubic-bezier(0.2,1,0.2,1)] bg-black/40 backdrop-blur-3xl border-r border-white/5 z-50 group">
        <div className="p-8 flex flex-col items-center group-hover:items-start transition-all">
          {/* HOME TRIGGER: HEXAGON LOGO */}
          <Link to="/" title="Return to Landing" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.15)] group-hover:rotate-90 transition-transform duration-700">
            <FiHexagon size={24} className="text-black" />
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <NavEntry icon={<FiGrid />} label="Core Intelligence" active={activeTab === "CORE_INTEL"} onClick={() => setActiveTab("CORE_INTEL")} />
          <NavEntry icon={<FiTrendingUp />} label="Market Telemetry" active={activeTab === "TELEMETRY"} onClick={() => setActiveTab("TELEMETRY")} />
          <NavEntry icon={<FiMessageSquare />} label="Neural Comms" onClick={() => navigate("/messages")} />
          <NavEntry icon={<FiGlobe />} label="Global Nodes" onClick={() => navigate("/explore")} />
          <NavEntry icon={<FiShield />} label="Security Vault" onClick={() => navigate("/security")} />
        </nav>
        <div className="p-6">
          <button onClick={logout} className="w-full flex items-center gap-4 p-4 text-zinc-600 hover:text-rose-500 transition-all rounded-2xl hover:bg-rose-500/5">
            <FiLogOut size={20} />
            <span className="opacity-0 group-hover:opacity-100 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-opacity">De-Authorize</span>
          </button>
        </div>
      </aside>

      {/* --- LAYER 2: SYSTEM DOCK (MOBILE) --- */}
      <nav className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] h-20 bg-zinc-900/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex items-center justify-around px-4 z-[100] shadow-2xl">
        {/* MOBILE HOME BUTTON */}
        <MobileAction icon={<FiHome />} onClick={() => navigate("/")} />
        <MobileAction icon={<FiBell />} onClick={() => setShowNotifications(true)} />
        <Link to="/post-gig" className="w-16 h-16 bg-violet-600 text-white rounded-full flex items-center justify-center -translate-y-8 shadow-2xl shadow-violet-600/40 border-4 border-[#020204]">
          <FiPlus size={28} />
        </Link>
        <MobileAction icon={<FiMessageSquare />} onClick={() => navigate("/messages")} />
        <Link to="/profile" className="p-3">
            <img src={userDisplayImage} className="w-8 h-8 rounded-lg border border-white/10 object-cover" alt="me" />
        </Link>
      </nav>

      {/* --- LAYER 3: MAIN COMPOSITOR --- */}
      <main className="flex-1 h-screen overflow-y-auto relative z-10 custom-scrollbar flex flex-col">
        
        {/* HUD HEADER */}
        <header className="sticky top-0 z-[100] px-6 lg:px-12 py-6 bg-[#020204]/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-10">
            <div>
              <p className="text-[9px] font-black tracking-[0.5em] text-violet-500 uppercase mb-1">System Uptime: {formatTime(systemUptime)}</p>
              {/* BRAND HOME TRIGGER */}
              <Link to="/" className="text-2xl lg:text-3xl font-black italic tracking-tighter uppercase tracking-[-0.05em] hover:text-violet-400 transition-colors">Nexus.Zero</Link>
            </div>
            <div className="hidden lg:flex items-center bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-2.5 gap-4 group focus-within:border-violet-500/50 transition-all">
               <FiSearch className="text-zinc-500 group-focus-within:text-violet-500" />
               <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Query nodes..." 
                className="bg-transparent border-none outline-none text-sm w-64 lg:w-96 font-medium" 
               />
               <span className="text-[10px] font-black text-zinc-600 bg-white/5 px-2 py-1 rounded">CTRL+K</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all"
            >
                <FiBell size={20} className={unreadCount > 0 ? "text-violet-400" : "text-zinc-400"} />
                {unreadCount > 0 && (
                  <span className="absolute top-3 right-3 w-2 h-2 bg-violet-500 rounded-full animate-ping" />
                )}
            </button>

            <Link to="/profile" className="flex items-center gap-4 pl-4 border-l border-white/10 group">
                <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Class: Obsidian</p>
                    <p className="text-xs font-bold group-hover:text-violet-400 transition-colors">{user?.name || "Operative"}</p>
                </div>
                <div className="w-12 h-12 p-0.5 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-xl transition-transform group-hover:scale-105">
                    <img 
                      src={userDisplayImage} 
                      className="w-full h-full rounded-[10px] bg-zinc-900 object-cover grayscale group-hover:grayscale-0 transition-all" 
                      alt="core" 
                      onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.id}` }}
                    />
                </div>
            </Link>
          </div>
        </header>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="p-6 lg:p-12 space-y-12 max-w-[1800px] mx-auto w-full pb-32 lg:pb-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <HudStat label="Total Asset Value" value="₦14.2M" icon={<FiDollarSign />} trend="+12.4%" color="violet" />
            <HudStat label="Active Node Flow" value={gigs.length} icon={<FiCpu />} trend="Stable" color="emerald" />
            <HudStat label="Comms Latency" value="0.04ms" icon={<FiActivity />} trend="100%" color="sky" />
            <HudStat label="Auth Strength" value="99.9%" icon={<FiShield />} trend="Secure" color="amber" />
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "CORE_INTEL" ? (
              <motion.div key="intel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                        <FiTerminal className="text-violet-500" />
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Intelligence Feed</h3>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-[10px] font-bold text-zinc-500 bg-white/5 px-3 py-1 rounded-full uppercase">Live Nodes: {nexusFeed.length}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {nexusFeed.length > 0 ? nexusFeed.map((node, i) => (
                      <NodeProtocol key={i} data={node} index={i} />
                    )) : (
                      <div className="py-24 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                        <p className="text-zinc-600 font-black uppercase tracking-widest italic animate-pulse">Scanning Neural Network...</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                  <Link to="/post-gig" className="block relative p-1 rounded-[3rem] bg-gradient-to-br from-violet-600/20 to-transparent group overflow-hidden border border-white/10 transition-all hover:scale-[1.02]">
                    <div className="bg-[#020204] rounded-[2.9rem] p-10 relative overflow-hidden">
                        <FiPlus size={120} className="absolute -right-10 -bottom-10 text-white/[0.02] group-hover:text-violet-500/10 transition-all duration-1000" />
                        <div className="relative z-10">
                            <h4 className="text-4xl font-black italic uppercase leading-[0.8] mb-6">Forge<br/>New Node</h4>
                            <p className="text-xs text-zinc-500 font-bold mb-8 uppercase tracking-widest">Deploy a cryptographic work order to the Nexus.</p>
                            <div className="h-14 w-full bg-white text-black flex items-center justify-center rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-violet-500 hover:text-white transition-all">Initialize Process</div>
                        </div>
                    </div>
                  </Link>
                  <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[3rem]">
                    <div className="flex items-center gap-3 mb-8 text-zinc-400">
                        <FiPieChart />
                        <span className="text-[10px] font-black uppercase tracking-widest">Asset Allocation</span>
                    </div>
                    <div className="h-48">
                        <Bar 
                            data={barData} 
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false, 
                                plugins: { legend: { display: false } },
                                scales: { x: { display: false }, y: { display: false } }
                            }} 
                        />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="tele" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
                <div className="bg-zinc-900/40 border border-white/5 rounded-[4rem] p-12 h-[600px] relative overflow-hidden">
                    <div className="flex justify-between items-center mb-12 relative z-10">
                        <div>
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter">Neural Pulse Analytics</h3>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Aggregated performance of all sub-nodes</p>
                        </div>
                        <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
                            {['6H', '24H', '7D', 'ALL'].map(t => <button key={t} className="px-6 py-2 text-[10px] font-black rounded-xl hover:bg-white/10 transition-all">{t}</button>)}
                        </div>
                    </div>
                    <div className="absolute inset-0 p-12 pt-40">
                        <Line data={pulseChartData} options={pulseOptions} />
                    </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* --- NOTIFICATION SLIDE-OVER --- */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]" 
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-screen w-full max-w-md bg-[#050507] border-l border-white/10 z-[201] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div>
                  <h2 className="text-xl font-black italic uppercase tracking-tighter">Neural Alerts</h2>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{unreadCount} pending decrypts</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={clearAllNotifs} className="text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors">Clear All</button>
                  <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-white/10 rounded-full transition-all"><FiX size={20}/></button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {notifications.length > 0 ? notifications.map((n) => (
                  <div 
                    key={n.id} 
                    onClick={() => markAsRead(n.id)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer group ${n.read ? 'bg-transparent border-white/5 opacity-60' : 'bg-white/[0.03] border-violet-500/30 shadow-[0_10px_30px_rgba(139,92,246,0.05)]'}`}
                  >
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.read ? 'bg-zinc-900 text-zinc-500' : 'bg-violet-600 text-white animate-pulse'}`}>
                        {n.type === 'payment' ? <FiDollarSign size={18}/> : <FiInfo size={18}/>}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-xs font-black uppercase tracking-tight ${n.read ? 'text-zinc-400' : 'text-white'}`}>{n.title}</h4>
                          <span className="text-[9px] font-bold text-zinc-600">{new Date(n.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium leading-relaxed">{n.message}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center text-center px-10">
                    <FiBell className="text-zinc-700 mb-4" size={32} />
                    <p className="text-sm font-black uppercase tracking-widest text-zinc-600 italic">Neural Pathways Clear</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- COMMAND MODE (NOW INCLUDES HOME LINK) --- */}
      <AnimatePresence>
        {isCommandMode && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[500] p-6 lg:p-24 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="flex justify-between items-center">
                        <h2 className="text-5xl font-black italic uppercase tracking-tighter">System Commands</h2>
                        <button onClick={() => setIsCommandMode(false)} className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center hover:bg-rose-500 transition-all"><FiX size={32}/></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div onClick={() => navigate("/")}><CommandBlock icon={<FiHome />} label="Return to Surface" sub="Exit Dashboard" /></div>
                        <CommandBlock icon={<FiPlus />} label="New Gig Node" sub="CTRL + N" />
                        <CommandBlock icon={<FiMessageSquare />} label="Neural Chat" sub="CTRL + M" />
                        <CommandBlock icon={<FiLogOut />} label="Terminate Session" sub="ESC" />
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- MAINTAINED SUB-COMPONENTS ---
const NavEntry = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-6 px-5 py-5 rounded-[1.5rem] transition-all duration-500 group relative ${active ? "bg-white text-black shadow-[0_20px_40px_rgba(255,255,255,0.1)]" : "text-zinc-600 hover:text-white"}`}>
    <span className={`text-2xl group-hover:scale-110 transition-transform ${active ? "scale-110" : ""}`}>{icon}</span>
    <span className="opacity-0 group-hover:opacity-100 transition-opacity font-black text-[10px] uppercase tracking-[0.25em] whitespace-nowrap">{label}</span>
    {active && <motion.div layoutId="nav-line" className="absolute left-[-1.5rem] w-1.5 h-8 bg-white rounded-r-full shadow-[0_0_20px_#fff]" />}
  </button>
);

const HudStat = ({ label, value, icon, trend, color }) => (
    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:border-white/20 transition-all group relative overflow-hidden">
        <div className={`absolute -right-4 -top-4 text-8xl opacity-[0.03] group-hover:opacity-[0.08] transition-all text-${color}-500`}>{icon}</div>
        <div className={`w-12 h-12 rounded-2xl bg-${color}-500/10 text-${color}-500 flex items-center justify-center mb-8 border border-${color}-500/20`}>{icon}</div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-2">{label}</p>
        <div className="flex items-baseline gap-4">
            <h3 className="text-3xl font-black italic tracking-tighter">{value}</h3>
            <span className="text-[10px] font-black text-emerald-500">{trend}</span>
        </div>
    </div>
);

const NodeProtocol = ({ data, index }) => (
    <motion.div whileHover={{ x: 12 }} className="p-6 bg-white/[0.01] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.04] transition-all group flex items-center justify-between">
        <div className="flex items-center gap-8">
            <div className="w-16 h-16 bg-zinc-950 rounded-[1.8rem] flex items-center justify-center border border-white/5 text-zinc-700 group-hover:text-violet-400 group-hover:border-violet-500/30 transition-all">
                <FiZap size={24} />
            </div>
            <div>
                <h4 className="text-lg font-black tracking-tight mb-1 group-hover:text-violet-400 transition-colors">{data.title || data.gigTitle}</h4>
                <div className="flex gap-4">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Protocol: 0x{index+72}F</span>
                    <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest italic">Stable Connection</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-10">
            <div className="hidden md:block text-right">
                <p className="text-2xl font-black italic tracking-tighter">₦{(data.price || 15000).toLocaleString()}</p>
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Escrow Ready</p>
            </div>
            <Link to={`/gig/${data.id}`} className="p-5 bg-white/5 rounded-2xl hover:bg-white hover:text-black transition-all">
                <FiChevronRight size={20} />
            </Link>
        </div>
    </motion.div>
);

const CommandBlock = ({ icon, label, sub }) => (
    <div className="p-10 bg-white/5 rounded-[3rem] border border-white/5 hover:border-violet-500/50 hover:bg-white/10 transition-all cursor-pointer group">
        <div className="text-4xl mb-6 group-hover:text-violet-500 transition-colors">{icon}</div>
        <h5 className="text-2xl font-black italic uppercase mb-2">{label}</h5>
        <p className="text-xs font-black text-zinc-600 tracking-[0.2em]">{sub}</p>
    </div>
);

const MobileAction = ({ icon, active, onClick }) => (
    <button onClick={onClick} className={`p-4 rounded-2xl transition-all ${active ? "text-white bg-white/10 shadow-inner" : "text-zinc-600"}`}>
      <span className="text-2xl">{icon}</span>
    </button>
);

const pulseChartData = {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
    datasets: [{
        data: [35, 62, 44, 88, 51, 79, 92],
        borderColor: "#8b5cf6",
        borderWidth: 8,
        tension: 0.5,
        fill: true,
        backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const grad = ctx.createLinearGradient(0, 0, 0, 400);
            grad.addColorStop(0, "rgba(139, 92, 246, 0.2)");
            grad.addColorStop(1, "transparent");
            return grad;
        },
        pointRadius: 0
    }]
};

const pulseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false }, ticks: { color: "#333", font: { weight: 'bold' } } }, y: { display: false } }
};

const barData = {
    labels: ["A", "B", "C", "D", "E", "F"],
    datasets: [{
        data: [20, 45, 30, 70, 50, 90],
        backgroundColor: "#8b5cf6",
        borderRadius: 20,
    }]
};

export default DashboardZero;