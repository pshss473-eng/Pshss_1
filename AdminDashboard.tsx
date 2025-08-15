import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Users, GraduationCap, Upload, Calendar, BarChart, FileText, Settings, Eye } from 'lucide-react';
import DashboardCard from '../Common/DashboardCard';
import Modal from '../Common/Modal';
import ManageTeachers from '../Admin/ManageTeachers';
import ManageStudents from '../Admin/ManageStudents';
import BulkUpload from '../Admin/BulkUpload';
import AttendanceReports from '../Admin/AttendanceReports';
import MarkReports from '../Admin/MarkReports';
import AuditLogs from '../Admin/AuditLogs';
import SystemSettings from '../Admin/SystemSettings';

type ModalType = 'teachers' | 'students' | 'upload' | 'timetable' | 'attendance' | 'marks' | 'audit' | 'settings' | null;

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const cards = [
    {
      title: 'Manage Teachers',
      description: 'Add, edit or remove teachers',
      icon: <Users className="w-8 h-8 text-blue-600" />,
      action: () => setActiveModal('teachers')
    },
    {
      title: 'Manage Students',
      description: 'Add students individually or in bulk',
      icon: <GraduationCap className="w-8 h-8 text-green-600" />,
      action: () => setActiveModal('students')
    },
    {
      title: 'Bulk Upload',
      description: 'Bulk upload via CSV/Google Sheets',
      icon: <Upload className="w-8 h-8 text-purple-600" />,
      action: () => setActiveModal('upload')
    },
    {
      title: 'Attendance Reports',
      description: 'View attendance analytics',
      icon: <BarChart className="w-8 h-8 text-orange-600" />,
      action: () => setActiveModal('attendance')
    },
    {
      title: 'Mark Analysis',
      description: 'Student performance reports',
      icon: <FileText className="w-8 h-8 text-red-600" />,
      action: () => setActiveModal('marks')
    },
    {
      title: 'Audit Logs',
      description: 'System activity history',
      icon: <Eye className="w-8 h-8 text-indigo-600" />,
      action: () => setActiveModal('audit')
    },
    {
      title: 'Settings',
      description: 'Configure system options',
      icon: <Settings className="w-8 h-8 text-gray-600" />,
      action: () => setActiveModal('settings')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[var(--admin-primary)] text-white rounded-full flex items-center justify-center font-bold">
                A
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome, {user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
              onClick={card.action}
              variant="admin"
            />
          ))}
        </div>

        {/* Modals */}
        <Modal
          isOpen={activeModal === 'teachers'}
          onClose={() => setActiveModal(null)}
          title="Manage Teachers"
          size="xl"
        >
          <ManageTeachers />
        </Modal>

        <Modal
          isOpen={activeModal === 'students'}
          onClose={() => setActiveModal(null)}
          title="Manage Students"
          size="xl"
        >
          <ManageStudents />
        </Modal>

        <Modal
          isOpen={activeModal === 'upload'}
          onClose={() => setActiveModal(null)}
          title="Bulk Upload Students"
          size="xl"
        >
          <BulkUpload />
        </Modal>

        <Modal
          isOpen={activeModal === 'attendance'}
          onClose={() => setActiveModal(null)}
          title="Attendance Reports"
          size="xl"
        >
          <AttendanceReports />
        </Modal>

        <Modal
          isOpen={activeModal === 'marks'}
          onClose={() => setActiveModal(null)}
          title="Mark Analysis"
          size="xl"
        >
          <MarkReports />
        </Modal>

        <Modal
          isOpen={activeModal === 'audit'}
          onClose={() => setActiveModal(null)}
          title="Audit Logs"
          size="xl"
        >
          <AuditLogs />
        </Modal>

        <Modal
          isOpen={activeModal === 'settings'}
          onClose={() => setActiveModal(null)}
          title="System Settings"
          size="lg"
        >
          <SystemSettings />
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;