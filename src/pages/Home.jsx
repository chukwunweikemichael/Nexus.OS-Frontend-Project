import Navbar from "../components/Navbar";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import {
  FiStar, FiArrowUp, FiHeart, FiEye, FiCamera,
  FiTrendingUp, FiAward, FiShield, FiSearch, FiBriefcase,
  FiZap, FiCheckCircle, FiDollarSign, FiMusic, FiArrowUpRight,
  FiGlobe, FiMessageCircle, FiUserCheck, FiCommand,
} from "react-icons/fi";
import {
  RiTwitterXFill, RiInstagramLine, RiLinkedinBoxFill, RiGithubFill,
} from "react-icons/ri";

import heroBg     from "../assets/hero-freelance-collaboration.jpg";
import gigBranding    from "../assets/gig-branding.jpg";
import gigContent     from "../assets/gig-content.jpg";
import gigVideo       from "../assets/gig-videoedit.jpg";
import gigSocial      from "../assets/gig-social-marketing.jpg";
import gigUx          from "../assets/gig-uxui.jpg";
import gigPhotography from "../assets/gig-photography.jpg";
import gigCopywriting from "../assets/gig-copywriting.jpg";
import gigAnimation   from "../assets/gig-animation.jpg";
import gigWeb         from "../assets/gig-webdev.jpg";
import gigIllustration from "../assets/gig-illustration.jpg";
import gigPodcast     from "../assets/gig-podcast.jpg";
import gigStrategy    from "../assets/gig-strategy.jpg";

/* ─── THEME-AWARE CSS ─────────────────────────────────────
   Dark vars are set by default. Light vars override when
   data-theme="light" is on <html>. Navbar toggles that attr.
──────────────────────────────────────────────────────────── */
const buildCSS = () => `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;400;800&family=Playfair+Display:ital,wght@0,900;1,400&family=JetBrains+Mono:wght@300&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --g:#D4AF37; --gl:#F9F6EE; --gd:#1A1A1A; --gm:rgba(212,175,55,0.08);
  --ink:#050505; --s1:rgba(255,255,255,0.03); --txt:#F4F4F4;
  --dim:rgba(255,255,255,0.4); --accent:#FFD700; --vi:#7C5FE0;
  --card-bg:rgba(255,255,255,0.03); --card-border:rgba(255,255,255,0.07);
  --filter-bg:rgba(8,8,16,0.94); --input-bg:rgba(255,255,255,0.04);
  --input-border:rgba(255,255,255,0.07); --text-sub:rgba(238,232,216,0.4);
  --section-border:rgba(255,255,255,0.04);
  --marquee-text:rgba(212,175,55,0.7); --marquee-dim:rgba(255,255,255,0.25);
  --step-bg:rgba(255,255,255,0.03); --step-border:rgba(255,255,255,0.06);
  --talent-bg:rgba(255,255,255,0.03); --talent-border:rgba(255,255,255,0.06);
  --footer-bg:rgba(0,0,0,0.5); --footer-link:rgba(255,255,255,0.4);
  --stat-sub:rgba(191,160,80,0.35); --hero-overlay:rgba(8,8,16,0.75);
}

/* ── LIGHT THEME OVERRIDES ── */
[data-theme="light"]:root,
html[data-theme="light"]{
  --ink:#F0EDE6;
  --txt:#1C1410;
  --s1:rgba(0,0,0,0.03);
  --dim:rgba(28,20,16,0.6);
  --card-bg:rgba(255,255,255,0.85);
  --card-border:rgba(0,0,0,0.09);
  --filter-bg:rgba(240,237,230,0.97);
  --input-bg:rgba(0,0,0,0.05);
  --input-border:rgba(0,0,0,0.12);
  --text-sub:rgba(28,20,16,0.5);
  --section-border:rgba(0,0,0,0.07);
  --marquee-text:rgba(140,100,20,0.85);
  --marquee-dim:rgba(28,20,16,0.35);
  --step-bg:rgba(255,255,255,0.7);
  --step-border:rgba(0,0,0,0.08);
  --talent-bg:rgba(255,255,255,0.8);
  --talent-border:rgba(0,0,0,0.07);
  --footer-bg:rgba(220,210,195,0.6);
  --footer-link:rgba(28,20,16,0.5);
  --stat-sub:rgba(140,100,20,0.5);
  --hero-overlay:rgba(245,240,230,0.45);
}

html{scroll-behavior:smooth}
body{background:var(--ink);color:var(--txt);overflow-x:hidden;font-family:'Plus Jakarta Sans',sans-serif;transition:background .4s,color .4s;}

/* cursor */
.cur-dot{position:fixed;width:6px;height:6px;border-radius:50%;background:var(--g);pointer-events:none;z-index:99999;transform:translate(-50%,-50%);mix-blend-mode:difference;}
.cur-ring{position:fixed;width:40px;height:40px;border-radius:50%;border:1px solid rgba(212,175,55,0.3);pointer-events:none;z-index:99998;transform:translate(-50%,-50%);transition:all .15s ease-out;}
.cur-ring.hov{width:64px;height:64px;border-color:rgba(212,175,55,0.8);}

/* typography */
.cf{font-family:'Playfair Display',serif}
.sf{font-family:'Plus Jakarta Sans',sans-serif}
.mf{font-family:'JetBrains Mono',monospace}

/* grain — lighter in light mode */
body::after{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");opacity:.3;pointer-events:none;z-index:9999;}
[data-theme="light"] body::after{opacity:.12;}

/* gradients */
.gg{background:linear-gradient(135deg,#FFF 30%,#D4AF37 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
[data-theme="light"] .gg{background:linear-gradient(135deg,#3D2B00 30%,#B8860B 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.gs{background:linear-gradient(180deg,rgba(255,255,255,1) 0%,rgba(255,255,255,0.2) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
[data-theme="light"] .gs{background:linear-gradient(180deg,#1C1410 0%,rgba(28,20,16,0.4) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}

/* ambient orbs */
.amb{position:fixed;inset:0;pointer-events:none;z-index:0}
.amb-1{position:absolute;width:80vw;height:80vw;background:radial-gradient(circle,rgba(212,175,55,0.05) 0%,transparent 70%);top:-20%;right:-10%;animation:drift 20s infinite alternate}
.amb-2{position:absolute;width:60vw;height:60vw;background:radial-gradient(circle,rgba(124,95,224,0.04) 0%,transparent 70%);bottom:-15%;left:-10%;animation:drift 25s infinite alternate-reverse}
.amb-3{position:absolute;width:40vw;height:40vw;background:radial-gradient(circle,rgba(31,255,168,0.03) 0%,transparent 70%);top:40%;right:20%;animation:drift 18s infinite alternate}
[data-theme="light"] .amb-1{background:radial-gradient(circle,rgba(212,175,55,0.08) 0%,transparent 70%);}
[data-theme="light"] .amb-2{background:radial-gradient(circle,rgba(124,95,224,0.06) 0%,transparent 70%);}
@keyframes drift{from{transform:translate(0,0)}to{transform:translate(-50px,50px)}}

.grid-tex{position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);background-size:100px 100px;mask-image:radial-gradient(circle at 50% 50%,black,transparent);}
[data-theme="light"] .grid-tex{background-image:linear-gradient(rgba(0,0,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.03) 1px,transparent 1px);}

.div{height:1px;background:linear-gradient(90deg,transparent,rgba(191,160,80,0.2),transparent)}
[data-theme="light"] .div{background:linear-gradient(90deg,transparent,rgba(140,100,20,0.25),transparent)}

::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:var(--ink)}
::-webkit-scrollbar-thumb{background:var(--g);border-radius:3px}

/* animations */
@keyframes wordReveal{0%{opacity:0;transform:translateY(100%) skewY(8deg);filter:blur(8px)}100%{opacity:1;transform:translateY(0) skewY(0deg);filter:blur(0)}}
.word-reveal{display:inline-block;overflow:hidden;vertical-align:bottom;}
.word-inner{display:inline-block;animation:wordReveal 1s cubic-bezier(0.16,1,0.3,1) forwards;opacity:0;}

@keyframes charIn{0%{opacity:0;transform:translateY(40px) rotateX(-40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}
.char-split span{display:inline-block;animation:charIn .6s cubic-bezier(0.16,1,0.3,1) forwards;opacity:0;}

@keyframes glitch1{0%,95%,100%{clip-path:inset(0 0 100% 0);transform:translateX(0)}96%{clip-path:inset(20% 0 60% 0);transform:translateX(-4px)}97%{clip-path:inset(60% 0 20% 0);transform:translateX(4px)}98%{clip-path:inset(40% 0 40% 0);transform:translateX(-2px)}}
@keyframes glitch2{0%,95%,100%{clip-path:inset(0 0 100% 0);transform:translateX(0)}96%{clip-path:inset(50% 0 30% 0);transform:translateX(3px)}97%{clip-path:inset(10% 0 70% 0);transform:translateX(-3px)}98%{clip-path:inset(30% 0 50% 0);transform:translateX(2px)}}
.glitch-wrap{position:relative;display:inline-block}
.glitch-wrap::before,.glitch-wrap::after{content:attr(data-text);position:absolute;inset:0;}
.glitch-wrap::before{color:#1FFFA8;animation:glitch1 8s infinite;}
.glitch-wrap::after{color:#7C5FE0;animation:glitch2 8s infinite .15s;}

@keyframes mq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes mqR{0%{transform:translateX(-50%)}100%{transform:translateX(0%)}}
.mq-track{animation:mq 35s linear infinite;display:flex;gap:0;width:max-content;}
.mq-track-rev{animation:mqR 40s linear infinite;display:flex;gap:0;width:max-content;}
.mq-track:hover,.mq-track-rev:hover{animation-play-state:paused}

@keyframes floatBadge{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.float-badge{animation:floatBadge 3s ease-in-out infinite}
@keyframes scrollLine{0%{height:0;opacity:1}80%{height:40px;opacity:1}100%{height:40px;opacity:0}}
.scroll-line{animation:scrollLine 2s ease-in-out infinite}

.fu{opacity:0;transform:translateY(40px);transition:opacity .8s cubic-bezier(0.16,1,0.3,1),transform .8s cubic-bezier(0.16,1,0.3,1)}
.fu.vis{opacity:1;transform:translateY(0)}

.gc{transition:transform .45s cubic-bezier(0.16,1,0.3,1),box-shadow .45s}
.gc:hover{transform:translateY(-10px) scale(1.015);box-shadow:0 40px 80px rgba(0,0,0,0.4),0 0 0 1px rgba(191,160,80,0.3),0 0 60px rgba(191,160,80,0.08)}
[data-theme="light"] .gc:hover{box-shadow:0 30px 70px rgba(0,0,0,0.15),0 0 0 1px rgba(140,100,20,0.2),0 0 40px rgba(191,160,80,0.1)}

.inp{transition:border-color .2s,box-shadow .2s}
.inp:focus{outline:none;border-color:var(--g)!important;box-shadow:0 0 0 3px rgba(191,160,80,0.1)}

.tag{font-size:11px;padding:4px 14px;border-radius:999px;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.04);color:var(--dim);transition:all .2s;cursor:default}
.tag:hover{border-color:rgba(191,160,80,0.4);color:var(--g)}
[data-theme="light"] .tag{border-color:rgba(0,0,0,0.08);background:rgba(0,0,0,0.04);}

@keyframes numGlow{0%,100%{text-shadow:0 0 30px rgba(191,160,80,0.3)}50%{text-shadow:0 0 60px rgba(191,160,80,0.7),0 0 100px rgba(191,160,80,0.3)}}
.ng{animation:numGlow 4s ease-in-out infinite}

@keyframes pd{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.8);opacity:.3}}
.pd{animation:pd 1.8s ease infinite}

.cat-sh{overflow:hidden}
.cat-sh::after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.06) 50%,transparent 60%);transform:translateX(-100%);transition:transform .6s ease}
.cat-sh:hover::after{transform:translateX(100%)}

@keyframes fillBar{from{width:0}to{width:var(--w)}}
.mb{height:2px;background:rgba(255,255,255,0.06);border-radius:999px;overflow:hidden}
.mf2{height:100%;background:linear-gradient(90deg,var(--g),var(--vi));border-radius:999px;animation:fillBar 1.4s cubic-bezier(0.16,1,0.3,1) forwards}
[data-theme="light"] .mb{background:rgba(0,0,0,0.08);}

.td{width:8px;height:8px;border-radius:999px;background:rgba(255,255,255,0.15);border:none;cursor:pointer;transition:all .3s;padding:0}
.td.a{width:28px;background:var(--g)}
[data-theme="light"] .td{background:rgba(0,0,0,0.15);}

@keyframes stepPulse{0%,100%{color:rgba(191,160,80,0.05)}50%{color:rgba(191,160,80,0.12)}}
.sn{animation:stepPulse 4s ease-in-out infinite}
[data-theme="light"] .sn{animation:none;color:rgba(191,160,80,0.08);}

.hstat{position:relative;padding:24px 28px;border-radius:20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);backdrop-filter:blur(12px);transition:border-color .3s,transform .3s;text-align:center}
.hstat:hover{border-color:rgba(191,160,80,0.3);transform:translateY(-3px)}
.hstat::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:60%;height:1px;background:linear-gradient(90deg,transparent,var(--g),transparent)}
[data-theme="light"] .hstat{background:rgba(255,255,255,0.6);border-color:rgba(0,0,0,0.08);backdrop-filter:blur(12px);}

.si{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);cursor:pointer;transition:all .25s;color:var(--dim);font-size:15px}
.si:hover{background:rgba(191,160,80,0.1);border-color:rgba(191,160,80,0.3);color:var(--g);transform:translateY(-3px)}
[data-theme="light"] .si{background:rgba(0,0,0,0.04);border-color:rgba(0,0,0,0.08);}

.fl{display:block;color:var(--footer-link);font-size:13px;margin-bottom:14px;transition:all .2s;text-decoration:none;}
.fl:hover{color:var(--g);transform:translateX(5px)}

.cta-btn{position:relative;overflow:hidden;padding:18px 44px;border-radius:14px;background:linear-gradient(135deg,#F5D97A,#BFA050,#8A6B2A);color:#080810;font-weight:700;font-size:15px;border:none;cursor:pointer;letter-spacing:.4px;transition:transform .2s,box-shadow .2s;font-family:'Plus Jakarta Sans',sans-serif;}
.cta-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.15),transparent);opacity:0;transition:opacity .3s}
.cta-btn:hover{transform:scale(1.04);box-shadow:0 20px 60px rgba(191,160,80,0.45)}
.cta-btn:hover::before{opacity:1}

.ghost-btn{padding:18px 44px;border-radius:14px;border:1px solid rgba(255,255,255,0.12);background:transparent;color:rgba(238,232,216,0.75);font-size:15px;cursor:pointer;transition:all .25s;font-family:'Plus Jakarta Sans',sans-serif;font-weight:500}
.ghost-btn:hover{border-color:rgba(191,160,80,0.35);color:var(--g)}
[data-theme="light"] .ghost-btn{border-color:rgba(0,0,0,0.15);color:rgba(28,20,16,0.7);}
[data-theme="light"] .ghost-btn:hover{border-color:rgba(140,100,20,0.4);color:var(--g)}

@keyframes lpr{0%{transform:scale(1);opacity:.6}100%{transform:scale(2.5);opacity:0}}
.lpr{position:absolute;inset:-4px;border-radius:50%;border:1px solid #1FFFA8;animation:lpr 2s ease-out infinite}

/* gig card light adjustments */
[data-theme="light"] .gig-card-body{ background:rgba(255,255,255,0.9) !important; border-color:rgba(0,0,0,0.09) !important; }
[data-theme="light"] .gig-card-body:hover{ border-color:rgba(140,100,20,0.25) !important; }
[data-theme="light"] .gig-price-text{ color:#7A5800 !important; }
[data-theme="light"] .gig-owner-text{ color:rgba(28,20,16,0.7) !important; }
[data-theme="light"] .gig-desc-text{ color:rgba(28,20,16,0.55) !important; }
[data-theme="light"] .gig-views-text{ color:rgba(28,20,16,0.4) !important; }
[data-theme="light"] .section-stat-sub{ color:rgba(28,20,16,0.45) !important; }

/* responsive */
@media(max-width:768px){
  .hide-mob{display:none!important}
  .mob-col{flex-direction:column}
  .mob-full{width:100%!important;min-width:0!important}
  .mob-center{text-align:center!important}
  .grid-2-1{grid-template-columns:1fr!important}
  .grid-3-1{grid-template-columns:1fr!important}
  .grid-4-2{grid-template-columns:1fr 1fr!important}
  .footer-grid{grid-template-columns:1fr 1fr!important}
}
@media(max-width:480px){
  .footer-grid{grid-template-columns:1fr!important}
  .grid-4-2{grid-template-columns:1fr!important}
  .hero-trust{flex-direction:column;gap:12px!important}
}
`;

