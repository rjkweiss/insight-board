import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import TextInput from "../components/TextInput";
import { login } from "../api/services/AuthService";

const Login = () => {
    const[formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const[resetKey, setResetKey] = useState(() => Date.now().toString())

    const navigate = useNavigate();

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = await toast.promise(
                login(formData.email, formData.password),
                {
                    loading: 'Logging in ...',
                    success: 'Logged in!',
                    error: 'Login failed'
                }
            );

            localStorage.setItem('token', token);
            // reset the form
            setResetKey(Date.now().toString());
            setFormData({email: '', password: ''})
            navigate('/dashboard');
        } catch(error) {
            console.error(error);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4 text-center">Login to InsightBoard</h2>
                <TextInput type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required resetKey={resetKey}/>
                <TextInput type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required resetKey={resetKey}/>
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
            </form>
            <p className="text-sm text-center mt-4">Do have an Account? <Link to='/register' className="text-blue-600 underline">Create Account</Link></p>
        </div>
    );
};

export default Login;
