export async function checkSession() {
    try {
        const res = await fetch("http://localhost/AlRearFrameAssy/backend/api/check_session.php", {
            method: "GET",
            credentials: "include"
        });

        const data = await res.json();
        return data;
    } catch (err) {
        return { status: false };
    }
}
