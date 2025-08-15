import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import DataTable from '../Common/DataTable';

const ViewStudents: React.FC = () => {
  const { user } = useAuth();
  const { data } = useData();

  const teacherClass = user?.assignedClass || '';
  const students = data.students
    .filter(s => s.class === teacherClass)
    .sort((a, b) => a.rollNo.localeCompare(b.rollNo));

  const columns = [
    { key: 'rollNo', label: 'Roll No' },
    { key: 'name', label: 'Name' },
    {
      key: 'feeStatus',
      label: 'Fee Status',
      render: (status: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === 'Paid'
              ? 'bg-green-100 text-green-800'
              : status === 'Pending'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
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
        <h3 className="text-lg font-semibold">Your Students - Class {teacherClass}</h3>
        <p className="text-gray-600">Total Students: {students.length}</p>
      </div>

      <DataTable
        columns={columns}
        data={students}
        emptyMessage={`No students found for class ${teacherClass}`}
      />
    </div>
  );
};

export default ViewStudents;