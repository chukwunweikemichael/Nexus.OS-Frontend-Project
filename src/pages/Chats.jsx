import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FiMessageSquare, FiChevronRight, FiClock, FiActivity } from "react-icons/fi";

const playSound = (url) => {
  const audio = new Audio(url);
  audio.volume = 0.1;
  audio.play().catch(() => {});
};

const Chats = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("conversations")) || [];
      const userChats = data.filter(
        (chat) =>
          chat.participants?.includes(user?.id) || chat.userId === user?.id
      );

      userChats.sort((a, b) => {
        const aTime = new Date(a.messages?.[a.messages.length - 1]?.timestamp || 0);
        const bTime = new Date(b.messages?.[b.messages.length - 1]?.timestamp || 0);
        return bTime - aTime;
      });

      setChats(userChats);
    } catch {
      setChats([]);
    }
  }, [user]);

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050508] text-white overflow-hidden font-sans selection:bg-indigo-500/30">
      <Navbar />

      {/* --- HYPER-GLOW BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            x: mousePos.x * 0.02, 
            y: mousePos.y * 0.02,
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: mousePos.x * -0.02, 
            y: mousePos.y * -0.02 
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]" 
        />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto pt-32 pb-20 px-6">
        
        {/* --- HEADER SECTION --- */}
        <header className="mb-16 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
              Nexus <span className="text-indigo-500">Channels</span>
            </h2>
            <div className="flex items-center gap-3 mt-4 opacity-50 justify-center lg:justify-start">
              <FiActivity className="text-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.4em] uppercase">Active Neural Network</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] font-black tracking-widest uppercase text-indigo-300"
          >
            {chats.length} Total Connections
          </motion.div>
        </header>

        {/* --- CHATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chats.length === 0 ? (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-[3rem] bg-white/[0.02]">
              <FiMessageSquare className="mx-auto text-4xl text-slate-700 mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm">Empty Transmission Log</p>
            </div>
          ) : (
            chats.map((chat, index) => {
              const lastMessage = chat.messages?.[chat.messages.length - 1];

              return (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/chat/${chat.id}`}
                    onMouseEnter={() => playSound("/sounds/pop.mp3")}
                    className="group relative block p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-indigo-500/40 transition-all duration-500 overflow-hidden"
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-2xl group-hover:rotate-6 transition-transform duration-500">
                            {chat.userInitials || "U"}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#050508]" />
                        </div>

                        {/* Text Info */}
                        <div className="max-w-[200px] lg:max-w-sm">
                          <h3 className="text-lg font-black uppercase italic tracking-tighter group-hover:text-indigo-400 transition-colors">
                            {chat.title || `CHANNEL_${chat.gigId}`}
                          </h3>
                          <p className="text-slate-500 text-xs font-bold mt-1 truncate uppercase tracking-wider">
                            {lastMessage?.text || "Standby for incoming..."}
                          </p>
                        </div>
                      </div>

                      {/* Time & Action */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                          <FiClock />
                          {lastMessage?.timestamp ? new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                          <FiChevronRight className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </div>
      </main>

      {/* --- CUSTOM STYLES --- */}
      <style>{`
        .selection\\:bg-indigo-500\\/30 ::selection {
          background-color: rgba(99, 102, 241, 0.3);
        }
        
        /* Smooth Scrolling */
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: #050508;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Chats;