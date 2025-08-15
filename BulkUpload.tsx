import React, { useState, useRef } from 'react';
import { useData } from '../../contexts/DataContext';
import { Upload, Download, CheckCircle, XCircle } from 'lucide-react';

interface ParsedStudent {
  Name: string;
  Class: string;
  RollNo: string;
  ParentEmail: string;
  ParentPassword: string;
  FeeStatus: string;
  error?: string;
}

const BulkUpload: React.FC = () => {
  const { data, updateData } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedData, setParsedData] = useState<ParsedStudent[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState('');

  const downloadTemplate = () => {
    const template = "Name,Class,Roll No,Parent Email,Parent Password,Fee Status\nJohn Doe,12-A,12A01,parent1@example.com,parent123,Paid";
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string) => {
    const lines = text.trim().split(/\r?\n/);
    return lines.map(line => line.split(',').map(cell => cell.trim()));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = parseCSV(text);
        
        if (rows.length < 2) {
          setMessage('CSV appears empty or invalid.');
          return;
        }

        const header = rows[0].map(h => h.toLowerCase());
        const expectedHeaders = ['name', 'class', 'roll no', 'parent email', 'parent password', 'fee status'];
        
        if (!expectedHeaders.every(h => header.includes(h))) {
          setMessage(`CSV missing required columns: ${expectedHeaders.join(', ')}`);
          return;
        }

        const indices: Record<string, number> = {};
        expectedHeaders.forEach(h => {
          indices[h] = header.indexOf(h);
        });

        const parsed = rows.slice(1).map((row, index) => {
          if (row.length < 6) return null;
          
          const student: ParsedStudent = {
            Name: row[indices['name']] || '',
            Class: row[indices['class']] || '',
            RollNo: row[indices['roll no']] || '',
            ParentEmail: row[indices['parent email']] || '',
            ParentPassword: row[indices['parent password']] || '',
            FeeStatus: row[indices['fee status']] || ''
          };

          // Validate
          if (!student.Name || !student.Class || !student.RollNo || !student.ParentEmail || !student.ParentPassword || !student.FeeStatus) {
            student.error = 'Missing required fields';
          } else if (!validateEmail(student.ParentEmail)) {
            student.error = 'Invalid parent email';
          } else if (!['paid', 'pending', 'partial'].includes(student.FeeStatus.toLowerCase())) {
            student.error = 'Fee status must be Paid, Pending or Partial';
          }

          return student;
        }).filter(Boolean) as ParsedStudent[];

        setParsedData(parsed);
        setShowPreview(true);
        setMessage('');
      } catch (error) {
        setMessage('Failed to parse CSV file.');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const confirmUpload = () => {
    const validStudents = parsedData.filter(s => !s.error);
    if (validStudents.length === 0) {
      setMessage('No valid students to upload.');
      return;
    }

    let addedCount = 0;
    const newStudents = [];

    validStudents.forEach(studentData => {
      // Check for duplicates
      const exists = data.students.some(s => 
        s.rollNo.toLowerCase() === studentData.RollNo.toLowerCase() && 
        s.class.toLowerCase() === studentData.Class.toLowerCase()
      );

      if (!exists) {
        const newId = Math.max(...data.students.map(s => s.id), 0) + 1 + addedCount;
        newStudents.push({
          id: newId,
          name: studentData.Name,
          class: studentData.Class,
          rollNo: studentData.RollNo,
          parentEmail: studentData.ParentEmail,
          parentPassword: studentData.ParentPassword,
          feeStatus: studentData.FeeStatus,
          attendance: [],
          marks: []
        });
        addedCount++;
      }
    });

    if (newStudents.length > 0) {
      updateData({ students: [...data.students, ...newStudents] });
      setMessage(`Successfully added ${addedCount} new students.`);
      setParsedData([]);
      setShowPreview(false);
    } else {
      setMessage('No new students to add (all already exist).');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Bulk Upload Students</h3>
        <button
          onClick={downloadTemplate}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download Template</span>
        </button>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">Drag & drop CSV file here or click to browse</p>
        <p className="text-sm text-gray-500">Supported format: CSV</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('Successfully') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {showPreview && parsedData.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Preview</h4>
          <div className="max-h-96 overflow-y-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Class</th>
                  <th className="px-4 py-3 text-left">Roll No</th>
                  <th className="px-4 py-3 text-left">Parent Email</th>
                  <th className="px-4 py-3 text-left">Fee Status</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.map((student, index) => (
                  <tr key={index} className={student.error ? 'bg-red-50' : 'bg-white'}>
                    <td className="px-4 py-3">{student.Name}</td>
                    <td className="px-4 py-3">{student.Class}</td>
                    <td className="px-4 py-3">{student.RollNo}</td>
                    <td className="px-4 py-3">{student.ParentEmail}</td>
                    <td className="px-4 py-3">{student.FeeStatus}</td>
                    <td className="px-4 py-3">
                      {student.error ? (
                        <div className="flex items-center space-x-1 text-red-600">
                          <XCircle className="w-4 h-4" />
                          <span className="text-xs">{student.error}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">OK</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={confirmUpload}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              disabled={parsedData.every(s => s.error)}
            >
              Confirm Upload
            </button>
            <button
              onClick={() => {
                setParsedData([]);
                setShowPreview(false);
              }}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUpload;