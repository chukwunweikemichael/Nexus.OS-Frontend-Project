import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiMic, FiSmile, FiPaperclip, FiMoon, FiSun, FiCheckCircle, FiCpu } from "react-icons/fi";

const formatTime = (time) => {
  const msgTime = new Date(time);
  const now = new Date();
  const diff = Math.floor((now - msgTime) / 1000);
  if (diff < 60) return "JUST NOW";
  if (diff < 3600) return `${Math.floor(diff / 60)}M AGO`;
  return msgTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const AI_PERSONAS = [
  { name: "Support Protocol", style: "from-indigo-500 to-blue-600", glow: "rgba(99, 102, 241, 0.4)" },
  { name: "Mentor AI", style: "from-emerald-400 to-teal-600", glow: "rgba(52, 211, 153, 0.4)" },
  { name: "Nexus Friend", style: "from-rose-400 to-purple-600", glow: "rgba(251, 113, 133, 0.4)" },
];

const EMOJIS = ["✨", "🔥", "💎", "🤝", "🚀", "❤️", "⚡", "🤖", "🌈", "💠"];

const ChatPage = () => {
  const { id } = useParams();
  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [theme, setTheme] = useState("dark");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const chats = JSON.parse(localStorage.getItem("conversations")) || [];
    const found = chats.find((c) => c.id === Number(id));
    setChat(found);
  }, [id]);

  useEffect(() => scrollToBottom(), [chat, isTyping]);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  const sendMessage = () => {
    if (!text.trim() && !selectedFile) return;

    const newMsg = {
      text,
      sender: "user",
      time: new Date().toISOString(),
      reactions: [],
      file: selectedFile ? URL.createObjectURL(selectedFile) : null,
    };

    const chats = JSON.parse(localStorage.getItem("conversations")) || [];
    const updatedChats = chats.map(c => c.id === Number(id) ? { ...c, messages: [...c.messages, newMsg] } : c);
    
    localStorage.setItem("conversations", JSON.stringify(updatedChats));
    setChat(updatedChats.find(c => c.id === Number(id)));
    setText("");
    setSelectedFile(null);

    setIsTyping(true);
    setTimeout(() => {
      const persona = AI_PERSONAS[Math.floor(Math.random() * AI_PERSONAS.length)];
      const aiMsg = {
        text: "Analyzing incoming transmission... Connection established. How can I assist your objectives?",
        sender: "ai",
        persona: persona.name,
        style: persona.style,
        glow: persona.glow,
        time: new Date().toISOString(),
        reactions: [],
      };

      const freshChats = JSON.parse(localStorage.getItem("conversations")) || [];
      const afterAI = freshChats.map(c => c.id === Number(id) ? { ...c, messages: [...c.messages, aiMsg] } : c);
      
      localStorage.setItem("conversations", JSON.stringify(afterAI));
      setChat(afterAI.find(c => c.id === Number(id)));
      setIsTyping(false);
    }, 2200);
  };

  if (!chat) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#08080a] text-indigo-500">
      <FiCpu className="text-6xl animate-spin-slow mb-4 opacity-50" />
      <p className="mf tracking-[0.6em] font-bold text-xs uppercase animate-pulse">Synchronizing Data</p>
    </div>
  );

  return (
    <div className={`min-h-screen relative flex flex-col transition-all duration-1000 overflow-hidden ${theme === "dark" ? "bg-[#050507] text-white" : "bg-slate-50 text-slate-900"}`}>
      <Navbar />

      {/* --- ANIMATED MESH BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className={`absolute top-[-20%] left-[-10%] w-[70%] h-[70%] blur-[140px] rounded-full opacity-30 ${theme === "dark" ? "bg-indigo-600" : "bg-blue-300"}`} 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, -40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className={`absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] blur-[140px] rounded-full opacity-20 ${theme === "dark" ? "bg-purple-600" : "bg-pink-300"}`} 
        />
      </div>

      <main className="flex-1 flex flex-col relative z-10 max-w-5xl mx-auto w-full px-6 pt-24 pb-10">
        
        {/* --- HEADER --- */}
        <header className="flex items-end justify-between mb-10 px-2">
          <div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">
              Nexus <span className="text-indigo-500">{chat.name || "Terminal"}</span>
            </h2>
            <div className="flex items-center gap-2 mt-3 opacity-60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Secure Link Active</span>
            </div>
          </div>
          <button 
            onClick={toggleTheme} 
            className="group w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-500 shadow-2xl"
          >
            {theme === "dark" ? <FiSun className="group-hover:rotate-90 transition-transform duration-500" /> : <FiMoon className="group-hover:-rotate-12 transition-transform duration-500" />}
          </button>
        </header>

        {/* --- CHAT AREA --- */}
        <div className={`flex-1 overflow-y-auto px-8 py-12 space-y-10 rounded-[3.5rem] border backdrop-blur-3xl custom-scrollbar transition-all duration-700 ${theme === "dark" ? "bg-white/[0.01] border-white/5 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)]" : "bg-white/40 border-black/5 shadow-xl"}`}>
          <AnimatePresence initial={false}>
            {chat.messages.map((msg, i) => {
              const isUser = msg.sender === "user";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div className={`relative group max-w-[80%] ${isUser ? "text-right" : "text-left"}`}>
                    {!isUser && (
                      <span className="inline-block text-[10px] font-black tracking-[0.25em] text-indigo-400 uppercase mb-3 px-1">
                        {msg.persona || "SYSTEM"}
                      </span>
                    )}

                    <div 
                      className={`relative px-8 py-6 rounded-[2.8rem] text-[0.95rem] leading-relaxed shadow-2xl transition-all duration-500 group-hover:translate-y-[-4px] ${
                        isUser 
                        ? "bg-gradient-to-br from-indigo-500 to-blue-700 text-white rounded-tr-none" 
                        : "bg-white/[0.04] border border-white/10 text-white rounded-tl-none"
                      }`}
                      style={{ boxShadow: !isUser ? `0 20px 40px -15px ${msg.glow || 'rgba(0,0,0,0.3)'}` : '' }}
                    >
                      {msg.text}
                      {msg.file && (
                        <div className="mt-5 p-2 bg-black/30 rounded-3xl border border-white/10 overflow-hidden group/img">
                          <img src={msg.file} alt="attachment" className="w-full h-48 object-cover rounded-2xl group-hover/img:scale-110 transition-transform duration-700" />
                        </div>
                      )}
                    </div>

                    <div className={`flex items-center gap-3 mt-3 px-4 text-[9px] font-black tracking-[0.2em] opacity-40 uppercase ${isUser ? "justify-end" : "justify-start"}`}>
                      <span>{formatTime(msg.time)}</span>
                      {isUser && <FiCheckCircle className="text-indigo-400" />}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex ml-4">
              <div className="flex gap-2 p-5 bg-white/5 rounded-full border border-white/5 shadow-inner">
                {[0, 1, 2].map((d) => (
                  <motion.div
                    key={d}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }}
                    className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,1)]"
                  />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* --- INPUT STATION --- */}
        <div className="mt-10 relative px-2">
          <div className="absolute inset-x-10 bottom-0 h-10 bg-indigo-500/20 blur-[60px] opacity-0 group-focus-within:opacity-100 transition-opacity" />
          
          <div className={`relative flex items-center gap-4 p-4 rounded-[3rem] border transition-all duration-500 shadow-2xl ${theme === "dark" ? "bg-white/[0.03] border-white/10 focus-within:border-indigo-500/40" : "bg-white border-black/5"}`}>
            
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
              className="w-14 h-14 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all active:scale-90"
            >
              <FiSmile size={22} />
            </button>

            <label className="cursor-pointer w-14 h-14 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all active:scale-90">
              <FiPaperclip size={22} />
              <input type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} />
            </label>

            <input
              type="text"
              placeholder="ENTER TRANSMISSION..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-transparent border-none outline-none text-xs font-black uppercase tracking-[0.2em] placeholder:text-slate-700 text-white"
            />

            <button 
              onClick={sendMessage} 
              className="bg-white text-black px-10 py-5 rounded-full font-black uppercase italic tracking-tighter text-xs flex items-center gap-3 hover:bg-indigo-500 hover:text-white transition-all shadow-xl active:scale-95"
            >
              SEND <FiSend size={14} />
            </button>
          </div>

          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                className="absolute bottom-28 left-6 p-6 bg-[#0c0c12] border border-white/10 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] grid grid-cols-5 gap-4 backdrop-blur-3xl z-50"
              >
                {EMOJIS.map((e) => (
                  <button key={e} onClick={() => { setText(prev => prev + e); setShowEmojiPicker(false); }} className="text-2xl hover:scale-125 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all p-2">
                    {e}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
        .mf { font-family: 'Space Mono', 'JetBrains Mono', monospace; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ChatPage;