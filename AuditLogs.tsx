import React from 'react';
import { useData } from '../../contexts/DataContext';
import DataTable from '../Common/DataTable';

const AuditLogs: React.FC = () => {
  const { data } = useData();

  const columns = [
    {
      key: 'timestamp',
      label: 'Timestamp',
      render: (timestamp: string) => new Date(timestamp).toLocaleString()
    },
    { key: 'message', label: 'Activity' }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">System Audit Logs</h3>
      
      <div className="max-h-96 overflow-y-auto">
        <DataTable
          columns={columns}
          data={data.logs || []}
          emptyMessage="No audit logs available"
        />
      </div>
    </div>
  );
};

export default AuditLogs;