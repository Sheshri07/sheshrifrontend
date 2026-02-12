import { createContext, useContext, useState, useEffect } from "react";
import { safeLocalStorage, safeSessionStorage } from "../utils/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount (check local first, then session)
    const storedUser = safeLocalStorage.getItem("user") || safeSessionStorage.getItem("user");
    const storedToken = safeLocalStorage.getItem("token") || safeSessionStorage.getItem("token");

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Safeguard: if it's the old nested structure { success, user: { ... } }, flatten it
        setUser(parsed.user ? parsed.user : parsed);
      } catch (e) {
        safeLocalStorage.removeItem("user");
        safeSessionStorage.removeItem("user");
        safeLocalStorage.removeItem("token");
        safeSessionStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = (authData, rememberMe = true) => {
    const { token, user: userDetails } = authData;
    setUser(userDetails);

    if (rememberMe) {
      safeLocalStorage.setItem("user", JSON.stringify(userDetails));
      safeLocalStorage.setItem("token", token);
      safeSessionStorage.removeItem("user");
      safeSessionStorage.removeItem("token");
    } else {
      safeSessionStorage.setItem("user", JSON.stringify(userDetails));
      safeSessionStorage.setItem("token", token);
      safeLocalStorage.removeItem("user");
      safeLocalStorage.removeItem("token");
    }
  };

  const logout = () => {
    setUser(null);
    safeLocalStorage.removeItem("user");
    safeSessionStorage.removeItem("user");
    safeLocalStorage.removeItem("token");
    safeSessionStorage.removeItem("token");
  };

  const updateUser = (updatedDetails) => {
    setUser(updatedDetails);

    // Update storage based on where the user was originally stored
    if (safeLocalStorage.getItem("user")) {
      safeLocalStorage.setItem("user", JSON.stringify(updatedDetails));
    } else if (safeSessionStorage.getItem("user")) {
      safeSessionStorage.setItem("user", JSON.stringify(updatedDetails));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
