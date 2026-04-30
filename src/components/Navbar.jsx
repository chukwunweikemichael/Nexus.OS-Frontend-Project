
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiZap, FiSun, FiMoon, FiUser, FiLayout, FiLogOut, FiActivity, FiShield } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  const isDashboard = location.pathname === "/dashboard";
  const isAdmin$ = location.pathname === "/admin";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    const isDark = saved === "dark";
    setDarkMode(isDark);
    applyTheme(isDark);
  }, []);

  const applyTheme = (isDark) => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    // update CSS variables for Home page gold theme
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty("--ink", "#050505");
      root.style.setProperty("--txt", "#F4F4F4");
      root.style.setProperty("--s1", "rgba(255,255,255,0.03)");
      root.style.setProperty("--dim", "rgba(255,255,255,0.4)");
      root.style.setProperty("--card-bg", "rgba(255,255,255,0.03)");
      root.style.setProperty("--card-border", "rgba(255,255,255,0.07)");
      root.style.setProperty("--filter-bg", "rgba(8,8,16,0.94)");
      root.style.setProperty("--input-bg", "rgba(255,255,255,0.04)");
      root.style.setProperty("--input-border", "rgba(255,255,255,0.07)");
      root.style.setProperty("--text-sub", "rgba(238,232,216,0.4)");
      root.style.setProperty("--section-border", "rgba(255,255,255,0.04)");
    } else {
      root.style.setProperty("--ink", "#F5F3EE");
      root.style.setProperty("--txt", "#1A1A1A");
      root.style.setProperty("--s1", "rgba(0,0,0,0.03)");
      root.style.setProperty("--dim", "rgba(0,0,0,0.5)");
      root.style.setProperty("--card-bg", "rgba(255,255,255,0.9)");
      root.style.setProperty("--card-border", "rgba(0,0,0,0.08)");
      root.style.setProperty("--filter-bg", "rgba(245,243,238,0.97)");
      root.style.setProperty("--input-bg", "rgba(0,0,0,0.05)");
      root.style.setProperty("--input-border", "rgba(0,0,0,0.1)");
      root.style.setProperty("--text-sub", "rgba(30,20,10,0.5)");
      root.style.setProperty("--section-border", "rgba(0,0,0,0.06)");
    }
    // dispatch so Home re-reads
    window.dispatchEvent(new Event("themechange"));
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    applyTheme(newMode);
  };

  const scrollToSection = (id) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" }), 100);
    } else {
      document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? "py-3 px-4 md:px-10" : "py-5 px-4 md:px-8"}`}>
      <div className={`max-w-7xl mx-auto transition-all duration-500 rounded-[24px] border ${
        scrolled
          ? "bg-white/70 dark:bg-black/70 backdrop-blur-xl backdrop-saturate-150 border-white/20 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
          : "bg-transparent border-transparent"
      }`}>
        <div className="px-6 py-3 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group active:scale-95 transition-transform">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-fuchsia-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
              <div className="relative p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm">
                <FiZap className="text-xl text-amber-500" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                NEXUS<span className="text-amber-500">.OS</span>
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-1 p-1 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
            {[
              { label: "Categories", id: "#categories" },
              { label: "Elite Gigs",  id: "#gigs" },
              { label: "Voices",      id: "#testimonials" },
            ].map((item) => (
              <button key={item.label} onClick={() => scrollToSection(item.id)}
                className="px-5 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white rounded-xl hover:bg-white dark:hover:bg-white/10 transition-all">
                {item.label}
              </button>
            ))}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">

            {/* Theme Toggle */}
            <button onClick={toggleDarkMode}
              className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-neutral-600 dark:text-neutral-400"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              {darkMode
                ? <FiSun className="text-lg text-amber-400" />
                : <FiMoon className="text-lg text-neutral-600" />}
            </button>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-black/10 dark:border-white/10">

                {/* Admin link */}
                {isAdmin && !isAdmin$ && (
                  <button onClick={() => navigate("/admin")}
                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:bg-purple-500 hover:text-white transition-all text-xs font-bold uppercase tracking-wider mr-1">
                    <FiShield className="text-xs" /> Admin
                  </button>
                )}

                {/* Dashboard link */}
                {!isDashboard && (
                  <button onClick={() => navigate("/dashboard")}
                    className="hidden md:flex items-center gap-2 px-4 py-2 mr-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500 hover:text-white transition-all text-xs font-bold uppercase tracking-wider">
                    <FiActivity className="animate-pulse" /> Dashboard
                  </button>
                )}

                {/* User capsule */}
                <div className="hidden md:flex flex-col items-end mr-2">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white">{user.name}</span>
                  <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Available
                  </span>
                </div>

                <button onClick={() => navigate("/profile")}
                  className={`relative group p-0.5 rounded-full border-2 transition-all ${location.pathname === "/profile" ? "border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]" : "border-amber-500/20 hover:border-amber-500"}`}>
                  <img src={user?.profile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                    alt="avatar" className="w-9 h-9 rounded-full object-cover" />
                </button>

                <button onClick={logout}
                  className="hidden md:flex p-2.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                  <FiLogOut />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => navigate("/login")}
                  className="px-5 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors">
                  Sign In
                </button>
                <button onClick={() => navigate("/register")}
                  className="px-5 py-2.5 text-sm font-bold rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black hover:scale-[1.03] active:scale-[0.97] transition-all shadow-lg dark:shadow-white/5">
                  Join
                </button>
              </div>
            )}

            {/* Mobile toggle */}
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-2xl text-neutral-900 dark:text-white">
              {open ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-6 pb-8 pt-4 flex flex-col gap-2">
            <MobileLink onClick={() => scrollToSection("#categories")}>Categories</MobileLink>
            <MobileLink onClick={() => scrollToSection("#gigs")}>Elite Gigs</MobileLink>
            <MobileLink onClick={() => scrollToSection("#testimonials")}>Voices</MobileLink>
            {user && (
              <>
                <div className="h-px bg-black/5 dark:bg-white/5 my-2" />
                {isAdmin && <MobileLink onClick={() => navigate("/admin")} icon={<FiShield />}>Admin Panel</MobileLink>}
                {!isDashboard && <MobileLink onClick={() => navigate("/dashboard")} icon={<FiLayout />}>Dashboard</MobileLink>}
                <MobileLink onClick={() => navigate("/profile")} icon={<FiUser />}>My Profile</MobileLink>
                <button onClick={logout} className="flex items-center gap-3 w-full p-4 rounded-2xl text-red-500 bg-red-500/5 font-medium">
                  <FiLogOut /> Logout
                </button>
              </>
            )}
            {/* Mobile theme toggle */}
            <button onClick={toggleDarkMode} className="flex items-center gap-3 w-full p-4 rounded-2xl text-neutral-700 dark:text-neutral-300 bg-black/5 dark:bg-white/5 font-medium mt-1">
              {darkMode ? <><FiSun className="text-amber-400" /> Switch to Light Mode</> : <><FiMoon /> Switch to Dark Mode</>}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const MobileLink = ({ children, onClick, icon }) => (
  <button onClick={onClick}
    className="flex items-center gap-3 w-full p-4 rounded-2xl text-left text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5 font-medium transition-colors">
    {icon && <span className="text-lg">{icon}</span>}
    {children}
  </button>
);

export default Navbar;