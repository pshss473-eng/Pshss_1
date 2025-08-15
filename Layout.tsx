import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import SplashScreen from './SplashScreen';
import LoginPage from '../Auth/LoginPage';
import AdminDashboard from '../Dashboards/AdminDashboard';
import TeacherDashboard from '../Dashboards/TeacherDashboard';
import ParentDashboard from '../Dashboards/ParentDashboard';
import ThemeToggle from './ThemeToggle';

const Layout: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <ThemeToggle />
      </>
    );
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'parent':
        return <ParentDashboard />;
      default:
        return <LoginPage />;
    }
  };

  return (
    <>
      {renderDashboard()}
      <ThemeToggle />
    </>
  );
};

export default Layout;