import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';

const SystemSettings: React.FC = () => {
  const { data, updateData } = useData();
  const { isDark, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    schoolStartTime: data.schoolStartTime || '08:00',
    schoolEndTime: data.schoolEndTime || '15:00'
  });
  const [message, setMessage] = useState('');

  const handleSave = () => {
    if (settings.schoolStartTime >= settings.schoolEndTime) {
      setMessage('Start time must be earlier than end time.');
      return;
    }

    updateData(settings);
    setMessage('Settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">System Settings</h3>

      <div className="space-y-4">
        <div>
          <label className="form-label">School Start Time</label>
          <input
            type="time"
            value={settings.schoolStartTime}
            onChange={(e) => setSettings({ ...settings, schoolStartTime: e.target.value })}
            className="form-input w-48"
          />
        </div>

        <div>
          <label className="form-label">School End Time</label>
          <input
            type="time"
            value={settings.schoolEndTime}
            onChange={(e) => setSettings({ ...settings, schoolEndTime: e.target.value })}
            className="form-input w-48"
          />
        </div>

        <div className="border-t pt-4">
          <label className="form-label">Application Theme</label>
          <button
            onClick={toggleTheme}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Switch to {isDark ? 'Light' : 'Dark'} Mode
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <div className="pt-4">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;