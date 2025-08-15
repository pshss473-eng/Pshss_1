import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DataTable from '../Common/DataTable';

const ViewAttendance: React.FC = () => {
  const { user } = useAuth();
  const student = user?.student;

  if (!student) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No linked student record found.</p>
      </div>
    );
  }

  const attendanceData = (student.attendance || [])
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const columns = [
    { key: 'date', label: 'Date' },
    {
      key: 'status',
      label: 'Status',
      render: (status: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === 'Present'
              ? 'bg-green-100 text-green-800'
              : status === 'Absent'
              ? 'bg-red-100 text-red-800'
              : status === 'Late'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {status}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Attendance Records</h3>
        <p className="text-gray-600">Student: {student.name} • Class: {student.class}</p>
      </div>

      <DataTable
        columns={columns}
        data={attendanceData}
        emptyMessage="No attendance records found"
      />
    </div>
  );
};

export default ViewAttendance;