import React, { useEffect, useState } from "react";
import { Calendar, Download, RefreshCw, Volume2, AlertCircle } from "lucide-react";
import Header from '../components/Header.jsx';

function AssemblyHeadSummary() {
    const [selectedDate, setSelectedDate] = useState("");
    const [summary, setSummary] = useState([]);
    const [rowAudio, setRowAudio] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedDate !== "") fetchSummary();
    }, [selectedDate]);

    const fetchSummary = async () => {
        setLoading(true);
        const res = await fetch(
            `http://localhost/AlRearFrameAssy/backend/api/getSummary.php?date=${selectedDate}`
        );

        const data = await res.json();

        if (data.status && Array.isArray(data.data)) {
            setSummary(data.data);
            setRowAudio({});
        } else {
            setSummary([]);
            setRowAudio({});
        }
        setLoading(false);
    };

    const loadAudio = async (master_id) => {
        const res = await fetch(
            `http://localhost/AlRearFrameAssy/backend/api/getAudio.php?master_id=${master_id}`
        );
        const data = await res.json();

        if (data.status) {
            setRowAudio(prev => ({
                ...prev,
                [master_id]: data.audio
            }));
        } else {
            alert("No audio found");
        }
    };

    const sendToRework = async (master_id) => {
        if (!window.confirm("Send this assembly to REWORK?")) return;

        const res = await fetch(
            "http://localhost/AlRearFrameAssy/backend/api/markRework.php",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ master_id })
            }
        );

        const data = await res.json();
        if (data.status) {
            alert("Marked for Rework!");
            fetchSummary();
        }
    };

    const exportData = () => {
        // Add export functionality here
        alert("Export functionality coming soon!");
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f5f5f5',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <Header activeTab="summary" />

            <div style={{
                maxWidth: '1600px',
                margin: '0 auto',
                padding: '2rem 1rem'
            }}>
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
                                margin: '0 0 0.25rem 0'
                            }}>
                                Assembly Summary
                            </h1>
                            <p style={{
                                color: '#6b7280',
                                margin: 0,
                                fontSize: '0.95rem'
                            }}>
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
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                            onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
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
                    marginBottom: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap'
                    }}>
                        <Calendar size={20} color="#6b7280" />
                        <label style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#374151'
                        }}>
                            Select Date:
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{
                                padding: '0.625rem 1rem',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                flex: '1 1 auto',
                                maxWidth: '250px'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                        {selectedDate && (
                            <button
                                onClick={fetchSummary}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.625rem 1rem',
                                    background: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#059669'}
                                onMouseLeave={(e) => e.target.style.background = '#10b981'}
                            >
                                <RefreshCw size={16} />
                                Refresh
                            </button>
                        )}
                    </div>
                </div>

                {/* Table Section */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    {loading ? (
                        <div style={{
                            padding: '3rem',
                            textAlign: 'center',
                            color: '#6b7280'
                        }}>
                            <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite' }} />
                            <p style={{ marginTop: '1rem' }}>Loading...</p>
                        </div>
                    ) : summary.length === 0 ? (
                        <div style={{
                            padding: '3rem',
                            textAlign: 'center'
                        }}>
                            <AlertCircle size={48} color="#9ca3af" />
                            <p style={{
                                marginTop: '1rem',
                                fontSize: '1.125rem',
                                fontWeight: '600',
                                color: '#6b7280'
                            }}>
                                {selectedDate ? 'No records found for selected date' : 'Please select a date to view records'}
                            </p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse'
                            }}>
                                <thead>
                                    <tr style={{
                                        background: '#f9fafb',
                                        borderBottom: '2px solid #e5e7eb'
                                    }}>
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
                                        const isOK = row.status.includes("OK");

                                        return (
                                            <tr
                                                key={index}
                                                style={{
                                                    borderBottom: '1px solid #e5e7eb',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                            >
                                                <td style={tableCellStyle}>{index + 1}</td>
                                                <td style={{...tableCellStyle, fontWeight: '600', color: '#1f2937'}}>
                                                    {row.axle_serial_no}
                                                </td>
                                                <td style={tableCellStyle}>{row.date}</td>

                                                <td style={tableCellStyle}>
                                                    <span style={{
                                                        padding: '0.375rem 0.875rem',
                                                        borderRadius: '6px',
                                                        fontSize: '0.875rem',
                                                        fontWeight: '600',
                                                        background: isOK ? '#d1fae5' : '#fee2e2',
                                                        color: isOK ? '#065f46' : '#991b1b',
                                                        display: 'inline-block'
                                                    }}>
                                                        {row.status}
                                                    </span>
                                                </td>

                                                <td style={tableCellStyle}>
                                                    {row.rework_status === "CLEAR" ? (
                                                        <span style={{
                                                            padding: '0.375rem 0.875rem',
                                                            borderRadius: '6px',
                                                            fontSize: '0.875rem',
                                                            fontWeight: '600',
                                                            background: '#dbeafe',
                                                            color: '#1e40af',
                                                            display: 'inline-block'
                                                        }}>
                                                            CLEAR
                                                        </span>
                                                    ) : (
                                                        <span style={{
                                                            padding: '0.375rem 0.875rem',
                                                            borderRadius: '6px',
                                                            fontSize: '0.875rem',
                                                            fontWeight: '600',
                                                            background: '#fef3c7',
                                                            color: '#92400e',
                                                            display: 'inline-block'
                                                        }}>
                                                            PENDING
                                                        </span>
                                                    )}
                                                </td>

                                                <td style={tableCellStyle}>
                                                    {row.audio ? (
                                                        rowAudio[row.master_id] ? (
                                                            <audio
                                                                controls
                                                                src={rowAudio[row.master_id]}
                                                                style={{
                                                                    width: '200px',
                                                                    height: '35px'
                                                                }}
                                                            />
                                                        ) : (
                                                            <button
                                                                onClick={() => loadAudio(row.master_id)}
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '0.5rem',
                                                                    padding: '0.5rem 1rem',
                                                                    background: '#eff6ff',
                                                                    border: '1px solid #bfdbfe',
                                                                    borderRadius: '6px',
                                                                    color: '#1e40af',
                                                                    fontSize: '0.875rem',
                                                                    fontWeight: '600',
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.2s'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.target.style.background = '#dbeafe';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.target.style.background = '#eff6ff';
                                                                }}
                                                            >
                                                                <Volume2 size={16} />
                                                                View Audio
                                                            </button>
                                                        )
                                                    ) : (
                                                        <span style={{ color: '#9ca3af' }}>-</span>
                                                    )}
                                                </td>

                                                <td style={tableCellStyle}>
                                                    <button
                                                        onClick={() => sendToRework(row.master_id)}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            background: '#f59e0b',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            color: 'white',
                                                            fontSize: '0.875rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer',
                                                            transition: 'background 0.2s',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.background = '#d97706'}
                                                        onMouseLeave={(e) => e.target.style.background = '#f59e0b'}
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

                @media (max-width: 768px) {
                    table {
                        font-size: 0.875rem;
                    }
                    
                    audio {
                        width: 150px !important;
                    }
                }
            `}</style>
        </div>
    );
}

const tableHeaderStyle = {
    padding: '1rem',
    textAlign: 'left',
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const tableCellStyle = {
    padding: '1rem',
    fontSize: '0.95rem',
    color: '#374151'
};

export default AssemblyHeadSummary;