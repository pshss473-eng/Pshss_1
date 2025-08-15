import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import DataTable from '../Common/DataTable';
import Modal from '../Common/Modal';

const ManageTeachers: React.FC = () => {
  const { data, updateData } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    subject: '',
    assignedClass: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      subject: '',
      assignedClass: ''
    });
    setErrors({});
    setShowPassword(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';

    // Check for duplicate email
    const existingTeacher = data.teachers.find(t => 
      t.email.toLowerCase() === formData.email.toLowerCase() && 
      t.id !== editingTeacher?.id
    );
    if (existingTeacher) {
      newErrors.email = 'Email already exists for another teacher';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingTeacher) {
      // Update teacher
      const updatedTeachers = data.teachers.map(t =>
        t.id === editingTeacher.id ? { ...t, ...formData } : t
      );
      updateData({ teachers: updatedTeachers });
      setEditingTeacher(null);
    } else {
      // Add new teacher
      const newTeacher = {
        id: Math.max(...data.teachers.map(t => t.id), 0) + 1,
        ...formData
      };
      updateData({ teachers: [...data.teachers, newTeacher] });
      setShowAddModal(false);
    }
    resetForm();
  };

  const handleEdit = (teacher: any) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      password: teacher.password,
      subject: teacher.subject,
      assignedClass: teacher.assignedClass
    });
  };

  const handleDelete = (teacherId: number) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      const updatedTeachers = data.teachers.filter(t => t.id !== teacherId);
      updateData({ teachers: updatedTeachers });
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subject' },
    { key: 'assignedClass', label: 'Assigned Class' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, teacher: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(teacher)}
            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
            title="Edit teacher"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(teacher.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete teacher"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const TeacherForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`form-input ${errors.name ? 'border-red-500' : ''}`}
          placeholder="Enter teacher name"
        />
        {errors.name && <p className="error-text">{errors.name}</p>}
      </div>

      <div>
        <label className="form-label">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`form-input ${errors.email ? 'border-red-500' : ''}`}
          placeholder="Enter email address"
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      <div className="relative">
        <label className="form-label">Password</label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className={`form-input pr-12 ${errors.password ? 'border-red-500' : ''}`}
          placeholder="Enter password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
        {errors.password && <p className="error-text">{errors.password}</p>}
      </div>

      <div>
        <label className="form-label">Subject</label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className={`form-input ${errors.subject ? 'border-red-500' : ''}`}
          placeholder="Enter subject"
        />
        {errors.subject && <p className="error-text">{errors.subject}</p>}
      </div>

      <div>
        <label className="form-label">Assigned Class</label>
        <input
          type="text"
          value={formData.assignedClass}
          onChange={(e) => setFormData({ ...formData, assignedClass: e.target.value })}
          className="form-input"
          placeholder="e.g., 12-A"
        />
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
        </button>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowAddModal(false);
            setEditingTeacher(null);
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
          <span>Add Teacher</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={data.teachers}
        emptyMessage="No teachers found"
      />

      {/* Add Teacher Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add Teacher"
        size="md"
      >
        <TeacherForm />
      </Modal>

      {/* Edit Teacher Modal */}
      <Modal
        isOpen={!!editingTeacher}
        onClose={() => {
          setEditingTeacher(null);
          resetForm();
        }}
        title="Edit Teacher"
        size="md"
      >
        <TeacherForm />
      </Modal>
    </div>
  );
};

export default ManageTeachers;