import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Megaphone } from 'lucide-react';

const ViewCirculars: React.FC = () => {
  const { data } = useData();
  const circulars = data.circulars || [];

  if (circulars.length === 0) {
    return (
      <div className="text-center py-8">
        <Megaphone className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-600">No circulars available currently.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Megaphone className="w-6 h-6 text-orange-600" />
        <h3 className="text-lg font-semibold">School Circulars</h3>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {circulars.map(circular => (
          <div key={circular.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-lg font-semibold text-gray-800">
                {circular.title}
              </h4>
              <span className="text-sm text-gray-500">
                {new Date(circular.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {circular.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewCirculars;