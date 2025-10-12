import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../features/authSlice';


export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            await dispatch(login({ email, password })).unwrap();
            navigate('/');

        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed. Please check your credentials and try again.");
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white p-6 rounded shadow-2xl shadow-blue-400">
                <h2 className="text-2xl font-semibold text-center">Sign Up</h2>
                <p className='text-center mb-5'>Enter your credentials to access your account</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className='' htmlFor='email'>Username</label>
                    <input value={email} id='email' onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded-2xl" />

                    <label className='' htmlFor='password'>Password</label>
                    <input value={password} id='password' onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-2 border rounded-2xl border-blue-500" />
                    <button className="w-full p-2 bg-blue-600 hover:bg-blue-400 text-white rounded-2xl">Sign in</button>
                </form>
                <div className="mt-4 text-sm text-center">Don't have an account? <Link to="/signup" className="text-blue-600">Sign up</Link></div>
            </div>
        </div>
    )
}
