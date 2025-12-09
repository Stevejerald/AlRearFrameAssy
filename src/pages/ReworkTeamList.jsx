import React, { useEffect, useState } from "react";
import { Calendar, RefreshCw, Volume2, Eye, CheckCircle, AlertCircle, Filter } from "lucide-react";
import ReworkHeader from "../components/ReworkHeader.jsx";
import { useNavigate } from "react-router-dom";

function ReworkTeamList() {
    const [selectedDate, setSelectedDate] = useState("");
    const [reworks, setReworks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [audioData, setAudioData] = useState({});
    const [statusFilter, setStatusFilter] = useState("ALL");

    const navigate = useNavigate();

    useEffect(() => {
        if (selectedDate !== "") fetchReworks();
    }, [selectedDate]);

    const fetchReworks = async () => {
        setLoading(true);

        const res = await fetch(
            `http://localhost/AlRearFrameAssy/backend/api/getReworkList.php?date=${selectedDate}`
        );

        const data = await res.json();
        if (data.status && Array.isArray(data.data)) {
            setReworks(data.data);
        } else {
            setReworks([]);
        }

        setAudioData({});
        setLoading(false);
    };

    const loadAudio = async (master_id) => {
        const res = await fetch(
            `http://localhost/AlRearFrameAssy/backend/api/getAudio.php?master_id=${master_id}`
        );

        const data = await res.json();
        if (data.status) {
            setAudioData(prev => ({
                ...prev,
                [master_id]: data.audio
            }));
        }
    };

    const acknowledge = async (master_id) => {
        if (!window.confirm("Acknowledge this rework?")) return;

        const res = await fetch(
            "http://localhost/AlRearFrameAssy/backend/api/ackRework.php",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ master_id })
            }
        );

        const data = await res.json();
        if (data.status) {
            alert("Rework acknowledged!");
            fetchReworks();
        }
    };

    const openDetails = (master_id) => {
        navigate(`/rework-details/${master_id}`);
    };

    /*************************************************
     * APPLY STATUS FILTER TO TABLE
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
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                >
                    <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: "700" }}>
                        Rework Team – Work Overview
                    </h1>
                    <p style={{ margin: 0, color: "#6b7280" }}>
                        View pending, processing, and completed reworks
                    </p>
                </div>

                {/* Filter Section */}
                <div
                    style={{
                        background: "white",
                        borderRadius: "12px",
                        padding: "1.5rem",
                        marginBottom: "1.5rem",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>

                        {/* DATE FILTER */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Calendar size={20} color="#6b7280" />
                            <label style={{ fontWeight: 600 }}>Select Date:</label>
                        </div>

                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{
                                padding: "0.625rem 1rem",
                                borderRadius: "8px",
                                border: "2px solid #e5e7eb"
                            }}
                        />

                        {/* STATUS FILTER */}
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
                                fontSize: "1rem",
                                cursor: "pointer"
                            }}
                        >
                            <option value="ALL">All</option>
                            <option value="NOT_ACK">Not Acknowledged</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="COMPLETED">Completed</option>
                        </select>

                        {selectedDate && (
                            <button
                                onClick={fetchReworks}
                                style={{
                                    padding: "0.625rem 1rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    background: "#10b981",
                                    color: "white",
                                    borderRadius: "8px",
                                    fontWeight: "600"
                                }}
                            >
                                <RefreshCw size={18} /> Refresh
                            </button>
                        )}
                    </div>
                </div>

                {/* Table Section */}
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
                            <RefreshCw size={32} style={{ animation: "spin 1s linear infinite" }} />
                            <p>Loading...</p>
                        </div>
                    ) : filteredReworks.length === 0 ? (
                        <div style={{ padding: "3rem", textAlign: "center" }}>
                            <AlertCircle size={48} color="#9ca3af" />
                            <p>No matching rework records</p>
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
                                            style={{
                                                borderBottom: "1px solid #e5e7eb",
                                                transition: "0.2s"
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                                        >
                                            <td style={td}>{index + 1}</td>
                                            <td style={{ ...td, fontWeight: 600 }}>{row.axle_serial_no}</td>
                                            <td style={td}>{row.prod_date}</td>
                                            <td style={td}>{row.drop_date}</td>
                                            <td style={td}>{row.stage_id}</td>
                                            <td style={td}>{row.reason || "-"}</td>

                                            {/* STATUS CHIP */}
                                            <td style={td}>
                                                <span
                                                    style={{
                                                        padding: "0.4rem 0.75rem",
                                                        borderRadius: "6px",
                                                        fontWeight: 600,
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
                                                    {row.rework_progress.replace("_", " ")}
                                                </span>
                                            </td>

                                            {/* AUDIO */}
                                            <td style={td}>
                                                {row.has_audio ? (
                                                    audioData[row.master_id] ? (
                                                        <audio controls src={audioData[row.master_id]} style={{ width: "180px" }} />
                                                    ) : (
                                                        <button onClick={() => loadAudio(row.master_id)} style={audioBtn}>
                                                            <Volume2 size={16} /> Load
                                                        </button>
                                                    )
                                                ) : (
                                                    <span style={{ color: "#9ca3af" }}>—</span>
                                                )}
                                            </td>

                                            {/* ACTIONS */}
                                            <td style={td}>
                                                {/* ACKNOWLEDGE BUTTON */}
                                                {row.rework_progress === "NOT_ACK" && (
                                                    <button
                                                        onClick={() => acknowledge(row.master_id)}
                                                        style={{
                                                            padding: "0.5rem 1rem",
                                                            background: "#f59e0b",
                                                            color: "white",
                                                            borderRadius: "6px",
                                                            marginBottom: "0.5rem",
                                                            display: "block"
                                                        }}
                                                    >
                                                        Acknowledge
                                                    </button>
                                                )}

                                                {/* START / VIEW REWORK */}
                                                <button
                                                    onClick={() => openDetails(row.master_id)}
                                                    style={{
                                                        padding: "0.5rem 1rem",
                                                        background: "#3b82f6",
                                                        color: "white",
                                                        borderRadius: "6px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "0.5rem"
                                                    }}
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
    fontSize: "0.875rem",
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
};

const td = {
    padding: "1rem",
    fontSize: "0.95rem",
    color: "#374151"
};

const audioBtn = {
    padding: "0.4rem 0.75rem",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "6px",
    color: "#1e40af",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
};

export default ReworkTeamList;
