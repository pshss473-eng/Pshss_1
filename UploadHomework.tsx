import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { BookOpen } from 'lucide-react';

const UploadHomework: React.FC = () => {
  const { user } = useAuth();
  const { data, updateData } = useData();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    content: ''
  });
  const [message, setMessage] = useState('');

  const teacherClass = user?.assignedClass || '';
  const subject = user?.subject || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      setMessage('Please enter homework content.');
      return;
    }

    const homework = data.homework || [];
    const newHomework = {
      id: Math.max(...homework.map(h => h.id || 0), 0) + 1,
      class: teacherClass,
      date: formData.date,
      subject,
      notes: formData.content,
      teacherName: user?.name || '',
      timestamp: new Date().toISOString()
    };

    updateData({ homework: [...homework, newHomework] });
    setMessage('Homework uploaded successfully!');
    setFormData({ date: new Date().toISOString().split('T')[0], content: '' });
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <BookOpen className="w-6 h-6 text-green-600" />
        <div>
          <h3 className="text-lg font-semibold">Upload Homework/Notes</h3>
          <p className="text-gray-600">Subject: {subject} • Class: {teacherClass}</p>
        </div>
      </div>

      {message && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-200">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-label">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="form-input"
            required
          />
        </div>

        <div>
          <label className="form-label">Homework / Notes</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="form-input"
            rows={6}
            placeholder="Enter homework description, assignments, or notes here..."
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Upload Homework
        </button>
      </form>
    </div>
  );
};

export default UploadHomework;