if (typeof document !== "undefined") {
  let s = document.getElementById("aura-elite-css");
  if (!s) { s = document.createElement("style"); s.id = "aura-elite-css"; document.head.appendChild(s); }
  s.textContent = buildCSS();
}

/* ─── CURSOR ──────────────────────────────────────────── */
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) return;
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) { dot.current.style.left = `${e.clientX}px`; dot.current.style.top = `${e.clientY}px`; }
    };
    let raf;
    const lerp = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.15;
      if (ring.current) { ring.current.style.left = `${ringPos.current.x}px`; ring.current.style.top = `${ringPos.current.y}px`; }
      raf = requestAnimationFrame(lerp);
    };
    raf = requestAnimationFrame(lerp);
    const onEnter = () => ring.current?.classList.add("hov");
    const onLeave = () => ring.current?.classList.remove("hov");
    document.addEventListener("mousemove", onMove);
    document.querySelectorAll("a,button,.si").forEach(el => { el.addEventListener("mouseenter", onEnter); el.addEventListener("mouseleave", onLeave); });
    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);
  if (typeof window !== "undefined" && window.innerWidth < 1024) return null;
  return (<><div ref={dot} className="cur-dot" /><div ref={ring} className="cur-ring" /></>);
}

/* ─── FADE UP ─────────────────────────────────────────── */
function useFadeUp() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("vis"); }), { threshold: 0.15 });
    document.querySelectorAll(".fu").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── BRAND ───────────────────────────────────────────── */
function BrandName() {
  const name = "NEXUS.OS ";
  return (
    <div className="glitch-wrap char-split sf" data-text={name}
      style={{ fontSize: "clamp(32px,5vw,64px)", fontWeight: 900, color: "var(--gl)", letterSpacing: "-0.05em", textTransform: "uppercase" }}>
      {name.split("").map((c, i) => (
        <span key={i} style={{ animationDelay: `${i * 0.05}s` }}>
          {c === "_" ? <span style={{ opacity: 0.2, color: "var(--g)" }}>.</span> : c}
        </span>
      ))}
    </div>
  );
}

/* ─── PARTICLES ───────────────────────────────────────── */
function Particles() {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2 + 0.5, duration: Math.random() * 20 + 15,
    delay: Math.random() * -20, opacity: Math.random() * 0.3 + 0.05,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
          width: `${p.size}px`, height: `${p.size}px`, borderRadius: "50%",
          background: p.id % 2 === 0 ? "var(--g)" : "#FFF", opacity: p.opacity,
          boxShadow: p.id % 2 === 0 ? "0 0 10px rgba(212,175,55,0.4)" : "none",
          animation: `drift ${p.duration}s linear ${p.delay}s infinite alternate`,
        }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN HOME COMPONENT
