import React, { useEffect, useState } from "react";
import { Calendar, RefreshCw, Volume2, Eye, CheckCircle, AlertCircle, Filter } from "lucide-react";
import ReworkHeader from "../components/ReworkHeader.jsx";
import { useNavigate } from "react-router-dom";

function ReworkTeamList() {
    const [selectedDate, setSelectedDate] = useState("2025-12-10"); // Default sample date
    const [reworks, setReworks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [audioData, setAudioData] = useState({});
    const [statusFilter, setStatusFilter] = useState("ALL");

    const navigate = useNavigate();

    // -----------------------------
    // STATIC SAMPLE DATA (NO BACKEND)
    // -----------------------------
    const sampleReworkList = [
        {
            master_id: 501,
            axle_serial_no: "AXL-7001",
            prod_date: "2025-12-09",
            drop_date: "2025-12-10",
            stage_id: "Stage 1",
            reason: "Noise detected",
            rework_progress: "NOT_ACK",
            has_audio: true
        },
        {
            master_id: 502,
            axle_serial_no: "AXL-7002",
            prod_date: "2025-12-08",
            drop_date: "2025-12-10",
            stage_id: "Stage 3",
            reason: "Torque mismatch",
            rework_progress: "PROCESSING",
            has_audio: true
        },
        {
            master_id: 503,
            axle_serial_no: "AXL-7003",
            prod_date: "2025-12-07",
            drop_date: "2025-12-10",
            stage_id: "Final QC",
            reason: "Visual defect",
            rework_progress: "COMPLETED",
            has_audio: false
        },
        {
            master_id: 504,
            axle_serial_no: "AXL-7004",
            prod_date: "2025-12-09",
            drop_date: "2025-12-10",
            stage_id: "Stage 2",
            reason: "Alignment issue",
            rework_progress: "PROCESSING",
            has_audio: true
        }
    ];

    useEffect(() => {
        loadSampleData();
    }, []);

    const loadSampleData = () => {
        setLoading(true);
        setTimeout(() => {
            setReworks(sampleReworkList);
            setLoading(false);
        }, 500);
    };

    // -----------------------------
    // STATIC SAMPLE AUDIO
    // -----------------------------
    const loadAudio = (master_id) => {
        const sampleAudioURL =
            "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars3.wav";

        setAudioData(prev => ({
            ...prev,
            [master_id]: sampleAudioURL
        }));
    };

    // -----------------------------
    // STATIC ACKNOWLEDGE ACTION
    // -----------------------------
    const acknowledge = (master_id) => {
        alert(`Rework ${master_id} acknowledged (sample action).`);

        // Update status locally
        setReworks(prev =>
            prev.map(item =>
                item.master_id === master_id
                    ? { ...item, rework_progress: "PROCESSING" }
                    : item
            )
        );
    };

    const openDetails = (master_id) => {
        navigate(`/rework-details/${master_id}`);
    };

    /*************************************************
     * APPLY STATUS FILTER
     *************************************************/
    const filteredReworks = reworks.filter(row => {
        if (statusFilter === "ALL") return true;
        return row.rework_progress === statusFilter;
    });

    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
            <ReworkHeader activeTab="summary" />

            <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "2rem 1rem" }}>

                {/* Page Header */}
                <div
                    style={{
                        background: "white",
                        padding: "1.5rem",
                        borderRadius: "12px",
                        marginBottom: "1.5rem",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                    }}
                >
                    <h1 style={{ fontSize: "1.75rem", fontWeight: "700" }}>
                        Rework Team – Work Overview
                    </h1>
                    <p style={{ color: "#6b7280" }}>
                        View pending, processing, and completed reworks
                    </p>
                </div>

                {/* Filters */}
                <div
                    style={{
                        background: "white",
                        padding: "1.5rem",
                        borderRadius: "12px",
                        marginBottom: "1.5rem",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>

                        {/* Date Filter */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Calendar size={20} color="#6b7280" />
                            <label style={{ fontWeight: 600 }}>Select Date:</label>
                        </div>

                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{
                                padding: "0.6rem 1rem",
                                border: "2px solid #e5e7eb",
                                borderRadius: "8px"
                            }}
                        />

                        {/* Status Filter */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <Filter size={20} color="#6b7280" />
                            <label style={{ fontWeight: 600 }}>Status:</label>
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                padding: "0.6rem 1rem",
                                borderRadius: "8px",
                                border: "2px solid #e5e7eb",
                                background: "white",
                                cursor: "pointer"
                            }}
                        >
                            <option value="ALL">All</option>
                            <option value="NOT_ACK">Not Acknowledged</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="COMPLETED">Completed</option>
                        </select>

                        <button
                            onClick={loadSampleData}
                            style={{
                                padding: "0.6rem 1rem",
                                background: "#10b981",
                                color: "white",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                fontWeight: 600
                            }}
                        >
                            <RefreshCw size={18} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                <div
                    style={{
                        background: "white",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                    }}
                >
                    {loading ? (
                        <div style={{ padding: "3rem", textAlign: "center" }}>
                            <RefreshCw size={32} style={{ animation: "spin 1s linear infinite" }} />
                            <p>Loading data...</p>
                        </div>
                    ) : filteredReworks.length === 0 ? (
                        <div style={{ padding: "3rem", textAlign: "center" }}>
                            <AlertCircle size={48} color="#9ca3af" />
                            <p>No matching reworks</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#f9fafb" }}>
                                        <th style={th}>SL No</th>
                                        <th style={th}>Axle Serial</th>
                                        <th style={th}>Prod Date</th>
                                        <th style={th}>Drop Date</th>
                                        <th style={th}>Stage</th>
                                        <th style={th}>Reason</th>
                                        <th style={th}>Status</th>
                                        <th style={th}>Audio</th>
                                        <th style={th}>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredReworks.map((row, index) => (
                                        <tr
                                            key={row.master_id}
                                            style={{ borderBottom: "1px solid #e5e7eb" }}
                                        >
                                            <td style={td}>{index + 1}</td>
                                            <td style={{ ...td, fontWeight: "600" }}>{row.axle_serial_no}</td>
                                            <td style={td}>{row.prod_date}</td>
                                            <td style={td}>{row.drop_date}</td>
                                            <td style={td}>{row.stage_id}</td>
                                            <td style={td}>{row.reason}</td>

                                            {/* Status Chip */}
                                            <td style={td}>
                                                <span
                                                    style={{
                                                        padding: "0.4rem 0.8rem",
                                                        borderRadius: "6px",
                                                        fontWeight: "600",
                                                        background:
                                                            row.rework_progress === "COMPLETED"
                                                                ? "#d1fae5"
                                                                : row.rework_progress === "PROCESSING"
                                                                    ? "#fef3c7"
                                                                    : "#fee2e2",
                                                        color:
                                                            row.rework_progress === "COMPLETED"
                                                                ? "#065f46"
                                                                : row.rework_progress === "PROCESSING"
                                                                    ? "#92400e"
                                                                    : "#991b1b"
                                                    }}
                                                >
                                                    {row.rework_progress.replace("_", " ")}
                                                </span>
                                            </td>

                                            {/* AUDIO */}
                                            <td style={td}>
                                                {row.has_audio ? (
                                                    audioData[row.master_id] ? (
                                                        <audio controls src={audioData[row.master_id]} style={{ width: "160px" }} />
                                                    ) : (
                                                        <button style={audioBtn} onClick={() => loadAudio(row.master_id)}>
                                                            <Volume2 size={16} /> Play
                                                        </button>
                                                    )
                                                ) : (
                                                    <span style={{ color: "#9ca3af" }}>—</span>
                                                )}
                                            </td>

                                            {/* ACTION BUTTONS */}
                                            <td style={td}>
                                                {row.rework_progress === "NOT_ACK" && (
                                                    <button
                                                        style={{
                                                            padding: "0.5rem 1rem",
                                                            background: "#f59e0b",
                                                            color: "white",
                                                            borderRadius: "6px",
                                                            marginBottom: "0.5rem",
                                                            display: "block"
                                                        }}
                                                        onClick={() => acknowledge(row.master_id)}
                                                    >
                                                        Acknowledge
                                                    </button>
                                                )}

                                                <button
                                                    style={{
                                                        padding: "0.5rem 1rem",
                                                        background: "#3b82f6",
                                                        color: "white",
                                                        borderRadius: "6px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "0.5rem"
                                                    }}
                                                    onClick={() => openDetails(row.master_id)}
                                                >
                                                    <Eye size={16} />
                                                    {row.rework_progress === "COMPLETED" ? "View" : "Start"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

const th = {
    padding: "1rem",
    textAlign: "left",
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#6b7280"
};

const td = {
    padding: "1rem",
    fontSize: "0.95rem",
    color: "#374151"
};

const audioBtn = {
    padding: "0.4rem 0.8rem",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#1e40af",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem"
};

export default ReworkTeamList;
