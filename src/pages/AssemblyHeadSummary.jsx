import React, { useEffect, useState } from "react";
import "../assets/css/AssemblyHeadSummary.css";

function AssemblyHeadSummary() {
    const [selectedDate, setSelectedDate] = useState("");
    const [summary, setSummary] = useState([]);

    useEffect(() => {
        if (selectedDate !== "") {
            fetchSummary();
        }
    }, [selectedDate]);

    /* ---------------------------------------------------
       FETCH SUMMARY BY DATE
    ---------------------------------------------------- */
    const fetchSummary = async () => {
        const res = await fetch(
            `http://localhost/AlRearFrameAssy/backend/api/getSummary.php?date=${selectedDate}`
        );

        const data = await res.json();
        if (data.status) {
            setSummary(data.records);
        } else {
            setSummary([]);
        }
    };

    /* ---------------------------------------------------
       SEND TO REWORK ACTION
    ---------------------------------------------------- */
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

    /* ---------------------------------------------------
       UI
    ---------------------------------------------------- */
    return (
        <div className="ahs-main">

            <h1 className="ahs-title">Assembly Summary</h1>

            {/* DATE FILTER */}
            <div className="ahs-filter">
                <label>Select Date: </label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            {/* SUMMARY TABLE */}
            <table className="ahs-table">
                <thead>
                    <tr>
                        <th>SL No</th>
                        <th>Axle Serial No</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Rework Status</th>
                        <th>Audio</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {summary.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="no-data">
                                No records found
                            </td>
                        </tr>
                    ) : (
                        summary.map((row, index) => {
                            const isOK = row.all_stages_ok === 1;
                            const statusText = isOK ? "OK" : `NOT OK (${row.failed_stage})`;

                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{row.axle_serial_no}</td>
                                    <td>{row.date_shift}</td>

                                    {/* STATUS */}
                                    <td className={isOK ? "status-ok" : "status-not"}>
                                        {statusText}
                                    </td>

                                    {/* REWORK STATUS */}
                                    <td>
                                        {row.rework === 1 ? (
                                            <span className="rework-badge">REWORK</span>
                                        ) : (
                                            <span className="ok-badge">CLEAR</span>
                                        )}
                                    </td>

                                    {/* AUDIO FILE */}
                                    <td>
                                        {row.audio_present === 1 ? (
                                            <button
                                                className="audio-btn"
                                                onClick={() => new Audio(row.audio_url).play()}
                                            >
                                                🔊 Play
                                            </button>
                                        ) : (
                                            "-"
                                        )}
                                    </td>

                                    {/* SEND TO REWORK */}
                                    <td>
                                        <button
                                            className="rework-btn"
                                            onClick={() => sendToRework(row.master_id)}
                                        >
                                            Send to Rework
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default AssemblyHeadSummary;
