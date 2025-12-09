import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkSession } from "../utils/checkSession";

function ProtectedRoute({ children, allowedRoles }) {
    const [loading, setLoading] = useState(true);
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        async function verify() {
            const session = await checkSession();

            if (session.status === true) {
                if (!allowedRoles || allowedRoles.includes(session.user.role)) {
                    setAllowed(true);
                }
            }

            setLoading(false);
        }
        verify();
    }, []);

    if (loading) return <p style={{ padding: 20 }}>Checking session...</p>;

    if (!allowed) return <Navigate to="/login" replace />;

    return children;
}

export default ProtectedRoute;
