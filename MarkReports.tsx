import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import DataTable from '../Common/DataTable';

const MarkReports: React.FC = () => {
  const { data } = useData();
  const [selectedClass, setSelectedClass] = useState('');

  const classes = useMemo(() => {
    return [...new Set(data.students.map(s => s.class))].sort();
  }, [data.students]);

  const markData = useMemo(() => {
    let entries: any[] = [];
    
    data.students.forEach(student => {
      if (selectedClass && student.class !== selectedClass) return;
      
      (student.marks || []).forEach(mark => {
        entries.push({
          name: student.name,
          class: student.class,
          rollNo: student.rollNo,
          subject: mark.subject,
          score: mark.score,
          date: new Date(mark.date).toLocaleDateString()
        });
      });
    });

    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data.students, selectedClass]);

  const columns = [
    { key: 'name', label: 'Student Name' },
    { key: 'class', label: 'Class' },
    { key: 'rollNo', label: 'Roll No' },
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

  const summary = useMemo(() => {
    const scores = markData.map(m => m.score);
    const total = scores.length;
    const average = total > 0 ? scores.reduce((sum, score) => sum + score, 0) / total : 0;
    const highest = total > 0 ? Math.max(...scores) : 0;
    const lowest = total > 0 ? Math.min(...scores) : 0;
    
    return { total, average: Math.round(average * 10) / 10, highest, lowest };
  }, [markData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Mark Analysis</h3>
        <div>
          <label htmlFor="classFilter" className="mr-2 text-sm font-medium">
            Filter by Class:
          </label>
          <select
            id="classFilter"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="form-input w-32"
          >
            <option value="">All Classes</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
          <div className="text-sm text-blue-800">Total Records</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{summary.average}%</div>
          <div className="text-sm text-green-800">Average Score</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{summary.highest}%</div>
          <div className="text-sm text-purple-800">Highest Score</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600">{summary.lowest}%</div>
          <div className="text-sm text-orange-800">Lowest Score</div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        <DataTable
          columns={columns}
          data={markData}
          emptyMessage="No marks data found"
        />
      </div>
    </div>
  );
};

export default MarkReports;