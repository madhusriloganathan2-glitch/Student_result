import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TeacherDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    studentName: '',
    subject: '',
    score: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [editingGrade, setEditingGrade] = useState(null);
  const [studentSubjects, setStudentSubjects] = useState([]);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentForm, setStudentForm] = useState({
    name: '',
    regNo: '',
    year: '',
    semester: '',
    dept: '',
    subject: '',
    dob: '',
    requirements: ''
  });
  const [studentErrors, setStudentErrors] = useState({});
  const [newSubject, setNewSubject] = useState('');
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    year: '',
    semester: ''
  });
  const [subjectErrors, setSubjectErrors] = useState({});
  const [subjectEntries, setSubjectEntries] = useState([]);

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

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Please enter a student name';
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
      studentId: '', // No longer using studentId since we're entering name manually
      studentName: formData.studentName.trim(),
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
      studentName: '',
      subject: '',
      score: '',
      date: new Date().toISOString().split('T')[0]
    });

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEdit = (grade) => {
    setEditingGrade(grade);
    setFormData({
      studentName: grade.studentName,
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

    if (name === 'studentName') {
      const trimmedName = value.trim();
      if (trimmedName) {
        const studentGrades = grades.filter(grade =>
          grade.studentName.toLowerCase().includes(trimmedName.toLowerCase())
        );
        const uniqueSubjects = [...new Set(studentGrades.map(grade => grade.subject))];
        setStudentSubjects(uniqueSubjects);
      } else {
        setStudentSubjects([]);
      }
    }
  };

  const validateStudentForm = () => {
    const newErrors = {};
    if (!studentForm.name.trim()) newErrors.name = 'Name is required';
    if (!studentForm.regNo.trim()) newErrors.regNo = 'Registration number is required';
    if (!studentForm.year.trim()) newErrors.year = 'Year is required';
    if (!studentForm.semester.trim()) newErrors.semester = 'Semester is required';
    if (!studentForm.dept.trim()) newErrors.dept = 'Department is required';
    if (!studentForm.subject.trim()) newErrors.subject = 'Subject is required';
    if (!studentForm.dob) newErrors.dob = 'Date of birth is required';
    setStudentErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (!validateStudentForm()) return;
    const newStudent = {
      id: studentForm.regNo || Date.now().toString(),
      name: studentForm.name.trim(),
      regNo: studentForm.regNo.trim(),
      year: studentForm.year.trim(),
      semester: studentForm.semester.trim(),
      dept: studentForm.dept.trim(),
      subject: studentForm.subject.trim(),
      dob: studentForm.dob,
      requirements: studentForm.requirements.trim()
    };
    setStudents([...students, { id: newStudent.id, name: newStudent.name }]);
    setSuccessMessage('Student added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    setStudentForm({
      name: '',
      regNo: '',
      year: '',
      semester: '',
      dept: '',
      subject: '',
      dob: '',
      requirements: ''
    });
    setStudentErrors({});
    setIsStudentModalOpen(false);
  };

  const validateSubjectForm = () => {
    const newErrors = {};
    if (!subjectForm.name.trim()) newErrors.name = 'Subject name is required';
    if (!subjectForm.year.trim()) newErrors.year = 'Year is required';
    if (!subjectForm.semester.trim()) newErrors.semester = 'Semester is required';
    setSubjectErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubjectSubmit = (e) => {
    e.preventDefault();
    if (!validateSubjectForm()) return;

    const trimmed = subjectForm.name.trim();
    if (trimmed && !subjects.includes(trimmed)) {
      setSubjects([...subjects, trimmed]);
    }
    setSubjectEntries([
      ...subjectEntries,
      {
        id: Date.now(),
        name: trimmed,
        year: subjectForm.year,
        semester: subjectForm.semester
      }
    ]);

    setSuccessMessage('Subject added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);

    setSubjectForm({
      name: '',
      year: '',
      semester: ''
    });
    setSubjectErrors({});
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
      {isStudentModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{ zIndex: 1060, pointerEvents: 'auto' }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Student</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setIsStudentModalOpen(false)}
                />
              </div>
              <form onSubmit={handleStudentSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className={`form-control ${studentErrors.name ? 'is-invalid' : ''}`}
                        value={studentForm.name}
                        onChange={(e) => {
                          setStudentForm({ ...studentForm, name: e.target.value });
                          if (studentErrors.name) setStudentErrors({ ...studentErrors, name: '' });
                        }}
                        placeholder="Enter full name"
                      />
                      {studentErrors.name && <div className="invalid-feedback">{studentErrors.name}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Reg No</label>
                      <input
                        type="text"
                        className={`form-control ${studentErrors.regNo ? 'is-invalid' : ''}`}
                        value={studentForm.regNo}
                        onChange={(e) => {
                          setStudentForm({ ...studentForm, regNo: e.target.value });
                          if (studentErrors.regNo) setStudentErrors({ ...studentErrors, regNo: '' });
                        }}
                        placeholder="e.g., STU123"
                      />
                      {studentErrors.regNo && <div className="invalid-feedback">{studentErrors.regNo}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Year</label>
                      <div className="btn-group w-100" role="group" aria-label="Select Year">
                        <button
                          type="button"
                          className={`btn btn-outline-primary ${studentForm.year === 'Year I' ? 'active' : ''}`}
                          onClick={() => {
                            setStudentForm({ ...studentForm, year: 'Year I', semester: '' });
                            if (studentErrors.year) setStudentErrors({ ...studentErrors, year: '' });
                          }}
                        >
                          Year I
                        </button>
                        <button
                          type="button"
                          className={`btn btn-outline-primary ${studentForm.year === 'Year II' ? 'active' : ''}`}
                          onClick={() => {
                            setStudentForm({ ...studentForm, year: 'Year II', semester: '' });
                            if (studentErrors.year) setStudentErrors({ ...studentErrors, year: '' });
                          }}
                        >
                          Year II
                        </button>
                      </div>
                      {studentErrors.year && (
                        <div className="text-danger small mt-1">{studentErrors.year}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Semester</label>
                      {studentForm.year === '' && (
                        <div className="form-text">Select a year first</div>
                      )}
                      {studentForm.year === 'Year I' && (
                        <div className="btn-group w-100" role="group" aria-label="Select Semester for Year I">
                          <button
                            type="button"
                            className={`btn btn-outline-secondary ${studentForm.semester === 'Sem 1' ? 'active' : ''}`}
                            onClick={() => {
                              setStudentForm({ ...studentForm, semester: 'Sem 1' });
                              if (studentErrors.semester) setStudentErrors({ ...studentErrors, semester: '' });
                            }}
                          >
                            Sem 1
                          </button>
                          <button
                            type="button"
                            className={`btn btn-outline-secondary ${studentForm.semester === 'Sem 2' ? 'active' : ''}`}
                            onClick={() => {
                              setStudentForm({ ...studentForm, semester: 'Sem 2' });
                              if (studentErrors.semester) setStudentErrors({ ...studentErrors, semester: '' });
                            }}
                          >
                            Sem 2
                          </button>
                        </div>
                      )}
                      {studentForm.year === 'Year II' && (
                        <div className="btn-group w-100" role="group" aria-label="Select Semester for Year II">
                          <button
                            type="button"
                            className={`btn btn-outline-secondary ${studentForm.semester === 'Sem 3' ? 'active' : ''}`}
                            onClick={() => {
                              setStudentForm({ ...studentForm, semester: 'Sem 3' });
                              if (studentErrors.semester) setStudentErrors({ ...studentErrors, semester: '' });
                            }}
                          >
                            Sem 3
                          </button>
                          <button
                            type="button"
                            className={`btn btn-outline-secondary ${studentForm.semester === 'Sem 4' ? 'active' : ''}`}
                            onClick={() => {
                              setStudentForm({ ...studentForm, semester: 'Sem 4' });
                              if (studentErrors.semester) setStudentErrors({ ...studentErrors, semester: '' });
                            }}
                          >
                            Sem 4
                          </button>
                        </div>
                      )}
                      {studentErrors.semester && (
                        <div className="text-danger small mt-1">{studentErrors.semester}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Dept</label>
                      <input
                        type="text"
                        className={`form-control ${studentErrors.dept ? 'is-invalid' : ''}`}
                        value={studentForm.dept}
                        onChange={(e) => {
                          setStudentForm({ ...studentForm, dept: e.target.value });
                          if (studentErrors.dept) setStudentErrors({ ...studentErrors, dept: '' });
                        }}
                        placeholder="e.g., Computer Science"
                      />
                      {studentErrors.dept && <div className="invalid-feedback">{studentErrors.dept}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Subject</label>
                      <input
                        type="text"
                        className={`form-control ${studentErrors.subject ? 'is-invalid' : ''}`}
                        value={studentForm.subject}
                        onChange={(e) => {
                          setStudentForm({ ...studentForm, subject: e.target.value });
                          if (studentErrors.subject) setStudentErrors({ ...studentErrors, subject: '' });
                        }}
                        placeholder="Enter subject name"
                      />
                      {studentErrors.subject && <div className="invalid-feedback">{studentErrors.subject}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">DOB</label>
                      <input
                        type="date"
                        className={`form-control ${studentErrors.dob ? 'is-invalid' : ''}`}
                        value={studentForm.dob}
                        onChange={(e) => {
                          setStudentForm({ ...studentForm, dob: e.target.value });
                          if (studentErrors.dob) setStudentErrors({ ...studentErrors, dob: '' });
                        }}
                      />
                      {studentErrors.dob && <div className="invalid-feedback">{studentErrors.dob}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label">Basic Requirements / Notes</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={studentForm.requirements}
                        onChange={(e) => setStudentForm({ ...studentForm, requirements: e.target.value })}
                        placeholder="Add any basic requirements, notes, or prerequisites"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsStudentModalOpen(false)}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Student
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040, pointerEvents: 'none' }}
          />
        </div>
      )}
      {/* Header */}
      <header className="bg-white shadow-sm border-bottom">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center py-3">
            <h1 className="h5 mb-0">Teacher Dashboard</h1>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">Welcome, {user.username}</span>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => setIsStudentModalOpen(true)}
              >
                Add Student
              </button>
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
            <li className="nav-item">
              <button
                onClick={() => setActiveTab('addSubject')}
                className={`nav-link ${activeTab === 'addSubject' ? 'active' : ''}`}
              >
                Add Subject
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
                    <label htmlFor="studentName" className="form-label">
                      Student Name
                    </label>
                    <input
                      id="studentName"
                      name="studentName"
                      type="text"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      className={`form-control ${errors.studentName ? 'is-invalid' : ''}`}
                      placeholder="Enter student name"
                    />
                    {errors.studentName && (
                      <div className="invalid-feedback">{errors.studentName}</div>
                    )}
                    {studentSubjects.length > 0 && (
                      <div className="mt-2">
                        <small className="text-muted">Subjects for this student:</small>
                        <ul className="list-group list-group-flush mt-1">
                          {studentSubjects.map(subject => (
                            <li key={subject} className="list-group-item py-1 px-2">
                              {subject}
                            </li>
                          ))}
                        </ul>
                      </div>
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
                          studentName: '',
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
                      <th>Regno</th>
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
                        <td>{grade.studentId}</td>
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

        {/* Add Subject Tab */}
        {activeTab === 'addSubject' && (
          <div className="card">
            <div className="card-body">
              <h2 className="h5 mb-4">Add Subject</h2>
              <form onSubmit={handleSubjectSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Subject Name</label>
                    <input
                      type="text"
                      className={`form-control ${subjectErrors.name ? 'is-invalid' : ''}`}
                      value={subjectForm.name}
                      onChange={(e) => {
                        setSubjectForm({ ...subjectForm, name: e.target.value });
                        if (subjectErrors.name) setSubjectErrors({ ...subjectErrors, name: '' });
                      }}
                      placeholder="Enter subject name"
                    />
                    {subjectErrors.name && <div className="invalid-feedback">{subjectErrors.name}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Year</label>
                    <div className="btn-group w-100" role="group" aria-label="Select Year for Subject">
                      <button
                        type="button"
                        className={`btn btn-outline-primary ${subjectForm.year === 'Year I' ? 'active' : ''}`}
                        onClick={() => {
                          setSubjectForm({ ...subjectForm, year: 'Year I', semester: '' });
                          if (subjectErrors.year) setSubjectErrors({ ...subjectErrors, year: '' });
                        }}
                      >
                        Year I
                      </button>
                      <button
                        type="button"
                        className={`btn btn-outline-primary ${subjectForm.year === 'Year II' ? 'active' : ''}`}
                        onClick={() => {
                          setSubjectForm({ ...subjectForm, year: 'Year II', semester: '' });
                          if (subjectErrors.year) setSubjectErrors({ ...subjectErrors, year: '' });
                        }}
                      >
                        Year II
                      </button>
                    </div>
                    {subjectErrors.year && (
                      <div className="text-danger small mt-1">{subjectErrors.year}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Semester</label>
                    {subjectForm.year === '' && (
                      <div className="form-text">Select a year first</div>
                    )}
                    {subjectForm.year === 'Year I' && (
                      <div className="btn-group w-100" role="group" aria-label="Select Semester for Year I">
                        <button
                          type="button"
                          className={`btn btn-outline-secondary ${subjectForm.semester === 'Sem 1' ? 'active' : ''}`}
                          onClick={() => {
                            setSubjectForm({ ...subjectForm, semester: 'Sem 1' });
                            if (subjectErrors.semester) setSubjectErrors({ ...subjectErrors, semester: '' });
                          }}
                        >
                          Sem 1
                        </button>
                        <button
                          type="button"
                          className={`btn btn-outline-secondary ${subjectForm.semester === 'Sem 2' ? 'active' : ''}`}
                          onClick={() => {
                            setSubjectForm({ ...subjectForm, semester: 'Sem 2' });
                            if (subjectErrors.semester) setSubjectErrors({ ...subjectErrors, semester: '' });
                          }}
                        >
                          Sem 2
                        </button>
                      </div>
                    )}
                    {subjectForm.year === 'Year II' && (
                      <div className="btn-group w-100" role="group" aria-label="Select Semester for Year II">
                        <button
                          type="button"
                          className={`btn btn-outline-secondary ${subjectForm.semester === 'Sem 3' ? 'active' : ''}`}
                          onClick={() => {
                            setSubjectForm({ ...subjectForm, semester: 'Sem 3' });
                            if (subjectErrors.semester) setSubjectErrors({ ...subjectErrors, semester: '' });
                          }}
                        >
                          Sem 3
                        </button>
                        <button
                          type="button"
                          className={`btn btn-outline-secondary ${subjectForm.semester === 'Sem 4' ? 'active' : ''}`}
                          onClick={() => {
                            setSubjectForm({ ...subjectForm, semester: 'Sem 4' });
                            if (subjectErrors.semester) setSubjectErrors({ ...subjectErrors, semester: '' });
                          }}
                        >
                          Sem 4
                        </button>
                      </div>
                    )}
                    {subjectErrors.semester && (
                      <div className="text-danger small mt-1">{subjectErrors.semester}</div>
                    )}
                  </div>
                </div>

              <hr className="my-4" />

              {subjectEntries.length === 0 ? (
                <p className="text-muted mb-0">No subjects added yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Subject</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjectEntries.map((entry) => (
                        <tr key={entry.id}>
                          <td>{entry.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-4">
                <button type="submit" className="btn btn-primary">
                  Save Subject
                </button>
                <button type="submit" className="btn btn-success ms-2">
                  Submit
                </button>
              </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;
