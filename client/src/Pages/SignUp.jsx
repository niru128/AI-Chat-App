import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signup } from '../features/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await dispatch(signup({ email, username, password })).unwrap();
      navigate('/');
    } catch (err) {
      alert(err?.message || 'Signup failed');
    }
  };

  const passwordRules = [
    { id: 1, label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
    { id: 2, label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
    { id: 3, label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
    { id: 4, label: 'One number', test: (pw) => /[0-9]/.test(pw) },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded shadow-blue-500 shadow-2xl">
        <h2 className="text-2xl font-semibold text-center">Sign up</h2>
        <p className="text-center mb-4">Create an account to get started</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-2 border rounded-2xl border-blue-500"
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border rounded-2xl border-blue-500"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            placeholder="Password"
            className="w-full p-2 border rounded-2xl border-blue-500"
          />

          {passwordFocused &&<ul className="mb-2 mt-1 space-y-1 ">
            {passwordRules.map(rule => {
              const valid = rule.test(password);
              return (
                <li key={rule.id} className="flex items-center text-sm">
                  <span
                    className={`mr-2 w-5 text-sm h-5 flex items-center justify-center rounded-full border ${
                      valid ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-300'
                    }`}
                  >
                    {valid ? '✔' : '✖'}
                  </span>
                  <span className={valid ? 'text-blue-500' : 'text-gray-500'}>
                    {rule.label}
                  </span>
                </li>
              );
            })}
          </ul>}

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full p-2 border rounded-2xl border-blue-500"
          />

          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-500"
          >
            Create account
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