═══════════════════════════════════════════════════════ */
const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [gigs, setGigs] = useState([]);
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [likedGigs, setLikedGigs] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [liveActivity, setLiveActivity] = useState(62);
  const [onlineUsers, setOnlineUsers] = useState(1876);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const trendingRef = useRef(null);
  const featuredRef = useRef(null);
  const userSkills = ["design", "content", "marketing", "creative"];

  useFadeUp();

  // listen for theme changes from Navbar
  useEffect(() => {
    const onTheme = () => {
      const dark = document.documentElement.getAttribute("data-theme") !== "light";
      setIsDark(dark);
      // rebuild CSS with new theme
      let s = document.getElementById("aura-elite-css");
      if (s) s.textContent = buildCSS();
    };
    const saved = localStorage.getItem("theme") || "dark";
    const dark = saved === "dark";
    setIsDark(dark);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    window.addEventListener("themechange", onTheme);
    return () => window.removeEventListener("themechange", onTheme);
  }, []);

  const avatars = [
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/65.jpg",
    "https://randomuser.me/api/portraits/men/88.jpg",
    "https://randomuser.me/api/portraits/women/22.jpg",
    "https://randomuser.me/api/portraits/men/45.jpg",
  ];

  const topTalents = [
    { id:1, name:"Aisha Bello",    role:"Principal Architect",  avatar:avatars[0], rating:5.0, completed:142, earning:"₦2.8M",  skills:["Neural UI","Spatial Design"] },
    { id:2, name:"Tunde Adeyemi", role:"Systems Engineer",      avatar:avatars[1], rating:4.9, completed:89,  earning:"₦1.9M",  skills:["React Engine","Node Protocol"] },
    { id:3, name:"Zainab Okeke",  role:"Narrative Strategist",  avatar:avatars[2], rating:5.0, completed:67,  earning:"₦1.4M",  skills:["Branding","Cognitive Strategy"] },
    { id:4, name:"Dr. K. Arinze", role:"Quantum Engineer",      avatar:avatars[3], rating:5.0, completed:215, earning:"₦12.5M", skills:["Cryptography","Backend Architecture"] },
    { id:5, name:"Elena V.",       role:"Motion Architect",      avatar:avatars[4], rating:4.8, completed:54,  earning:"₦900K",  skills:["After Effects","3D Synthesis"] },
  ];

