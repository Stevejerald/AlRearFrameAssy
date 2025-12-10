import React, { useEffect, useState } from "react";
import { Calendar, Download, RefreshCw, Volume2, AlertCircle } from "lucide-react";
import Header from '../components/Header.jsx';

function AssemblyHeadSummary() {
    const [selectedDate, setSelectedDate] = useState("");
    const [summary, setSummary] = useState([]);
    const [rowAudio, setRowAudio] = useState({});
    const [loading, setLoading] = useState(false);

    // ------------------------------------------
    // STATIC SAMPLE TABLE DATA (NO API REQUIRED)
    // ------------------------------------------
    const sampleData = [
        {
            master_id: 101,
            axle_serial_no: "AXL-2025-001",
            date: "2025-01-15",
            status: "OK",
            rework_status: "CLEAR",
            audio: true
        },
        {
            master_id: 102,
            axle_serial_no: "AXL-2025-002",
            date: "2025-01-15",
            status: "NOT OK",
            rework_status: "PENDING",
            audio: true
        },
        {
            master_id: 103,
            axle_serial_no: "AXL-2025-003",
            date: "2025-01-15",
            status: "OK",
            rework_status: "CLEAR",
            audio: false
        },
        {
            master_id: 104,
            axle_serial_no: "AXL-2025-004",
            date: "2025-01-15",
            status: "NOT OK",
            rework_status: "PENDING",
            audio: true
        }
    ];

    // When date is selected → Load static sample data
    useEffect(() => {
        if (selectedDate !== "") {
            setLoading(true);
            setTimeout(() => {
                setSummary(sampleData); // << static data
                setLoading(false);
            }, 600);
        }
    }, [selectedDate]);

    // ------------------------------------------
    // STATIC SAMPLE AUDIO RESPONSE
    // ------------------------------------------
    const loadAudio = async (master_id) => {
        // Fake sample audio URL
        const sampleAudioURL = "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars3.wav";

        setRowAudio(prev => ({
            ...prev,
            [master_id]: sampleAudioURL
        }));
    };

    // ------------------------------------------
    // STATIC REWORK FUNCTION (no backend)
    // ------------------------------------------
    const sendToRework = async (master_id) => {
        if (!window.confirm("Send this assembly to REWORK?")) return;

        alert(`Assembly ${master_id} marked for rework (sample action).`);
    };

    const exportData = () => {
        alert("Sample Export Coming Soon!");
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f5f5f5'
        }}>
            <Header activeTab="summary" />

            <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '2rem 1rem' }}>

                {/* Page Header */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <div>
                            <h1 style={{
                                fontSize: '1.75rem',
                                fontWeight: '700',
                                color: '#1f2937',
                                margin: 0
                            }}>
                                Assembly Summary
                            </h1>
                            <p style={{ color: '#6b7280', margin: 0 }}>
                                View and manage assembly records
                            </p>
                        </div>

                        <button
                            onClick={exportData}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.5rem',
                                background: '#3b82f6',
                                color: 'white',
                                borderRadius: '8px',
                                fontWeight: '600'
                            }}
                        >
                            <Download size={18} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Filter Section */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Calendar size={20} color="#6b7280" />
                        <label style={{ fontWeight: '600' }}>Select Date:</label>

                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{
                                padding: '0.625rem 1rem',
                                borderRadius: '8px',
                                border: '2px solid #e5e7eb',
                                maxWidth: '250px'
                            }}
                        />
                    </div>
                </div>

                {/* TABLE SECTION */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}>
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center' }}>
                            <RefreshCw size={32} style={{ animation: "spin 1s linear infinite" }} />
                            <p>Loading...</p>
                        </div>
                    ) : summary.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center' }}>
                            <AlertCircle size={48} color="#9ca3af" />
                            <p style={{ marginTop: '1rem', fontWeight: '600', color: '#6b7280' }}>
                                {selectedDate ? "No sample data found." : "Select a date to view sample data"}
                            </p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                                        <th style={tableHeaderStyle}>SL No</th>
                                        <th style={tableHeaderStyle}>Axle Serial No</th>
                                        <th style={tableHeaderStyle}>Date</th>
                                        <th style={tableHeaderStyle}>Status</th>
                                        <th style={tableHeaderStyle}>Rework Status</th>
                                        <th style={tableHeaderStyle}>Audio</th>
                                        <th style={tableHeaderStyle}>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {summary.map((row, index) => {
                                        const isOK = row.status === "OK";

                                        return (
                                            <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                <td style={tableCellStyle}>{index + 1}</td>

                                                <td style={{ ...tableCellStyle, fontWeight: '600' }}>
                                                    {row.axle_serial_no}
                                                </td>

                                                <td style={tableCellStyle}>{row.date}</td>

                                                {/* STATUS */}
                                                <td style={tableCellStyle}>
                                                    <span style={{
                                                        padding: '0.375rem 0.875rem',
                                                        borderRadius: '6px',
                                                        background: isOK ? '#d1fae5' : '#fee2e2',
                                                        color: isOK ? '#065f46' : '#991b1b',
                                                        fontWeight: '600'
                                                    }}>
                                                        {row.status}
                                                    </span>
                                                </td>

                                                {/* REWORK STATUS */}
                                                <td style={tableCellStyle}>
                                                    <span style={{
                                                        padding: '0.375rem 0.875rem',
                                                        borderRadius: '6px',
                                                        background: row.rework_status === "CLEAR" ? '#dbeafe' : '#fef3c7',
                                                        color: row.rework_status === "CLEAR" ? '#1e40af' : '#92400e',
                                                        fontWeight: '600'
                                                    }}>
                                                        {row.rework_status}
                                                    </span>
                                                </td>

                                                {/* AUDIO */}
                                                <td style={tableCellStyle}>
                                                    {row.audio ? (
                                                        rowAudio[row.master_id] ? (
                                                            <audio controls src={rowAudio[row.master_id]} style={{ width: '180px' }} />
                                                        ) : (
                                                            <button
                                                                onClick={() => loadAudio(row.master_id)}
                                                                style={audioBtnStyle}
                                                            >
                                                                <Volume2 size={16} /> Play Audio
                                                            </button>
                                                        )
                                                    ) : (
                                                        <span style={{ color: '#9ca3af' }}>No Audio</span>
                                                    )}
                                                </td>

                                                {/* SEND TO REWORK */}
                                                <td style={tableCellStyle}>
                                                    <button
                                                        onClick={() => sendToRework(row.master_id)}
                                                        style={reworkBtnStyle}
                                                    >
                                                        Send to Rework
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
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

// ----------------------
// Styles
// ----------------------
const tableHeaderStyle = {
    padding: "1rem",
    fontWeight: "700",
    fontSize: "0.8rem",
    textTransform: "uppercase",
    color: "#6b7280",
    letterSpacing: "0.05em"
};

const tableCellStyle = {
    padding: "1rem",
    fontSize: "0.95rem",
    color: "#374151"
};

const audioBtnStyle = {
    padding: "0.5rem 0.75rem",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "6px",
    color: "#1e40af",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    fontWeight: "600",
    cursor: "pointer"
};

const reworkBtnStyle = {
    padding: "0.5rem 1rem",
    background: "#f59e0b",
    borderRadius: "6px",
    color: "white",
    fontWeight: "600",
    cursor: "pointer"
};

export default AssemblyHeadSummary;
