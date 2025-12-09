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
    const [stats, setStats] = useState({
        total_rework: 0,
        pending_rework: 0,
        completed_rework: 0,
        in_progress: 0
    });

    const [trendData, setTrendData] = useState([]);
    const [stageBreakdown, setStageBreakdown] = useState([]);
    const [recentReworks, setRecentReworks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);

        try {
            const res = await fetch(
                "http://localhost/AlRearFrameAssy/backend/api/getReworkDashboard.php"
            );
            const data = await res.json();

            if (data.status) {
                setStats(data.data.stats);
                setTrendData(data.data.trend);
                setStageBreakdown(data.data.stage_breakdown);
                setRecentReworks(data.data.recent_reworks);
            }
        } catch (err) {
            console.error("Dashboard Fetch Error:", err);
        }

        setLoading(false);
    };

    // Status Pie Chart Data
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
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    border: "1px solid #e5e7eb"
                }}>
                    <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>
                        {label}
                    </p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ fontSize: "14px", color: entry.color, margin: 0 }}>
                            {entry.name}: <strong>{entry.value}</strong>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#f5f5f5",
            fontFamily: "system-ui, -apple-system, sans-serif"
        }}>
            <ReworkHeader activeTab="home" />

            <div style={{
                maxWidth: "1600px",
                margin: "0 auto",
                padding: "2rem 1rem"
            }}>
                {/* PAGE HEADER */}
                <div style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    marginBottom: "1.5rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "1rem"
                    }}>
                        <div>
                            <h1 style={{ fontSize: "1.75rem", fontWeight: "700", margin: 0 }}>
                                Rework Team Dashboard
                            </h1>
                            <p style={{ color: "#6b7280", margin: 0 }}>
                                Monitor and manage rework operations
                            </p>
                        </div>

                        <button
                            onClick={fetchDashboardData}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.75rem 1.5rem",
                                background: "#3b82f6",
                                color: "white",
                                borderRadius: "8px",
                                fontWeight: "600"
                            }}
                        >
                            <RefreshCw size={18} />
                            Refresh Data
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
                    {/* TOTAL REWORK */}
                    <KPIBox
                        title="Total Rework"
                        value={stats.total_rework}
                        icon={<Package size={24} color="#3b82f6" />}
                        color="#3b82f6"
                        bg="#eff6ff"
                    />

                    {/* PENDING */}
                    <KPIBox
                        title="Pending Rework"
                        value={stats.pending_rework}
                        icon={<Clock size={24} color="#f59e0b" />}
                        color="#f59e0b"
                        bg="#fef3c7"
                    />

                    {/* IN PROGRESS */}
                    <KPIBox
                        title="In Progress"
                        value={stats.in_progress}
                        icon={<Activity size={24} color="#3b82f6" />}
                        color="#3b82f6"
                        bg="#eff6ff"
                    />

                    {/* COMPLETED */}
                    <KPIBox
                        title="Completed"
                        value={stats.completed_rework}
                        icon={<CheckCircle2 size={24} color="#10b981" />}
                        color="#10b981"
                        bg="#d1fae5"
                    />
                </div>

                {/* TREND + STATUS PIE */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
                    gap: "1.5rem",
                    marginBottom: "1.5rem"
                }}>
                    {/* TREND CHART */}
                    <ChartCard
                        title="Rework Trend"
                        subtitle="Last 7 Days"
                        icon={<TrendingUp size={24} color="#3b82f6" />}
                    >
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line dataKey="sent" stroke="#f59e0b" name="Sent" strokeWidth={3} />
                                <Line dataKey="completed" stroke="#10b981" name="Completed" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* STATUS DISTRIBUTION */}
                    <ChartCard
                        title="Status Distribution"
                        subtitle="Current Breakdown"
                        icon={<Target size={24} color="#3b82f6" />}
                    >
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={statusDistribution}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    dataKey="value"
                                    label={({ name, percent }) =>
                                        `${name} ${(percent * 100).toFixed(0)}%`
                                    }
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
                    title="Stage-wise Rework Breakdown"
                    subtitle="Rework count by assembly stage"
                    icon={<AlertTriangle size={24} color="#f59e0b" />}
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
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}>
                    <div style={{
                        padding: "1.5rem",
                        borderBottom: "1px solid #e5e7eb"
                    }}>
                        <h3>Recent Rework Items</h3>
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
                                    <td style={{ ...tableCell, fontWeight: "600" }}>
                                        {item.axle_no}
                                    </td>
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

/* Small Reusable Components (for cleaner UI) */

const KPIBox = ({ title, value, icon, color, bg }) => (
    <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "1.5rem",
        borderLeft: `4px solid ${color}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
    }}>
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem"
        }}>
            <div>
                <p style={{ color: "#6b7280", marginBottom: "0.5rem" }}>{title}</p>
                <p style={{ fontSize: "2rem", fontWeight: "700" }}>{value}</p>
            </div>
            <div style={{
                width: "48px",
                height: "48px",
                background: bg,
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                {icon}
            </div>
        </div>
    </div>
);

const ChartCard = ({ title, subtitle, icon, children }) => (
    <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "1.5rem",
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
    color: "#6b7280",
    textTransform: "uppercase"
};

const tableCell = {
    padding: "1rem",
    fontSize: "0.95rem"
};

export default ReworkTeamDashboard;
