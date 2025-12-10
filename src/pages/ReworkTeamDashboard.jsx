import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";

import {
    RefreshCw,
    Clock,
    CheckCircle2,
    AlertTriangle,
    TrendingUp,
    Package,
    Activity,
    Target
} from "lucide-react";

import ReworkHeader from "../components/ReworkHeader.jsx";

function ReworkTeamDashboard() {

    // ------------------------------------------
    // STATIC SAMPLE DASHBOARD DATA
    // ------------------------------------------
    const sampleStats = {
        total_rework: 85,
        pending_rework: 32,
        completed_rework: 40,
        in_progress: 13
    };

    const sampleTrend = [
        { date: "2025-12-04", sent: 10, completed: 6 },
        { date: "2025-12-05", sent: 12, completed: 7 },
        { date: "2025-12-06", sent: 14, completed: 8 },
        { date: "2025-12-07", sent: 9, completed: 5 },
        { date: "2025-12-08", sent: 15, completed: 11 },
        { date: "2025-12-09", sent: 13, completed: 9 },
        { date: "2025-12-10", sent: 12, completed: 10 }
    ];

    const sampleStageBreakdown = [
        { stage: "Stage 1", count: 12 },
        { stage: "Stage 2", count: 18 },
        { stage: "Stage 3", count: 9 },
        { stage: "Stage 4", count: 21 },
        { stage: "Final QC", count: 8 }
    ];

    const sampleRecentReworks = [
        { axle_no: "AXL-3001", stage: "Stage 2", status: "PENDING", date: "2025-12-10" },
        { axle_no: "AXL-3002", stage: "Stage 4", status: "PROCESSING", date: "2025-12-10" },
        { axle_no: "AXL-3003", stage: "Final QC", status: "COMPLETED", date: "2025-12-09" },
        { axle_no: "AXL-3004", stage: "Stage 1", status: "PENDING", date: "2025-12-09" }
    ];

    const [stats, setStats] = useState(sampleStats);
    const [trendData, setTrendData] = useState(sampleTrend);
    const [stageBreakdown, setStageBreakdown] = useState(sampleStageBreakdown);
    const [recentReworks, setRecentReworks] = useState(sampleRecentReworks);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fake loading animation
        setTimeout(() => setLoading(false), 600);
    }, []);

    const refreshDashboard = () => {
        setLoading(true);
        setTimeout(() => {
            setStats(sampleStats);
            setTrendData(sampleTrend);
            setStageBreakdown(sampleStageBreakdown);
            setRecentReworks(sampleRecentReworks);
            setLoading(false);
        }, 600);
    };

    // Pie chart data
    const statusDistribution = [
        { name: "Pending", value: stats.pending_rework, color: "#f59e0b" },
        { name: "In Progress", value: stats.in_progress, color: "#3b82f6" },
        { name: "Completed", value: stats.completed_rework, color: "#10b981" }
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: "white",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.15)",
                    border: "1px solid #e5e7eb"
                }}>
                    <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>
                        {label}
                    </p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ fontSize: "14px", color: entry.color }}>
                            {entry.name}: <strong>{entry.value}</strong>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
            <ReworkHeader activeTab="home" />

            <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "2rem 1rem" }}>

                {/* PAGE HEADER */}
                <div style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    marginBottom: "1.5rem"
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <div>
                            <h1 style={{ fontSize: "1.75rem", fontWeight: "700" }}>
                                Rework Team Dashboard
                            </h1>
                            <p style={{ color: "#6b7280" }}>
                                Monitor and manage rework operations
                            </p>
                        </div>

                        <button
                            onClick={refreshDashboard}
                            style={{
                                background: "#3b82f6",
                                color: "white",
                                padding: "0.75rem 1.5rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                borderRadius: "8px",
                                fontWeight: "600"
                            }}
                        >
                            <RefreshCw size={20} /> Refresh Data
                        </button>
                    </div>
                </div>

                {/* KPI CARDS */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "1rem",
                    marginBottom: "1.5rem"
                }}>
                    <KPIBox
                        title="Total Rework"
                        value={stats.total_rework}
                        color="#3b82f6"
                        bg="#eff6ff"
                        icon={<Package color="#3b82f6" size={24} />}
                    />
                    <KPIBox
                        title="Pending Rework"
                        value={stats.pending_rework}
                        color="#f59e0b"
                        bg="#fef3c7"
                        icon={<Clock color="#f59e0b" size={24} />}
                    />
                    <KPIBox
                        title="In Progress"
                        value={stats.in_progress}
                        color="#3b82f6"
                        bg="#eff6ff"
                        icon={<Activity color="#3b82f6" size={24} />}
                    />
                    <KPIBox
                        title="Completed"
                        value={stats.completed_rework}
                        color="#10b981"
                        bg="#d1fae5"
                        icon={<CheckCircle2 color="#10b981" size={24} />}
                    />
                </div>

                {/* TREND + PIE CHART */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
                    gap: "1.5rem"
                }}>
                    <ChartCard
                        title="Rework Trend"
                        subtitle="Last 7 Days"
                        icon={<TrendingUp color="#3b82f6" size={24} />}
                    >
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Line dataKey="sent" stroke="#f59e0b" strokeWidth={3} />
                                <Line dataKey="completed" stroke="#10b981" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard
                        title="Status Distribution"
                        subtitle="Current Status"
                        icon={<Target color="#3b82f6" size={24} />}
                    >
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={statusDistribution}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {statusDistribution.map((e, i) => (
                                        <Cell key={i} fill={e.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                {/* STAGE BREAKDOWN */}
                <ChartCard
                    title="Stage-wise Breakdown"
                    subtitle="Rework counts per stage"
                    icon={<AlertTriangle color="#f59e0b" size={24} />}
                >
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stageBreakdown}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="stage" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* RECENT REWORK TABLE */}
                <div style={{
                    background: "white",
                    borderRadius: "12px",
                    marginTop: "1.5rem"
                }}>
                    <div style={{
                        padding: "1.5rem",
                        borderBottom: "1px solid #e5e7eb"
                    }}>
                        <h3>Recent Reworks</h3>
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f9fafb" }}>
                                <th style={tableHeader}>SL No</th>
                                <th style={tableHeader}>Axle Serial</th>
                                <th style={tableHeader}>Stage</th>
                                <th style={tableHeader}>Status</th>
                                <th style={tableHeader}>Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentReworks.map((item, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                                    <td style={tableCell}>{i + 1}</td>
                                    <td style={{ ...tableCell, fontWeight: "600" }}>{item.axle_no}</td>
                                    <td style={tableCell}>{item.stage}</td>
                                    <td style={tableCell}>{item.status}</td>
                                    <td style={tableCell}>{item.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

/* ------------------------------
   REUSABLE COMPONENTS
-------------------------------- */

const KPIBox = ({ title, value, icon, color, bg }) => (
    <div style={{
        background: "white",
        padding: "1.5rem",
        borderRadius: "12px",
        borderLeft: `4px solid ${color}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
    }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
                <p style={{ color: "#6b7280" }}>{title}</p>
                <p style={{ fontSize: "2rem", fontWeight: "700" }}>{value}</p>
            </div>
            <div style={{
                width: "48px",
                height: "48px",
                background: bg,
                borderRadius: "12px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                {icon}
            </div>
        </div>
    </div>
);

const ChartCard = ({ title, subtitle, icon, children }) => (
    <div style={{
        background: "white",
        padding: "1.5rem",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
    }}>
        <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1rem"
        }}>
            {icon}
            <div>
                <h3 style={{ margin: 0 }}>{title}</h3>
                <p style={{ margin: 0, color: "#6b7280" }}>{subtitle}</p>
            </div>
        </div>
        {children}
    </div>
);

const tableHeader = {
    padding: "1rem",
    textAlign: "left",
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#6b7280"
};

const tableCell = {
    padding: "1rem",
    fontSize: "0.95rem",
    color: "#374151"
};

export default ReworkTeamDashboard;
