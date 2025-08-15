import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const RequestChanges: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [requests, setRequests] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load existing requests
    const storedRequests = JSON.parse(localStorage.getItem('profileChangeRequests') || '[]');
    const userRequests = storedRequests.filter((r: any) => r.userId === user?.id);
    setRequests(userRequests);
  }, [user?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setMessage('Invalid email format.');
      return;
    }

    if (formData.name === user?.name && formData.email === user?.email) {
      setMessage('Please enter new details to request a change.');
      return;
    }

    const allRequests = JSON.parse(localStorage.getItem('profileChangeRequests') || '[]');
    const newRequest = {
      id: Math.max(...allRequests.map((r: any) => r.id || 0), 0) + 1,
      userId: user?.id,
      name: formData.name !== user?.name ? formData.name : '',
      email: formData.email !== user?.email ? formData.email : '',
      status: 'Pending',
      timestamp: new Date().toISOString()
    };

    allRequests.push(newRequest);
    localStorage.setItem('profileChangeRequests', JSON.stringify(allRequests));
    setRequests([...requests, newRequest]);
    setMessage('Request submitted successfully. Await admin approval.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Request Profile Changes</h3>
        <p className="text-gray-600">Submit requests to update your profile information</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-orange-50 text-orange-700 border border-orange-200'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-label">New Name (optional)</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
            placeholder="Enter new name"
          />
        </div>

        <div>
          <label className="form-label">New Email (optional)</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="form-input"
            placeholder="Enter new email"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Request
        </button>
      </form>

      <div>
        <h4 className="text-lg font-medium mb-4">Your Pending Requests</h4>
        {requests.length === 0 ? (
          <p className="text-gray-600">No pending requests.</p>
        ) : (
          <div className="space-y-2">
            {requests.map(request => (
              <div key={request.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    {request.name && (
                      <p><strong>Name:</strong> {request.name}</p>
                    )}
                    {request.email && (
                      <p><strong>Email:</strong> {request.email}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : request.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(request.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestChanges;