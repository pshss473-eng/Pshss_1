import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ViewFees: React.FC = () => {
  const { user } = useAuth();
  const student = user?.student;

  if (!student) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No linked student record found.</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      case 'partial':
        return <Clock className="w-8 h-8 text-yellow-500" />;
      default:
        return <DollarSign className="w-8 h-8 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'pending':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'partial':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <DollarSign className="w-6 h-6 text-green-600" />
        <div>
          <h3 className="text-lg font-semibold">Fee Status</h3>
          <p className="text-gray-600">Student: {student.name} • Class: {student.class}</p>
        </div>
      </div>

      <div className={`border rounded-lg p-6 ${getStatusColor(student.feeStatus)}`}>
        <div className="flex items-center space-x-4">
          {getStatusIcon(student.feeStatus)}
          <div>
            <h4 className="text-xl font-semibold">
              Fee Status: {student.feeStatus}
            </h4>
            <p className="text-sm opacity-90 mt-1">
              {student.feeStatus.toLowerCase() === 'paid' 
                ? 'All fees are up to date'
                : student.feeStatus.toLowerCase() === 'pending'
                ? 'Payment is required'
                : 'Partial payment received'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-medium text-blue-800 mb-2">Payment Information</h5>
        <p className="text-blue-700 text-sm">
          Please contact the school office for detailed payment information, receipts, and payment methods.
        </p>
        <p className="text-blue-700 text-sm mt-2">
          <strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 4:00 PM
        </p>
      </div>
    </div>
  );
};

export default ViewFees;