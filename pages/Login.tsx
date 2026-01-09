import React, { useState } from 'react';
import { loginAdmin } from '../services/db';

const Login: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginAdmin(email, password);
      onLoginSuccess();
    } catch (err: any) {
      setError("Login failed: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Admin Access</h2>
      
      {/* Demo helper text - remove in production */}
      <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded mb-4">
        <strong>Demo Mode:</strong> Use <code>admin@college.edu</code> / <code>admin123</code>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;