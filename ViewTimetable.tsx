import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const ViewTimetable: React.FC = () => {
  const { user } = useAuth();
  const { data } = useData();
  const student = user?.student;

  if (!student) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No linked student record found.</p>
      </div>
    );
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];
  const timetable = data.timetable || {};
  const classTimetable = timetable[student.class] || {};

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Class Timetable</h3>
        <p className="text-gray-600">Class: {student.class}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                Period
              </th>
              {days.map(day => (
                <th key={day} className="border border-gray-300 px-4 py-3 text-left font-semibold">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map(period => (
              <tr key={period}>
                <td className="border border-gray-300 px-4 py-3 font-medium bg-gray-50">
                  {period}
                </td>
                {days.map(day => {
                  const cell = classTimetable[day]?.[period];
                  return (
                    <td key={day} className="border border-gray-300 px-4 py-3">
                      {cell ? (
                        <div>
                          <div className="font-medium text-gray-800">
                            {cell.subject || '-'}
                          </div>
                          <div className="text-xs text-gray-600">
                            {cell.teacher || ''}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewTimetable;