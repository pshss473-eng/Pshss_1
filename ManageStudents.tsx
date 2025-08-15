import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import DataTable from '../Common/DataTable';
import Modal from '../Common/Modal';

const ManageStudents: React.FC = () => {
  const { data, updateData } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    rollNo: '',
    parentEmail: '',
    parentPassword: '',
    feeStatus: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      name: '',
      class: '',
      rollNo: '',
      parentEmail: '',
      parentPassword: '',
      feeStatus: ''
    });
    setErrors({});
    setShowPassword(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.class.trim()) newErrors.class = 'Class is required';
    if (!formData.rollNo.trim()) newErrors.rollNo = 'Roll number is required';
    if (!formData.parentEmail.trim()) newErrors.parentEmail = 'Parent email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
      newErrors.parentEmail = 'Invalid email format';
    }
    if (!formData.parentPassword.trim()) newErrors.parentPassword = 'Parent password is required';
    if (!formData.feeStatus) newErrors.feeStatus = 'Fee status is required';

    // Check for duplicate roll number in same class
    const existingStudent = data.students.find(s => 
      s.rollNo.toLowerCase() === formData.rollNo.toLowerCase() && 
      s.class.toLowerCase() === formData.class.toLowerCase() &&
      s.id !== editingStudent?.id
    );
    if (existingStudent) {
      newErrors.rollNo = 'A student with this roll number already exists in this class';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingStudent) {
      // Update student
      const updatedStudents = data.students.map(s =>
        s.id === editingStudent.id 
          ? { ...s, ...formData, attendance: s.attendance || [], marks: s.marks || [] }
          : s
      );
      updateData({ students: updatedStudents });
      setEditingStudent(null);
    } else {
      // Add new student
      const newStudent = {
        id: Math.max(...data.students.map(s => s.id), 0) + 1,
        ...formData,
        attendance: [],
        marks: []
      };
      updateData({ students: [...data.students, newStudent] });
      setShowAddModal(false);
    }
    resetForm();
  };

  const handleEdit = (student: any) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      class: student.class,
      rollNo: student.rollNo,
      parentEmail: student.parentEmail,
      parentPassword: student.parentPassword,
      feeStatus: student.feeStatus
    });
  };

  const handleDelete = (studentId: number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const updatedStudents = data.students.filter(s => s.id !== studentId);
      updateData({ students: updatedStudents });
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'class', label: 'Class' },
    { key: 'rollNo', label: 'Roll No' },
    { key: 'parentEmail', label: 'Parent Email' },
    { key: 'feeStatus', label: 'Fee Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, student: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(student)}
            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
            title="Edit student"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(student.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete student"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const StudentForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`form-input ${errors.name ? 'border-red-500' : ''}`}
          placeholder="Enter student name"
        />
        {errors.name && <p className="error-text">{errors.name}</p>}
      </div>

      <div>
        <label className="form-label">Class</label>
        <input
          type="text"
          value={formData.class}
          onChange={(e) => setFormData({ ...formData, class: e.target.value })}
          className={`form-input ${errors.class ? 'border-red-500' : ''}`}
          placeholder="e.g., 12-A"
        />
        {errors.class && <p className="error-text">{errors.class}</p>}
      </div>

      <div>
        <label className="form-label">Roll Number</label>
        <input
          type="text"
          value={formData.rollNo}
          onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
          className={`form-input ${errors.rollNo ? 'border-red-500' : ''}`}
          placeholder="Enter roll number"
        />
        {errors.rollNo && <p className="error-text">{errors.rollNo}</p>}
      </div>

      <div>
        <label className="form-label">Parent Email</label>
        <input
          type="email"
          value={formData.parentEmail}
          onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
          className={`form-input ${errors.parentEmail ? 'border-red-500' : ''}`}
          placeholder="Enter parent email"
        />
        {errors.parentEmail && <p className="error-text">{errors.parentEmail}</p>}
      </div>

      <div className="relative">
        <label className="form-label">Parent Password</label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={formData.parentPassword}
          onChange={(e) => setFormData({ ...formData, parentPassword: e.target.value })}
          className={`form-input pr-12 ${errors.parentPassword ? 'border-red-500' : ''}`}
          placeholder="Enter parent password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
        {errors.parentPassword && <p className="error-text">{errors.parentPassword}</p>}
      </div>

      <div>
        <label className="form-label">Fee Status</label>
        <select
          value={formData.feeStatus}
          onChange={(e) => setFormData({ ...formData, feeStatus: e.target.value })}
          className={`form-input ${errors.feeStatus ? 'border-red-500' : ''}`}
        >
          <option value="">Select fee status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Partial">Partial</option>
        </select>
        {errors.feeStatus && <p className="error-text">{errors.feeStatus}</p>}
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          {editingStudent ? 'Update Student' : 'Add Student'}
        </button>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowAddModal(false);
            setEditingStudent(null);
          }}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Student</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={data.students}
        emptyMessage="No students found"
      />

      {/* Add Student Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add Student"
        size="md"
      >
        <StudentForm />
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={!!editingStudent}
        onClose={() => {
          setEditingStudent(null);
          resetForm();
        }}
        title="Edit Student"
        size="md"
      >
        <StudentForm />
      </Modal>
    </div>
  );
};

export default ManageStudents;