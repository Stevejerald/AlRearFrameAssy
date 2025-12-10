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

    // -----------------------------------
    // STATIC SAMPLE DATA (NO API CALL)
    // -----------------------------------
    const sampleDashboardData = {
        team_performance: { total: 120 },
        ok_assemblies: 87,
        not_ok: 12,
        reworks_raised: 5,

        ok_notok_trend: {
            "2025-01-01": { ok_count: 10, not_ok_count: 2 },
            "2025-01-02": { ok_count: 14, not_ok_count: 1 },
            "2025-01-03": { ok_count: 12, not_ok_count: 3 },
            "2025-01-04": { ok_count: 15, not_ok_count: 2 },
            "2025-01-05": { ok_count: 11, not_ok_count: 1 },
            "2025-01-06": { ok_count: 16, not_ok_count: 4 },
        },

        stage_failure_analysis: [
            { stage_id: "STG-1", count: 4 },
            { stage_id: "STG-2", count: 7 },
            { stage_id: "STG-3", count: 3 }
        ],

        rework_completion_trend: {
            Week_1: 5,
            Week_2: 8,
            Week_3: 3,
            Week_4: 7
        },

        workplan_summary: {
            shift_1: { workplan: 50, assembled: 40 },
            shift_2: { workplan: 60, assembled: 55 }
        },

        this_month_quality: {
            passed_without_fault: 80,
            assembled_with_fault: 10,
            rework: 6,
            drop: 4
        },

        team_performance_shift: {
            production: {
                yesterday_shift_1: 40,
                yesterday_shift_2: 35,
                today_shift_1: 45,
                today_shift_2: 38
            },
            ok: {
                yesterday_shift_1_ok: 36,
                yesterday_shift_2_ok: 31,
                today_shift_1_ok: 40,
                today_shift_2_ok: 34
            },
            not_ok: {
                yesterday_shift_1: 4,
                yesterday_shift_2: 4,
                today_shift_1: 5,
                today_shift_2: 4
            }
        },

        alerts: [
            "High rejection at Stage 2",
            "Delay in workplan Shift 1",
            "Rework pending from yesterday"
        ],

        current_shift: "A",
        workplan_count: 100,
        current_shift_made: 60
    };

    const dashboard = sampleDashboardData;

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
                    <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                        {label}
                    </p>
                    {payload.map((entry, index) => (
                        <p key={index}>
                            {entry.name}: <b>{entry.value}</b>
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
        total_assemblies: dashboard.team_performance.total,
        ok_assemblies: dashboard.ok_assemblies,
        not_ok_assemblies: dashboard.not_ok,
        rework_count: dashboard.reworks_raised,
    };

    // -----------------------------
    // 2. OK vs NOT OK Trend
    // -----------------------------
    const okNotOkData = Object.entries(dashboard.ok_notok_trend).map(([date, values]) => ({
        date,
        ok: values.ok_count,
        not_ok: values.not_ok_count
    }));

    // -----------------------------
    // 3. Stage Failure Analysis
    // -----------------------------
    const stageFailureData = dashboard.stage_failure_analysis.map(item => ({
        stage: item.stage_id,
        failures: item.count
    }));

    // -----------------------------
    // 4. Rework Trend
    // -----------------------------
    const reworkTrendData = Object.entries(dashboard.rework_completion_trend).map(([week, total]) => ({
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
    // 7. Team Performance Graph
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
    const recentAlerts = dashboard.alerts.map((msg, i) => ({
        id: i,
        type: "warning",
        message: msg,
        time: "Just now"
    }));

    // -----------------------------
    // 9. Current Shift & Progress
    // -----------------------------
    const currentShift = {
        shift: dashboard.current_shift === "A" ? "Shift 1" : "Shift 2",
        startTime: "06:00",
        endTime: "14:00",
        supervisor: "Assembly Head",
        activeWorkers: 12,
        target: dashboard.workplan_count,
        completed: dashboard.current_shift_made
    };

    const progressPercentage =
        currentShift.target > 0
            ? ((currentShift.completed / currentShift.target) * 100).toFixed(1)
            : 0;

    // -----------------------------------
    // UI Rendering (unchanged)
    // -----------------------------------
    return (
        <div className="dashboard-wrapper">
            <Header />

            {/* SAME UI AS BEFORE */}
            {/* 🟢 Everything below is unchanged UI */}
            {/* 🟢 Only the data above changed */}

            <main className="dashboard-main">

                {/* SHIFT BANNER */}
                <div className="shift-banner">
                    <div className="shift-grid">
                        <div>
                            <div className="shift-item-header"><Clock /><span>Current Shift</span></div>
                            <p className="shift-item-title">{currentShift.shift}</p>
                            <p className="shift-item-subtitle">{currentShift.startTime} - {currentShift.endTime}</p>
                        </div>

                        <div>
                            <div className="shift-item-header"><Users /><span>AssemblyHead</span></div>
                            <p className="shift-item-title">{currentShift.supervisor}</p>
                            <p className="shift-item-subtitle">{currentShift.activeWorkers} Active Workers</p>
                        </div>

                        <div>
                            <div className="shift-item-header"><Target /><span>Current Progress</span></div>
                            <p className="shift-item-title">{currentShift.completed} / {currentShift.target}</p>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="shift-item-header"><Activity /><span>Efficiency Rate</span></div>
                            <p className="shift-item-title">{progressPercentage}%</p>
                            <p className="shift-item-subtitle">
                                {progressPercentage >= 90 ? "Excellent" :
                                    progressPercentage >= 75 ? "Good" :
                                        "Needs Attention"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* KPI CARDS */}
                <div className="kpi-grid">
                    <div className="kpi-card"><div className="kpi-card-content">
                        <div className="kpi-icon-wrapper"><div className="kpi-icon blue"><Package /></div></div>
                        <p className="kpi-label">Total Assemblies</p>
                        <p className="kpi-value">{stats.total_assemblies}</p>
                        <p className="kpi-footer gray">Today's production</p>
                    </div></div>

                    <div className="kpi-card"><div className="kpi-card-content">
                        <div className="kpi-icon-wrapper"><div className="kpi-icon green"><CheckCircle2 /></div></div>
                        <p className="kpi-label">OK Assemblies</p>
                        <p className="kpi-value">{stats.ok_assemblies}</p>
                        <p className="kpi-footer green">✓ Quality passed</p>
                    </div></div>

                    <div className="kpi-card"><div className="kpi-card-content">
                        <div className="kpi-icon-wrapper"><div className="kpi-icon red"><XCircle /></div></div>
                        <p className="kpi-label">NOT OK / Dropped</p>
                        <p className="kpi-value">{stats.not_ok_assemblies}</p>
                        <p className="kpi-footer red">✗ Quality failed</p>
                    </div></div>

                    <div className="kpi-card"><div className="kpi-card-content">
                        <div className="kpi-icon-wrapper"><div className="kpi-icon orange"><RefreshCw /></div></div>
                        <p className="kpi-label">Reworks Raised</p>
                        <p className="kpi-value">{stats.rework_count}</p>
                        <p className="kpi-footer orange">⟳ Pending rework</p>
                    </div></div>
                </div>

                {/* WORKPLAN, ALERTS */}
                <div className="charts-grid three-col">
                    <div className="chart-card">
                        <div className="chart-header"><Calendar /><h3>RearFrame Assy Workplan</h3></div>

                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={workplanData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="shift" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="planned" fill="#93c5fd" />
                                <Bar dataKey="completed" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header"><AlertTriangle /><h3>Alerts</h3></div>
                        <div className="alerts-list">
                            {recentAlerts.map(alert => (
                                <div key={alert.id} className="alert-item warning">
                                    <p className="alert-message">{alert.message}</p>
                                    <p className="alert-time">{alert.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* OK vs NOT OK Trend */}
                <div className="charts-grid two-col">
                    <div className="chart-card">
                        <div className="chart-header"><TrendingUp /><h3>OK vs NOT OK Trend</h3></div>

                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={okNotOkData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="ok" fill="#10b981" />
                                <Bar dataKey="not_ok" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* PIE CHART */}
                    <div className="chart-card">
                        <div className="chart-header"><Target /><h3>Quality Status</h3></div>

                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie
                                    data={qualityMetrics}
                                    outerRadius={80}
                                    dataKey="value"
                                    label
                                >
                                    {qualityMetrics.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Stage Failure + Team Performance */}
                <div className="charts-grid two-col">
                    <div className="chart-card">
                        <div className="chart-header"><AlertCircle /><h3>Stage Failures</h3></div>

                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={stageFailureData}>
                                <XAxis dataKey="stage" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="failures" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header"><Users /><h3>Team Performance</h3></div>

                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={teamPerformance}>
                                <XAxis dataKey="team" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="productivity" fill="#3b82f6" />
                                <Bar dataKey="quality" fill="#10b981" />
                                <Bar dataKey="safety" fill="#f59e0b" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* REWORK TREND */}
                <div className="chart-card">
                    <div className="chart-header"><RefreshCw /><h3>Rework Trend</h3></div>

                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={reworkTrendData}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Line dataKey="reworks" stroke="#3b82f6" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </main>
        </div>
    );
}

export default AssemblyHeadDashboard;
