import axios from "axios";
import React, { useState } from "react";
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = async () => {
    try {
        const response = await
        axios.post("http://localhost:3030/api/users/login", { email, password });
        localStorage.setItem("token", response.data.token);
        window.location.href = "/dashboard";
    } catch (error) {
        alert("Login failed");
    }
    };
    return (
        <div>
            <h2>Login</h2>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};
export default Login;