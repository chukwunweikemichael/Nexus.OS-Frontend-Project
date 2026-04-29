import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUser, FiMail, FiLock, FiBriefcase, FiGlobe, 
  FiDollarSign, FiChevronRight, FiChevronLeft, 
  FiCamera, FiGithub, FiLinkedin, FiZap, FiCheckCircle, FiLoader, FiShield, FiLayers, FiSearch
} from "react-icons/fi";

const SKILLS_MATRIX = [
  // TECH & DEVELOPMENT
  "Full-Stack Engineering", "Mobile App Architecture", "Web3 & Smart Contracts", 
  "DevOps & Cloud", "AI & Machine Learning", "Cybersecurity", "Python/Data Science",
  "Frontend Architecture", "Backend Engineering", "API Integration",

  // DESIGN & CREATIVE
  "UI/UX Design", "Product Design", "Brand Identity", "3D Modeling & Rendering",
  "Motion Graphics", "Game Design", "Illustration", "Typography",
  "Brand Strategy", "Design Systems",

  // WRITING & CONTENT
  "Copywriting", "Technical Writing", "Neural Narrative", "Ghostwriting",
  "SEO Content Strategy", "Translation & Localization", "Scriptwriting",
  "Technical Documentation", "Creative Storytelling",

  // VIDEO & AUDIO
  "Video Engineering", "Post-Production", "Sound Design", "Voiceover",
  "Color Grading", "Visual Effects (VFX)", "Podcast Production",
  "2D/3D Animation",

  // MARKETING & GROWTH
  "Performance Marketing", "Social Media Management", "Email Marketing",
  "Market Research", "Influencer Strategy", "Conversion Rate Optimization",
  "Growth Hacking", "Google Ads Specialist",

  // BUSINESS & OPERATIONS
  "Project Management", "Financial Modeling", "Business Analysis",
  "Legal Consulting", "Virtual Assistance", "E-commerce Strategy",
  "HR Consulting", "Supply Chain Logisitics"
];

