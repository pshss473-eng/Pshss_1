import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Check, Upload, BookOpen, Users, Settings } from 'lucide-react';
import DashboardCard from '../Common/DashboardCard';
import Modal from '../Common/Modal';
import TakeAttendance from '../Teacher/TakeAttendance';
import UploadMarks from '../Teacher/UploadMarks';
import UploadHomework from '../Teacher/UploadHomework';
import ViewStudents from '../Teacher/ViewStudents';
import RequestChanges from '../Teacher/RequestChanges';

type ModalType = 'attendance' | 'marks' | 'homework' | 'students' | 'request' | null;

const TeacherDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const cards = [
    {
      title: 'Take Attendance',
      description: 'Mark student attendance',
      icon: <Check className="w-8 h-8 text-green-600" />,
      action: () => setActiveModal('attendance')
    },
    {
      title: 'Upload Marks',
      description: 'Enter test/exam results',
      icon: <Upload className="w-8 h-8 text-blue-600" />,
      action: () => setActiveModal('marks')
    },
    {
      title: 'Upload Homework',
      description: 'Share assignments with students',
      icon: <BookOpen className="w-8 h-8 text-purple-600" />,
      action: () => setActiveModal('homework')
    },
    {
      title: 'View Students',
      description: 'See your assigned classes',
      icon: <Users className="w-8 h-8 text-orange-600" />,
      action: () => setActiveModal('students')
    },
    {
      title: 'Request Changes',
      description: 'Update your profile',
      icon: <Settings className="w-8 h-8 text-gray-600" />,
      action: () => setActiveModal('request')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[var(--teacher-primary)] text-white rounded-full flex items-center justify-center font-bold">
                T
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
                <p className="text-gray-600">Welcome, {user?.name}</p>
                <p className="text-sm text-gray-500">
                  Subject: {user?.subject} • Class: {user?.assignedClass}
                </p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
              onClick={card.action}
              variant="teacher"
            />
          ))}
        </div>

        {/* Modals */}
        <Modal
          isOpen={activeModal === 'attendance'}
          onClose={() => setActiveModal(null)}
          title="Take Attendance"
          size="xl"
        >
          <TakeAttendance />
        </Modal>

        <Modal
          isOpen={activeModal === 'marks'}
          onClose={() => setActiveModal(null)}
          title="Upload Marks"
          size="xl"
        >
          <UploadMarks />
        </Modal>

        <Modal
          isOpen={activeModal === 'homework'}
          onClose={() => setActiveModal(null)}
          title="Upload Homework"
          size="lg"
        >
          <UploadHomework />
        </Modal>

        <Modal
          isOpen={activeModal === 'students'}
          onClose={() => setActiveModal(null)}
          title="View Students"
          size="xl"
        >
          <ViewStudents />
        </Modal>

        <Modal
          isOpen={activeModal === 'request'}
          onClose={() => setActiveModal(null)}
          title="Request Changes"
          size="lg"
        >
          <RequestChanges />
        </Modal>
      </div>
    </div>
  );
};

export default TeacherDashboard;