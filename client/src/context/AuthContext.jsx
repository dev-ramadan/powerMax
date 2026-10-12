import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pm_user');
      if (!saved) return null;

      // Self-heal: if pm_user was saved as a JWT string (starts with eyJ)
      if (saved.includes('eyJhbGciOi')) {
        localStorage.removeItem('pm_user');
        localStorage.removeItem('pm_token');
        return null;
      }

      const parsed = JSON.parse(saved);
      // Ensure it's a valid user object with properties, not an accidental token string
      if (typeof parsed === 'object' && parsed !== null && (parsed._id || parsed.role || parsed.email)) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      let saved = localStorage.getItem('pm_token');
      if (!saved) return null;
      if (saved.startsWith('"') && saved.endsWith('"')) {
        try { saved = JSON.parse(saved); } catch {}
      }
      return saved;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Supports both login(token, user) and login(user, token) or login({ token, user })
  const login = useCallback((arg1, arg2) => {
    let userData = null;
    let tokenStr = null;

    if (typeof arg1 === 'string' && typeof arg2 === 'object' && arg2 !== null) {
      tokenStr = arg1;
      userData = arg2;
    } else if (typeof arg1 === 'object' && arg1 !== null && typeof arg2 === 'string') {
      userData = arg1;
      tokenStr = arg2;
    } else if (typeof arg1 === 'object' && arg1 !== null && arg1.token && arg1.user) {
      tokenStr = arg1.token;
      userData = arg1.user;
    } else {
      userData = arg1;
      tokenStr = arg2;
    }

    if (typeof tokenStr === 'string' && tokenStr.startsWith('"') && tokenStr.endsWith('"')) {
      try { tokenStr = JSON.parse(tokenStr); } catch {}
    }

    setUser(userData);
    setToken(tokenStr);

    if (userData) {
      localStorage.setItem('pm_user', JSON.stringify(userData));
    }
    if (tokenStr) {
      localStorage.setItem('pm_token', typeof tokenStr === 'string' ? tokenStr : JSON.stringify(tokenStr));
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pm_user');
    localStorage.removeItem('pm_token');
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('pm_user', JSON.stringify(userData));
    }
  }, []);

  const isAdmin = user?.role === 'admin' || user?.role === 'staff';
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, isAdmin, login, logout, updateUser, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