const Register = () => {
  const { register, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    name: "", email: "", password: "",
    bio: "", skills: [], hourlyRate: "35", avatar: "",
    linkedin: "", github: "", country: "Global", 
    title: "", experienceLevel: "Expert",
    availability: "Immediate", language: "English"
  });

  const filteredSkills = SKILLS_MATRIX.filter(skill => 
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handleInputChange("avatar", reader.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleSkill = (skill) => {
    const newSkills = form.skills.includes(skill) 
      ? form.skills.filter(s => s !== skill) 
      : [...form.skills, skill];
    handleInputChange("skills", newSkills);
  };

  const executeFinalRegistration = async () => {
    setError("");
    setLoading(true);
    try {
      const createdUser = await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      const finalProfile = {
        ...createdUser,
        role: "freelancer",
        level: form.experienceLevel,
        profile: { ...form }
      };

      await updateUser(finalProfile);
      setSuccess(true);
      setTimeout(() => { window.location.href = "/dashboard"; }, 1500);
    } catch (err) {
      setError(err.message || "Uplink Failed. Verify Credentials.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
    else executeFinalRegistration();
  };

  return (
    <div className="min-h-screen bg-[#020203] text-zinc-300 font-sans selection:bg-violet-500/30 overflow-x-hidden">
      <Navbar />
      
      {/* --- AMBIENT ARCHITECTURE --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-fuchsia-600/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto py-24 px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          
          {/* --- LEFT NAVIGATION PANEL --- */}
          <div className="lg:col-span-4 sticky top-32">
            <div className="relative p-1 bg-gradient-to-b from-white/10 to-transparent rounded-[3rem]">
              <div className="bg-[#08080a] p-10 rounded-[2.8rem] backdrop-blur-2xl">
                <div className="mb-12">
                   <h1 className="text-white text-4xl font-black italic tracking-tighter leading-none flex items-center gap-3">
                     <FiZap className="text-violet-500" /> LANCER<span className="text-zinc-500 font-light">PROTOCOL</span>
                   </h1>
                   <p className="text-zinc-600 font-bold text-[10px] tracking-[0.4em] uppercase mt-4">Node Establishment v4.0</p>
                </div>

                <div className="space-y-10">
                  {[
                    { s: 1, t: "Verification", d: "Credentialing & Security", icon: <FiShield /> },
                    { s: 2, t: "Expertise", d: "Service Capability Mapping", icon: <FiLayers /> },
                    { s: 3, t: "Marketplace", d: "Valuation & Connectivity", icon: <FiGlobe /> }
                  ].map(item => (
                    <div key={item.s} className={`flex items-center gap-6 transition-all duration-500 ${step === item.s ? "opacity-100 translate-x-2" : "opacity-30 grayscale blur-[0.5px]"}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg border ${step >= item.s ? "bg-violet-500/20 border-violet-500 text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.3)]" : "border-zinc-800 text-zinc-600"}`}>
                        {step > item.s ? <FiCheckCircle /> : item.icon}
                      </div>
                      <div>
                        <p className="font-black uppercase tracking-widest text-[11px] text-white">{item.t}</p>
                        <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-tighter mt-1">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* LIVE PREVIEW BADGE */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 mx-4 p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center gap-5 backdrop-blur-md">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden ring-4 ring-violet-500/20">
                {form.avatar ? <img src={form.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black animate-pulse" />}
              </div>
              <div>
                <p className="text-white text-sm font-black italic tracking-tight">{form.name || "OPERATIVE_PENDING"}</p>
                <div className="flex items-center gap-2 mt-1">
                   <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">{form.title || "Awaiting Title"}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* --- RIGHT FORM AREA --- */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.form 
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={nextStep} 
                className="space-y-12"
              >
                {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">{error}</div>}

                {/* STEP 1: IDENTITY */}
                {step === 1 && (
                  <div className="space-y-10">
                    <header>
                      <h2 className="text-white text-5xl font-black italic tracking-tighter uppercase leading-tight">Identity<br/>Authentication</h2>
                      <p className="text-zinc-500 text-sm font-medium mt-4">Initialize your secure profile on the global talent grid.</p>
                    </header>
                    <div className="grid md:grid-cols-2 gap-6">
                      <ProtocolInput icon={<FiUser />} placeholder="Full Legal Name" value={form.name} onChange={v => handleInputChange("name", v)} />
                      <ProtocolInput icon={<FiMail />} placeholder="Secure Email Link" type="email" value={form.email} onChange={v => handleInputChange("email", v)} />
                    </div>
                    <ProtocolInput icon={<FiLock />} placeholder="Security Passphrase" type="password" value={form.password} onChange={v => handleInputChange("password", v)} />
                  </div>
                )}

                {/* STEP 2: EXPERTISE (EXPANDED) */}
                {step === 2 && (
                  <div className="space-y-10">
                    <header>
                      <h2 className="text-white text-5xl font-black italic tracking-tighter uppercase leading-tight">Service<br/>Architecture</h2>
                    </header>

                    <div className="bg-white/[0.02] p-1 border border-white/5 rounded-[2.5rem]">
                      <div className="bg-[#0a0a0c] p-8 rounded-[2.3rem] space-y-6 shadow-2xl">
                        <ProtocolInput icon={<FiBriefcase />} placeholder="Lead Profession (e.g. Senior Cloud Architect)" value={form.title} onChange={v => handleInputChange("title", v)} />
                        <div className="relative">
                          <textarea 
                            className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] p-6 text-white outline-none focus:border-violet-500/50 h-32 transition-all resize-none text-sm font-medium"
                            placeholder="Operational Mission Brief. What specific solutions do you engineer?"
                            value={form.bio}
                            onChange={e => handleInputChange("bio", e.target.value)}
                          />
                          <div className="absolute bottom-4 right-6 text-[8px] font-black text-zinc-700 tracking-[0.2em] uppercase">Narrative Protocol</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                        <p className="text-[10px] font-black uppercase text-violet-500 tracking-[0.4em]">Capability Matrix ({form.skills.length})</p>
                        <div className="relative">
                           <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-xs" />
                           <input 
                            type="text" 
                            placeholder="Filter Capabilities..." 
                            className="bg-white/[0.03] border border-white/10 rounded-full pl-10 pr-4 py-2 text-[10px] uppercase font-black tracking-widest text-white outline-none focus:border-violet-500/50 transition-all w-full md:w-64"
                            onChange={(e) => setSearchTerm(e.target.value)}
                           />
                        </div>
                      </div>

                      <div className="p-1 bg-white/[0.01] border border-white/5 rounded-[2.5rem]">
                        <div className="max-h-[350px] overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 custom-scrollbar">
                          {filteredSkills.map(skill => (
                            <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                              className={`flex items-center justify-between px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 border ${form.skills.includes(skill) ? "bg-violet-600/20 border-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]" : "bg-white/[0.03] border-white/5 text-zinc-600 hover:border-violet-500/40"}`}>
                              {skill}
                              {form.skills.includes(skill) && <FiCheckCircle className="text-violet-400" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: DEPLOYMENT */}
                {step === 3 && (
                  <div className="space-y-10">
                    <header>
                      <h2 className="text-white text-5xl font-black italic tracking-tighter uppercase leading-tight">Market<br/>Connectivity</h2>
                    </header>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                         <ProtocolInput icon={<FiDollarSign />} placeholder="Hourly Rate (₦)" type="number" value={form.hourlyRate} onChange={v => handleInputChange("hourlyRate", v)} />
                         <ProtocolSelect label="Availability Status" options={["Immediate", "72 Hours Notice", "Strategic Only"]} onChange={v => handleInputChange("availability", v)} />
                      </div>
                      <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                         <ProtocolInput icon={<FiLinkedin />} placeholder="LinkedIn Pulse" value={form.linkedin} onChange={v => handleInputChange("linkedin", v)} />
                         <ProtocolInput icon={<FiGithub />} placeholder="Source Repository" value={form.github} onChange={v => handleInputChange("github", v)} />
                      </div>
                    </div>
                    <div className="bg-violet-600/5 border border-violet-500/20 p-8 rounded-[2.5rem] flex items-center justify-between group">
                      <div className="flex items-center gap-6">
                         <div className="w-20 h-20 rounded-2xl bg-black border border-white/10 flex items-center justify-center overflow-hidden">
                            {form.avatar ? <img src={form.avatar} className="w-full h-full object-cover" /> : <FiCamera className="text-zinc-700 text-2xl" />}
                         </div>
                         <div>
                            <p className="text-white text-lg font-black italic">Identity Asset</p>
                            <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mt-1">Biometric Portrait Required</p>
                         </div>
                      </div>
                      <label className="cursor-pointer bg-white text-black px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-500 hover:text-white transition-all shadow-xl">
                        Upload Asset
                        <input type="file" className="hidden" onChange={handleFileChange} />
                      </label>
                    </div>
                  </div>
                )}

                {/* CONTROLS */}
                <div className="flex items-center justify-between pt-12 border-t border-white/5">
                  {step > 1 ? (
                    <button type="button" onClick={() => setStep(step - 1)} className="flex items-center gap-3 text-zinc-500 font-black uppercase text-[10px] tracking-[0.3em] hover:text-white transition-all group">
                      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all"><FiChevronLeft /></div> 
                      Previous Phase
                    </button>
                  ) : <div />}
                  <button type="submit" disabled={loading} className="group relative px-12 py-6 bg-white rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50">
                    <div className="relative z-10 flex items-center gap-4 text-black font-black uppercase italic tracking-tighter text-xl">
                      {loading ? <FiLoader className="animate-spin" /> : (
                        <>{step < 3 ? "Next Phase" : "Finalize Protocol"} <FiChevronRight className="group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-violet-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </button>
                </div>
              </motion.form>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #8b5cf6; }
      `}} />
    </div>
  );
};

// --- ELITE UI SUB-COMPONENTS ---
const ProtocolInput = ({ icon, placeholder, type = "text", value, onChange }) => (
  <div className="relative w-full group">
    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-400 transition-all duration-300">
      {icon}
    </div>
    <input 
      type={type} required value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/5 rounded-2xl text-white outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-all placeholder:text-zinc-700 placeholder:font-bold placeholder:uppercase placeholder:text-[9px] placeholder:tracking-widest text-sm"
    />
  </div>
);

const ProtocolSelect = ({ label, options, onChange }) => (
  <div className="space-y-3">
    <label className="text-[9px] font-black uppercase text-violet-500/60 ml-2 tracking-widest">{label}</label>
    <div className="relative">
      <select 
        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-violet-500/40 transition-all appearance-none cursor-pointer text-[10px] font-black uppercase tracking-widest"
        onChange={e => onChange(e.target.value)}
      >
        {options.map(opt => <option key={opt} value={opt} className="bg-[#0a0a0c]">{opt}</option>)}
      </select>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30"><FiChevronRight className="rotate-90" /></div>
    </div>
  </div>
);

export default Register;