const suggestions = [
  "Advanced React Infrastructure",
  "High-Authority Brand Protocol",
  "Technical Narrative Strategy",
  "Cinematic Motion Systems",
  "Interface Architecture [UI/UX]",
  "Algorithmic Growth Campaign"
];
const MARQUEE_DOMAINS = [
  "Lagos Tech Node",
  "Sovereign Backend Systems",
  "Interface Engineering",
  "Distributed Infrastructure",
  "Autonomous Smart Contracts",
  "High-Fidelity Product Design",
  "Protocol Security Audit",
  "Global Capital Interface",
  "Systems Architecture"
];
const MARQUEE_STATUS = [
  "SYSTEM_STATUS: NOMINAL",
  "CAPITAL_DEVOPS_SYNC: ACTIVE",
  "NODES_DEployed: 4.8K+",
  "SECURE_ESCROW: ENGAGED",
  "NODE_MATCHED: [ENG_LAGOS_04]",
  "ENCRYPTION_PROTOCOL: AES-512",
  "SOVEREIGN_ID_VERIFIED",
  "PAYMENT_SYNC: SUCCESSFUL",
  "BRIEF_INITIALIZED: 00:42:12",
  "NETWORK_LATENCY: 12ms"
];

  useEffect(() => {
    const defaultGigs = [
      { id:1,  title:"Premium Brand Identity & Logo Design",   description:"Crafting timeless visual identities for ambitious African brands.", price:12500, category:"design",    owner:"Aisha Bello",   ownerAvatar:avatars[0], image:gigBranding,     views:342, rating:4.9, status:"approved" },
      { id:2,  title:"High-Converting Sales Copywriting",      description:"Persuasive copy that turns visitors into loyal customers.",        price:6800,  category:"writing",   owner:"Tunde Adeyemi", ownerAvatar:avatars[1], image:gigCopywriting,  views:289, rating:5.0, status:"approved" },
      { id:3,  title:"Cinematic Video Editing & Motion",       description:"Professional video editing with stunning transitions and effects.", price:18500, category:"video",     owner:"Zainab Okeke",  ownerAvatar:avatars[2], image:gigVideo,        views:415, rating:4.8, status:"approved" },
      { id:4,  title:"Instagram & TikTok Growth Strategy",     description:"Full social media management and content strategy for growth.",    price:9200,  category:"marketing", owner:"Chidi Nwosu",   ownerAvatar:avatars[3], image:gigSocial,       views:267, rating:4.7, status:"approved" },
      { id:5,  title:"Mobile App & Web UI/UX Design",          description:"Beautiful, intuitive interfaces that users love.",                 price:22800, category:"design",    owner:"Elena Voss",    ownerAvatar:avatars[4], image:gigUx,           views:178, rating:5.0, status:"approved" },
      { id:6,  title:"Professional Product Photography",       description:"Studio-quality photos that make your products irresistible.",      price:7500,  category:"design",    owner:"Femi Alabi",    ownerAvatar:avatars[5], image:gigPhotography,  views:134, rating:4.9, status:"approved" },
      { id:7,  title:"2D/3D Animation Explainers",             description:"Engaging animated videos that explain complex ideas simply.",      price:16500, category:"video",     owner:"Nkechi Eze",    ownerAvatar:avatars[0], image:gigAnimation,    views:203, rating:4.8, status:"approved" },
      { id:8,  title:"SEO Blog Writing & Content Strategy",    description:"Well-researched articles that rank and convert.",                  price:4500,  category:"writing",   owner:"David Okafor",  ownerAvatar:avatars[1], image:gigContent,      views:312, rating:4.6, status:"approved" },
      { id:9,  title:"Podcast Editing & Audio Production",     description:"Clean, polished audio with music, effects & show notes.",          price:8200,  category:"audio",     owner:"Amara Nwankwo", ownerAvatar:avatars[2], image:gigPodcast,      views:98,  rating:4.9, status:"approved" },
      { id:10, title:"Digital Marketing Campaign Setup",       description:"Facebook, Google & Instagram ads that deliver ROI.",               price:13800, category:"marketing", owner:"Kingsley Obi",  ownerAvatar:avatars[3], image:gigStrategy,     views:245, rating:4.7, status:"approved" },
      { id:11, title:"Custom Illustration & Artwork",          description:"Unique hand-drawn or digital illustrations for your brand.",       price:9500,  category:"design",    owner:"Seyi Adebayo",  ownerAvatar:avatars[4], image:gigIllustration, views:156, rating:5.0, status:"approved" },
      { id:12, title:"Modern Responsive Website Design",       description:"Fast, beautiful websites optimized for conversion.",               price:24500, category:"web",       owner:"Ifeoma Chukwu", ownerAvatar:avatars[5], image:gigWeb,          views:189, rating:4.8, status:"approved" },
    ];
    const stored = (() => { try { return JSON.parse(localStorage.getItem("gigs")) || []; } catch { return []; } })();
    // ✅ only show approved gigs — admin controls which appear here
    const approved = stored.filter(g => !g.status || g.status === "approved");
    setGigs(approved.length ? approved : defaultGigs);

    const i1 = setInterval(() => setLiveActivity(p => p + Math.floor(Math.random() * 4) + 1), 2500);
    const i2 = setInterval(() => setOnlineUsers(p => p + Math.floor(Math.random() * 9) + 4), 4200);
    const onScroll = () => setShowScroll(window.scrollY > 400);
    // live reload when admin approves gigs
    const onStorage = () => {
      const fresh = (() => { try { return JSON.parse(localStorage.getItem("gigs")) || []; } catch { return []; } })();
      const approvedFresh = fresh.filter(g => !g.status || g.status === "approved");
      if (approvedFresh.length) setGigs(approvedFresh);
    };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("storage", onStorage);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("storage", onStorage); clearInterval(i1); clearInterval(i2); };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrentTestimonial(p => (p + 1) % 3), 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const slider = trendingRef.current; let pos = 0; let raf;
    const step = () => { if (slider && !isPaused) { pos += 0.9; if (pos >= slider.scrollWidth - slider.clientWidth + 50) pos = -50; slider.scrollLeft = pos; } raf = requestAnimationFrame(step); };
    step(); return () => cancelAnimationFrame(raf);
  }, [isPaused]);

  useEffect(() => {
    const slider = featuredRef.current; let pos = 0; let raf;
    const step = () => { if (slider && !isPaused) { pos += 0.75; if (pos >= slider.scrollWidth - slider.clientWidth + 30) pos = -30; slider.scrollLeft = pos; } raf = requestAnimationFrame(step); };
    step(); return () => cancelAnimationFrame(raf);
  }, [isPaused]);

  const calcScore = (gig) => {
    let s = 0;
    userSkills.forEach(sk => { if (gig.title.toLowerCase().includes(sk) || gig.description.toLowerCase().includes(sk)) s += 35; });
    if (gig.category && userSkills.includes(gig.category)) s += 20;
    if (gig.price <= 6000) s += 15;
    return Math.min(s, 100);
  };

  const sortedGigs = gigs
    .filter(g => {
      const ms = g.title.toLowerCase().includes(search.toLowerCase()) || g.description.toLowerCase().includes(search.toLowerCase());
      const mp = maxPrice ? g.price <= Number(maxPrice) : true;
      const mc = category ? g.category === category : true;
      return ms && mp && mc;
    })
    .map(g => ({ ...g, matchScore: calcScore(g) }))
    .sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : b.matchScore - a.matchScore);

  const handleGigClick = (id) => {
    const updated = gigs.map(g => g.id === id ? { ...g, views: (g.views || 0) + 1 } : g);
    localStorage.setItem("gigs", JSON.stringify(updated));
    navigate(`/gig/${id}`);
  };

  const toggleLike = (id) => setLikedGigs(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const categories = [
    { name:"Brand Identity",  value:"design",    img:gigBranding,     count:"3.2K Nodes", icon:<FiCommand/>  },
    { name:"Content & Copy",  value:"writing",   img:gigContent,      count:"2.7K Nodes", icon:<FiAward/>    },
    { name:"Video & Motion",  value:"video",     img:gigVideo,        count:"1.9K Nodes", icon:<FiEye/>      },
    { name:"Social Growth",   value:"marketing", img:gigSocial,       count:"2.1K Nodes", icon:<FiTrendingUp/>},
    { name:"UI/UX Design",    value:"design",    img:gigUx,           count:"1.6K Nodes", icon:<FiZap/>      },
    { name:"Photography",     value:"design",    img:gigPhotography,  count:"890 Nodes",  icon:<FiCamera/>   },
    { name:"Audio & Podcast", value:"audio",     img:gigPodcast,      count:"620 Nodes",  icon:<FiMusic/>    },
  ];

  const howItWorks = [
    { icon:<FiBriefcase/>,  title:"Deploy Brief",    desc:"Define your objective in seconds. The AI Engine identifies elite architects instantly.", step:"01" },
    { icon:<FiZap/>,         title:"Neural Matching", desc:"Review instant proposals from verified specialists — ranked by architectural fit.",     step:"02" },
    { icon:<FiCheckCircle/>, title:"Secure Handshake",desc:"End-to-end encrypted collaboration with full escrow asset protection.",               step:"03" },
    { icon:<FiDollarSign/>,  title:"Asset Release",   desc:"Authorize payment only upon 100% protocol satisfaction. Zero friction.",              step:"04" },
  ];

  const testimonials = [
    { name:"Sarah K.", role:"Founder @LagosTech",  text:"Required a world-class identity in 48 hours. The precision was absolute — a masterclass in digital execution.", avatar:avatars[0] },
    { name:"James O.", role:"CEO @NairaVentures",  text:"The Neural Matching is unparalleled. I have never encountered this caliber of talent in a single ecosystem.",    avatar:avatars[1] },
    { name:"Amara N.", role:"Creative Director",   text:"AURA is redefining the ceiling for African creatives. My latest acquisition is a genuine masterpiece.",          avatar:avatars[2] },
  ];

  /* style helpers */
  const cardBg    = "var(--card-bg)";
  const cardBdr   = "var(--card-border)";
  const inputBg   = "var(--input-bg)";
  const inputBdr  = "var(--input-border)";
  const textSub   = "var(--text-sub)";
  const secBdr    = "var(--section-border)";

  const btn = (bg, color = "#050505") => ({
    padding:"20px 40px", borderRadius:"2px", background:bg, color,
    fontWeight:800, fontSize:"11px", fontFamily:"'Plus Jakarta Sans',sans-serif",
    border:"none", cursor:"pointer", letterSpacing:"4px", textTransform:"uppercase",
    transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)", display:"flex", alignItems:"center", gap:12, whiteSpace:"nowrap",
  });
  const S = (base, more = {}) => ({ ...base, ...more });

  return (
    <div style={{ background:"var(--ink)", color:"var(--txt)", minHeight:"100vh", overflowX:"hidden", fontFamily:"'Plus Jakarta Sans',sans-serif", cursor:"none", transition:"background .4s,color .4s" }}>
      <Cursor/>
      <div className="amb"><div className="amb-1"/><div className="amb-2"/><div className="amb-3"/></div>
      <div className="grid-tex"/>
      <Navbar/>

      {/* ── MARQUEE ── */}
      <div style={{ borderTop:`1px solid ${secBdr}`, borderBottom:`1px solid ${secBdr}`, padding:"14px 0", overflow:"hidden", position:"relative", zIndex:2 }}>
        <div className="mq-track">
          {[...MARQUEE_DOMAINS,...MARQUEE_DOMAINS,...MARQUEE_DOMAINS,...MARQUEE_DOMAINS].map((text,i)=>(
            <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:16, padding:"0 28px", whiteSpace:"nowrap" }}>
              <span className="mf" style={{ fontSize:10, fontWeight:700, letterSpacing:"4px", textTransform:"uppercase", color:"var(--marquee-text)", fontStyle:"italic" }}>{text}</span>
              <span style={{ color:"var(--marquee-dim)", opacity:.3 }}>//</span>
            </span>
          ))}
        </div>
      </div>
      <div style={{ borderBottom:`1px solid ${secBdr}`, padding:"8px 0", overflow:"hidden", background:isDark?"rgba(255,255,255,0.02)":"rgba(0,0,0,0.02)", position:"relative", zIndex:2 }}>
        <div className="mq-track-rev">
          {[...MARQUEE_STATUS,...MARQUEE_STATUS,...MARQUEE_STATUS,...MARQUEE_STATUS].map((text,i)=>(
            <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:14, padding:"0 22px", whiteSpace:"nowrap" }}>
              <span className="mf" style={{ fontSize:8, letterSpacing:"2px", textTransform:"uppercase", color:"var(--marquee-dim)" }}>{text}</span>
              <span style={{ width:2, height:2, borderRadius:"50%", background:"var(--marquee-dim)", opacity:.3, display:"inline-block" }}/>
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", zIndex:1 }}>
        <div style={{ position:"absolute", inset:0 }}>
          <img src={heroBg} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", filter:isDark?"brightness(0.22) saturate(0.75)":"brightness(0.55) saturate(0.6)", transform:"scale(1.03)" }}/>
          <div style={{ position:"absolute", inset:0, background:isDark?"linear-gradient(180deg,rgba(8,8,16,.15) 0%,rgba(8,8,16,.75) 55%,#080810 100%)":"linear-gradient(180deg,rgba(245,240,230,.3) 0%,rgba(245,240,230,.75) 55%,var(--ink) 100%)" }}/>
        </div>
        <Particles/>

        {/* TELEMETRY BADGES - REDEFINED FOR PRECISION */}
{/* RIGHT: SYSTEM PIPELINE TELEMETRY */}
<div className="nexus-badge" style={{ 
  position: "absolute", top: 90, right: 20, zIndex: 20, 
  display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 
}}>
  <div style={{ 
    display: "flex", alignItems: "center", gap: 12, padding: "12px 24px", 
    borderRadius: 0, background: "rgba(255, 191, 0, 0.03)", 
    border: "1px solid rgba(255, 191, 0, 0.3)", 
    backdropFilter: "blur(20px)", color: "#FFBF00",
    boxShadow: "inset 0 0 20px rgba(255, 191, 0, 0.05)"
  }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <span style={{ fontSize: 8, opacity: 0.5, letterSpacing: "1px", fontFamily: "'JetBrains Mono'" }}>PIPELINE_STATUS</span>
      <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: "2px", fontFamily: "'JetBrains Mono'" }}>
        ACTIVE_BRIEFS: {liveActivity}+
      </span>
    </div>
    <div className="pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFBF00" }} />
  </div>
  <span style={{ fontSize: 8, color: "rgba(255, 191, 0, 0.3)", fontFamily: "'JetBrains Mono'" }}>SECURE_CONNECTION_ESTABLISHED</span>
</div>

