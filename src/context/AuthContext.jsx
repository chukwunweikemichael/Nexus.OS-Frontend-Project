import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// ✅ SAFE JSON PARSE (prevents crashes)
const safeParse = (data, fallback) => {
  try {
    return JSON.parse(data) || fallback;
  } catch {
    return fallback;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ LOAD + SYNC USER
  useEffect(() => {
    const syncUser = () => {
      try {
        const storedUser = safeParse(localStorage.getItem("user"), null);
        const users = safeParse(localStorage.getItem("users"), []);

        if (storedUser && users.length) {
          const freshUser = users.find((u) => u.id === storedUser.id);

          if (freshUser) {
            setUser(freshUser);
            localStorage.setItem("user", JSON.stringify(freshUser));
          } else {
            localStorage.removeItem("user");
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    syncUser();

    // ✅ sync across tabs
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  // 🔥 REGISTER
  const register = async ({ name, email, password }) => {
    let users = safeParse(localStorage.getItem("users"), []);

    const normalizedEmail = email.trim().toLowerCase();

    const exists = users.find(
      (u) => u.email?.trim().toLowerCase() === normalizedEmail
    );

    if (exists) throw new Error("User already exists");

    const isFirstUser = users.length === 0;

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: isFirstUser ? "admin" : "user",
      createdAt: new Date().toISOString(),
      profile: { bio: "", skills: [], avatar: "" },
      rating: 0,
      completedJobs: 0,
      level: "Beginner",
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("user", JSON.stringify(newUser));

    setUser(newUser);

    return newUser;
  };

  // 🔥 LOGIN
  const login = async ({ email, password }) => {
    const users = safeParse(localStorage.getItem("users"), []);
    const normalizedEmail = email.trim().toLowerCase();

    const foundUser = users.find(
      (u) =>
        u.email?.trim().toLowerCase() === normalizedEmail &&
        u.password === password
    );

    if (!foundUser) throw new Error("Invalid credentials");

    localStorage.setItem("user", JSON.stringify(foundUser));
    setUser(foundUser);

    return foundUser;
  };

  // 🔥 UPDATE USER (FIXED DEEP MERGE)
  const updateUser = (updatedUser) => {
    let users = safeParse(localStorage.getItem("users"), []);

    const updatedUsers = users.map((u) => {
      if (u.id !== updatedUser.id) return u;

      return {
        ...u,
        ...updatedUser,
        profile: {
          ...u.profile,
          ...(updatedUser.profile || {}),
        },
      };
    });

    const freshUser = updatedUsers.find((u) => u.id === updatedUser.id);

    if (!freshUser) return;

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("user", JSON.stringify(freshUser));

    setUser(freshUser);
  };

  // 🔥 REFRESH USER
  const refreshUser = () => {
    const storedUser = safeParse(localStorage.getItem("user"), null);
    const users = safeParse(localStorage.getItem("users"), []);

    if (!storedUser) return;

    const freshUser = users.find((u) => u.id === storedUser.id);

    if (freshUser) {
      setUser(freshUser);
      localStorage.setItem("user", JSON.stringify(freshUser));
    }
  };

  // 🔥 LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // 🔥 DELETE ACCOUNT
  const deleteUser = () => {
    if (!user) return;

    if (!window.confirm("Delete account permanently?")) return;

    let users = safeParse(localStorage.getItem("users"), []);
    users = users.filter((u) => u.id !== user.id);

    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem(
      "gigs",
      JSON.stringify(
        safeParse(localStorage.getItem("gigs"), []).filter(
          (g) => g.ownerId !== user.id
        )
      )
    );

    localStorage.setItem(
      "applications",
      JSON.stringify(
        safeParse(localStorage.getItem("applications"), []).filter(
          (a) => a.applicantId !== user.id
        )
      )
    );

    localStorage.setItem(
      "notifications",
      JSON.stringify(
        safeParse(localStorage.getItem("notifications"), []).filter(
          (n) => n.userId !== user.id
        )
      )
    );

    localStorage.removeItem("conversations");
    localStorage.removeItem("user");

    setUser(null);

    window.location.replace("/register");
  };

  // Improved isAdmin
  const isAdmin = user?.role === "admin" || user?.role === "Admin";

  // Helper to check if user can access admin panel
  const canAccessAdmin = () => {
    return user && (user.role === "admin" || user.role === "Admin");
  };
  
  return (
    <AuthContext.Provider
    value={{
  user,
  loading,
  register,
  login,
  logout,
  updateUser,
  refreshUser,
  deleteUser,
  isAdmin,
  canAccessAdmin   // ← add this
}}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);