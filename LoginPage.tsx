import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [role, setRole] = useState<'admin' | 'teacher' | 'parent'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'Please enter your email or code.';
    }

    if (!password.trim()) {
      newErrors.password = 'Please enter your password.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const success = login(email, password, role);
    if (!success) {
      setErrors({ general: `Invalid ${role} credentials. Please check your email and password.` });
    }
  };

  const roles = [
    { key: 'admin', label: 'Admin', bgColor: 'btn-admin' },
    { key: 'teacher', label: 'Teacher', bgColor: 'btn-teacher' },
    { key: 'parent', label: 'Parent', bgColor: 'btn-parent' }
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--admin-primary)] text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-bold">PSHSS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          {roles.map(({ key, label, bgColor }) => (
            <button
              key={key}
              type="button"
              onClick={() => setRole(key)}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                role === key
                  ? `${bgColor} text-white shadow-md transform scale-105`
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400 rounded-r-md">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="form-label">
              Email address or code
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`form-input ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter email or login code"
              autoComplete="username"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="relative">
            <label htmlFor="password" className="form-label">
              Password or code
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`form-input pr-12 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter password"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--admin-primary)] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs">
            <p><strong>Admin:</strong> admin@pshss.edu / admin123</p>
            <p><strong>Teacher:</strong> teacher1@pshss.edu / teacher1</p>
            <p><strong>Parent:</strong> student1@pshss.edu / student1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;