{/* LEFT: NETWORK NODE TELEMETRY */}
<div className="nexus-badge" style={{ 
  position: "absolute", top: 90, left: 20, zIndex: 20, 
  display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 
}}>
  <div style={{ 
    display: "flex", alignItems: "center", gap: 12, padding: "12px 24px", 
    borderRadius: 0, background: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)", 
    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`, 
    backdropFilter: "blur(20px)", color: isDark ? "#FFF" : "#000"
  }}>
    <div style={{ width: 6, height: 6, background: "#00FF41", borderRadius: "50%", boxShadow: "0 0 10px #00FF41" }} />
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontSize: 8, opacity: 0.5, letterSpacing: "1px", fontFamily: "'JetBrains Mono'" }}>CORE_NETWORK</span>
      <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: "2px", fontFamily: "'JetBrains Mono'" }}>
        VERIFIED_NODES: {onlineUsers.toLocaleString()}
      </span>
    </div>
  </div>
  <span style={{ fontSize: 8, color: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.3)", fontFamily: "'JetBrains Mono'" }}>LOC_SYNC: LAGOS_CENTRAL</span>
</div>

{/* MAIN TERMINAL INTERFACE */}
<div className="fu" style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 20px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
  
  <div style={{ marginBottom: 24 }}>
    <span className="mf" style={{ fontSize: 10, fontWeight: 900, letterSpacing: "8px", textTransform: "uppercase", color: "#FFBF00", background: "rgba(255, 191, 0, 0.05)", padding: "8px 20px", border: "1px solid rgba(255, 191, 0, 0.3)" }}>
     NEXUS.OS PROTOCOL // TALENT_ACQUISITION_CORE
    </span>
  </div>

  <h1 style={{ fontSize: "clamp(48px, 8vw, 110px)", lineHeight: 0.85, fontWeight: 900, letterSpacing: "-0.06em", marginBottom: "32px", color: isDark ? "#FFF" : "#1C1410", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
    UPGRADE <br />
    <span style={{ fontStyle: "italic", fontWeight: 200, color: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(28, 20, 16, 0.3)" }}>YOUR</span> CAPACITY.
  </h1>

  <p style={{ maxWidth: "640px", margin: "0 auto 48px", color: isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(28, 20, 16, 0.6)", fontWeight: 400, lineHeight: 1.8, fontSize: "clamp(15px, 2vw, 18px)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
  NEXUS.OS is a high-performance ecosystem designed to bridge the gap between elite African talent and global opportunities. Built for transparency, speed, and absolute reliability.
  </p>

  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24 }}>
    {/* PRIMARY ACTION */}
    <button 
      onClick={() => navigate("/about")} 
      style={{ ...btn("#FFBF00", "#000"), borderRadius: 0, fontWeight: 900, letterSpacing: "2px", textTransform: "uppercase", border: "none", padding: "18px 36px", cursor: "pointer" }}
    >
     OUR MISSION <FiArrowUpRight style={{ marginLeft: 8 }} />
    </button>

    {/* SECONDARY ACTION */}
    <button 
      onClick={() => navigate("/register")} 
      style={{ 
        background: "transparent", 
        color: isDark ? "#FFF" : "#1C1410", 
        padding: "18px 36px", 
        fontSize: 12, 
        fontWeight: 900, 
        letterSpacing: "2px", 
        textTransform: "uppercase", 
        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(28, 20, 16, 0.15)"}`, 
        backdropFilter: "blur(12px)", 
        display: "flex", 
        alignItems: "center", 
        cursor: "pointer", 
        transition: "0.3s" 
      }}
    >
      Join Network <FiArrowUpRight style={{ marginLeft: 8 }} />
    </button>
  
          </div>
          <div style={{ marginTop:80, display:"flex", justifyContent:"center", alignItems:"center", gap:64, borderTop:`1px solid ${isDark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.07)"}`, paddingTop:40, flexWrap:"wrap" }}>
            {[{val:"₦4.2B+",lab:"Capital Flow"},{val:"12K+",lab:"Verified Nodes"},{val:"0.02s",lab:"Match Latency"}].map((stat,i)=>(
              <div key={i} style={{ textAlign:"left" }}>
                <div style={{ fontSize:20, fontWeight:900, letterSpacing:"-0.04em", textTransform:"uppercase" }}>{stat.val}</div>
                <div className="mf" style={{ fontSize:9, fontWeight:700, letterSpacing:"3px", textTransform:"uppercase", color:isDark?"rgba(255,255,255,0.2)":"rgba(28,20,16,0.3)" }}>{stat.lab}</div>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div style={{ maxWidth:740, margin:"48px auto 0", position:"relative" }}>
            <div style={{ display:"flex", gap:8, padding:8, borderRadius:18, background:isDark?"rgba(255,255,255,0.04)":"rgba(255,255,255,0.8)", border:"1px solid rgba(191,160,80,0.18)", backdropFilter:"blur(40px)", boxShadow:isDark?"0 40px 100px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.06)":"0 20px 60px rgba(0,0,0,0.1),inset 0 1px 0 rgba(255,255,255,0.8)", flexWrap:"wrap" }}>
              <div style={{ position:"relative", flex:"1 1 280px" }}>
                <FiSearch style={{ position:"absolute", left:18, top:"50%", transform:"translateY(-50%)", color:"var(--g)", fontSize:16 }}/>
                <input className="inp" type="text" placeholder="Search elite services…" value={search}
                  onChange={e=>{ setSearch(e.target.value); setShowSuggestions(e.target.value.length>1); }}
                  onKeyDown={e=>e.key==="Enter"&&document.getElementById("gigs")?.scrollIntoView({behavior:"smooth"})}
                  onFocus={()=>setShowSuggestions(search.length>1)}
                  onBlur={()=>setTimeout(()=>setShowSuggestions(false),200)}
                  style={{ width:"100%", padding:"16px 16px 16px 48px", borderRadius:12, background:"transparent", border:`1px solid ${inputBdr}`, color:"var(--txt)", fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif" }}/>
              </div>
              <button className="cta-btn"
                onClick={()=>document.getElementById("gigs")?.scrollIntoView({behavior:"smooth"})}
                style={{ flex:"0 0 auto", padding:"16px 28px", borderRadius:12, fontSize:13 }}>
                Find Perfection <Sparkles style={{ width:13, height:13 }}/>
              </button>
            </div>
            {showSuggestions && (
              <div style={{ position:"absolute", top:"calc(100% + 8px)", left:0, right:0, background:isDark?"#0F0F18":"#FFFDF7", border:"1px solid rgba(191,160,80,0.18)", borderRadius:16, padding:8, zIndex:50, boxShadow:"0 24px 60px rgba(0,0,0,0.15)" }}>
                {suggestions.filter(s=>s.toLowerCase().includes(search.toLowerCase())).map((s,i)=>(
                  <div key={i} onClick={()=>{ setSearch(s); setShowSuggestions(false); document.getElementById("gigs")?.scrollIntoView({behavior:"smooth"}); }}
                    style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 16px", borderRadius:10, cursor:"pointer", fontSize:13, color:"var(--txt)", transition:"background .15s" }}
                    onMouseEnter={e=>(e.currentTarget.style.background=isDark?"rgba(191,160,80,0.07)":"rgba(191,160,80,0.1)")}
                    onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                    <FiSearch style={{ color:"var(--g)", flexShrink:0, fontSize:13 }}/> {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hero stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, maxWidth:560, margin:"64px auto 0" }}>
            {[{n:"14,872",l:"Students Earning",s:"this month"},{n:"₦68.4M",l:"Paid Out",s:"in 2026"},{n:"4.98★",l:"Avg Rating",s:"across 11K gigs"}].map((st,i)=>(
              <div key={i} className="hstat">
                <div className="cf ng" style={{ fontSize:"clamp(22px,4vw,40px)", fontWeight:700, color:"#F5D97A", lineHeight:1 }}>{st.n}</div>
                <div className="mf" style={{ fontSize:9, letterSpacing:"2px", textTransform:"uppercase", color:textSub, marginTop:6 }}>{st.l}</div>
                <div style={{ fontSize:9, color:"rgba(191,160,80,0.3)", marginTop:3 }}>{st.s}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position:"absolute", bottom:36, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
          <span className="mf" style={{ fontSize:9, letterSpacing:"4px", color:isDark?"rgba(238,232,216,0.2)":"rgba(28,20,16,0.25)" }}>SCROLL</span>
          <div className="scroll-line" style={{ width:1, background:"linear-gradient(180deg,rgba(191,160,80,0.6),transparent)", height:0 }}/>
        </div>
        <button onClick={()=>alert("🤖 AI Matchmaker — coming soon!")}
          style={{ position:"fixed", bottom:32, right:32, zIndex:30, display:"flex", alignItems:"center", gap:8, padding:"12px 22px", borderRadius:999, background:"linear-gradient(135deg,#7C5FE0,#5B3FBF)", color:"#fff", fontSize:12, fontWeight:600, border:"none", cursor:"none", boxShadow:"0 8px 32px rgba(124,95,224,0.35)", letterSpacing:"0.5px", fontFamily:"'Plus Jakarta Sans',sans-serif" }}
          onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.06)")} onMouseLeave={e=>(e.currentTarget.style.transform="scale(1)")}>
          <FiMessageCircle style={{ fontSize:14 }}/> AI Matchmaker
        </button>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ position:"relative", zIndex:1, padding:"80px 20px", borderBottom:`1px solid ${secBdr}` }}>
        <div style={{ maxWidth:1140, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 }} className="grid-4-2">
          {[{val:"14K+",label:"Active Students",sub:"& growing daily"},{val:"9,341",label:"Jobs Delivered",sub:"with 5-star reviews"},{val:"₦68M+",label:"Total Earnings",sub:"& counting"},{val:"99.4%",label:"Satisfaction Rate",sub:"guaranteed"}].map((s,i)=>(
            <div key={i} className="fu" style={{ textAlign:"center", transitionDelay:`${i*.1}s` }}>
              <div className="cf ng" style={{ fontSize:"clamp(40px,5vw,64px)", fontWeight:700, background:"linear-gradient(180deg,#F5D97A,#BFA050)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1 }}>{s.val}</div>
              <div className="mf" style={{ fontSize:10, letterSpacing:"2px", textTransform:"uppercase", color:textSub, marginTop:10 }}>{s.label}</div>
              <div className="section-stat-sub" style={{ fontSize:11, color:"var(--stat-sub)", marginTop:4 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FILTERS ── */}
      <section style={{ position:"sticky", top:0, zIndex:50, background:"var(--filter-bg)", backdropFilter:"blur(28px)", borderBottom:"1px solid rgba(191,160,80,0.1)", padding:"14px 20px" }}>
        <div style={{ maxWidth:1140, margin:"0 auto", display:"flex", flexWrap:"wrap", gap:10, alignItems:"center" }}>
          {[
            <input key="price" type="number" placeholder="Max budget (₦)" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} className="inp"
              style={{ flex:"1 1 140px", maxWidth:180, padding:"11px 16px", borderRadius:10, background:inputBg, border:`1px solid ${inputBdr}`, color:"var(--txt)", fontSize:13, fontFamily:"'Plus Jakarta Sans',sans-serif" }}/>,
            <select key="cat" value={category} onChange={e=>setCategory(e.target.value)} className="inp"
              style={{ flex:"1 1 140px", maxWidth:180, padding:"11px 16px", borderRadius:10, background:isDark?"rgba(8,8,16,0.95)":"rgba(255,255,255,0.9)", border:`1px solid ${inputBdr}`, color:"var(--txt)", fontSize:13, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
              <option value="">All Categories</option>
              {["design","web","writing","video","marketing","audio"].map(c=><option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
            </select>,
            <select key="sort" value={sort} onChange={e=>setSort(e.target.value)} className="inp"
              style={{ flex:"1 1 140px", maxWidth:180, padding:"11px 16px", borderRadius:10, background:isDark?"rgba(8,8,16,0.95)":"rgba(255,255,255,0.9)", border:`1px solid ${inputBdr}`, color:"var(--txt)", fontSize:13, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
              <option value="">AI Elite Ranking</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
            </select>,
          ]}
          <button onClick={()=>{ setSearch(""); setMaxPrice(""); setCategory(""); setSort(""); }}
            style={{ padding:"11px 18px", borderRadius:10, background:"transparent", border:"none", color:"rgba(191,160,80,0.6)", fontSize:13, cursor:"none", fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"color .2s" }}
            onMouseEnter={e=>(e.currentTarget.style.color="#F5D97A")} onMouseLeave={e=>(e.currentTarget.style.color="rgba(191,160,80,0.6)")}>Clear</button>
          <button onClick={()=>navigate("/post-gig")}
            style={S(btn("linear-gradient(135deg,#1FFFA8,#0ABF7A)"),{ marginLeft:"auto", padding:"11px 22px", borderRadius:10, boxShadow:"0 4px 20px rgba(31,255,168,0.2)" })}
            onMouseEnter={e=>{ e.currentTarget.style.transform="scale(1.04)"; e.currentTarget.style.boxShadow="0 8px 30px rgba(31,255,168,0.35)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 4px 20px rgba(31,255,168,0.2)"; }}>+ Post a Gig</button>
        </div>
      </section>

      {/* ── FEATURED CAROUSEL ── */}
      <section style={{ position:"relative", zIndex:1, maxWidth:1140, margin:"0 auto", padding:"80px 20px" }}>
        <div className="fu" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:40, flexWrap:"wrap", gap:12 }}>
          <div>
            <div className="mf" style={{ fontSize:9, letterSpacing:"3px", color:"rgba(191,160,80,0.5)", marginBottom:10 }}>HANDPICKED BY AI</div>
            <h2 className="cf" style={{ fontSize:"clamp(26px,4vw,46px)", fontWeight:600, lineHeight:1, margin:0 }}>
              Featured <em className="gg" style={{ fontStyle:"italic", fontWeight:300 }}>This Week</em>
            </h2>
          </div>
          <span className="mf" style={{ fontSize:10, letterSpacing:"2px", color:"rgba(191,160,80,0.4)" }}>✦ CURATED</span>
        </div>
        <div ref={featuredRef} onMouseEnter={()=>setIsPaused(true)} onMouseLeave={()=>setIsPaused(false)}
          style={{ display:"flex", gap:18, overflowX:"hidden", paddingBottom:4, cursor:"grab" }}>
          {sortedGigs.slice(0,8).map((gig,i)=>(
            <div key={`f${gig.id}-${i}`} onClick={()=>handleGigClick(gig.id)}
              style={{ minWidth:230, borderRadius:18, overflow:"hidden", background:cardBg, border:`1px solid ${cardBdr}`, cursor:"none", flexShrink:0, transition:"border-color .3s,transform .3s" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(191,160,80,0.35)"; e.currentTarget.style.transform="translateY(-5px)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=cardBdr; e.currentTarget.style.transform="translateY(0)"; }}>
              <div style={{ height:130, overflow:"hidden" }}>
                <img src={gig.image} alt={gig.title} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .5s" }}
                  onMouseEnter={e=>(e.target.style.transform="scale(1.08)")} onMouseLeave={e=>(e.target.style.transform="scale(1)")}/>
              </div>
              <div style={{ padding:"16px 18px" }}>
                <div style={{ fontSize:13, fontWeight:500, lineHeight:1.4, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{gig.title}</div>
                <div className="cf gig-price-text" style={{ fontSize:20, fontWeight:700, color:"var(--g)", marginTop:10 }}>₦{gig.price.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="div"/>

      {/* ── CATEGORIES ── */}
      <section id="categories" style={{ position:"relative", zIndex:1, maxWidth:1140, margin:"0 auto", padding:"80px 20px" }}>
        <div className="fu" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:52, flexWrap:"wrap", gap:14 }}>
          <div>
            <div className="mf" style={{ fontSize:9, letterSpacing:"3px", color:"rgba(191,160,80,0.5)", marginBottom:10 }}>EXPLORE</div>
            <h2 className="cf" style={{ fontSize:"clamp(30px,5vw,54px)", fontWeight:700, lineHeight:1, margin:0 }}>
              Signature <em className="gg" style={{ fontStyle:"italic", fontWeight:300 }}>Categories</em>
            </h2>
            <p style={{ color:textSub, fontSize:14, marginTop:10 }}>Handpicked excellence. Delivered instantly.</p>
          </div>
          <button onClick={()=>document.getElementById("gigs")?.scrollIntoView({behavior:"smooth"})}
            style={{ display:"flex", alignItems:"center", gap:6, color:"var(--g)", background:"none", border:"none", cursor:"none", fontSize:13, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:500, transition:"gap .2s" }}
            onMouseEnter={e=>(e.currentTarget.style.gap="10px")} onMouseLeave={e=>(e.currentTarget.style.gap="6px")}>
            Explore all <FiArrowUp style={{ transform:"rotate(45deg)" }}/>
          </button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))", gap:18 }}>
          {categories.map((cat,i)=>(
            <div key={i} className="cat-sh fu"
              style={{ position:"relative", height:270, borderRadius:20, overflow:"hidden", cursor:"none", border:`1px solid ${cardBdr}`, transitionDelay:`${i*.07}s`, transition:"border-color .4s,transform .5s,box-shadow .5s" }}
              onClick={()=>{ setCategory(cat.value); document.getElementById("gigs")?.scrollIntoView({behavior:"smooth"}); }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(191,160,80,0.4)"; e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.boxShadow="0 24px 50px rgba(0,0,0,0.3),0 0 0 1px rgba(191,160,80,0.3)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=cardBdr; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
              <img src={cat.img} alt={cat.name} loading="lazy" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .7s,filter .4s" }}
                onMouseEnter={e=>{ e.target.style.transform="scale(1.1)"; e.target.style.filter="brightness(0.65) saturate(1.3)"; }}
                onMouseLeave={e=>{ e.target.style.transform="scale(1)"; e.target.style.filter="brightness(1)"; }}/>
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent 35%,rgba(0,0,0,0.88) 100%)" }}/>
              <div style={{ position:"absolute", top:14, left:14, fontSize:18, color:"rgba(191,160,80,0.5)" }}>{cat.icon}</div>
              <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"16px 18px" }}>
                <div style={{ fontSize:14, fontWeight:600, marginBottom:4, color:"#FFF" }}>{cat.name}</div>
                <div className="mf" style={{ fontSize:9, color:"var(--g)", letterSpacing:"1.5px" }}>{cat.count}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="div"/>

      {/* ── HOW IT WORKS ── */}
      <section style={{ position:"relative", zIndex:1, maxWidth:1140, margin:"0 auto", padding:"80px 20px" }}>
        <div className="fu" style={{ textAlign:"center", marginBottom:60 }}>
          <div className="mf" style={{ fontSize:9, letterSpacing:"3px", color:"rgba(191,160,80,0.5)", marginBottom:14 }}>THE PROCESS</div>
          <h2 className="cf" style={{ fontSize:"clamp(26px,4vw,50px)", fontWeight:700, margin:0 }}>
            From idea to <em className="gg" style={{ fontStyle:"italic", fontWeight:300 }}>masterpiece</em>
          </h2>
          <p style={{ color:textSub, marginTop:12, fontSize:14 }}>Four steps. Zero friction. Guaranteed excellence.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:22 }}>
          {howItWorks.map((step,i)=>(
            <div key={i} className="fu"
              style={{ position:"relative", padding:"40px 30px", borderRadius:22, background:"var(--step-bg)", border:`1px solid var(--step-border)`, transitionDelay:`${i*.1}s`, transition:"border-color .3s,transform .3s,box-shadow .3s" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(191,160,80,0.3)"; e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.boxShadow=isDark?"0 24px 60px rgba(0,0,0,0.4)":"0 20px 50px rgba(0,0,0,0.12)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--step-border)"; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
              <div className="cf sn" style={{ position:"absolute", top:20, right:24, fontSize:68, fontWeight:900, lineHeight:1 }}>{step.step}</div>
              <div style={{ width:36, height:2, background:"linear-gradient(90deg,var(--g),transparent)", marginBottom:24 }}/>
              <div style={{ color:"var(--g)", fontSize:20, marginBottom:16 }}>{step.icon}</div>
              <h3 style={{ fontSize:17, fontWeight:700, marginBottom:12 }}>{step.title}</h3>
              <p style={{ color:textSub, fontSize:13, lineHeight:1.75, margin:0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="div"/>

      {/* ── TOP TALENTS ── */}
      <section style={{ position:"relative", zIndex:1, maxWidth:1140, margin:"0 auto", padding:"80px 20px" }}>
        <div className="fu" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:52, flexWrap:"wrap", gap:14 }}>
          <div>
            <div className="mf" style={{ fontSize:9, letterSpacing:"3px", color:"rgba(191,160,80,0.5)", marginBottom:10 }}>LEADERBOARD</div>
            <h2 className="cf" style={{ fontSize:"clamp(26px,4vw,46px)", fontWeight:700, lineHeight:1, margin:0 }}>
              Top Students <em className="gg" style={{ fontStyle:"italic", fontWeight:300 }}>This Month</em>
            </h2>
          </div>
          <button style={{ color:"var(--g)", background:"none", border:"none", cursor:"none", fontSize:13, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Full leaderboard →</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:22 }} className="grid-3-1">
          {topTalents.map((t,i)=>(
            <div key={t.id} className="fu"
              style={{ padding:"34px", borderRadius:22, background:"var(--talent-bg)", border:`1px solid var(--talent-border)`, transitionDelay:`${i*.1}s`, transition:"transform .4s,box-shadow .4s,border-color .3s" }}
              onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-8px)"; e.currentTarget.style.boxShadow=isDark?"0 40px 80px rgba(0,0,0,0.5),0 0 0 1px rgba(191,160,80,0.25)":"0 30px 60px rgba(0,0,0,0.12),0 0 0 1px rgba(140,100,20,0.2)"; e.currentTarget.style.borderColor="rgba(191,160,80,0.2)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor="var(--talent-border)"; }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ position:"relative" }}>
                    <img src={t.avatar} alt="" style={{ width:54, height:54, borderRadius:14, objectFit:"cover", border:"2px solid rgba(191,160,80,0.25)" }}/>
                    <div style={{ position:"absolute", bottom:-3, right:-3, width:14, height:14, borderRadius:"50%", background:"#1FFFA8", border:"2px solid #080810" }}/>
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:15 }}>{t.name}</div>
                    <div style={{ color:"var(--g)", fontSize:12, marginTop:3 }}>{t.role}</div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:"#F5D97A", fontWeight:700 }}>
                  <FiStar style={{ fill:"#F5D97A", stroke:"none" }}/> {t.rating}
                </div>
              </div>
              <div style={{ display:"flex", gap:28, marginBottom:22, paddingBottom:22, borderBottom:`1px solid ${isDark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.06)"}` }}>
                <div>
                  <div className="mf" style={{ fontSize:9, letterSpacing:"1.5px", textTransform:"uppercase", color:textSub, marginBottom:5 }}>Completed</div>
                  <div className="cf" style={{ fontSize:30, fontWeight:700 }}>{t.completed}</div>
                </div>
                <div>
                  <div className="mf" style={{ fontSize:9, letterSpacing:"1.5px", textTransform:"uppercase", color:textSub, marginBottom:5 }}>Earned</div>
                  <div className="cf" style={{ fontSize:30, fontWeight:700, color:"#1FFFA8" }}>{t.earning}</div>
                </div>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:24 }}>
                {t.skills.map(sk=><span key={sk} className="tag">{sk}</span>)}
              </div>
              <button style={S(btn("linear-gradient(135deg,#1FFFA8,#0ABF7A)"),{ width:"100%", justifyContent:"center", padding:"14px", borderRadius:12, fontSize:13 })}
                onMouseEnter={e=>{ e.currentTarget.style.transform="scale(1.02)"; e.currentTarget.style.boxShadow="0 8px 28px rgba(31,255,168,0.3)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="none"; }}>Hire Now</button>
            </div>
          ))}
        </div>
      </section>

      <div className="div"/>

      {/* ── GIG GRID ── */}
      <section id="gigs" style={{ position:"relative", zIndex:1, maxWidth:1140, margin:"0 auto", padding:"80px 20px" }}>
        <div className="fu" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:52, flexWrap:"wrap", gap:14 }}>
          <div>
            <div className="mf" style={{ fontSize:9, letterSpacing:"3px", color:"rgba(191,160,80,0.5)", marginBottom:10 }}>AI-RANKED</div>
            <h2 className="cf" style={{ fontSize:"clamp(30px,5vw,54px)", fontWeight:700, lineHeight:1, margin:0 }}>
              Elite <em className="gg" style={{ fontStyle:"italic", fontWeight:300 }}>Gigs</em>
            </h2>
            <p style={{ color:textSub, fontSize:13, marginTop:8 }}>Curated for excellence. Matched to you.</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, color:"var(--g)", fontSize:12 }}>
            <FiTrendingUp/> Trending in Lagos
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))", gap:26 }}>
          {sortedGigs.map((gig,i)=>(
            <div key={`${gig.id}-${i}`} className="gc fu gig-card-body" onClick={()=>handleGigClick(gig.id)}
              style={{ position:"relative", borderRadius:22, overflow:"hidden", background:cardBg, border:`1px solid ${cardBdr}`, cursor:"none", transitionDelay:`${(i%3)*.1}s` }}>
              <div style={{ position:"relative", height:210, overflow:"hidden" }}>
                <img src={gig.image} alt={gig.title} loading="lazy" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .6s" }}/>
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.65))" }}/>
                <div style={{ position:"absolute", top:14, left:14, display:"flex", gap:6 }}>
                  <span className="mf" style={{ padding:"4px 11px", borderRadius:999, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(8px)", fontSize:8, fontWeight:700, letterSpacing:"1.5px", color:"var(--g)", border:"1px solid rgba(191,160,80,0.25)" }}>PREMIUM</span>
                  {gig.rating>=4.9&&<span className="mf" style={{ padding:"4px 11px", borderRadius:999, background:"linear-gradient(135deg,#F5D97A,#BFA050)", fontSize:8, fontWeight:700, letterSpacing:"1px", color:"#080810", display:"flex", alignItems:"center", gap:3 }}><FiStar style={{ fill:"#080810", stroke:"none", fontSize:9 }}/> TOP</span>}
                  <span className="mf" style={{ padding:"4px 11px", borderRadius:999, background:"rgba(31,255,168,0.12)", backdropFilter:"blur(8px)", fontSize:8, fontWeight:700, letterSpacing:"1px", color:"#1FFFA8", border:"1px solid rgba(31,255,168,0.2)" }}>INSTANT</span>
                </div>
                <button onClick={e=>{ e.stopPropagation(); toggleLike(gig.id); }}
                  style={{ position:"absolute", top:12, right:12, width:34, height:34, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", border:"none", cursor:"none", transition:"all .2s", background:likedGigs.includes(gig.id)?"#E11D48":"rgba(0,0,0,0.5)", backdropFilter:"blur(8px)", color:likedGigs.includes(gig.id)?"#fff":"rgba(238,232,216,0.6)" }}>
                  <FiHeart style={{ fill:likedGigs.includes(gig.id)?"#fff":"none", fontSize:13 }}/>
                </button>
                <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"10px 14px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span className="mf" style={{ fontSize:8, color:"rgba(238,232,216,0.45)", letterSpacing:"1px", display:"flex", alignItems:"center", gap:4 }}>
                      <Sparkles style={{ width:9, height:9, color:"var(--g)" }}/> AI MATCH
                    </span>
                    <span className="mf" style={{ fontSize:8, color:"var(--g)" }}>{gig.matchScore}%</span>
                  </div>
                  <div className="mb"><div className="mf2" style={{ "--w":`${gig.matchScore}%` }}/></div>
                  {gig.matchScore>70&&<div className="mf" style={{ marginTop:5, display:"inline-block", padding:"2px 9px", borderRadius:999, background:"#1FFFA8", color:"#080810", fontSize:8, fontWeight:700 }}>PERFECT MATCH</div>}
                </div>
              </div>
              <div style={{ padding:"22px" }}>
                <h3 className="gig-card-body" style={{ fontSize:15, fontWeight:700, lineHeight:1.4, marginBottom:8, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", transition:"color .2s" }}
                  onMouseEnter={e=>(e.currentTarget.style.color="var(--g)")} onMouseLeave={e=>(e.currentTarget.style.color="")}>{gig.title}</h3>
                <p className="gig-desc-text" style={{ color:isDark?"rgba(238,232,216,0.38)":"rgba(28,20,16,0.55)", fontSize:12, lineHeight:1.65, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", margin:"0 0 18px" }}>{gig.description}</p>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
                  <img src={gig.ownerAvatar} alt={gig.owner} style={{ width:34, height:34, borderRadius:9, objectFit:"cover", border:`1px solid ${cardBdr}` }}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div className="gig-owner-text" style={{ fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:5 }}>
                      {gig.owner} <span style={{ fontSize:9, color:"#1FFFA8", flexShrink:0 }}>✓</span>
                    </div>
                    <div style={{ fontSize:10, color:"var(--g)", display:"flex", alignItems:"center", gap:3, marginTop:2 }}>
                      <FiStar style={{ fill:"var(--g)", stroke:"none", fontSize:9 }}/> {gig.rating}
                      <span style={{ color:textSub, marginLeft:3 }}>· Verified Pro</span>
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:9, color:textSub, marginBottom:2 }}>Delivery</div>
                    <div className="mf" style={{ fontSize:11, color:"#1FFFA8" }}>2–3 days</div>
                  </div>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:16, borderTop:`1px solid ${isDark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.06)"}` }}>
                  <div className="gig-views-text" style={{ display:"flex", alignItems:"center", gap:4, fontSize:11 }}>
                    <FiEye style={{ fontSize:12 }}/> {gig.views}
                  </div>
                  <div className="cf gig-price-text" style={{ fontSize:26, fontWeight:700, color:"var(--g)", lineHeight:1 }}>₦{gig.price.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
          {sortedGigs.length===0&&(
            <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"80px 20px", color:textSub }}>
              <p style={{ fontSize:14, fontWeight:600 }}>No gigs found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── TRENDING CAROUSEL ── */}
      <section style={{ position:"relative", zIndex:1, padding:"80px 0", borderTop:`1px solid ${secBdr}`, background:isDark?"rgba(255,255,255,0.01)":"rgba(0,0,0,0.02)" }}>
        <div className="fu" style={{ textAlign:"center", marginBottom:40, padding:"0 20px" }}>
          <h2 className="cf" style={{ fontSize:"clamp(22px,4vw,42px)", fontWeight:700, margin:0 }}>
            🔥 Trending <em className="gg" style={{ fontStyle:"italic", fontWeight:300 }}>This Hour</em> in Africa
          </h2>
        </div>
        <div ref={trendingRef} onMouseEnter={()=>setIsPaused(true)} onMouseLeave={()=>setIsPaused(false)}
          style={{ display:"flex", gap:20, overflowX:"hidden", padding:"8px 24px", cursor:"grab" }}>
          {[...sortedGigs,...sortedGigs].map((gig,i)=>(
            <div key={`t${gig.id}-${i}`} onClick={()=>handleGigClick(gig.id)}
              style={{ minWidth:270, borderRadius:18, overflow:"hidden", background:cardBg, border:`1px solid ${cardBdr}`, cursor:"none", flexShrink:0, transition:"border-color .3s,transform .3s" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(191,160,80,0.3)"; e.currentTarget.style.transform="translateY(-4px)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=cardBdr; e.currentTarget.style.transform="translateY(0)"; }}>
              <img src={gig.image} alt={gig.title} loading="lazy" style={{ width:"100%", height:170, objectFit:"cover" }}/>
              <div style={{ padding:"18px" }}>
                <div style={{ fontSize:13, fontWeight:600, display:"-webkit-box", WebkitLineClamp:1, WebkitBoxOrient:"vertical", overflow:"hidden", marginBottom:6 }}>{gig.title}</div>
                <div style={{ fontSize:11, color:textSub, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", marginBottom:14 }}>{gig.description}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:4, color:"var(--g)", fontSize:11 }}>
                    <FiStar style={{ fill:"var(--g)", stroke:"none" }}/> {gig.rating}
                  </div>
                  <div className="cf" style={{ fontSize:22, fontWeight:700, color:"var(--g)" }}>₦{gig.price.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" style={{ position:"relative", zIndex:1, maxWidth:1140, margin:"0 auto", padding:"80px 20px" }}>
        <div className="fu" style={{ textAlign:"center", marginBottom:52 }}>
          <div className="mf" style={{ fontSize:9, letterSpacing:"3px", color:"rgba(191,160,80,0.5)", marginBottom:12 }}>TESTIMONIALS</div>
          <h2 className="cf" style={{ fontSize:"clamp(26px,4vw,50px)", fontWeight:700, margin:0 }}>
            Voices of <em className="gg" style={{ fontStyle:"italic", fontWeight:300 }}>Excellence</em>
          </h2>
        </div>
        <div style={{ position:"relative", overflow:"hidden", borderRadius:26, border:"1px solid rgba(191,160,80,0.14)", background:isDark?"linear-gradient(135deg,rgba(191,160,80,0.04),rgba(124,95,224,0.04))":"linear-gradient(135deg,rgba(255,252,240,0.8),rgba(245,240,255,0.8))" }}
          onMouseEnter={()=>setIsPaused(true)} onMouseLeave={()=>setIsPaused(false)}>
          <div style={{ display:"flex", transition:"transform .7s cubic-bezier(0.16,1,0.3,1)", transform:`translateX(-${currentTestimonial*100}%)` }}>
            {testimonials.map((t,i)=>(
              <div key={i} style={{ minWidth:"100%", padding:"clamp(28px,5vw,60px) clamp(24px,6vw,72px)" }}>
                <div className="cf" style={{ fontSize:80, lineHeight:.7, color:"rgba(191,160,80,0.12)", marginBottom:24, fontWeight:700 }}>"</div>
                <p className="cf" style={{ fontSize:"clamp(16px,2.5vw,24px)", fontStyle:"italic", fontWeight:300, lineHeight:1.75, color:isDark?"rgba(238,232,216,0.82)":"rgba(28,20,16,0.75)", margin:"0 0 40px" }}>{t.text}</p>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <img src={t.avatar} alt="" style={{ width:48, height:48, borderRadius:13, border:"2px solid rgba(191,160,80,0.25)" }}/>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14 }}>{t.name}</div>
                      <div className="mf" style={{ color:"var(--g)", fontSize:11, marginTop:3, letterSpacing:".5px" }}>{t.role}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:3 }}>
                    {Array(5).fill(0).map((_,j)=><FiStar key={j} style={{ fill:"var(--g)", stroke:"none", fontSize:14, color:"var(--g)" }}/>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", justifyContent:"center", gap:8, padding:"0 0 24px" }}>
            {testimonials.map((_,i)=>(
              <button key={i} onClick={()=>setCurrentTestimonial(i)} className={`td${i===currentTestimonial?" a":""}`}/>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position:"relative", zIndex:1, padding:"120px 20px", overflow:"hidden" }}>
        <div className="amb-1" style={{ position:"absolute", opacity:.8 }}/>
        <div className="amb-2" style={{ position:"absolute", opacity:.6 }}/>
        <div style={{ position:"relative", maxWidth:760, margin:"0 auto", textAlign:"center" }}>
          <div className="fu" style={{ display:"inline-block", padding:"8px 22px", borderRadius:999, border:"1px solid rgba(191,160,80,0.2)", background:"rgba(191,160,80,0.07)", marginBottom:32 }}>
            <span className="mf" style={{ fontSize:9, letterSpacing:"3px", color:"var(--g)" }}>JOIN THE NEXUS.OS </span>
          </div>
          <h2 className="cf fu" style={{ fontSize:"clamp(36px,8vw,88px)", fontWeight:700, lineHeight:.9, letterSpacing:"-2px", marginBottom:20 }}>
            Your next chapter of <em className="gg" style={{ fontStyle:"italic", fontWeight:300 }}>wealth</em><br/>starts here.
          </h2>
          <p className="fu" style={{ color:textSub, fontSize:"clamp(13px,1.8vw,16px)", maxWidth:420, margin:"0 auto 48px", lineHeight:1.8 }}>
            Join 14,000+ students already building generational income on Africa's most prestigious freelance platform.
          </p>
          <div className="fu" style={{ display:"flex", flexWrap:"wrap", gap:14, justifyContent:"center" }}>
            <button className="cta-btn" onClick={()=>navigate("/register")}>Start earning today — free</button>
            <button className="ghost-btn" onClick={()=>document.getElementById("gigs")?.scrollIntoView({behavior:"smooth"})}>Browse live gigs</button>
          </div>
        </div>
      </section>

      {/* ── ADVISORY ── */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"40px 40px 60px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:40 }} className="grid-3-1">
          {[
            { title:"High Authority",  col:isDark?"rgba(212,175,55,0.3)":"rgba(140,100,20,0.4)", tcol:"rgba(212,175,55,1)", delay:"0s",   text:"Only the top 1% of digital architects are permitted into the Sovereign ecosystem. Quality is a mechanical certainty." },
            { title:"Neural Matching", col:isDark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.1)",    tcol:isDark?"rgba(255,255,255,0.6)":"rgba(28,20,16,0.6)", delay:"0.2s", text:"Our intelligence engine analyzes 40+ vectors to match your project with the perfect specialist in real-time." },
            { title:"Zero Friction",   col:isDark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.1)",    tcol:isDark?"rgba(255,255,255,0.6)":"rgba(28,20,16,0.6)", delay:"0.4s", text:"Automated escrow and encrypted workspaces ensure your capital and data remain under your absolute control." },
          ].map((a,i)=>(
            <div key={i} className="fu" style={{ borderLeft:`1px solid ${a.col}`, paddingLeft:24, paddingTop:16, paddingBottom:16, transitionDelay:a.delay }}>
              <h4 className="mf" style={{ fontSize:10, fontWeight:700, letterSpacing:"4px", textTransform:"uppercase", color:a.tcol, marginBottom:8 }}>{a.title}</h4>
              <p style={{ fontSize:12, color:textSub, lineHeight:1.85, fontWeight:300 }}>{a.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ position:"relative", zIndex:1, borderTop:`1px solid ${secBdr}`, background:"var(--footer-bg)", padding:"72px 20px 40px", backdropFilter:"blur(20px)" }}>
        <div style={{ maxWidth:1140, margin:"0 auto" }}>
          <div className="footer-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:"40px 48px", marginBottom:60 }}>
            <div>
              <BrandName/>
              <div style={{ width:36, height:2, background:"linear-gradient(90deg,var(--g),transparent)", margin:"16px 0" }}/>
              <p style={{ color:"var(--footer-link)", fontSize:13, lineHeight:1.85, maxWidth:230 }}>
                Africa's most prestigious student-to-global marketplace. Built for those who refuse to be average.
              </p>
              <div style={{ display:"flex", gap:10, marginTop:24 }}>
                {[RiGithubFill,RiTwitterXFill,RiInstagramLine,RiLinkedinBoxFill].map((Icon,i)=>(
                  <button key={i} className="si" style={{ cursor:"none" }}><Icon/></button>
                ))}
              </div>
            </div>
            {[
              { title:"Platform", links:["Find Talent","Post a Gig","Success Stories"] },
              { title:"Company",  links:["About Us","For Students","Blog","Careers"] },
              { title:"Legal",    links:["Privacy Policy","Terms of Service","Cookie Policy"] },
            ].map(col=>(
              <div key={col.title}>
                <div className="mf" style={{ fontSize:9, letterSpacing:"3px", color:"var(--footer-link)", marginBottom:20, textTransform:"uppercase", opacity:.6 }}>{col.title}</div>
                {col.links.map(l=><a key={l} className="fl" href="#">{l}</a>)}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12, paddingTop:24, borderTop:`1px solid ${secBdr}` }}>
            <p className="mf" style={{ color:"var(--footer-link)", fontSize:11, margin:0, opacity:.4 }}>NEXUS.OS // CORE_NETWORK © 2026 · Lagos, Nigeria</p>
            <p className="mf" style={{ color:"rgba(191,160,80,0.25)", fontSize:10, margin:0 }}>THE FUTURE OF WORK IS AFRICAN</p>
          </div>
        </div>
      </footer>

      {showScroll && (
        <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
          style={{ position:"fixed", bottom:96, right:28, zIndex:50, width:42, height:42, borderRadius:12, background:"linear-gradient(135deg,#BFA050,#8A6B2A)", border:"none", display:"flex", alignItems:"center", justifyContent:"center", color:"#080810", cursor:"none", boxShadow:"0 8px 24px rgba(191,160,80,0.3)", transition:"transform .2s" }}
          onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.12) rotate(8deg)")}
          onMouseLeave={e=>(e.currentTarget.style.transform="scale(1) rotate(0)")}>
          <FiArrowUp style={{ fontSize:17, strokeWidth:2.5 }}/>
        </button>
      )}
    </div>
  );
};

export default Home;