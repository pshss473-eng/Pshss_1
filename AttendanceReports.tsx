import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import DataTable from '../Common/DataTable';

const AttendanceReports: React.FC = () => {
  const { data } = useData();
  const [selectedClass, setSelectedClass] = useState('');

  const classes = useMemo(() => {
    return [...new Set(data.students.map(s => s.class))].sort();
  }, [data.students]);

  const attendanceData = useMemo(() => {
    let entries: any[] = [];
    
    data.students.forEach(student => {
      if (selectedClass && student.class !== selectedClass) return;
      
      (student.attendance || []).forEach(attendance => {
        entries.push({
          name: student.name,
          class: student.class,
          date: attendance.date,
          status: attendance.status,
          rollNo: student.rollNo
        });
      });
    });

    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data.students, selectedClass]);

  const columns = [
    { key: 'name', label: 'Student Name' },
    { key: 'class', label: 'Class' },
    { key: 'rollNo', label: 'Roll No' },
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

  const summary = useMemo(() => {
    const total = attendanceData.length;
    const present = attendanceData.filter(a => a.status === 'Present').length;
    const absent = attendanceData.filter(a => a.status === 'Absent').length;
    const late = attendanceData.filter(a => a.status === 'Late').length;
    
    return { total, present, absent, late };
  }, [attendanceData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Attendance Reports</h3>
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
          <div className="text-2xl font-bold text-green-600">{summary.present}</div>
          <div className="text-sm text-green-800">Present</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">{summary.absent}</div>
          <div className="text-sm text-red-800">Absent</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">{summary.late}</div>
          <div className="text-sm text-yellow-800">Late</div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        <DataTable
          columns={columns}
          data={attendanceData}
          emptyMessage="No attendance data found"
        />
      </div>
    </div>
  );
};

export default AttendanceReports;