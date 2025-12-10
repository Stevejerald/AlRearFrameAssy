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

    // -----------------------------------------
    // STATIC MASTER SAMPLE DATA
    // -----------------------------------------
    const sampleMaster = {
        master_id,
        axle_serial_no: "AXL-7002",
        prod_date: "2025-12-09",
        prod_shift: "Shift 1"
    };

    // -----------------------------------------
    // STATIC TASK SAMPLE DATA
    // -----------------------------------------
    const sampleTasks = [
        {
            stage_id: "1",
            task_no: "2",
            description: "Noise detected inside assembly unit",
            audio: "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars3.wav"
        },
        {
            stage_id: "3",
            task_no: "1",
            description: "Torque mismatch detected in calibration",
            audio: null
        },
        {
            stage_id: "4",
            task_no: "3",
            description: "Alignment deviation beyond tolerance",
            audio: null
        }
    ];

    useEffect(() => {
        loadSampleDetails();
    }, []);

    // -----------------------------------------
    // LOAD STATIC SAMPLE DATA
    // -----------------------------------------
    const loadSampleDetails = () => {
        setLoading(true);
        setTimeout(() => {
            setMaster(sampleMaster);
            setTasks(sampleTasks);
            setLoading(false);
        }, 400);
    };

    // -----------------------------------------
    // YES BUTTON → remove task from the list
    // -----------------------------------------
    const handleYes = (stage_id, task_no) => {
        alert(`Task ${task_no} at stage ${stage_id} marked FIXED (sample).`);

        // Remove the task from the list
        setTasks(prev =>
            prev.filter(t => !(t.stage_id === stage_id && t.task_no === task_no))
        );
    };

    // -----------------------------------------
    // NO BUTTON → open popup
    // -----------------------------------------
    const handleNo = (stage_id, task_no) => {
        setActiveTask({ stage_id, task_no });
        setShowAudioPopup(true);
    };

    // -----------------------------------------
    // SAVE AUDIO FOR NO (sample only)
    // -----------------------------------------
    const saveReworkAudio = async (audioBlob) => {
        const reader = new FileReader();
        reader.onloadend = () => {

            alert(`Audio saved for Stage ${activeTask.stage_id}, Task ${activeTask.task_no} (sample).`);

            // Update task to include audio
            setTasks(prev =>
                prev.map(t =>
                    t.stage_id === activeTask.stage_id && t.task_no === activeTask.task_no
                        ? { ...t, audio: reader.result }
                        : t
                )
            );

            setShowAudioPopup(false);
            setActiveTask(null);
        };

        reader.readAsDataURL(audioBlob);
    };

    // -----------------------------------------
    // COMPLETE ENTIRE REWORK (static)
    // -----------------------------------------
    const completeRework = () => {
        if (!window.confirm("Confirm rework completion?")) return;

        alert("Rework Completed Successfully! (sample)");
        navigate("/reworkteam");
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

                {/* BACK BUTTON */}
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

                {/* HEADER CARD */}
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

                {/* TASKS LIST */}
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

                                {/* YES / NO Buttons */}
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

                {/* COMPLETE BUTTON */}
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
