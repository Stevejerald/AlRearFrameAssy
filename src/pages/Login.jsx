import React, { useState } from "react";
import "../assets/css/Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // -----------------------------------
    // STATIC LOGIN CREDENTIALS (OFFLINE)
    // -----------------------------------
    const STATIC_USERS = [
        {
            email: "assemble@al.in",
            password: "123456",
            role: "assemblyHead",
            redirect: "/AssemblyHead/"
        },
        {
            email: "rework@al.in",
            password: "123456",
            role: "reworkTeam",
            redirect: "/ReworkTeam/"
        }
    ];

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill all fields");
            return;
        }

        setLoading(true);

        setTimeout(() => {
            // Check credentials against static users
            const user = STATIC_USERS.find(
                (u) => u.email === email && u.password === password
            );

            if (!user) {
                setError("Invalid credentials");
                setLoading(false);
                return;
            }

            // Redirect based on role
            window.location.href = user.redirect;

            setLoading(false);
        }, 600); // fake loading delay
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2 className="login-title">Admin Login</h2>

                {error && <p className="login-error">{error}</p>}

                <form onSubmit={handleLogin}>
                    <div className="login-field">
                        <label>Email ID</label>
                        <input
                            type="email"
                            placeholder="Enter Email ID"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    <div className="login-field">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    <button className="login-button" type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
