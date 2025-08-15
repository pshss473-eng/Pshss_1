import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Upload, CheckCircle, XCircle } from 'lucide-react';

interface ParsedMark {
  RollNo: string;
  StudentName: string;
  Marks: string;
  error?: string;
}

const UploadMarks: React.FC = () => {
  const { user } = useAuth();
  const { data, updateData } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedData, setParsedData] = useState<ParsedMark[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState('');

  const teacherClass = user?.assignedClass || '';
  const subject = user?.subject || '';

  const parseCSV = (text: string) => {
    const lines = text.trim().split(/\r?\n/);
    return lines.map(line => line.split(',').map(cell => cell.trim()));
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

        const header = rows[0].map(h => h.toLowerCase().trim());
        const requiredHeaders = ['rollno', 'studentname', 'marks'];
        
        if (!requiredHeaders.every(h => header.includes(h))) {
          setMessage('CSV missing required columns: RollNo, StudentName, Marks.');
          return;
        }

        const indices: Record<string, number> = {};
        requiredHeaders.forEach(h => {
          indices[h] = header.indexOf(h);
        });

        const parsed = rows.slice(1).map(row => {
          if (row.length < 3) return null;
          
          const mark: ParsedMark = {
            RollNo: row[indices['rollno']] || '',
            StudentName: row[indices['studentname']] || '',
            Marks: row[indices['marks']] || ''
          };

          // Validate
          if (!mark.RollNo || !mark.StudentName || mark.Marks === '') {
            mark.error = 'Missing required fields';
          } else if (isNaN(Number(mark.Marks)) || Number(mark.Marks) < 0 || Number(mark.Marks) > 100) {
            mark.error = 'Marks must be number between 0-100';
          }

          return mark;
        }).filter(Boolean) as ParsedMark[];

        setParsedData(parsed);
        setShowPreview(true);
        setMessage('');
      } catch (error) {
        setMessage('Failed to parse CSV file.');
      }
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const confirmUpload = () => {
    const validMarks = parsedData.filter(m => !m.error);
    if (validMarks.length === 0) {
      setMessage('No valid marks to upload.');
      return;
    }

    // Create student map for the teacher's class
    const studentMap: Record<string, any> = {};
    data.students.forEach(s => {
      if (s.class === teacherClass) {
        studentMap[s.rollNo.toLowerCase()] = s;
      }
    });

    let addedCount = 0;
    const updatedStudents = data.students.map(student => {
      const markData = validMarks.find(m => 
        m.RollNo.toLowerCase() === student.rollNo.toLowerCase()
      );

      if (markData && student.class === teacherClass) {
        const marksArray = [...(student.marks || [])];
        const existingIndex = marksArray.findIndex(m => m.subject === subject);
        
        if (existingIndex >= 0) {
          marksArray[existingIndex] = {
            ...marksArray[existingIndex],
            score: Number(markData.Marks),
            date: new Date().toISOString()
          };
        } else {
          marksArray.push({
            subject,
            score: Number(markData.Marks),
            date: new Date().toISOString()
          });
        }

        addedCount++;
        return { ...student, marks: marksArray };
      }

      return student;
    });

    updateData({ students: updatedStudents });
    setMessage(`Successfully uploaded marks for ${addedCount} students.`);
    setParsedData([]);
    setShowPreview(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Upload Marks - {subject}</h3>
        <p className="text-gray-600">Class: {teacherClass}</p>
        <p className="text-sm text-gray-500 mt-2">
          Upload CSV file with columns: RollNo, StudentName, Marks
        </p>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
      >
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">Drag & drop CSV file here or click to browse</p>
        <p className="text-sm text-gray-500">Format: RollNo, StudentName, Marks</p>
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
                  <th className="px-4 py-3 text-left">Roll No</th>
                  <th className="px-4 py-3 text-left">Student Name</th>
                  <th className="px-4 py-3 text-left">Marks</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.map((mark, index) => (
                  <tr key={index} className={mark.error ? 'bg-red-50' : 'bg-white'}>
                    <td className="px-4 py-3">{mark.RollNo}</td>
                    <td className="px-4 py-3">{mark.StudentName}</td>
                    <td className="px-4 py-3">{mark.Marks}</td>
                    <td className="px-4 py-3">
                      {mark.error ? (
                        <div className="flex items-center space-x-1 text-red-600">
                          <XCircle className="w-4 h-4" />
                          <span className="text-xs">{mark.error}</span>
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
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              disabled={parsedData.every(m => m.error)}
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

export default UploadMarks;