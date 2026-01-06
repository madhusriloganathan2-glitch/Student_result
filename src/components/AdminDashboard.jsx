import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);

  // User form state
  const [userFormData, setUserFormData] = useState({
    username: '',
    password: '',
    role: 'student'
  });

  // Subject form state
  const [subjectFormData, setSubjectFormData] = useState({
    name: '',
    code: '',
    description: ''
  });

  useEffect(() => {
    // Mock data - in real app, this would be API calls
    setTimeout(() => {
      const mockUsers = [
        { id: 1, username: 'student', role: 'student', status: 'active', createdAt: '2024-01-01' },
        { id: 2, username: 'teacher', role: 'teacher', status: 'active', createdAt: '2024-01-02' },
        { id: 3, username: 'admin', role: 'admin', status: 'active', createdAt: '2024-01-03' },
        { id: 4, username: 'john_doe', role: 'student', status: 'active', createdAt: '2024-01-10' },
        { id: 5, username: 'jane_smith', role: 'teacher', status: 'inactive', createdAt: '2024-01-15' },
      ];

      const mockSubjects = [
        { id: 1, name: 'Mathematics', code: 'MATH101', description: 'Basic mathematics course' },
        { id: 2, name: 'Physics', code: 'PHYS101', description: 'Introduction to physics' },
        { id: 3, name: 'Chemistry', code: 'CHEM101', description: 'Fundamentals of chemistry' },
        { id: 4, name: 'Biology', code: 'BIO101', description: 'Introduction to biology' },
        { id: 5, name: 'English', code: 'ENG101', description: 'English language and literature' },
      ];

      setUsers(mockUsers);
      setSubjects(mockSubjects);
      setLoading(false);
    }, 1000);
  }, []);

  const handleUserSubmit = (e) => {
    e.preventDefault();
    
    const newUser = {
      id: editingUser ? editingUser.id : Date.now(),
      username: userFormData.username,
      role: userFormData.role,
      status: 'active',
      createdAt: editingUser ? editingUser.createdAt : new Date().toISOString().split('T')[0]
    };

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? newUser : u));
      setSuccessMessage('User updated successfully!');
      setEditingUser(null);
    } else {
      setUsers([...users, newUser]);
      setSuccessMessage('User created successfully!');
    }

    setUserFormData({ username: '', password: '', role: 'student' });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSubjectSubmit = (e) => {
    e.preventDefault();
    
    const newSubject = {
      id: editingSubject ? editingSubject.id : Date.now(),
      name: subjectFormData.name,
      code: subjectFormData.code,
      description: subjectFormData.description
    };

    if (editingSubject) {
      setSubjects(subjects.map(s => s.id === editingSubject.id ? newSubject : s));
      setSuccessMessage('Subject updated successfully!');
      setEditingSubject(null);
    } else {
      setSubjects([...subjects, newSubject]);
      setSuccessMessage('Subject created successfully!');
    }

    setSubjectFormData({ name: '', code: '', description: '' });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserFormData({
      username: user.username,
      password: '',
      role: user.role
    });
    setActiveTab('users');
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setSubjectFormData({
      name: subject.name,
      code: subject.code,
      description: subject.description
    });
    setActiveTab('subjects');
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
      setSuccessMessage('User deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleDeleteSubject = (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      setSubjects(subjects.filter(s => s.id !== subjectId));
      setSuccessMessage('Subject deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    ));
    setSuccessMessage('User status updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-white d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading admin dashboard...</p>
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
            <h1 className="h5 mb-0">Admin Dashboard</h1>
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
        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-4">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                onClick={() => setActiveTab('users')}
                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
              >
                Users Management
              </button>
            </li>
            <li className="nav-item">
              <button
                onClick={() => setActiveTab('subjects')}
                className={`nav-link ${activeTab === 'subjects' ? 'active' : ''}`}
              >
                Subjects Management
              </button>
            </li>
          </ul>
        </div>

        {/* Users Management */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* User Form */}
            <div className="card">
              <div className="card-body">
                <h2 className="h5 mb-4">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h2>
                
                <form onSubmit={handleUserSubmit} className="space-y-3">
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label htmlFor="username" className="form-label">
                        Username
                      </label>
                      <input
                        id="username"
                        type="text"
                        value={userFormData.username}
                        onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label htmlFor="password" className="form-label">
                        Password {editingUser && '(leave blank to keep current)'}
                      </label>
                      <input
                        id="password"
                        type="password"
                        value={userFormData.password}
                        onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                        className="form-control"
                        required={!editingUser}
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label htmlFor="role" className="form-label">
                        Role
                      </label>
                      <select
                        id="role"
                        value={userFormData.role}
                        onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                        className="form-select"
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      {editingUser ? 'Update User' : 'Add User'}
                    </button>
                    {editingUser && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUser(null);
                          setUserFormData({ username: '', password: '', role: 'student' });
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

            {/* Users Table */}
            <div className="card">
              <div className="card-header">
                <h2 className="h5 mb-0">All Users</h2>
              </div>
              
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Username</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userItem) => (
                      <tr key={userItem.id}>
                        <td className="fw-medium">{userItem.username}</td>
                        <td>
                          <span className={`badge ${
                            userItem.role === 'admin' ? 'bg-purple' :
                            userItem.role === 'teacher' ? 'bg-primary' :
                            'bg-success'
                          }`}>
                            {userItem.role}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            userItem.status === 'active' ? 'bg-success' : 'bg-danger'
                          }`}>
                            {userItem.status}
                          </span>
                        </td>
                        <td>{new Date(userItem.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            onClick={() => handleEditUser(userItem)}
                            className="btn btn-sm btn-outline-primary me-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => toggleUserStatus(userItem.id)}
                            className="btn btn-sm btn-outline-warning me-2"
                          >
                            {userItem.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(userItem.id)}
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
            </div>
          </div>
        )}

        {/* Subjects Management */}
        {activeTab === 'subjects' && (
          <div className="space-y-4">
            {/* Subject Form */}
            <div className="card">
              <div className="card-body">
                <h2 className="h5 mb-4">
                  {editingSubject ? 'Edit Subject' : 'Add New Subject'}
                </h2>
                
                <form onSubmit={handleSubjectSubmit} className="space-y-3">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="subjectName" className="form-label">
                        Subject Name
                      </label>
                      <input
                        id="subjectName"
                        type="text"
                        value={subjectFormData.name}
                        onChange={(e) => setSubjectFormData({ ...subjectFormData, name: e.target.value })}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="subjectCode" className="form-label">
                        Subject Code
                      </label>
                      <input
                        id="subjectCode"
                        type="text"
                        value={subjectFormData.code}
                        onChange={(e) => setSubjectFormData({ ...subjectFormData, code: e.target.value })}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={subjectFormData.description}
                      onChange={(e) => setSubjectFormData({ ...subjectFormData, description: e.target.value })}
                      rows={3}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      {editingSubject ? 'Update Subject' : 'Add Subject'}
                    </button>
                    {editingSubject && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSubject(null);
                          setSubjectFormData({ name: '', code: '', description: '' });
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

            {/* Subjects Table */}
            <div className="card">
              <div className="card-header">
                <h2 className="h5 mb-0">All Subjects</h2>
              </div>
              
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Subject Name</th>
                      <th>Code</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject) => (
                      <tr key={subject.id}>
                        <td className="fw-medium">{subject.name}</td>
                        <td>{subject.code}</td>
                        <td>{subject.description}</td>
                        <td>
                          <button
                            onClick={() => handleEditSubject(subject)}
                            className="btn btn-sm btn-outline-primary me-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSubject(subject.id)}
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
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
