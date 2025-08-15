import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: number;
  role: 'admin' | 'teacher' | 'parent';
  name?: string;
  email: string;
  subject?: string;
  assignedClass?: string;
  student?: any;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, role: string): boolean => {
    const schoolData = JSON.parse(localStorage.getItem('schoolData') || '{}');

    switch (role) {
      case 'admin':
        if (email === schoolData.admin?.email && password === schoolData.admin?.password) {
          setUser({ id: 1, role: 'admin', email });
          logActivity('Admin logged in.');
          return true;
        }
        break;
      case 'teacher': {
        const teacher = schoolData.teachers?.find(
          (t: any) => t.email.toLowerCase() === email.toLowerCase() && t.password === password
        );
        if (teacher) {
          setUser({ ...teacher, role: 'teacher' });
          logActivity(`Teacher ${teacher.name} logged in.`);
          return true;
        }
        break;
      }
      case 'parent': {
        const student = schoolData.students?.find(
          (s: any) => s.parentEmail.toLowerCase() === email.toLowerCase() && s.parentPassword === password
        );
        if (student) {
          setUser({ id: student.id, role: 'parent', email, student });
          logActivity(`Parent of ${student.name} logged in.`);
          return true;
        }
        break;
      }
    }
    return false;
  };

  const logout = () => {
    if (user) {
      const userLabel = user.role === 'parent' ? `Parent of ${user.student?.name}` : user.name || user.email;
      logActivity(`${user.role} (${userLabel}) logged out.`);
    }
    setUser(null);
  };

  const logActivity = (message: string) => {
    const schoolData = JSON.parse(localStorage.getItem('schoolData') || '{}');
    const timestamp = new Date().toISOString();
    schoolData.logs = schoolData.logs || [];
    schoolData.logs.unshift({ timestamp, message });
    localStorage.setItem('schoolData', JSON.stringify(schoolData));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};