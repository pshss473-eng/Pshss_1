import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Check, FileText, Calendar, Megaphone, DollarSign } from 'lucide-react';
import DashboardCard from '../Common/DashboardCard';
import Modal from '../Common/Modal';
import ViewAttendance from '../Parent/ViewAttendance';
import ViewMarks from '../Parent/ViewMarks';
import ViewTimetable from '../Parent/ViewTimetable';
import ViewCirculars from '../Parent/ViewCirculars';
import ViewFees from '../Parent/ViewFees';

type ModalType = 'attendance' | 'marks' | 'timetable' | 'circulars' | 'fees' | null;

const ParentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const cards = [
    {
      title: 'View Attendance',
      description: "Check your child's attendance",
      icon: <Check className="w-8 h-8 text-green-600" />,
      action: () => setActiveModal('attendance')
    },
    {
      title: 'View Marks',
      description: 'See test/exam results',
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      action: () => setActiveModal('marks')
    },
    {
      title: 'View Timetable',
      description: 'Check class schedule',
      icon: <Calendar className="w-8 h-8 text-purple-600" />,
      action: () => setActiveModal('timetable')
    },
    {
      title: 'View Circulars',
      description: 'School announcements',
      icon: <Megaphone className="w-8 h-8 text-orange-600" />,
      action: () => setActiveModal('circulars')
    },
    {
      title: 'Fee Status',
      description: 'Check payment details',
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
      action: () => setActiveModal('fees')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[var(--parent-primary)] text-white rounded-full flex items-center justify-center font-bold">
                P
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Parent Dashboard</h1>
                <p className="text-gray-600">Welcome, Parent of {user?.student?.name}</p>
                <p className="text-sm text-gray-500">
                  Class: {user?.student?.class} • Roll No: {user?.student?.rollNo}
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
              variant="parent"
            />
          ))}
        </div>

        {/* Modals */}
        <Modal
          isOpen={activeModal === 'attendance'}
          onClose={() => setActiveModal(null)}
          title="Attendance Records"
          size="xl"
        >
          <ViewAttendance />
        </Modal>

        <Modal
          isOpen={activeModal === 'marks'}
          onClose={() => setActiveModal(null)}
          title="Marks Records"
          size="xl"
        >
          <ViewMarks />
        </Modal>

        <Modal
          isOpen={activeModal === 'timetable'}
          onClose={() => setActiveModal(null)}
          title="Class Timetable"
          size="xl"
        >
          <ViewTimetable />
        </Modal>

        <Modal
          isOpen={activeModal === 'circulars'}
          onClose={() => setActiveModal(null)}
          title="School Circulars"
          size="xl"
        >
          <ViewCirculars />
        </Modal>

        <Modal
          isOpen={activeModal === 'fees'}
          onClose={() => setActiveModal(null)}
          title="Fee Status"
          size="lg"
        >
          <ViewFees />
        </Modal>
      </div>
    </div>
  );
};

export default ParentDashboard;