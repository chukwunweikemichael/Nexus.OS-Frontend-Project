import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { FiClock, FiCheckCircle, FiDollarSign, FiUser, FiSend, FiBarChart2, FiInfo, FiZap, FiShield, FiCpu, FiTrendingUp } from "react-icons/fi";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

const GigDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [gig, setGig] = useState(null);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const gigs = JSON.parse(localStorage.getItem("gigs")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = gigs.find((g) => g.id === Number(id));

    if (found) {
      const owner = users.find((u) => u.id === found.ownerId);
      setGig({ ...found, ownerName: owner?.name || "Neural Core" });
    }

    setUser(JSON.parse(localStorage.getItem("user")) || null);
    setApplications(JSON.parse(localStorage.getItem("applications")) || []);
  }, [id]);

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleApply = () => {
    if (!message.trim() || !user || user.role === "admin") return;
    const apps = JSON.parse(localStorage.getItem("applications")) || [];
    const convos = JSON.parse(localStorage.getItem("conversations")) || [];
    
    const newApp = { id: Date.now(), gigId: gig.id, applicantId: user.id, message, status: "pending", createdAt: new Date().toISOString() };
    const newConversation = { id: Date.now(), gigId: gig.id, userId: user.id, ownerId: gig.ownerId, name: gig.ownerName, messages: [{ text: message, sender: "user", time: new Date().toISOString() }] };

    localStorage.setItem("applications", JSON.stringify([...apps, newApp]));
    localStorage.setItem("conversations", JSON.stringify([...convos, newConversation]));
    navigate(`/chat/${newConversation.id}`);
  };

  const userApplied = applications.some(a => a.gigId === gig?.id && a.applicantId === user?.id);

  if (!gig) return <div className="h-screen bg-[#020204] flex items-center justify-center text-indigo-500 font-black tracking-[1em] animate-pulse uppercase">Syncing...</div>;

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#020204] text-white selection:bg-indigo-500/40 overflow-hidden font-sans"
    >
      <Navbar />

      {/* --- LAYER 0: THE NEURAL VOID --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ 
            x: (mousePos.x - window.innerWidth / 2) * 0.05,
            y: (mousePos.y - window.innerHeight / 2) * 0.05 
          }}
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-600/10 blur-[150px]" 
        />
        <motion.div 
          animate={{ 
            x: (mousePos.x - window.innerWidth / 2) * -0.03,
            y: (mousePos.y - window.innerHeight / 2) * -0.03 
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[150px]" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto pt-36 pb-20 px-8">
        
        {/* --- HEADER ARCHITECTURE --- */}
        <div className="flex flex-col lg:flex-row items-end justify-between gap-10 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black tracking-[0.5em] text-indigo-400 uppercase">
                Contract Unit v4.0
              </span>
              <div className="h-[1px] w-12 bg-white/10" />
              <FiZap className="text-amber-400 animate-pulse text-xs" />
            </div>
            <h1 className="text-6xl lg:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] text-white drop-shadow-2xl">
              {gig.title.split(' ')[0]} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-400">
                {gig.title.split(' ').slice(1).join(' ')}
              </span>
            </h1>
          </motion.div>

          <div className="flex gap-4">
            <div className="px-8 py-5 rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-3xl flex items-center gap-6">
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Contract Value</p>
                <p className="text-3xl font-black italic text-white leading-none tracking-tighter">₦{gig.price}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)]">
                <FiDollarSign className="text-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* --- LEFT: INFORMATION CELLS --- */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Description Cell */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative p-10 lg:p-14 rounded-[3.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
                <FiCpu size={120} />
              </div>
              <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" /> Project Specification
              </h3>
              <p className="text-xl lg:text-2xl font-medium text-slate-200 leading-relaxed italic uppercase tracking-tight">
                "{gig.description}"
              </p>
              
              <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-8 pt-10 border-t border-white/5">
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Origin</p>
                  <p className="text-sm font-black uppercase italic">{gig.ownerName}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Node Status</p>
                  <p className="text-sm font-black text-emerald-400 uppercase italic">Encrypted</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Priority</p>
                  <p className="text-sm font-black text-indigo-400 uppercase italic">Level 01</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Security</p>
                  <p className="text-sm font-black text-purple-400 uppercase italic flex items-center gap-1"><FiShield /> Shielded</p>
                </div>
              </div>
            </motion.div>

            {/* Analytics Cell */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 rounded-[3rem] bg-indigo-500/5 border border-indigo-500/10 backdrop-blur-md">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Density</p>
                  <FiTrendingUp className="text-indigo-400" />
                </div>
                <div className="h-40">
                  <Line data={{
                    labels: ["", "", "", "", "", ""],
                    datasets: [{ 
                      data: [20, 50, 40, 80, 60, 95], 
                      borderColor: '#6366f1', 
                      borderWidth: 3,
                      tension: 0.5, 
                      pointRadius: 0,
                      fill: true,
                      backgroundColor: 'rgba(99, 102, 241, 0.1)'
                    }]
                  }} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { display: false }, y: { display: false } }, plugins: { legend: { display: false } } }} />
                </div>
              </div>
              
              <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-md flex flex-col justify-between">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-loose">
                  Our neural-matching algorithm indicates this contract aligns with your current skill profile.
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "88%" }}
                      className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)]"
                    />
                  </div>
                  <span className="text-xs font-black text-indigo-400 italic">88% Match</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT: TRANSMISSION PORTAL --- */}
          <div className="lg:col-span-4 sticky top-36">
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-1 rounded-[3.5rem] bg-gradient-to-b from-indigo-500 to-purple-600 shadow-[0_40px_100px_-20px_rgba(99,102,241,0.5)]"
            >
              <div className="bg-[#0a0a0f] rounded-[3.4rem] p-8 lg:p-10 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">Initiate Proposal</span>
                    <FiSend className="text-indigo-400" />
                  </div>

                  <textarea
                    className={`w-full p-8 bg-white/[0.03] rounded-[2.5rem] border border-white/5 text-white placeholder:text-white/10 text-xs font-bold uppercase tracking-widest h-64 focus:border-indigo-500/50 outline-none transition-all resize-none shadow-inner ${userApplied ? 'opacity-30 cursor-not-allowed' : ''}`}
                    placeholder={userApplied ? "SYNC COMPLETE" : "INPUT YOUR STRATEGIC APPROACH..."}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={userApplied}
                  />

                  <button
                    onClick={handleApply}
                    disabled={userApplied}
                    className="w-full mt-6 py-7 bg-white text-black rounded-[2.2rem] font-black text-xs uppercase italic tracking-[0.25em] flex items-center justify-center gap-4 hover:bg-indigo-500 hover:text-white transition-all active:scale-95 disabled:opacity-50 group"
                  >
                    {userApplied ? (
                      <>LINK ESTABLISHED <FiCheckCircle /></>
                    ) : (
                      <>EXECUTE LINK <FiZap className="group-hover:animate-bounce" /></>
                    )}
                  </button>

                  <AnimatePresence>
                    {userApplied && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 p-6 bg-white/5 rounded-3xl border border-white/5 flex items-start gap-4"
                      >
                        <FiInfo className="text-indigo-400 mt-1" />
                        <p className="text-[9px] font-black tracking-widest uppercase leading-relaxed text-slate-400">
                          Data packet successfully routed. Monitor your Nexus Channels for secure feedback.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Bottom Tech Badge */}
            <div className="mt-8 flex items-center justify-center gap-3 opacity-20 hover:opacity-50 transition-opacity">
              <FiShield className="text-xs" />
              <p className="text-[8px] font-black tracking-[0.6em] uppercase underline decoration-indigo-500 underline-offset-4">Secure Neural Protocol</p>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; cursor: crosshair; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default GigDetails;