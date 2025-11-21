import React, { useEffect, useState } from "react";
import "../assets/css/AssemblyHeadSummary.css";

function AssemblyHeadSummary() {
    const [selectedDate, setSelectedDate] = useState("");
    const [summary, setSummary] = useState([]);

    // store audio per-row
    const [rowAudio, setRowAudio] = useState({});

    useEffect(() => {
        if (selectedDate !== "") fetchSummary();
    }, [selectedDate]);

    /* ---------------------------------------------------
       FETCH SUMMARY BY DATE
    ---------------------------------------------------- */
    const fetchSummary = async () => {
        const res = await fetch(
            `http://localhost/AlRearFrameAssy/backend/api/getSummary.php?date=${selectedDate}`
        );

        const data = await res.json();

        if (data.status && Array.isArray(data.data)) {
            setSummary(data.data);
            setRowAudio({}); // reset audio players
        } else {
            setSummary([]);
            setRowAudio({});
        }
    };

    /* ---------------------------------------------------
       FETCH AUDIO FOR A ROW
    ---------------------------------------------------- */
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
            fetchSummary(); // refresh table
        }
    };

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

            {/* TABLE */}
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

                            const isOK = row.status.includes("OK");

                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{row.axle_serial_no}</td>
                                    <td>{row.date}</td>

                                    <td className={isOK ? "status-ok" : "status-not"}>
                                        {row.status}
                                    </td>

                                    <td>
                                        {row.rework_status === "CLEAR" ? (
                                            <span className="ok-badge">CLEAR</span>
                                        ) : (
                                            <span className="rework-badge">PENDING</span>
                                        )}
                                    </td>

                                    {/* AUDIO COLUMN */}
                                    <td>
                                        {row.audio ? (
                                            rowAudio[row.master_id] ? (
                                                <audio
                                                    controls
                                                    src={rowAudio[row.master_id]}
                                                    style={{ width: "180px" }}
                                                ></audio>
                                            ) : (
                                                <button
                                                    className="audio-btn"
                                                    onClick={() => loadAudio(row.master_id)}
                                                >
                                                    🎧 View Audio
                                                </button>
                                            )
                                        ) : (
                                            "-"
                                        )}
                                    </td>

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
