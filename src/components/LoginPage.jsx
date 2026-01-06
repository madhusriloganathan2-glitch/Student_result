import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation for demo
    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password');
      return;
    }
    
    // Mock authentication - in real app, this would be an API call
    const users = {
      student: { username: 'student', password: 'student123', role: 'student' },
      teacher: { username: 'teacher', password: 'teacher123', role: 'teacher' },
      admin: { username: 'admin', password: 'admin123', role: 'admin' }
    };

    const user = Object.values(users).find(
      u => u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      onLogin(user);
    } else {
      setError('Invalid credentials. Try student/student123, teacher/teacher123, or admin/admin123');
    }
  };

  return (
    <div className="min-vh-100 bg-white d-flex align-items-center justify-content-center p-4">
      <div className="card shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h1 className="h3 mb-3 fw-bold">Student Result System</h1>
            <p className="text-muted">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="form-control"
                placeholder="Enter your username"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="form-control"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
            >
              Sign In
            </button>
          </form>

          <div className="mt-4 text-center text-muted small">
            <p className="mb-1">Demo Accounts:</p>
            <p className="mb-1">Student: student/student123</p>
            <p className="mb-1">Teacher: teacher/teacher123</p>
            <p className="mb-0">Admin: admin/admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
