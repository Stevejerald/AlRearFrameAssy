import AlLogo from '../assets/img/logo.png';
import React, { useState, useEffect } from "react";
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
    LayoutDashboard,
    RefreshCw,
    CheckCircle2,
    XCircle,
    AlertCircle,
    TrendingUp,
    Calendar,
    Users,
    Clock,
    Target,
    Activity,
    Package,
    AlertTriangle
} from "lucide-react";
import "../assets/css/AssemblyHeadDashboard.css";
import Header from "../components/Header.jsx";

function AssemblyHeadDashboard() {
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {
        fetch("http://localhost/AlRearFrameAssy/backend/api/getAssemblyHeadDashboard.php")
            .then(res => res.json())
            .then(data => {
                setDashboard(data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("API Fetch Error:", err);
                setLoading(false);
            });
    }, []);

    if (loading || !dashboard) {
        return <p style={{ padding: "20px" }}>Loading dashboard...</p>;
    }

    // -----------------------------
    // CUSTOM TOOLTIP 
    // -----------------------------
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    border: '1px solid #dbeafe'
                }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                        {label}
                    </p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ fontSize: '14px', color: entry.color || "#000", margin: 0 }}>
                            {entry.name}: <span style={{ fontWeight: 'bold' }}>{entry.value}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // -----------------------------
    // 1. KPI STATS
    // -----------------------------
    const stats = {
        total_assemblies: dashboard.team_performance?.total ?? 0,
        ok_assemblies: dashboard.ok_assemblies ?? 0,
        not_ok_assemblies: dashboard.not_ok ?? 0,
        rework_count: dashboard.reworks_raised ?? 0,
    };

    // -----------------------------
    // 2. OK vs NOT OK Trend
    // -----------------------------
    const okNotOkData = Object.entries(dashboard.ok_notok_trend || {}).map(([date, values]) => ({
        date,
        ok: values.ok_count,
        not_ok: values.not_ok_count
    }));

    // -----------------------------
    // 3. Stage Failure Analysis
    // -----------------------------
    const stageFailureData = (dashboard.stage_failure_analysis || []).map(item => ({
        stage: item.stage_id,
        failures: item.count
    }));

    // -----------------------------
    // 4. Rework Trend (Weekly)
    // -----------------------------
    const reworkTrendData = Object.entries(dashboard.rework_completion_trend || {}).map(([week, total]) => ({
        date: week.replace("_", " "),
        reworks: total
    }));

    // -----------------------------
    // 5. Workplan Summary
    // -----------------------------
    const workplanData = [
        {
            shift: "1st Shift",
            planned: dashboard.workplan_summary.shift_1.workplan,
            completed: dashboard.workplan_summary.shift_1.assembled
        },
        {
            shift: "2nd Shift",
            planned: dashboard.workplan_summary.shift_2.workplan,
            completed: dashboard.workplan_summary.shift_2.assembled
        }
    ];

    // -----------------------------
    // 6. Quality Pie Chart
    // -----------------------------
    const qualityMetrics = [
        { name: "Passed", value: dashboard.this_month_quality.passed_without_fault, color: "#10b981" },
        { name: "Failed", value: dashboard.this_month_quality.assembled_with_fault, color: "#ef4444" },
        { name: "Rework", value: dashboard.this_month_quality.rework, color: "#f59e0b" },
        { name: "Dropped", value: dashboard.this_month_quality.drop, color: "#6b7280" }
    ];

    // -----------------------------
    // 7. Team Performance (Graph)
    // -----------------------------
    const teamPerformance = [
        {
            team: "Yesterday Shift 1",
            productivity: dashboard.team_performance_shift.production.yesterday_shift_1,
            quality: dashboard.team_performance_shift.ok.yesterday_shift_1_ok,
            safety: dashboard.team_performance_shift.not_ok.yesterday_shift_1
        },
        {
            team: "Yesterday Shift 2",
            productivity: dashboard.team_performance_shift.production.yesterday_shift_2,
            quality: dashboard.team_performance_shift.ok.yesterday_shift_2_ok,
            safety: dashboard.team_performance_shift.not_ok.yesterday_shift_2
        },
        {
            team: "Today Shift 1",
            productivity: dashboard.team_performance_shift.production.today_shift_1,
            quality: dashboard.team_performance_shift.ok.today_shift_1_ok,
            safety: dashboard.team_performance_shift.not_ok.today_shift_1
        },
        {
            team: "Today Shift 2",
            productivity: dashboard.team_performance_shift.production.today_shift_2,
            quality: dashboard.team_performance_shift.ok.today_shift_2_ok,
            safety: dashboard.team_performance_shift.not_ok.today_shift_2
        }
    ];

    // -----------------------------
    // 8. Alerts
    // -----------------------------
    const recentAlerts = (dashboard.alerts || []).map((msg, i) => ({
        id: i,
        type: "warning",
        message: msg,
        time: "Just now"
    }));

    // -----------------------------
    // 9. Current Shift
    // -----------------------------
    const currentShift = {
        shift: dashboard.current_shift === "A" ? "Shift 1" : "Shift 2",
        startTime: dashboard.current_shift === "A" ? "06:00" : "14:00",
        endTime: dashboard.current_shift === "A" ? "14:00" : "22:00",
        supervisor: "Assembly Head",
        activeWorkers: 12,
        target: dashboard.workplan_count,
        completed: dashboard.current_shift_made
    };

    const progressPercentage =
        currentShift.target > 0
            ? ((currentShift.completed / currentShift.target) * 100).toFixed(1)
            : 0;

    return (
        <div className="dashboard-wrapper">
            {/* TOP NAVBAR */}
            <Header />

            <main className="dashboard-main">
                {/* CURRENT SHIFT INFO */}
                <div className="shift-banner">
                    <div className="shift-grid">
                        <div>
                            <div className="shift-item-header">
                                <Clock />
                                <span>Current Shift</span>
                            </div>
                            <p className="shift-item-title">{currentShift.shift}</p>
                            <p className="shift-item-subtitle">{currentShift.startTime} - {currentShift.endTime}</p>
                        </div>
                        <div>
                            <div className="shift-item-header">
                                <Users />
                                <span>AssemblyHead</span>
                            </div>
                            <p className="shift-item-title">{currentShift.supervisor}</p>
                            <p className="shift-item-subtitle">{currentShift.activeWorkers} Active Workers</p>
                        </div>
                        <div>
                            <div className="shift-item-header">
                                <Target />
                                <span>Current Progress</span>
                            </div>
                            <p className="shift-item-title">{currentShift.completed} / {currentShift.target}</p>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="shift-item-header">
                                <Activity />
                                <span>Efficiency Rate</span>
                            </div>
                            <p className="shift-item-title">{progressPercentage}%</p>
                            <p className="shift-item-subtitle">
                                {progressPercentage >= 90 ? "Excellent" : progressPercentage >= 75 ? "Good" : "Needs Attention"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* KPI CARDS */}
                <div className="kpi-grid">
                    <div className="kpi-card">
                        <div className="kpi-card-content">
                            <div className="kpi-icon-wrapper">
                                <div className="kpi-icon blue">
                                    <Package />
                                </div>
                            </div>
                            <p className="kpi-label">Total Assemblies</p>
                            <p className="kpi-value">{stats.total_assemblies}</p>
                            <p className="kpi-footer gray">Today's production</p>
                        </div>
                        <div className="kpi-card-border blue"></div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-card-content">
                            <div className="kpi-icon-wrapper">
                                <div className="kpi-icon green">
                                    <CheckCircle2 />
                                </div>
                            </div>
                            <p className="kpi-label">OK Assemblies</p>
                            <p className="kpi-value">{stats.ok_assemblies}</p>
                            <p className="kpi-footer green">✓ Quality passed</p>
                        </div>
                        <div className="kpi-card-border green"></div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-card-content">
                            <div className="kpi-icon-wrapper">
                                <div className="kpi-icon red">
                                    <XCircle />
                                </div>
                            </div>
                            <p className="kpi-label">NOT OK / Dropped</p>
                            <p className="kpi-value">{stats.not_ok_assemblies}</p>
                            <p className="kpi-footer red">✗ Quality failed</p>
                        </div>
                        <div className="kpi-card-border red"></div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-card-content">
                            <div className="kpi-icon-wrapper">
                                <div className="kpi-icon orange">
                                    <RefreshCw />
                                </div>
                            </div>
                            <p className="kpi-label">Reworks Raised</p>
                            <p className="kpi-value">{stats.rework_count}</p>
                            <p className="kpi-footer orange">⟳ Pending rework</p>
                        </div>
                        <div className="kpi-card-border orange"></div>
                    </div>
                </div>

                {/* WORKPLAN & ALERTS ROW */}
                <div className="charts-grid three-col">
                    <div className="chart-card">
                        <div className="chart-header">
                            <Calendar />
                            <h3 className="chart-title">RearFrame Assy Workplan</h3>
                            <span className="chart-subtitle">Daily Overview</span>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={workplanData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="shift" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="planned" name="Planned" fill="#93c5fd" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="completed" name="Completed" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <AlertTriangle />
                            <h3 className="chart-title">Alerts</h3>
                        </div>
                        <div className="alerts-list">
                            {recentAlerts.map(alert => (
                                <div key={alert.id} className={`alert-item ${alert.type}`}>
                                    <p className="alert-message">{alert.message}</p>
                                    <p className="alert-time">{alert.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CHARTS ROW 1 */}
                <div className="charts-grid three-col">
                    <div className="chart-card">
                        <div className="chart-header">
                            <TrendingUp />
                            <h3 className="chart-title">OK vs NOT OK Trend</h3>
                            <span className="chart-subtitle">Last 7 Days</span>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={okNotOkData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="ok" name="OK" fill="#10b981" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="not_ok" name="NOT OK" fill="#ef4444" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <Target />
                            <h3 className="chart-title">This Month Quality Status</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={qualityMetrics}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    dataKey="value"
                                >
                                    {qualityMetrics.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* CHARTS ROW 2 */}
                <div className="charts-grid two-col">
                    <div className="chart-card">
                        <div className="chart-header">
                            <AlertCircle />
                            <h3 className="chart-title">Stage Failure Analysis</h3>
                            <span className="chart-subtitle">Current Month</span>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={stageFailureData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="failures" name="Failures" fill="url(#colorFailures)" radius={[8, 8, 0, 0]} />
                                <defs>
                                    <linearGradient id="colorFailures" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <Users />
                            <h3 className="chart-title">Team Performance</h3>
                            <span className="chart-subtitle">Today</span>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={teamPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="team" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="productivity" name="Planned" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="quality" name="Shift 1" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="safety" name="Shift 2" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* CHARTS ROW 3: Rework Trend */}
                <div className="chart-card">
                    <div className="chart-header">
                        <RefreshCw />
                        <h3 className="chart-title">Rework Trend Analysis</h3>
                        <span className="chart-subtitle">Last 30 Days</span>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={reworkTrendData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="reworks"
                                name="Reworks"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', r: 5 }}
                                activeDot={{ r: 7, fill: '#1d4ed8' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </main>
        </div>
    );
}

export default AssemblyHeadDashboard;