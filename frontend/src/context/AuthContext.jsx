import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("ff-token"));
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("ff-user");
    return u ? JSON.parse(u) : null;
  });

  const login = (token, user) => {
    localStorage.setItem("ff-token", token);
    localStorage.setItem("ff-user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("ff-token");
    localStorage.removeItem("ff-user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}