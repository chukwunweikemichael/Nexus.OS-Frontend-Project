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
  "Full-Stack Engineering", "Mobile App Architecture", "Web3 & Smart Contracts", 
  "DevOps & Cloud", "AI & Machine Learning", "Cybersecurity", "Python/Data Science",
  "Frontend Architecture", "Backend Engineering", "API Integration",
  "UI/UX Design", "Product Design", "Brand Identity", "3D Modeling & Rendering",
  "Motion Graphics", "Game Design", "Illustration", "Typography",
  "Brand Strategy", "Design Systems",
  "Copywriting", "Technical Writing", "Neural Narrative", "Ghostwriting",
  "SEO Content Strategy", "Translation & Localization", "Scriptwriting",
  "Technical Documentation", "Creative Storytelling",
  "Video Engineering", "Post-Production", "Sound Design", "Voiceover",
  "Color Grading", "Visual Effects (VFX)", "Podcast Production",
  "2D/3D Animation",
  "Performance Marketing", "Social Media Management", "Email Marketing",
  "Market Research", "Influencer Strategy", "Conversion Rate Optimization",
  "Growth Hacking", "Google Ads Specialist",
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
        <div className="absolute top-[-10%] right-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-violet-600/10 blur-[80px] md:blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-fuchsia-600/10 blur-[80px] md:blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:2rem_2rem] md:bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto py-12 md:py-24 px-4 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-24 items-start">
          
          {/* --- LEFT NAVIGATION PANEL --- */}
          {/* Mobile: Simple Header | Desktop: Sticky Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="relative p-1 bg-gradient-to-b from-white/10 to-transparent rounded-[2rem] md:rounded-[3rem]">
              <div className="bg-[#08080a] p-6 md:p-10 rounded-[1.8rem] md:rounded-[2.8rem] backdrop-blur-2xl">
                <div className="mb-8 md:mb-12 text-center lg:text-left">
                   <h1 className="text-white text-3xl md:text-4xl font-black italic tracking-tighter leading-none flex items-center justify-center lg:justify-start gap-3">
                     <FiZap className="text-violet-500 shrink-0" /> LANCER<span className="text-zinc-500 font-light">PROTOCOL</span>
                   </h1>
                   <p className="text-zinc-600 font-bold text-[8px] md:text-[10px] tracking-[0.4em] uppercase mt-4">Node Establishment v4.0</p>
                </div>

                {/* Progress Steps: Horizontal on mobile, vertical on desktop */}
                <div className="flex lg:flex-col justify-between lg:justify-start lg:space-y-10 gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                  {[
                    { s: 1, t: "Verification", d: "Credentialing", icon: <FiShield /> },
                    { s: 2, t: "Expertise", d: "Capability", icon: <FiLayers /> },
                    { s: 3, t: "Market", d: "Connectivity", icon: <FiGlobe /> }
                  ].map(item => (
                    <div key={item.s} className={`flex flex-col lg:flex-row items-center gap-3 lg:gap-6 shrink-0 transition-all duration-500 ${step === item.s ? "opacity-100" : "opacity-30 grayscale blur-[0.5px]"}`}>
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-md md:text-lg border ${step >= item.s ? "bg-violet-500/20 border-violet-500 text-violet-400" : "border-zinc-800 text-zinc-600"}`}>
                        {step > item.s ? <FiCheckCircle /> : item.icon}
                      </div>
                      <div className="text-center lg:text-left">
                        <p className="font-black uppercase tracking-widest text-[9px] md:text-[11px] text-white">{item.t}</p>
                        <p className="hidden lg:block text-zinc-600 text-[9px] font-bold uppercase tracking-tighter mt-1">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* LIVE PREVIEW BADGE - Hidden on very small screens to save space */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 mx-2 p-4 md:p-6 bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-[2rem] flex items-center gap-4 md:gap-5 backdrop-blur-md">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden ring-4 ring-violet-500/20 shrink-0">
                {form.avatar ? <img src={form.avatar} className="w-full h-full object-cover" alt="avatar" /> : <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black animate-pulse" />}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-black italic tracking-tight truncate">{form.name || "OPERATIVE_PENDING"}</p>
                <div className="flex items-center gap-2 mt-1">
                   <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                   <p className="text-zinc-500 text-[8px] md:text-[9px] font-black uppercase tracking-widest truncate">{form.title || "Awaiting Title"}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* --- RIGHT FORM AREA --- */}
          <div className="lg:col-span-8 w-full">
            <AnimatePresence mode="wait">
              <motion.form 
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={nextStep} 
                className="space-y-8 md:space-y-12"
              >
                {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">{error}</div>}

                {/* STEP 1: IDENTITY */}
                {step === 1 && (
                  <div className="space-y-8 md:space-y-10">
                    <header>
                      <h2 className="text-white text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-tight">Identity<br/>Authentication</h2>
                      <p className="text-zinc-500 text-sm font-medium mt-4">Initialize your secure profile on the global talent grid.</p>
                    </header>
                    <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                      <ProtocolInput icon={<FiUser />} placeholder="Full Legal Name" value={form.name} onChange={v => handleInputChange("name", v)} />
                      <ProtocolInput icon={<FiMail />} placeholder="Secure Email Link" type="email" value={form.email} onChange={v => handleInputChange("email", v)} />
                    </div>
                    <ProtocolInput icon={<FiLock />} placeholder="Security Passphrase" type="password" value={form.password} onChange={v => handleInputChange("password", v)} />
                  </div>
                )}

                {/* STEP 2: EXPERTISE */}
                {step === 2 && (
                  <div className="space-y-8 md:space-y-10">
                    <header>
                      <h2 className="text-white text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-tight">Service<br/>Architecture</h2>
                    </header>

                    <div className="bg-white/[0.02] p-0.5 md:p-1 border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem]">
                      <div className="bg-[#0a0a0c] p-6 md:p-8 rounded-[1.4rem] md:rounded-[2.3rem] space-y-6 shadow-2xl">
                        <ProtocolInput icon={<FiBriefcase />} placeholder="Lead Profession" value={form.title} onChange={v => handleInputChange("title", v)} />
                        <div className="relative">
                          <textarea 
                            className="w-full bg-white/[0.03] border border-white/10 rounded-[1.2rem] md:rounded-[1.5rem] p-4 md:p-6 text-white outline-none focus:border-violet-500/50 h-32 transition-all resize-none text-sm font-medium"
                            placeholder="Operational Mission Brief. What specific solutions do you engineer?"
                            value={form.bio}
                            onChange={e => handleInputChange("bio", e.target.value)}
                          />
                          <div className="absolute bottom-4 right-6 text-[7px] md:text-[8px] font-black text-zinc-700 tracking-[0.2em] uppercase">Narrative Protocol</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
                        <p className="text-[10px] font-black uppercase text-violet-500 tracking-[0.4em]">Capability Matrix ({form.skills.length})</p>
                        <div className="relative w-full sm:w-64">
                           <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-xs" />
                           <input 
                            type="text" 
                            placeholder="Filter Capabilities..." 
                            className="bg-white/[0.03] border border-white/10 rounded-full pl-10 pr-4 py-2 text-[10px] uppercase font-black tracking-widest text-white outline-none focus:border-violet-500/50 transition-all w-full"
                            onChange={(e) => setSearchTerm(e.target.value)}
                           />
                        </div>
                      </div>

                      <div className="p-1 bg-white/[0.01] border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem]">
                        <div className="max-h-[300px] md:max-h-[400px] overflow-y-auto p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 custom-scrollbar">
                          {filteredSkills.map(skill => (
                            <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                              className={`flex items-center justify-between px-4 py-3 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all duration-300 border ${form.skills.includes(skill) ? "bg-violet-600/20 border-violet-500 text-white" : "bg-white/[0.03] border-white/5 text-zinc-600 hover:border-violet-500/40"}`}>
                              <span className="truncate mr-2">{skill}</span>
                              {form.skills.includes(skill) && <FiCheckCircle className="text-violet-400 shrink-0" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: DEPLOYMENT */}
                {step === 3 && (
                  <div className="space-y-8 md:space-y-10">
                    <header>
                      <h2 className="text-white text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-tight">Market<br/>Connectivity</h2>
                    </header>
                    <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
                      <div className="bg-white/[0.02] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 space-y-6">
                         <ProtocolInput icon={<FiDollarSign />} placeholder="Hourly Rate (₦)" type="number" value={form.hourlyRate} onChange={v => handleInputChange("hourlyRate", v)} />
                         <ProtocolSelect label="Availability Status" options={["Immediate", "72 Hours Notice", "Strategic Only"]} onChange={v => handleInputChange("availability", v)} />
                      </div>
                      <div className="bg-white/[0.02] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 space-y-6">
                         <ProtocolInput icon={<FiLinkedin />} placeholder="LinkedIn Pulse" value={form.linkedin} onChange={v => handleInputChange("linkedin", v)} />
                         <ProtocolInput icon={<FiGithub />} placeholder="Source Repository" value={form.github} onChange={v => handleInputChange("github", v)} />
                      </div>
                    </div>
                    <div className="bg-violet-600/5 border border-violet-500/20 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-black border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                            {form.avatar ? <img src={form.avatar} className="w-full h-full object-cover" alt="preview" /> : <FiCamera className="text-zinc-700 text-2xl" />}
                         </div>
                         <div>
                            <p className="text-white text-lg font-black italic">Identity Asset</p>
                            <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mt-1">Biometric Portrait Required</p>
                         </div>
                      </div>
                      <label className="w-full sm:w-auto cursor-pointer bg-white text-black px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-500 hover:text-white transition-all text-center">
                        Upload Asset
                        <input type="file" className="hidden" onChange={handleFileChange} />
                      </label>
                    </div>
                  </div>
                )}

                {/* CONTROLS */}
                <div className="flex flex-col-reverse sm:flex-row items-center justify-between pt-8 md:pt-12 border-t border-white/5 gap-6">
                  {step > 1 ? (
                    <button type="button" onClick={() => setStep(step - 1)} className="flex items-center gap-3 text-zinc-500 font-black uppercase text-[10px] tracking-[0.3em] hover:text-white transition-all group">
                      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all"><FiChevronLeft /></div> 
                      Previous Phase
                    </button>
                  ) : <div className="hidden sm:block" />}
                  
                  <button type="submit" disabled={loading} className="w-full sm:w-auto group relative px-8 md:px-12 py-5 md:py-6 bg-white rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50">
                    <div className="relative z-10 flex items-center justify-center gap-4 text-black font-black uppercase italic tracking-tighter text-lg md:text-xl">
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
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

// --- ELITE UI SUB-COMPONENTS ---
const ProtocolInput = ({ icon, placeholder, type = "text", value, onChange }) => (
  <div className="relative w-full group">
    <div className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-400 transition-all duration-300">
      {icon}
    </div>
    <input 
      type={type} required value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full pl-12 md:pl-14 pr-6 py-4 md:py-5 bg-white/[0.03] border border-white/5 rounded-2xl text-white outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-all placeholder:text-zinc-700 placeholder:font-bold placeholder:uppercase placeholder:text-[8px] md:placeholder:text-[9px] placeholder:tracking-widest text-sm"
    />
  </div>
);

const ProtocolSelect = ({ label, options, onChange }) => (
  <div className="space-y-3">
    <label className="text-[8px] md:text-[9px] font-black uppercase text-violet-500/60 ml-2 tracking-widest">{label}</label>
    <div className="relative">
      <select 
        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 md:p-5 text-white outline-none focus:border-violet-500/40 transition-all appearance-none cursor-pointer text-[9px] md:text-[10px] font-black uppercase tracking-widest"
        onChange={e => onChange(e.target.value)}
      >
        {options.map(opt => <option key={opt} value={opt} className="bg-[#0a0a0c]">{opt}</option>)}
      </select>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30"><FiChevronRight className="rotate-90" /></div>
    </div>
  </div>
);

export default Register;