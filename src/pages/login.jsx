import axios from 'axios';
import React, { useState } from 'react';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login", {
                email,
                password,
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user_id", response.data.data.id)
                localStorage.setItem("isLoggedIn", "true");

                // Reload the page to reflect login state
                window.location.href = "/";
            } else {
                setError("Invalid response from server.");
            }
        } catch (err) {
            setError("Invalid email or password.");
        }
    };

    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
                <legend className="fieldset-legend">Login</legend>

                {error && <p className="text-red-500 text-[15px]">{error}</p>}

                <label className="fieldset-label">Email</label>
                <input 
                    type="email" 
                    className="input" 
                    placeholder="Email"  
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label className="fieldset-label">Password</label>
                <input 
                    type="password" 
                    className="input" 
                    placeholder="Password"  
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button className="btn btn-warning mt-4 text-amber-100" onClick={handleSubmit}>Login</button>
            </fieldset>
        </div>
    );
}

export default Login;
