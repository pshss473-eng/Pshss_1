import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DataTable from '../Common/DataTable';

const ViewMarks: React.FC = () => {
  const { user } = useAuth();
  const student = user?.student;

  if (!student) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No linked student record found.</p>
      </div>
    );
  }

  const marksData = (student.marks || [])
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(mark => ({
      ...mark,
      date: new Date(mark.date).toLocaleDateString()
    }));

  const columns = [
    { key: 'subject', label: 'Subject' },
    {
      key: 'score',
      label: 'Score',
      render: (score: number) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            score >= 80
              ? 'bg-green-100 text-green-800'
              : score >= 60
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {score}%
        </span>
      )
    },
    { key: 'date', label: 'Date' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Marks Records</h3>
        <p className="text-gray-600">Student: {student.name} • Class: {student.class}</p>
      </div>

      <DataTable
        columns={columns}
        data={marksData}
        emptyMessage="No marks records found"
      />
    </div>
  );
};

export default ViewMarks;