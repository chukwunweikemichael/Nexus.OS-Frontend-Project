import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import {
  FiEye,
  FiEyeOff,
  FiChevronRight,
  FiCommand,
  FiActivity,
  FiGlobe,
  FiShield,
} from "react-icons/fi";

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) return setError("IDENTITY_REQUIRED");

    try {
      setLoading(true);
      const loggedInUser = await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      setTimeout(() => {
        if (
          loggedInUser &&
          (loggedInUser.role === "admin" || loggedInUser.role === "Admin")
        ) {
          window.location.href = "/admin";
        } else {
          window.location.href = "/dashboard";
        }
      }, 800);
    } catch (err) {
      setError("ACCESS_DENIED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000] text-white selection:bg-amber-500 selection:text-black font-sans overflow-x-hidden">
      <div className="fixed top-0 w-full z-[100] backdrop-blur-xl border-b border-white/5">
        <Navbar />
      </div>

      {/* AMBIENT DIMENSION */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-amber-600/[0.07] blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-white/[0.02] blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dlbv8sc6e/image/upload/v1700000000/noise_uvw6id.png')] opacity-[0.02] pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen pt-[180px] pb-20 px-8">
        {/* BRAND IDENTITY */}
        <div className="mb-20 text-center animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="inline-flex items-center gap-4 px-5 py-2 rounded-full border border-white/10 bg-white/5 mb-10 shadow-2xl">
            <FiShield className="text-amber-500 text-xs" />
            <span className="text-[9px] font-black tracking-[6px] uppercase text-white/50">
TALENT_SYNC_PROTOCOL: ACTIVE            </span>
          </div>

          <h1 className="text-[clamp(4rem,15vw,10rem)] font-black leading-[0.75] tracking-[-0.07em] uppercase">
            NEXUS
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/10 italic font-thin tracking-tighter">
              .OS
            </span>
          </h1>
        </div>

        {/* INTERFACE CONSOLE */}
        <div className="w-full max-w-[1200px] relative animate-in zoom-in-95 duration-1000">
          <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[30px] opacity-20" />

          <div className="relative bg-[#050505]/60 border border-white/10 backdrop-blur-[120px] rounded-[28px] overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* STATUS PANEL */}
              <div className="hidden lg:flex flex-col justify-between p-16 w-[40%] border-r border-white/5 bg-white/[0.01]">
                <div className="space-y-16">
                  <div className="flex items-center gap-5">
                    <div className="h-10 w-10 bg-white flex items-center justify-center rounded-sm">
                      <FiCommand className="text-black text-xl" />
                    </div>
                    <span className="text-xs font-black tracking-[5px] uppercase opacity-40">
                      Nexus_Core_Protocol
                    </span>
                  </div>

                  <div className="space-y-8">
                    <h2 className="text-5xl font-black tracking-tighter leading-none uppercase">
                      Gig
                      <br />
                      Authority.
                    </h2>
                    <p className="text-[10px] text-white/30 tracking-[3px] uppercase leading-relaxed max-w-xs">
                      The premier ecosystem for elite freelancing, secure escrow, and global 
                      project deployment.
                    </p>
                  </div>
                </div>

                <div className="space-y-8 pt-10 border-t border-white/5">
                  <div className="flex items-center gap-4">
                    <FiActivity className="text-amber-500 animate-pulse" />
                    <span className="text-[10px] font-black tracking-[4px] uppercase">
                      Market_Nodes: 12,841
                    </span>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-white/10">
                    <span>ESCROW_ENCRYPTED</span>
                    <span>OS_STABLE</span>
                  </div>
                </div>
              </div>

              {/* ACTION PORTAL */}
              <div className="p-12 md:p-24 w-full lg:w-[60%] relative">
                {success ? (
                  <div className="text-center py-20 animate-in fade-in duration-700">
                    <FiGlobe className="text-6xl text-amber-500 mx-auto mb-8 animate-spin-slow" />
                    <h3 className="text-4xl font-black tracking-tighter uppercase italic">
                      Link Established
                    </h3>
                    <button
                      onClick={() => setSuccess(false)}
                      className="mt-12 px-14 py-4 border border-white/10 hover:bg-white hover:text-black transition-all text-[10px] font-black tracking-[6px] uppercase rounded-full"
                    >
                      Restart Protocol
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={
                      view === "login"
                        ? handleSubmit
                        : (e) => {
                            e.preventDefault();
                            setSuccess(true);
                          }
                    }
                    className="space-y-16"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-8">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black tracking-[10px] text-amber-500 uppercase">
                          {view === "login" ? "Talent_Sync" : "Key_Recovery"}
                        </p>
                        <h4 className="text-2xl font-light tracking-tighter italic text-white/40">
                          Initialize session.
                        </h4>
                      </div>
                    </div>

                    {error && (
                      <div className="text-[10px] font-mono text-red-500 tracking-[4px] uppercase italic border-l-2 border-red-500 pl-4">
                        {`> ${error}`}
                      </div>
                    )}

                    <div className="space-y-12">
                      <div className="group">
                        <label className="text-[9px] font-black tracking-[5px] text-white/20 uppercase mb-5 block group-focus-within:text-white transition-colors">
                          Freelancer_UID
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          className="w-full bg-transparent border-b border-white/10 py-5 text-4xl font-extralight outline-none focus:border-amber-500 transition-all placeholder:text-white/5 tracking-tighter"
                          placeholder="talent@nexus.os"
                        />
                      </div>

                      {view === "login" && (
                        <div className="group relative">
                          <label className="text-[9px] font-black tracking-[5px] text-white/20 uppercase mb-5 block group-focus-within:text-white transition-colors">
                            Private_Access_Key
                          </label>
                          <input
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={(e) =>
                              setForm({ ...form, password: e.target.value })
                            }
                            className="w-full bg-transparent border-b border-white/10 py-5 text-4xl font-extralight outline-none focus:border-amber-500 transition-all placeholder:text-white/5 tracking-tighter"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 bottom-6 text-white/10 hover:text-white transition-colors"
                          >
                            {showPassword ? <FiEyeOff size={28} /> : <FiEye size={28} />}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 space-y-10">
                      <button
                        type="submit"
                        disabled={loading}
                        className="group/btn relative w-full h-24 bg-white text-black hover:bg-amber-500 transition-all duration-500 rounded-sm shadow-[0_0_50px_rgba(255,255,255,0.1)] active:scale-[0.98]"
                      >
                        <span className="flex items-center justify-center gap-6 font-black text-[11px] tracking-[15px] uppercase">
                          {loading ? "Decrypting" : "Enter Network"}
                          <FiChevronRight className="text-3xl group-hover/btn:translate-x-4 transition-transform duration-500" />
                        </span>
                      </button>

                      <div className="flex justify-between items-center px-2">
                        <button
                          type="button"
                          onClick={() =>
                            setView(view === "login" ? "forgot" : "login")
                          }
                          className="text-[10px] font-black tracking-[6px] text-white/10 hover:text-white uppercase transition-all"
                        >
                          {view === "login" ? "Connection Lost" : "Return to Sync"}
                        </button>
                        <span className="text-[10px] font-black tracking-[4px] text-white/5 uppercase italic">
                          NEXUS.OS © 2026
                        </span>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 opacity-[0.03] select-none pointer-events-none">
          <p className="text-[20vw] font-black tracking-[-0.12em] uppercase leading-none">Marketplace</p>
        </div>
      </div>
    </div>
  );
};

export default Login;