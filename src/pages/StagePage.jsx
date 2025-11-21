import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Scanner from "../components/Scanner.jsx";
import stageData from "../data/stageData.json";
import AudioRecorderPopup from "../components/AudioRecorderPopup.jsx";
import '../assets/css/StagePage.css';

function StagePage() {
    const { stageId } = useParams();

    const [tasks, setTasks] = useState([]);
    const [showAudioPopup, setShowAudioPopup] = useState(false);
    const [activeTask, setActiveTask] = useState(null);
    const [audioData, setAudioData] = useState({});
    const [selectedButtons, setSelectedButtons] = useState({});
    const [masterData, setMasterData] = useState(null);
    const [sequenceId, setSequenceId] = useState(null);
    const [isDropped, setIsDropped] = useState(false);

    const isScannerStage = stageId === "1L";

    useEffect(() => {
        loadStageData();
        if (!isScannerStage) fetchAssemblyForStage();
    }, [stageId]);

    /* ---------------------------------------------------
       FETCH PENDING ASSEMBLY FOR NON-1L
    ---------------------------------------------------- */
    const fetchAssemblyForStage = async () => {
        const res = await fetch(
            `http://localhost/AlRearFrameAssy/backend/api/getPendingAssembly.php?stage_id=${stageId}`
        );

        const data = await res.json();

        if (data.status) {
            setMasterData(data.master);
            setSequenceId(data.sequence_id);
            setIsDropped(data.master.dropped === 1);

            // save master data in localStorage for NO-Scanner submit logic
            localStorage.setItem("scannerData", JSON.stringify({
                stage_id: stageId,
                dateShift: data.master.date_shift,
                axleSerialNo: data.master.axle_serial_no,
                axleSpec: data.master.axle_spec,
                axleCasingPartNo: data.master.axle_casing_part_no,
                brakePartNoLH: data.master.brake_part_no_lh,
                brakePartNoRH: data.master.brake_part_no_rh,
                cwpDiffNo: data.master.cwp_diff_carrier_no,
                axleQR: data.master.axle_qr,
                brakeQR: data.master.brake_qr,
                hubQR: data.master.hub_qr,
                absQR: data.master.abs_qr
            }));
        } else {
            alert("No pending assembly found!");
        }
    };

    /* ---------------------------------------------------
       LOAD TASKS FROM JSON
    ---------------------------------------------------- */
    const loadStageData = () => {
        const obj = stageData.find(o => o[String(stageId)]);
        if (obj) setTasks(obj[String(stageId)]);
    };

    /* ---------------------------------------------------
       YES / NO LOGIC
    ---------------------------------------------------- */
    const handleYesClick = (i) => {
        if (isDropped) return;
        setSelectedButtons(prev => ({
            ...prev,
            [i]: prev[i] === "yes" ? null : "yes"
        }));
    };

    const handleNoClick = (i) => {
        if (isDropped) return;

        const isAlreadyNo = selectedButtons[i] === "no";

        setSelectedButtons(prev => ({
            ...prev,
            [i]: isAlreadyNo ? null : "no"
        }));

        if (!isAlreadyNo) {
            setActiveTask(i);
            setShowAudioPopup(true);
        }
    };

    const handleAudioSave = (audioBlob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setAudioData(prev => ({
                ...prev,
                [activeTask]: reader.result
            }));
        };
        reader.readAsDataURL(audioBlob);
    };

    /* ---------------------------------------------------
       SUBMIT STAGE
    ---------------------------------------------------- */
    const handleSubmitStage = async () => {
        if (isDropped) {
            alert("Cannot submit. Assembly is DROPPED.");
            return;
        }

        const missing = tasks.find((_, i) => !selectedButtons[i]);
        if (missing) {
            alert("Answer YES/NO for all tasks!");
            return;
        }

        const stagePayload = tasks.map((t, i) => ({
            task_no: t["S No"],
            description: t["Description"],
            status: selectedButtons[i],
            audio: audioData[i] || null
        }));

        /* -------- 1L -> uses scanner data and submitStage.php -------- */
        if (isScannerStage) {
            const master = JSON.parse(localStorage.getItem("scannerData"));
            master.stage_id = stageId;

            const payload = { master, stage: stagePayload };

            const res = await fetch(
                "http://localhost/AlRearFrameAssy/backend/api/submitStage.php",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                }
            );

            const data = await res.json();

            if (data.status) {
                localStorage.removeItem("scannerData");
                alert("Stage submitted!");
                window.location.reload();
            }

            return;
        }

        /* ---------------- NON 1L ---------------- */
        const payload = {
            master_id: masterData.id,
            sequence_id: sequenceId,
            stage_id: stageId,
            stage: stagePayload
        };

        const res = await fetch(
            "http://localhost/AlRearFrameAssy/backend/api/submitStageNoScanner.php",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }
        );

        const data = await res.json();

        if (data.status) {
            alert("Stage saved!");
            window.location.reload();
        }
    };

    /* ---------------------------------------------------
       DROP ASSEMBLY
    ---------------------------------------------------- */
    const handleDropAssy = async () => {
        if (isDropped) return;

        if (!window.confirm("Are you sure you want to DROP this assembly?"))
            return;

        const res = await fetch(
            "http://localhost/AlRearFrameAssy/backend/api/dropAssembly.php",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sequence_id: sequenceId })
            }
        );

        const data = await res.json();

        if (data.status) {
            alert("Assembly DROPPED.");
            setIsDropped(true);
        }
    };

    /* ---------------------------------------------------
       NEXT ASSEMBLY (processed = 1)
    ---------------------------------------------------- */
    const handleNextAssembly = async () => {
        if (!sequenceId) {
            alert("Sequence ID missing!");
            return;
        }

        const res = await fetch(
            "http://localhost/AlRearFrameAssy/backend/api/markSequenceProcessed.php",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sequence_id: sequenceId })
            }
        );

        const data = await res.json();

        if (data.status) {
            window.location.reload(); // load next pending
        } else {
            alert("Failed to load next assembly.");
        }
    };

    /* ---------------------------------------------------
       RENDER UI
    ---------------------------------------------------- */
    return (
        <div className="Main">

            {/* 🔥 DROPPED OVERLAY (BLOCKS UI) */}
            {isDropped && (
                <div className="dropped-overlay">
                    🚫 ASSEMBLY DROPPED 🚫

                    <button
                        className="next-assy-btn"
                        onClick={handleNextAssembly}
                        style={{
                            marginTop: "20px",
                            padding: "12px 25px",
                            fontSize: "20px",
                            background: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer"
                        }}
                    >
                        ➜ Next Assembly
                    </button>
                </div>
            )}

            {showAudioPopup && (
                <AudioRecorderPopup
                    onClose={() => setShowAudioPopup(false)}
                    onSave={handleAudioSave}
                />
            )}

            <Scanner readOnly={!isScannerStage} masterData={masterData} />

            {/* YES/NO TABLE */}
            <div className="stage-form">
                <table className="stage-table">
                    <thead>
                        <tr>
                            <th>S No</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tasks.map((task, index) => (
                            <tr key={index}>
                                <td>{task["S No"]}</td>
                                <td>{task["Description"]}</td>
                                <td>
                                    <button
                                        className={`yes-btn ${selectedButtons[index] === "yes" ? "selected" : ""}`}
                                        onClick={() => handleYesClick(index)}
                                        disabled={isDropped}
                                    >
                                        YES
                                    </button>

                                    <button
                                        className={`no-btn ${selectedButtons[index] === "no" ? "selected" : ""}`}
                                        onClick={() => handleNoClick(index)}
                                        disabled={isDropped}
                                    >
                                        NO
                                    </button>

                                    {audioData[index] && (
                                        <span style={{ color: "red" }}>🎤</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* SUBMIT + DROP BUTTONS */}
            {!isDropped && (
                <div className="submit-container">
                    <button className="submit-btn" onClick={handleSubmitStage}>
                        Submit Self Certification
                    </button>

                    <button
                        className="drop-btn"
                        onClick={handleDropAssy}
                        style={{ marginLeft: "20px", background: "red" }}
                    >
                        Drop Assy
                    </button>
                </div>
            )}
        </div>
    );
}

export default StagePage;
