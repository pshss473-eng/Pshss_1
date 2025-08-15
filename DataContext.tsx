import React, { createContext, useContext, useState, useEffect } from 'react';

interface Teacher {
  id: number;
  name: string;
  email: string;
  password: string;
  subject: string;
  assignedClass: string;
}

interface Student {
  id: number;
  name: string;
  class: string;
  rollNo: string;
  parentEmail: string;
  parentPassword: string;
  feeStatus: string;
  attendance: Array<{ date: string; status: string }>;
  marks: Array<{ subject: string; score: number; date: string }>;
}

interface SchoolData {
  admin: { email: string; password: string };
  teachers: Teacher[];
  students: Student[];
  circulars: Array<{ id: number; title: string; date: string; text: string }>;
  logs: Array<{ timestamp: string; message: string }>;
  timetable?: any;
  homework?: any[];
}

interface DataContextType {
  data: SchoolData;
  updateData: (newData: Partial<SchoolData>) => void;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SchoolData>({
    admin: { email: '', password: '' },
    teachers: [],
    students: [],
    circulars: [],
    logs: []
  });

  const initializeData = () => {
    if (!localStorage.getItem('schoolData')) {
      const initialData: SchoolData = {
        admin: { email: "admin@pshss.edu", password: "admin123" },
        teachers: [
          {
            id: 1,
            name: "Teacher 1",
            email: "teacher1@pshss.edu",
            password: "teacher1",
            subject: "Mathematics",
            assignedClass: "12-A"
          },
          {
            id: 2,
            name: "Teacher 2",
            email: "teacher2@pshss.edu",
            password: "teacher2",
            subject: "Science",
            assignedClass: "12-B"
          }
        ],
        students: [
          {
            id: 1,
            name: "Student 1",
            class: "12-A",
            rollNo: "12A01",
            parentEmail: "student1@pshss.edu",
            parentPassword: "student1",
            feeStatus: "Paid",
            attendance: [],
            marks: []
          },
          {
            id: 2,
            name: "Student 2",
            class: "12-B",
            rollNo: "12B01",
            parentEmail: "student2@pshss.edu",
            parentPassword: "student2",
            feeStatus: "Paid",
            attendance: [],
            marks: []
          }
        ],
        circulars: [
          {
            id: 1,
            title: "Holiday Announcement",
            date: "2024-07-10",
            text: "School will remain closed on 15th August for Independence Day."
          }
        ],
        logs: []
      };
      localStorage.setItem('schoolData', JSON.stringify(initialData));
      setData(initialData);
    } else {
      const stored = JSON.parse(localStorage.getItem('schoolData')!);
      setData(stored);
    }
  };

  const updateData = (newData: Partial<SchoolData>) => {
    const updated = { ...data, ...newData };
    setData(updated);
    localStorage.setItem('schoolData', JSON.stringify(updated));
  };

  const refreshData = () => {
    const stored = JSON.parse(localStorage.getItem('schoolData') || '{}');
    setData(stored);
  };

  useEffect(() => {
    initializeData();
  }, []);

  return (
    <DataContext.Provider value={{ data, updateData, refreshData }}>
      {children}
    </DataContext.Provider>
  );
};