import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/services/AuthService";

import TextInput from "../components/TextInput";

const Register = () => {
    const[formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const[resetKey, setResetKey] = useState(() => Date.now().toString());
    const navigate = useNavigate();

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = await toast.promise(
                register(formData.email, formData.password),
                {
                    loading: 'Signing up ...',
                    success: 'Signed up!',
                    error: 'Sign up failed'
                }
            );
            localStorage.setItem('token', token);

            // reset the form
            setResetKey(Date.now().toString());
            setFormData({email: '', password: ''});

            // navigate to login
            navigate('/dashboard');

        } catch(error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl text-center font-semibold mb-4">Register</h2>
                <TextInput type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required resetKey={resetKey}/>
                <TextInput type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required resetKey={resetKey}/>
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Signup</button>
            </form>
            <p className="text-sm text-center mt-4">
                Already have an account? <Link to='/login' className="text-blue-600 underline">Login</Link>
            </p>
        </div>
    );
};

export default Register;
