import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[var(--admin-primary)] flex flex-col items-center justify-center z-50 animate-fadeIn">
      <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
        <span className="text-3xl md:text-4xl font-bold text-[var(--admin-primary)]">
          PSHSS
        </span>
      </div>
      <h1 className="text-white text-xl md:text-2xl font-semibold text-center px-4">
        School Management System
      </h1>
      <div className="mt-8 flex space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-white rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default SplashScreen;