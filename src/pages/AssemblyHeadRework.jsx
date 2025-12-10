import React, { useEffect, useState } from "react";
import { Calendar, RefreshCw, Volume2, AlertCircle } from "lucide-react";
import Header from "../components/Header.jsx";

function AssemblyHeadRework() {
    // DEFAULT FIXED DATE: 2025-12-10 (YYYY-MM-DD)
    const [selectedDate, setSelectedDate] = useState("2025-12-10");

    const [reworks, setReworks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [audioData, setAudioData] = useState({});

    // ------------------------------------------
    // STATIC SAMPLE DATA (NO API CALLS)
    // ------------------------------------------
    const sampleReworkList = [
        {
            master_id: 201,
            axle_serial_no: "AXL-9001",
            prod_date: "2025-12-09",
            drop_date: "2025-12-10",
            stage_id: "Stage 3",
            rework_progress: "PENDING",
            reason: "Noise detected during rotation",
            has_audio: true
        },
        {
            master_id: 202,
            axle_serial_no: "AXL-9002",
            prod_date: "2025-12-09",
            drop_date: "2025-12-10",
            stage_id: "Stage 2",
            rework_progress: "PROCESSING",
            reason: "Torque mismatch",
            has_audio: true
        },
        {
            master_id: 203,
            axle_serial_no: "AXL-9003",
            prod_date: "2025-12-09",
            drop_date: "2025-12-10",
            stage_id: "Stage 1",
            rework_progress: "COMPLETED",
            reason: "Alignment correction",
            has_audio: false
        }
    ];

    useEffect(() => {
        fetchReworkList();
    }, []);

    // ------------------------------------------
    // Replace backend with sample data
    // ------------------------------------------
    const fetchReworkList = async () => {
        setLoading(true);

        // Fake a delay for loading effect
        setTimeout(() => {
            setReworks(sampleReworkList);
            setLoading(false);
        }, 600);
    };

    // ------------------------------------------
    // STATIC SAMPLE AUDIO
    // ------------------------------------------
    const loadAudio = async (master_id) => {
        const sampleAudioURL =
            "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars3.wav";

        setAudioData(prev => ({
            ...prev,
            [master_id]: sampleAudioURL
        }));
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
            <Header activeTab="rework" />

            <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "2rem 1rem" }}>
                
                {/* Header */}
                <div
                    style={{
                        background: "white",
                        padding: "1.5rem",
                        borderRadius: "12px",
                        marginBottom: "1.5rem",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                >
                    <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: "700" }}>
                        Rework Overview
                    </h1>
                    <p style={{ margin: 0, color: "#6b7280" }}>
                        View assemblies that require rework
                    </p>
                </div>

                {/* Filter */}
                <div
                    style={{
                        background: "white",
                        borderRadius: "12px",
                        padding: "1.5rem",
                        marginBottom: "1.5rem",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <Calendar size={20} color="#6b7280" />

                        <label
                            style={{
                                fontSize: "1rem",
                                fontWeight: "600",
                                color: "#374151",
                            }}
                        >
                            Select Date:
                        </label>

                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                fetchReworkList();
                            }}
                            style={{
                                padding: "0.625rem 1rem",
                                border: "2px solid #e5e7eb",
                                borderRadius: "8px",
                                fontSize: "1rem",
                                maxWidth: "250px",
                            }}
                        />

                        <button
                            onClick={fetchReworkList}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.625rem 1rem",
                                background: "#10b981",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                            }}
                        >
                            <RefreshCw size={18} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div
                    style={{
                        background: "white",
                        borderRadius: "12px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        overflow: "hidden",
                    }}
                >
                    {loading ? (
                        <div style={{ padding: "3rem", textAlign: "center" }}>
                            <RefreshCw
                                size={32}
                                style={{ animation: "spin 1s linear infinite" }}
                            />
                            <p style={{ marginTop: "1rem" }}>Loading...</p>
                        </div>
                    ) : reworks.length === 0 ? (
                        <div style={{ padding: "3rem", textAlign: "center" }}>
                            <AlertCircle size={48} color="#9ca3af" />
                            <p
                                style={{
                                    marginTop: "1rem",
                                    fontSize: "1.125rem",
                                    color: "#6b7280",
                                    fontWeight: "600",
                                }}
                            >
                                No rework records for {selectedDate}
                            </p>
                        </div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#f9fafb" }}>
                                        <th style={th}>SL No</th>
                                        <th style={th}>Axle Serial No</th>
                                        <th style={th}>Production Date</th>
                                        <th style={th}>Drop Date</th>
                                        <th style={th}>Drop Stage</th>
                                        <th style={th}>Rework Status</th>
                                        <th style={th}>Reason</th>
                                        <th style={th}>Audio</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {reworks.map((row, index) => (
                                        <tr
                                            key={row.master_id}
                                            style={{
                                                borderBottom: "1px solid #e5e7eb",
                                                transition: "background 0.2s",
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.background = "#f9fafb")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.background = "white")
                                            }
                                        >
                                            <td style={td}>{index + 1}</td>
                                            <td style={{ ...td, fontWeight: "600" }}>{row.axle_serial_no}</td>
                                            <td style={td}>{row.prod_date}</td>
                                            <td style={td}>{row.drop_date}</td>
                                            <td style={td}>{row.stage_id}</td>

                                            {/* STATUS */}
                                            <td style={td}>
                                                <span
                                                    style={{
                                                        padding: "0.4rem 0.75rem",
                                                        borderRadius: "6px",
                                                        fontSize: "0.875rem",
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
                                                                    : "#991b1b",
                                                    }}
                                                >
                                                    {row.rework_progress}
                                                </span>
                                            </td>

                                            <td style={td}>{row.reason || "-"}</td>

                                            {/* AUDIO */}
                                            <td style={td}>
                                                {row.has_audio ? (
                                                    audioData[row.master_id] ? (
                                                        <audio
                                                            controls
                                                            src={audioData[row.master_id]}
                                                            style={{ width: "200px" }}
                                                        />
                                                    ) : (
                                                        <button
                                                            onClick={() => loadAudio(row.master_id)}
                                                            style={audioBtn}
                                                        >
                                                            <Volume2 size={16} /> Play Audio
                                                        </button>
                                                    )
                                                ) : (
                                                    <span style={{ color: "#9ca3af" }}>—</span>
                                                )}
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
    fontSize: "0.875rem",
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
};

const td = {
    padding: "1rem",
    fontSize: "0.95rem",
    color: "#374151",
};

const audioBtn = {
    padding: "0.5rem 1rem",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "6px",
    color: "#1e40af",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
};

export default AssemblyHeadRework;
