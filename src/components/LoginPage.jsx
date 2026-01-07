import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth, signInWithEmailAndPassword } from '../firebase';

const LoginPage = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const user = userCredential.user;
      
      // For demo purposes, assign admin role to authenticated users
      // In production, you would fetch user roles from Firestore or custom claims
      const userData = {
        email: user.email,
        username: user.email.split('@')[0], // Extract username from email
        role: 'admin', // Default to admin for demo
        uid: user.uid
      };
      
      onLogin(userData);
    } catch (error) {
      console.error('Firebase auth error:', error);
      switch (error.code) {
        case 'auth/user-not-found':
          setError('User not found. Please check your email.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email format.');
          break;
        default:
          setError('Login failed. Please try again.');
      }
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
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="form-control"
                placeholder="Enter your email"
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
            <p className="mb-1">Firebase Authentication:</p>
            <p className="mb-1">Use any valid Firebase email/password</p>
            <p className="mb-0">All authenticated users redirect to admin dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
