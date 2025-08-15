import React from 'react';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant: 'admin' | 'teacher' | 'parent';
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon,
  onClick,
  variant
}) => {
  const variantClasses = {
    admin: 'card-admin hover:shadow-blue-200',
    teacher: 'card-teacher hover:shadow-green-200',
    parent: 'card-parent hover:shadow-blue-200'
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-6 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer ${variantClasses[variant]}`}
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default DashboardCard;