import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TeacherDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    score: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [editingGrade, setEditingGrade] = useState(null);

  useEffect(() => {
    // Mock data - in real app, this would be API calls
    setTimeout(() => {
      const mockStudents = [
        { id: 'STU001', name: 'John Smith' },
        { id: 'STU002', name: 'Emily Johnson' },
        { id: 'STU003', name: 'Michael Brown' },
        { id: 'STU004', name: 'Sarah Davis' },
        { id: 'STU005', name: 'James Wilson' },
      ];

      const mockSubjects = [
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'English',
        'History',
        'Computer Science',
        'Economics'
      ];

      const mockGrades = [
        { id: 1, studentId: 'STU001', studentName: 'John Smith', subject: 'Mathematics', score: 85, date: '2024-01-15' },
        { id: 2, studentId: 'STU002', studentName: 'Emily Johnson', subject: 'Physics', score: 78, date: '2024-01-20' },
        { id: 3, studentId: 'STU003', studentName: 'Michael Brown', subject: 'Chemistry', score: 92, date: '2024-01-25' },
        { id: 4, studentId: 'STU004', studentName: 'Sarah Davis', subject: 'Biology', score: 88, date: '2024-02-01' },
        { id: 5, studentId: 'STU005', studentName: 'James Wilson', subject: 'English', score: 90, date: '2024-02-05' },
      ];

      setStudents(mockStudents);
      setSubjects(mockSubjects);
      setGrades(mockGrades);
      setLoading(false);
    }, 1000);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.studentId) {
      newErrors.studentId = 'Please select a student';
    }
    
    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }
    
    if (!formData.score) {
      newErrors.score = 'Please enter a score';
    } else if (isNaN(formData.score) || formData.score < 0 || formData.score > 100) {
      newErrors.score = 'Score must be between 0 and 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newGrade = {
      id: editingGrade ? editingGrade.id : Date.now(),
      studentId: formData.studentId,
      studentName: students.find(s => s.id === formData.studentId)?.name,
      subject: formData.subject,
      score: parseInt(formData.score),
      date: formData.date
    };

    if (editingGrade) {
      setGrades(grades.map(g => g.id === editingGrade.id ? newGrade : g));
      setSuccessMessage('Grade updated successfully!');
      setEditingGrade(null);
    } else {
      setGrades([...grades, newGrade]);
      setSuccessMessage('Grade uploaded successfully!');
    }

    setFormData({
      studentId: '',
      subject: '',
      score: '',
      date: new Date().toISOString().split('T')[0]
    });
    
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEdit = (grade) => {
    setEditingGrade(grade);
    setFormData({
      studentId: grade.studentId,
      subject: grade.subject,
      score: grade.score.toString(),
      date: grade.date
    });
    setActiveTab('upload');
  };

  const handleDelete = (gradeId) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      setGrades(grades.filter(g => g.id !== gradeId));
      setSuccessMessage('Grade deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-white d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading teacher dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-bottom">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center py-3">
            <h1 className="h5 mb-0">Teacher Dashboard</h1>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">Welcome, {user.username}</span>
              <button
                onClick={onLogout}
                className="btn btn-danger btn-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-4">
        {/* Navigation Tabs */}
        <div className="mb-4">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                onClick={() => setActiveTab('upload')}
                className={`nav-link ${activeTab === 'upload' ? 'active' : ''}`}
              >
                {editingGrade ? 'Edit Grade' : 'Upload Grades'}
              </button>
            </li>
            <li className="nav-item">
              <button
                onClick={() => setActiveTab('edit')}
                className={`nav-link ${activeTab === 'edit' ? 'active' : ''}`}
              >
                Manage Grades
              </button>
            </li>
          </ul>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        {/* Upload/Edit Grade Form */}
        {activeTab === 'upload' && (
          <div className="card">
            <div className="card-body">
              <h2 className="h5 mb-4">
                {editingGrade ? 'Edit Grade' : 'Upload New Grade'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="studentId" className="form-label">
                      Student
                    </label>
                    <select
                      id="studentId"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      className={`form-select ${errors.studentId ? 'is-invalid' : ''}`}
                    >
                      <option value="">Select a student</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name} ({student.id})
                        </option>
                      ))}
                    </select>
                    {errors.studentId && (
                      <div className="invalid-feedback">{errors.studentId}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="subject" className="form-label">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`form-select ${errors.subject ? 'is-invalid' : ''}`}
                    >
                      <option value="">Select a subject</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                    {errors.subject && (
                      <div className="invalid-feedback">{errors.subject}</div>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="score" className="form-label">
                      Score (0-100)
                    </label>
                    <input
                      id="score"
                      name="score"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.score}
                      onChange={handleInputChange}
                      className={`form-control ${errors.score ? 'is-invalid' : ''}`}
                      placeholder="Enter score"
                    />
                    {errors.score && (
                      <div className="invalid-feedback">{errors.score}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="date" className="form-label">
                      Date
                    </label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingGrade ? 'Update Grade' : 'Upload Grade'}
                  </button>
                  {editingGrade && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingGrade(null);
                        setFormData({
                          studentId: '',
                          subject: '',
                          score: '',
                          date: new Date().toISOString().split('T')[0]
                        });
                      }}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Editable Grades Table */}
        {activeTab === 'edit' && (
          <div className="card">
            <div className="card-header">
              <h2 className="h5 mb-0">Manage Grades</h2>
            </div>
            
            {grades.length === 0 ? (
              <div className="card-body text-center">
                <p className="text-muted mb-0">No grades found</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Student</th>
                      <th>Subject</th>
                      <th>Score</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((grade) => (
                      <tr key={grade.id}>
                        <td>
                          <div>
                            <div className="fw-medium">{grade.studentName}</div>
                            <small className="text-muted">{grade.studentId}</small>
                          </div>
                        </td>
                        <td>{grade.subject}</td>
                        <td>
                          <span className={`badge ${
                            grade.score >= 90 ? 'bg-success' :
                            grade.score >= 80 ? 'bg-primary' :
                            grade.score >= 70 ? 'bg-warning' :
                            'bg-danger'
                          }`}>
                            {grade.score}
                          </span>
                        </td>
                        <td>{new Date(grade.date).toLocaleDateString()}</td>
                        <td>
                          <button
                            onClick={() => handleEdit(grade)}
                            className="btn btn-sm btn-outline-primary me-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(grade.id)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;
