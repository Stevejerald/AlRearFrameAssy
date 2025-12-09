import React, { useEffect, useState } from "react";
import { Calendar, Plus, Edit2, Trash2, Save, X, RefreshCw, AlertCircle } from "lucide-react";
import Header from '../components/Header.jsx';

function Workplan() {
    const [workplans, setWorkplans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    // Form state
    const [formData, setFormData] = useState({
        date: '',
        shift: 'Shift 1',
        count: ''
    });

    useEffect(() => {
        fetchWorkplans();
    }, []);

    const fetchWorkplans = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                'http://localhost/AlRearFrameAssy/backend/api/getWorkplans.php'
            );
            const data = await res.json();
            
            if (data.status && Array.isArray(data.data)) {
                setWorkplans(data.data);
            } else {
                setWorkplans([]);
            }
        } catch (error) {
            console.error('Error fetching workplans:', error);
            setWorkplans([]);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.date || !formData.shift || !formData.count) {
            alert('Please fill all fields!');
            return;
        }

        const payload = {
            date: formData.date,
            shift: formData.shift,
            count: parseInt(formData.count)
        };

        if (editingId) {
            payload.id = editingId;
        }

        try {
            const url = editingId 
                ? 'http://localhost/AlRearFrameAssy/backend/api/updateWorkplan.php'
                : 'http://localhost/AlRearFrameAssy/backend/api/createWorkplan.php';

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (data.status) {
                alert(editingId ? 'Workplan updated!' : 'Workplan created!');
                setShowForm(false);
                setEditingId(null);
                setFormData({ date: '', shift: 'Shift 1', count: '' });
                fetchWorkplans();
            } else {
                alert(data.message || 'Failed to save workplan');
            }
        } catch (error) {
            console.error('Error saving workplan:', error);
            alert('Error saving workplan');
        }
    };

    const handleEdit = (workplan) => {
        setFormData({
            date: workplan.date,
            shift: workplan.shift,
            count: workplan.count.toString()
        });
        setEditingId(workplan.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this workplan?')) {
            return;
        }

        try {
            const res = await fetch(
                'http://localhost/AlRearFrameAssy/backend/api/deleteWorkplan.php',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                }
            );

            const data = await res.json();

            if (data.status) {
                alert('Workplan deleted!');
                fetchWorkplans();
            } else {
                alert(data.message || 'Failed to delete workplan');
            }
        } catch (error) {
            console.error('Error deleting workplan:', error);
            alert('Error deleting workplan');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ date: '', shift: 'Shift 1', count: '' });
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f5f5f5',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <Header activeTab="workplan" />

            <div style={{
                maxWidth: '1400px',
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
                                Workplan Management
                            </h1>
                            <p style={{
                                color: '#6b7280',
                                margin: 0,
                                fontSize: '0.95rem'
                            }}>
                                Create and manage daily production workplans
                            </p>
                        </div>

                        <button
                            onClick={() => setShowForm(!showForm)}
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
                            {showForm ? <X size={18} /> : <Plus size={18} />}
                            {showForm ? 'Cancel' : 'Create Workplan'}
                        </button>
                    </div>
                </div>

                {/* Create/Edit Form */}
                {showForm && (
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        marginBottom: '1.5rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '2px solid #3b82f6'
                    }}>
                        <h2 style={{
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: '#1f2937',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <Calendar size={24} color="#3b82f6" />
                            {editingId ? 'Edit Workplan' : 'Create New Workplan'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '1.5rem',
                                marginBottom: '1.5rem'
                            }}>
                                {/* Date Field */}
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: '#374151',
                                        marginBottom: '0.5rem'
                                    }}>
                                        Date <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                    />
                                </div>

                                {/* Shift Field */}
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: '#374151',
                                        marginBottom: '0.5rem'
                                    }}>
                                        Shift <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <select
                                        value={formData.shift}
                                        onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            transition: 'border-color 0.2s',
                                            cursor: 'pointer',
                                            background: 'white'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                    >
                                        <option value="Shift 1">Shift 1</option>
                                        <option value="Shift 2">Shift 2</option>
                                    </select>
                                </div>

                                {/* Count Field */}
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: '#374151',
                                        marginBottom: '0.5rem'
                                    }}>
                                        Target Count <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.count}
                                        onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                                        placeholder="Enter target count"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                    />
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                justifyContent: 'flex-end'
                            }}>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem 1.5rem',
                                        background: 'white',
                                        color: '#6b7280',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '0.95rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = '#f9fafb';
                                        e.target.style.borderColor = '#d1d5db';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'white';
                                        e.target.style.borderColor = '#e5e7eb';
                                    }}
                                >
                                    <X size={18} />
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem 1.5rem',
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
                                    <Save size={18} />
                                    {editingId ? 'Update Workplan' : 'Create Workplan'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Workplans Table */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        padding: '1.5rem',
                        borderBottom: '1px solid #e5e7eb',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h2 style={{
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: '#1f2937',
                            margin: 0
                        }}>
                            Workplan History
                        </h2>
                        <button
                            onClick={fetchWorkplans}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                background: 'transparent',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                color: '#6b7280',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = '#f9fafb';
                                e.target.style.borderColor = '#d1d5db';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.borderColor = '#e5e7eb';
                            }}
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div style={{
                            padding: '3rem',
                            textAlign: 'center',
                            color: '#6b7280'
                        }}>
                            <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite' }} />
                            <p style={{ marginTop: '1rem' }}>Loading workplans...</p>
                        </div>
                    ) : workplans.length === 0 ? (
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
                                No workplans found
                            </p>
                            <p style={{
                                marginTop: '0.5rem',
                                fontSize: '0.95rem',
                                color: '#9ca3af'
                            }}>
                                Create your first workplan to get started
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
                                        <th style={tableHeaderStyle}>Date</th>
                                        <th style={tableHeaderStyle}>Shift</th>
                                        <th style={tableHeaderStyle}>Target Count</th>
                                        <th style={tableHeaderStyle}>Created On</th>
                                        <th style={tableHeaderStyle}>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {workplans.map((workplan, index) => (
                                        <tr
                                            key={workplan.id}
                                            style={{
                                                borderBottom: '1px solid #e5e7eb',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                        >
                                            <td style={tableCellStyle}>{index + 1}</td>
                                            <td style={{...tableCellStyle, fontWeight: '600', color: '#1f2937'}}>
                                                {workplan.date}
                                            </td>
                                            <td style={tableCellStyle}>
                                                <span style={{
                                                    padding: '0.375rem 0.875rem',
                                                    borderRadius: '6px',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    background: workplan.shift === 'Shift 1' ? '#dbeafe' : '#fef3c7',
                                                    color: workplan.shift === 'Shift 1' ? '#1e40af' : '#92400e',
                                                    display: 'inline-block'
                                                }}>
                                                    {workplan.shift}
                                                </span>
                                            </td>
                                            <td style={{...tableCellStyle, fontWeight: '700', color: '#3b82f6', fontSize: '1.1rem'}}>
                                                {workplan.count}
                                            </td>
                                            <td style={{...tableCellStyle, color: '#6b7280'}}>
                                                {workplan.created_at || '-'}
                                            </td>
                                            <td style={tableCellStyle}>
                                                <div style={{
                                                    display: 'flex',
                                                    gap: '0.5rem',
                                                    justifyContent: 'center'
                                                }}>
                                                    <button
                                                        onClick={() => handleEdit(workplan)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.375rem',
                                                            padding: '0.5rem 0.875rem',
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
                                                        <Edit2 size={14} />
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(workplan.id)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.375rem',
                                                            padding: '0.5rem 0.875rem',
                                                            background: '#fef2f2',
                                                            border: '1px solid #fecaca',
                                                            borderRadius: '6px',
                                                            color: '#991b1b',
                                                            fontSize: '0.875rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.target.style.background = '#fee2e2';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.background = '#fef2f2';
                                                        }}
                                                    >
                                                        <Trash2 size={14} />
                                                        Delete
                                                    </button>
                                                </div>
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

                input[type="number"]::-webkit-inner-spin-button,
                input[type="number"]::-webkit-outer-spin-button {
                    opacity: 1;
                }

                @media (max-width: 768px) {
                    table {
                        font-size: 0.875rem;
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

export default Workplan;