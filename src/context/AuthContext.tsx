import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_DRIVER_PROFILE, DEMO_OWNER_PROFILE } from '../data/mockData';
import { api } from '../services/api';

interface AuthContextType {
  user: UserProfile;
  role: UserRole;
  switchRole: (role: UserRole) => void;
  loginAsDriver: () => void;
  loginAsOwner: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  logout: () => void;
  login: (email: string, role: UserRole, name?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('parko_active_role') as UserRole;
    return savedRole === 'owner' ? 'owner' : 'driver';
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('parko_user_profile');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return role === 'owner' ? DEMO_OWNER_PROFILE : DEMO_DRIVER_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('parko_active_role', role);
    localStorage.setItem('parko_user_profile', JSON.stringify(user));
  }, [role, user]);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'owner') {
      setUser(DEMO_OWNER_PROFILE);
    } else {
      setUser(DEMO_DRIVER_PROFILE);
    }
  };

  const loginAsDriver = () => {
    setRole('driver');
    setUser(DEMO_DRIVER_PROFILE);
  };

  const loginAsOwner = () => {
    setRole('owner');
    setUser(DEMO_OWNER_PROFILE);
  };

  const login = (email: string, selectedRole: UserRole, name?: string) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || (email.split('@')[0].replace(/[._]/g, ' ') || 'New User'),
      email,
      role: selectedRole,
      avatar: selectedRole === 'owner' ? DEMO_OWNER_PROFILE.avatar : DEMO_DRIVER_PROFILE.avatar,
      phone: '+91 98765 43210',
      memberSince: 'October 2026',
      isVerified: true,
      defaultVehicle: selectedRole === 'driver' ? {
        makeModel: 'Tesla Model 3 (Midnight Silver)',
        licensePlate: 'MH 02 CZ 8921',
        state: 'Maharashtra'
      } : undefined
    };
    setRole(selectedRole);
    setUser(newUser);

    // Sync with backend API
    api.auth.login(email, selectedRole).catch((err) => console.warn('Logged in locally:', err));
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      if (updates.defaultVehicle) {
        api.auth.updateVehicle({
          userId: updated.id,
          makeModel: updates.defaultVehicle.makeModel,
          licensePlate: updates.defaultVehicle.licensePlate,
          state: updates.defaultVehicle.state
        }).catch((err) => console.warn('Updated vehicle locally:', err));
      }
      return updated;
    });
  };

  const logout = () => {
    setRole('driver');
    setUser(DEMO_DRIVER_PROFILE);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        switchRole,
        loginAsDriver,
        loginAsOwner,
        updateUser,
        logout,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
