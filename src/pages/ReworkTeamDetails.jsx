import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Volume2, ArrowLeftCircle } from "lucide-react";
import AudioRecorderPopup from "../components/AudioRecorderPopup.jsx";
import Header from "../components/Header.jsx";

function ReworkTeamDetails() {
    const { master_id } = useParams();
    const navigate = useNavigate();

    const [master, setMaster] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showAudioPopup, setShowAudioPopup] = useState(false);
    const [activeTask, setActiveTask] = useState(null);

    useEffect(() => {
        fetchDetails();
    }, []);

    const fetchDetails = async () => {
        setLoading(true);
        const res = await fetch(
            `http://localhost/AlRearFrameAssy/backend/api/getReworkDetails.php?master_id=${master_id}`
        );
        const data = await res.json();

        if (data.status) {
            setMaster(data.master);
            setTasks(data.failed_tasks);
        }

        setLoading(false);
    };

    /************************************************
     * UPDATE YES immediately in database
     ************************************************/
    const handleYes = async (stage_id, task_no) => {
        const payload = {
            master_id,
            stage_id,
            task_no,
            status: "yes",
            audio: null
        };

        await fetch(
            "http://localhost/AlRearFrameAssy/backend/api/updateReworkTask.php",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }
        );

        fetchDetails(); // Reload updated remaining failed tasks
    };

    /************************************************
     * When NO → open audio popup
     ************************************************/
    const handleNo = (stage_id, task_no) => {
        setActiveTask({ stage_id, task_no });
        setShowAudioPopup(true);
    };

    /************************************************
     * Save NO with audio inside DB
     ************************************************/
    const saveReworkAudio = async (audioBlob) => {
        const reader = new FileReader();
        reader.onloadend = async () => {

            const payload = {
                master_id,
                stage_id: activeTask.stage_id,
                task_no: activeTask.task_no,
                status: "no",
                audio: reader.result
            };

            await fetch(
                "http://localhost/AlRearFrameAssy/backend/api/updateReworkTask.php",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                }
            );

            setShowAudioPopup(false);
            setActiveTask(null);
            fetchDetails();
        };

        reader.readAsDataURL(audioBlob);
    };

    /************************************************
     * Complete Entire Rework
     ************************************************/
    const completeRework = async () => {
        const confirm = window.confirm("Confirm rework completion?");
        if (!confirm) return;

        const res = await fetch(
            "http://localhost/AlRearFrameAssy/backend/api/completeRework.php",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ master_id })
            }
        );

        const data = await res.json();

        if (data.status) {
            alert("Rework Completed Successfully!");
            navigate("/rework-team");
        }
    };

    const reworkCompleted = tasks.length === 0;

    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
            <Header activeTab="reworkteam" />

            {showAudioPopup && (
                <AudioRecorderPopup
                    onClose={() => setShowAudioPopup(false)}
                    onSave={saveReworkAudio}
                />
            )}

            <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>

                <button
                    onClick={() => navigate(-1)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "#2563eb",
                        fontSize: "1rem",
                        marginBottom: "1rem"
                    }}
                >
                    <ArrowLeftCircle size={22} /> Back
                </button>

                <div
                    style={{
                        background: "white",
                        padding: "1.5rem",
                        borderRadius: "12px",
                        marginBottom: "2rem",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                    }}
                >
                    <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: "700" }}>
                        Rework Task Details
                    </h1>

                    {master && (
                        <p style={{ marginTop: "0.5rem", color: "#6b7280" }}>
                            Axle Serial: <strong>{master.axle_serial_no}</strong> <br />
                            Production Date: {master.prod_date} | Shift: {master.prod_shift}
                        </p>
                    )}
                </div>

                <div
                    style={{
                        background: "white",
                        borderRadius: "12px",
                        padding: "1.5rem",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                    }}
                >
                    <h2 style={{ marginBottom: "1rem" }}>Tasks to Rework</h2>

                    {loading ? (
                        <p>Loading...</p>
                    ) : tasks.length === 0 ? (
                        <p style={{ color: "#16a34a", fontWeight: 700 }}>
                            ✅ All tasks fixed! You may complete the rework.
                        </p>
                    ) : (
                        tasks.map((t, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: "1.5rem",
                                    borderBottom: "1px solid #e5e7eb",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "1rem"
                                }}
                            >
                                <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                                    Stage {t.stage_id} — Task {t.task_no}
                                </div>

                                <div style={{ fontSize: "1rem", color: "#374151" }}>
                                    {t.description}
                                </div>

                                {t.audio && (
                                    <audio
                                        controls
                                        src={t.audio}
                                        style={{ width: "250px" }}
                                    />
                                )}

                                <div style={{ display: "flex", gap: "1rem" }}>
                                    <button
                                        onClick={() => handleYes(t.stage_id, t.task_no)}
                                        style={{
                                            padding: "0.75rem 1.5rem",
                                            background: "#059669",
                                            color: "white",
                                            borderRadius: "8px",
                                            border: "none",
                                            cursor: "pointer",
                                            fontWeight: 600
                                        }}
                                    >
                                        YES (Fixed)
                                    </button>

                                    <button
                                        onClick={() => handleNo(t.stage_id, t.task_no)}
                                        style={{
                                            padding: "0.75rem 1.5rem",
                                            background: "#fee2e2",
                                            color: "#991b1b",
                                            borderRadius: "8px",
                                            border: "none",
                                            cursor: "pointer",
                                            fontWeight: 600
                                        }}
                                    >
                                        NO (Still Issue)
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {reworkCompleted && (
                    <div style={{ textAlign: "center", marginTop: "2rem" }}>
                        <button
                            onClick={completeRework}
                            style={{
                                padding: "1rem 3rem",
                                background: "#3b82f6",
                                color: "white",
                                fontSize: "1.2rem",
                                fontWeight: "700",
                                borderRadius: "12px",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            ✅ Complete Rework
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReworkTeamDetails;
