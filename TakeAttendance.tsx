import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Save } from 'lucide-react';

const TakeAttendance: React.FC = () => {
  const { user } = useAuth();
  const { data, updateData } = useData();
  const [message, setMessage] = useState('');

  const teacherClass = user?.assignedClass || '';
  const today = new Date().toISOString().split('T')[0];

  const classStudents = data.students
    .filter(s => s.class === teacherClass)
    .sort((a, b) => a.rollNo.localeCompare(b.rollNo));

  const [attendance, setAttendance] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    classStudents.forEach(student => {
      const existing = student.attendance?.find(a => a.date === today);
      initial[student.id] = existing?.status || 'Present';
    });
    return initial;
  });

  if (!teacherClass) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">You are not assigned any class for attendance.</p>
      </div>
    );
  }

  if (classStudents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No students found for your assigned class: {teacherClass}</p>
      </div>
    );
  }

  const handleStatusChange = (studentId: number, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    const updatedStudents = data.students.map(student => {
      if (student.class !== teacherClass) return student;

      const status = attendance[student.id];
      const attendanceArray = [...(student.attendance || [])];
      const existingIndex = attendanceArray.findIndex(a => a.date === today);

      if (existingIndex >= 0) {
        attendanceArray[existingIndex].status = status;
      } else {
        attendanceArray.push({ date: today, status });
      }

      return { ...student, attendance: attendanceArray };
    });

    updateData({ students: updatedStudents });
    setMessage('Attendance saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Take Attendance - {teacherClass}</h3>
          <p className="text-gray-600">Date: {new Date(today).toLocaleDateString()}</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Attendance</span>
        </button>
      </div>

      {message && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-200">
          {message}
        </div>
      )}

      <div className="max-h-96 overflow-y-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Roll No</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {classStudents.map(student => (
              <tr key={student.id} className="border-b">
                <td className="px-4 py-3 font-medium">{student.rollNo}</td>
                <td className="px-4 py-3">{student.name}</td>
                <td className="px-4 py-3">
                  <select
                    value={attendance[student.id]}
                    onChange={(e) => handleStatusChange(student.id, e.target.value)}
                    className="form-input py-1 text-sm"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                    <option value="Excused">Excused</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TakeAttendance;