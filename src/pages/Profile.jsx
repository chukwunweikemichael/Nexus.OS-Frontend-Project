import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from "chart.js";
import {
  FiEdit3, FiCpu, FiDollarSign, FiBriefcase, FiGithub, FiLinkedin, 
  FiMapPin, FiZap, FiTerminal, FiChevronRight, FiX, FiCheck, 
  FiActivity, FiGlobe, FiTrendingUp, FiUnlock, FiExternalLink, 
  FiSettings, FiTrash2, FiShield, FiAlertTriangle, FiSquare, FiLoader
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const Profile = () => {
  const { user, updateUser, deleteUser } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("intelligence");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [deleteInput, setDeleteInput] = useState("");

  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState("");

  const [formData, setFormData] = useState({
    name: "", title: "", bio: "", skills: "", country: "", hourlyRate: "", avatar: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        title: user.profile?.title || "",
        bio: user.profile?.bio || "",
        skills: (user.profile?.skills || []).join(", "),
        country: user.profile?.country || "",
        hourlyRate: user.profile?.hourlyRate || "",
        avatar: user.profile?.avatar || ""
      });
    }
  }, [user]);

  const handleDeploy = () => {
    setIsDeploying(true);
    setDeployStep("INITIALIZING_HANDSHAKE...");
    setTimeout(() => setDeployStep("SYNCING_GLOBAL_NODES..."), 800);
    setTimeout(() => setDeployStep("PURGING_EDGE_CACHE..."), 1600);
    setTimeout(() => setDeployStep("ENCRYPTING_IDENTITY_DATA..."), 2400);
    setTimeout(() => {
      setIsDeploying(false);
      setDeployStep("");
      alert("SUCCESS: Identity Protocol Deployed to World Servers.");
    }, 3200);
  };

  const handleMouseMove = (e) => {
    setMousePos({ 
      x: (e.clientX / window.innerWidth - 0.5) * 15, 
      y: (e.clientY / window.innerHeight - 0.5) * 15 
    });
  };

  const processUpdate = (e) => {
    e.preventDefault();
    updateUser({
      ...user,
      name: formData.name,
      profile: {
        ...user.profile,
        title: formData.title,
        bio: formData.bio,
        country: formData.country,
        hourlyRate: formData.hourlyRate,
        avatar: formData.avatar,
        skills: formData.skills.split(",").map(s => s.trim()).filter(s => s !== "")
      }
    });
    setIsEditModalOpen(false);
  };

  if (!user) return <TheVoidLoader />;

  return (
    <div onMouseMove={handleMouseMove} className="min-h-screen bg-[#020202] text-white font-mono selection:bg-indigo-500/40 overflow-x-hidden">
      <Navbar />

      {/* --- RESPONSIVE DEPLOY STATUS --- */}
      {isDeploying && (
        <div className="fixed top-0 left-0 w-full z-[1000] h-1 bg-white/10">
          <div className="h-full bg-indigo-500 animate-[loading_3.2s_ease-in-out]" />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-indigo-600 px-4 py-2 md:px-6 md:py-2 rounded-full border border-indigo-400 shadow-2xl flex items-center gap-3 whitespace-nowrap">
            <FiLoader className="animate-spin text-xs" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">{deployStep}</span>
          </div>
        </div>
      )}

      {/* --- MAIN CONTAINER --- */}
      <div className="pt-24 md:pt-32 lg:pt-40 pb-20 px-4 sm:px-8 lg:px-16 max-w-[1920px] mx-auto relative z-10">
        
        {/* HUD BG */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_90%)]" />
        </div>

        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 md:gap-12 mb-16 md:mb-24">
          <div className="space-y-4 md:space-y-6 flex-1 w-full">
            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[7px] md:text-[9px] font-black tracking-[0.3em] text-indigo-400 uppercase whitespace-nowrap">Status: Elite_Class</span>
              <div className="h-[1px] flex-1 md:w-20 bg-white/10" />
              <span className="text-[7px] md:text-[9px] text-white/30 uppercase tracking-widest flex items-center gap-2 animate-pulse whitespace-nowrap"><FiActivity /> Optimized</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter uppercase leading-[0.9] italic break-words">
              {user.name}
            </h1>
            
            <p className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-light text-slate-500 italic flex items-center gap-3">
               <FiSquare className="text-indigo-600 rotate-45 text-xs md:text-sm" /> {user.profile?.title || "Senior Intelligence Lead"}
            </p>
          </div>

          {/* ACTION BUTTONS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col gap-3 w-full lg:w-auto lg:min-w-[280px]">
             <ControlBtn icon={<FiSettings />} text="Config" color="indigo" onClick={() => setIsEditModalOpen(true)} />
             <ControlBtn 
              icon={isDeploying ? <FiLoader className="animate-spin" /> : <FiUnlock />} 
              text={isDeploying ? "SYNC..." : "Deploy"} 
              color="white" 
              onClick={handleDeploy} 
             />
             <ControlBtn icon={<FiTrash2 />} text="Terminate" color="red" onClick={() => setIsDeleteConfirmOpen(true)} />
          </div>
        </div>

        {/* --- CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT: IDENTITY (STACKS ON MOBILE) */}
          <div className="lg:col-span-4 space-y-8 md:space-y-12">
            <div className="relative group max-w-sm mx-auto lg:max-w-none">
              <div className="absolute -inset-1 bg-indigo-500/20 blur-2xl rounded-[2rem] md:rounded-[3rem] group-hover:bg-indigo-500/40 transition-all duration-1000" />
              <div className="relative aspect-[4/5] bg-zinc-900 border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden">
                <img 
                   src={user.profile?.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.name}`} 
                   className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-1000"
                   alt="Identity"
                />
                <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-black/60 backdrop-blur-xl border border-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl">
                   <p className="text-[6px] md:text-[8px] font-black text-indigo-500 uppercase tracking-widest">Authenticity</p>
                   <p className="text-[10px] md:text-xs font-bold uppercase">Verified_01</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <DataBlock label="Velocity" value={`₦${user.profile?.hourlyRate || "0"}`} />
              <DataBlock label="Region" value={user.profile?.country || "Earth"} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
               <SocialRow icon={<FiGithub />} label="Source" url={user.profile?.github} />
               <SocialRow icon={<FiLinkedin />} label="Professional" url={user.profile?.linkedin} />
            </div>
          </div>

          {/* RIGHT: COMMAND CENTER */}
          <div className="lg:col-span-8 space-y-8 md:space-y-12">
            {/* HUD NAV - SCROLLABLE ON MOBILE */}
            <nav className="flex gap-6 md:gap-12 border-b border-white/5 overflow-x-auto no-scrollbar">
               {["intelligence", "deployments", "metrics"].map(tab => (
                 <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 md:pb-6 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] transition-all relative whitespace-nowrap ${activeTab === tab ? "text-white" : "text-white/20 hover:text-white"}`}
                 >
                   {tab}
                   {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] md:h-[3px] bg-indigo-500" />}
                 </button>
               ))}
            </nav>

            {activeTab === "intelligence" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 md:space-y-12">
                <div className="bg-white/[0.02] border-l-2 md:border-l-4 border-indigo-500 p-6 md:p-12 rounded-r-[1.5rem] md:rounded-r-[3rem] relative overflow-hidden group">
                  <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-6 md:mb-10">Manifesto</p>
                  <p className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.2] tracking-tighter italic text-white/90">
                    "{user.profile?.bio || "Intelligence summary missing."}"
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                  <SkillMatrix skills={user.profile?.skills || []} />
                  <SystemHealth />
                </div>
              </div>
            )}

            {activeTab === "deployments" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 animate-in zoom-in-95 duration-500">
                {(user.gigs || []).map((gig, i) => (
                  <GigCard key={i} gig={gig} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- MOBILE RESPONSIVE MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative w-full md:max-w-2xl bg-[#050505] border-l border-white/10 h-full p-6 md:p-12 overflow-y-auto animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-10 md:mb-16">
              <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">Config</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-red-500 transition-all"><FiX /></button>
            </div>

            <form onSubmit={processUpdate} className="space-y-6 md:space-y-8">
               <TermInput label="Name" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
               <TermInput label="Title" value={formData.title} onChange={(v) => setFormData({...formData, title: v})} />
               <div className="space-y-2 md:space-y-3">
                 <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/30">Bio</label>
                 <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 text-sm md:text-base text-white focus:border-indigo-500 outline-none h-32 md:h-44 resize-none font-bold"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                 />
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                 <TermInput label="Rate" value={formData.hourlyRate} onChange={(v) => setFormData({...formData, hourlyRate: v})} />
                 <TermInput label="Region" value={formData.country} onChange={(v) => setFormData({...formData, country: v})} />
               </div>
               <TermInput label="Skills" value={formData.skills} onChange={(v) => setFormData({...formData, skills: v})} />
               
               <button type="submit" className="w-full py-4 md:py-6 bg-indigo-600 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.4em] text-[9px] md:text-[10px] hover:bg-white hover:text-black transition-all duration-500">
                 Commit Protocol
               </button>
            </form>
          </div>
        </div>
      )}

      {/* --- RESPONSIVE DELETE MODAL --- */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-red-950/40 backdrop-blur-2xl" onClick={() => setIsDeleteConfirmOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#0e0000] border border-red-500/30 p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] text-center">
            <FiShield className="text-4xl md:text-6xl text-red-500 mx-auto mb-6 animate-pulse" />
            <h3 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-red-500 mb-4">Danger</h3>
            <p className="text-white/50 text-[10px] md:text-sm leading-relaxed mb-8 md:mb-10">Confirm permanent deletion of <span className="text-white font-bold">{user.name}</span>.</p>
            
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-center text-white outline-none mb-6 focus:border-red-500 transition-all font-bold"
              placeholder="IDENTITY NAME"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setIsDeleteConfirmOpen(false)} className="flex-1 py-4 bg-white/5 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest order-2 sm:order-1">Abort</button>
              <button 
                onClick={() => deleteInput === user.name && deleteUser()}
                disabled={deleteInput !== user.name}
                className="flex-1 py-4 bg-red-600 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:bg-red-500 disabled:opacity-20 transition-all order-1 sm:order-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- RESPONSIVE SUB-COMPONENTS ---

const ControlBtn = ({ icon, text, color, onClick }) => {
  const styles = {
    indigo: "bg-indigo-600 text-white border-indigo-500 hover:bg-white hover:text-black",
    white: "bg-white/5 text-white border-white/10 hover:bg-white hover:text-black",
    red: "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-600 hover:text-white"
  };

  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-between px-6 md:px-8 py-3 md:py-4 border rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[7px] md:text-[9px] transition-all duration-500 group ${styles[color]}`}
    >
      <span className="flex items-center gap-2 md:gap-3">{icon} {text}</span>
      <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
    </button>
  );
};

const DataBlock = ({ label, value }) => (
  <div className="bg-white/[0.02] border border-white/5 p-4 md:p-8 rounded-2xl md:rounded-3xl group hover:border-indigo-500/30 transition-all">
    <p className="text-[6px] md:text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">{label}</p>
    <p className="text-sm md:text-lg font-bold truncate">{value}</p>
  </div>
);

const SocialRow = ({ icon, label, url }) => (
  <a href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 md:p-6 bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl hover:bg-indigo-600 transition-all group overflow-hidden">
    <div className="flex items-center gap-3 md:gap-4">
      <span className="text-lg md:text-xl text-white/40 group-hover:text-white">{icon}</span>
      <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/30 group-hover:text-white">{label}</span>
    </div>
    <FiExternalLink className="opacity-0 group-hover:opacity-100 transition-opacity" />
  </a>
);

const SkillMatrix = ({ skills }) => (
  <div className="bg-[#080808] border border-white/5 p-6 md:p-10 rounded-2xl md:rounded-[3rem] space-y-6 md:space-y-8">
    <h3 className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/30">Matrix</h3>
    <div className="flex flex-wrap gap-2">
      {skills.map((s, i) => (
        <span key={i} className="px-3 py-1 md:px-5 md:py-2 bg-indigo-500/5 border border-indigo-500/20 text-indigo-400 text-[8px] md:text-[10px] font-bold uppercase rounded-full whitespace-nowrap">
          {s}
        </span>
      ))}
    </div>
  </div>
);

const SystemHealth = () => (
  <div className="bg-[#080808] border border-white/5 p-6 md:p-10 rounded-2xl md:rounded-[3rem] flex flex-col justify-center text-center space-y-3 md:space-y-4 group">
    <FiCpu className="text-3xl md:text-5xl mx-auto text-indigo-500/20 group-hover:text-indigo-500 transition-all" />
    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/30">Health</p>
    <div className="text-xl md:text-4xl font-black italic uppercase">Operational</div>
  </div>
);

const GigCard = ({ gig }) => (
  <div className="bg-white/[0.02] border border-white/5 p-6 md:p-10 rounded-2xl md:rounded-[3rem] group hover:bg-indigo-600 transition-all duration-500">
    <div className="flex justify-between items-start mb-6 md:mb-8">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl flex items-center justify-center text-lg group-hover:bg-white group-hover:text-black transition-all">
        <FiBriefcase />
      </div>
      <span className="text-[7px] md:text-[9px] font-black bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded uppercase tracking-widest">Active</span>
    </div>
    <h4 className="text-lg md:text-2xl font-black italic uppercase mb-3 group-hover:text-white">{gig.title}</h4>
    <p className="text-[10px] text-white/40 mb-6 md:mb-10 line-clamp-3 group-hover:text-white/80">{gig.description}</p>
    <div className="text-xl md:text-3xl font-black tracking-tighter">₦{gig.price}</div>
  </div>
);

const TermInput = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/30">{label}</label>
    <input 
      type="text"
      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 text-sm md:text-base text-white focus:border-indigo-500 outline-none transition-all font-bold"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const TheVoidLoader = () => (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
    <div className="w-16 h-16 md:w-24 md:h-24 border-t-2 border-indigo-500 rounded-full animate-spin relative mb-10">
      <div className="absolute inset-2 border-b-2 border-indigo-300 rounded-full animate-spin-reverse opacity-50" />
    </div>
    <span className="text-indigo-500 font-black uppercase tracking-[1em] md:tracking-[2em] text-[8px] animate-pulse">Syncing_Identity</span>
  </div>
);

export default Profile;