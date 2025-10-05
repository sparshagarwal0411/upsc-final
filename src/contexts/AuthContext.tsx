import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  upscId?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  verifyOTP: (otp: string) => Promise<boolean>;
  refreshAuthState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// JWT Token utilities
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true; // If we can't parse the token, consider it expired
  }
};

const getTokenPayload = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing JWT token on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        if (isTokenExpired(token)) {
          // Token is expired, clear it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        } else {
          // Token is valid, set user as authenticated
          const userInfo = JSON.parse(userData);
          const payload = getTokenPayload(token);
          
          setUser({
            id: payload?.sub || '1',
            name: userInfo.name || 'User',
            email: userInfo.email || payload?.email || '',
            phone: userInfo.phone || '',
            upscId: userInfo.upscId,
            isVerified: true,
          });
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: any): Promise<boolean> => {
    try {
      const response = await fetch('https://igdt.adityaexp.dev/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Store JWT token in localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify({ email: credentials.email }));
        
        // Refresh auth state to update the context
        refreshAuthState();
        
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock successful registration
    setUser({
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      isVerified: false,
    });
    
    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshAuthState = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      if (isTokenExpired(token)) {
        // Token is expired, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } else {
        // Token is valid, set user as authenticated
        const userInfo = JSON.parse(userData);
        const payload = getTokenPayload(token);
        
        setUser({
          id: payload?.sub || '1',
          name: userInfo.name || 'User',
          email: userInfo.email || payload?.email || '',
          phone: userInfo.phone || '',
          upscId: userInfo.upscId,
          isVerified: true,
        });
      }
    } else {
      setUser(null);
    }
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user) {
      setUser({ ...user, isVerified: true });
    }
    
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      verifyOTP,
      refreshAuthState,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};