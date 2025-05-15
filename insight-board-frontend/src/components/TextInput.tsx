import React, { useState, useEffect } from "react";

type InputProps = {
    type: string,
    name: string,
    value: string,
    onChange: (name: string, value: string) => void;
    placeholder: string,
    required?: boolean,
    resetKey?: string
}

const TextInput: React.FC<InputProps> = ({ type, name, value, onChange, placeholder, required = false, resetKey }) => {
    const[touched, setTouched] = useState(false);

    const error = touched && required && !value ? `${name} is required.`: '';

    useEffect(() => {
        setTouched(false);
    }, [resetKey]);

    return (
        <div>
            <input
                type={type}
                name={name}
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder={placeholder}
                className={`w-full border rounded px-3 py-2 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:outline-hidden focus:border-none focus:ring-2`}
            />
        </div>
    );
};

export default TextInput;
