import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { FiCpu, FiZap, FiEdit3, FiDollarSign, FiUser, FiCheckCircle, FiPlus, FiTerminal, FiActivity, FiShield } from "react-icons/fi";

const CreateGig = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    owner: "",
  });

  const [aiInput, setAiInput] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [category, setCategory] = useState("");
  const [activeField, setActiveField] = useState(null);

  useEffect(() => {
    if (!user) return navigate("/login");
    if (user.role !== "admin") return navigate("/dashboard");
    setForm(prev => ({ ...prev, owner: user.name || "ROOT_ADMIN" }));
  }, [user, navigate]);

  const generateGig = () => {
    if (!aiInput) return;
    setLoadingAI(true);
    // Artificial Intelligence "Simulation" Delay
    setTimeout(() => {
      const skill = aiInput.toLowerCase();
      const basePrice = skill.includes("web") ? 25000 : skill.includes("app") ? 45000 : 15000;

      setForm({
        title: `CORE ${skill.toUpperCase()} INFRASTRUCTURE`,
        description: `Full-stack deployment of high-performance ${skill} solutions. Optimized for scalability and neural integration.`,
        price: basePrice,
        owner: user?.name || "ROOT",
      });

      setCategory(skill.includes("design") ? "Design" : "Engineering");
      setLoadingAI(false);
    }, 1500);
  };

  const handleSubmit = () => {
    if (!form.title || !form.description || !form.price) return;
    
    const gigs = JSON.parse(localStorage.getItem("gigs")) || [];
    const newGig = {
      id: Date.now(),
      ...form,
      price: Number(form.price),
      ownerId: user?.id,
      category: category || "Standard",
      status: "active",
      createdAt: new Date().toISOString(),
    };

    gigs.push(newGig);
    localStorage.setItem("gigs", JSON.stringify(gigs));
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-[#020204] text-white selection:bg-indigo-500/40 overflow-x-hidden font-sans">
      <Navbar />

      {/* --- NEURAL OVERLAY --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/5 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto pt-32 pb-20 px-6 grid lg:grid-cols-12 gap-12">
        
        {/* --- LEFT SIDE: THE FORGE (FORM) --- */}
        <div className="lg:col-span-7">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 text-indigo-400 mb-4">
              <FiTerminal className="animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.5em] uppercase text-indigo-500/60">System/Forge/Gig-Constructor</span>
            </div>
            <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">
              Deploy <span className="text-indigo-500 underline decoration-indigo-500/20 underline-offset-8">New Node</span>
            </h1>
          </motion.div>

          {/* AI GENERATOR - TERMINAL STYLE */}
          <div className="mb-10 group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#0a0a0f] p-8 rounded-3xl border border-white/5 backdrop-blur-3xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FiCpu className="text-indigo-500" />
                  <p className="text-[10px] font-black tracking-widest uppercase">Neural Suggestion Engine</p>
                </div>
                {loadingAI && <div className="flex gap-1"><div className="w-1 h-1 bg-indigo-500 animate-bounce" /><div className="w-1 h-1 bg-indigo-500 animate-bounce [animation-delay:0.2s]" /><div className="w-1 h-1 bg-indigo-500 animate-bounce [animation-delay:0.4s]" /></div>}
              </div>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="INPUT CORE SKILLSET..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl p-4 text-[10px] font-bold tracking-widest uppercase focus:border-indigo-500 outline-none transition-all"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                />
                <button
                  onClick={generateGig}
                  className="px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Sync
                </button>
              </div>
            </div>
          </div>

          {/* MAIN INPUTS */}
          <div className="space-y-6">
            <div className={`transition-all duration-500 ${activeField === 'title' ? 'translate-x-2' : ''}`}>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-2">Primary Identifier</p>
              <input
                type="text"
                onFocus={() => setActiveField('title')}
                placeholder="GIG TITLE"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-6 rounded-2xl bg-white/[0.02] border border-white/5 focus:border-indigo-500/50 outline-none text-xs font-black tracking-widest uppercase transition-all shadow-2xl"
              />
            </div>

            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-2">Structural Details</p>
              <textarea
                placeholder="TECHNICAL DESCRIPTION..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-6 rounded-2xl bg-white/[0.02] border border-white/5 focus:border-indigo-500/50 outline-none text-xs font-bold tracking-widest uppercase h-48 transition-all resize-none shadow-2xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-2">Valuation (₦)</p>
                <input
                  type="number"
                  placeholder="CREDITS"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full p-6 rounded-2xl bg-white/[0.02] border border-white/5 focus:border-indigo-500/50 outline-none text-xs font-black tracking-widest uppercase transition-all shadow-2xl"
                />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-2">Authorized Signatory</p>
                <div className="w-full p-6 rounded-2xl bg-white/[0.01] border border-white/5 text-slate-600 text-xs font-black tracking-widest uppercase italic flex items-center gap-2">
                  <FiShield /> {form.owner}
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(99, 102, 241, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="w-full py-8 mt-10 bg-white text-black rounded-[2.5rem] font-black text-xs uppercase italic tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-indigo-600 hover:text-white transition-all group"
            >
              INITIALIZE SYSTEM DEPLOYMENT <FiPlus className="group-hover:rotate-90 transition-transform" />
            </motion.button>
          </div>
        </div>

        {/* --- RIGHT SIDE: LIVE PREVIEW HUD --- */}
        <div className="lg:col-span-5 hidden lg:block sticky top-32">
          <div className="p-8 rounded-[3.5rem] bg-white/[0.01] border border-white/5 backdrop-blur-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><FiActivity size={100} /></div>
            
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-12">Live Node Preview</p>

            <div className="space-y-6">
              <div className="h-4 w-24 bg-indigo-500/20 rounded-full animate-pulse" />
              <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none min-h-[80px]">
                {form.title || "Awaiting Title..."}
              </h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-loose line-clamp-4 min-h-[100px]">
                {form.description || "Enter system parameters to generate visual preview..."}
              </p>
              
              <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                <div>
                  <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Contract Valuation</p>
                  <p className="text-2xl font-black italic text-indigo-400">₦{form.price || "0"}</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase italic tracking-widest">
                  {category || "Global"} Node
                </div>
              </div>
            </div>

            {/* DECORATIVE TERMINAL LINES */}
            <div className="mt-12 space-y-2 opacity-20">
              <div className="h-1 w-full bg-white/10 rounded-full" />
              <div className="h-1 w-[80%] bg-white/10 rounded-full" />
              <div className="h-1 w-[60%] bg-white/10 rounded-full" />
            </div>
          </div>
          
          <p className="text-center mt-6 text-[8px] font-black text-slate-700 uppercase tracking-[0.8em]">End of Transmission</p>
        </div>
      </main>

      <style>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        textarea::-webkit-scrollbar { width: 0px; }
      `}</style>
    </div>
  );
};

export default CreateGig;