import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

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

        if (storedUser) {
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
      } catch (e) {
        console.error("Auth sync error:", e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    syncUser();
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  // ====================== REGISTER ======================
  const register = async ({ name, email, password }) => {
    let users = safeParse(localStorage.getItem("users"), []);
    const normalizedEmail = email.trim().toLowerCase();

    const exists = users.some(
      (u) => u.email?.trim().toLowerCase() === normalizedEmail
    );

    if (exists) throw new Error("User already exists");

    const isFirstUser = users.length === 0;

    const newUser = {
      id: Date.now().toString(),
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

  // ====================== LOGIN ======================
  const login = async ({ email, password }) => {
    const users = safeParse(localStorage.getItem("users"), []);
    const normalizedEmail = email.trim().toLowerCase();

    const foundUser = users.find(
      (u) =>
        u.email?.trim().toLowerCase() === normalizedEmail &&
        u.password === password
    );

    if (!foundUser) throw new Error("Invalid email or password");

    localStorage.setItem("user", JSON.stringify(foundUser));
    setUser(foundUser);

    return foundUser;
  };

  // ====================== OTHER FUNCTIONS ======================
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    if (!user) return;

    let users = safeParse(localStorage.getItem("users"), []);

    const updatedUsers = users.map((u) =>
      u.id === user.id
        ? {
            ...u,
            ...updatedFields,
            profile: {
              ...u.profile,
              ...(updatedFields.profile || {}),
            },
          }
        : u
    );

    const freshUser = updatedUsers.find((u) => u.id === user.id);

    if (freshUser) {
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("user", JSON.stringify(freshUser));
      setUser(freshUser);
    }
  };

  const refreshUser = () => {
    const storedUser = safeParse(localStorage.getItem("user"), null);
    if (!storedUser) return;

    const users = safeParse(localStorage.getItem("users"), []);
    const freshUser = users.find((u) => u.id === storedUser.id);

    if (freshUser) {
      setUser(freshUser);
      localStorage.setItem("user", JSON.stringify(freshUser));
    }
  };

  const deleteUser = () => {
    if (!user || !window.confirm("Delete account permanently?")) return;

    let users = safeParse(localStorage.getItem("users"), []);
    users = users.filter((u) => u.id !== user.id);

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.removeItem("user");
    setUser(null);

    window.location.replace("/register");
  };

  const isAdmin = user?.role?.toLowerCase() === "admin";

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUser,
    refreshUser,
    deleteUser,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);