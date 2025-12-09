import React, { useState } from "react";
import "../assets/css/Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill all fields");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost/AlRearFrameAssy/backend/api/adminLogin.php",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",   // 🔥 REQUIRED FOR PHP SESSION
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await response.json();

            if (data.status === true) {
                const role = data.user.role;

                // 🔥 ROLE-BASED REDIRECT
                if (role === "assemblyHead") {
                    window.location.href = "/AssemblyHead/";
                } else if (role === "reworkTeam") {
                    window.location.href = "/ReworkTeam/";
                } else {
                    setError("User role not recognized.");
                }
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Server error. Try again later.");
        }

        setLoading(false);
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
