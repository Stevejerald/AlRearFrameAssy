import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Scanner from "../components/Scanner.jsx";
import stageData from "../data/stageData.json";
import AudioRecorderPopup from "../components/AudioRecorderPopup.jsx";

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
    const [empId, setEmpId] = useState("");

    const isScannerStage = stageId === "1L";

    useEffect(() => {
        loadStageData();
        if (!isScannerStage) fetchAssemblyForStage();
    }, [stageId]);

    useEffect(() => {
        async function fetchEmp() {
            try {
                const res = await fetch(
                    "http://localhost/AlRearFrameAssy/backend/api/getSessionEmpID.php",
                    { credentials: "include" }  // IMPORTANT for PHP sessions
                );

                const data = await res.json();

                if (data.status) {
                    setEmpId(data.emp_id);   // Auto-fill Employee ID input
                }
            } catch (err) {
                console.error("Session fetch failed:", err);
            }
        }

        fetchEmp();
    }, []);


    const fetchAssemblyForStage = async () => {
        const res = await fetch(
            `http://localhost/AlRearFrameAssy/backend/api/getPendingAssembly.php?stage_id=${stageId}`
        );

        const data = await res.json();

        if (data.status) {
            setMasterData(data.master);
            setSequenceId(data.sequence_id);
            setIsDropped(data.master.dropped === 1);

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

    const loadStageData = () => {
        const obj = stageData.find(o => o[String(stageId)]);
        if (obj) setTasks(obj[String(stageId)]);
    };

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

    const handleSubmitStage = async () => {
        if (isDropped) {
            alert("Cannot submit. Assembly is DROPPED.");
            return;
        }

        if (!empId.trim()) {
            alert("Please enter Employee ID!");
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

        if (isScannerStage) {
            const master = JSON.parse(localStorage.getItem("scannerData"));
            master.stage_id = stageId;
            master.emp_id = empId;

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

        const payload = {
            master_id: masterData.id,
            sequence_id: sequenceId,
            stage_id: stageId,
            emp_id: empId,
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
            window.location.reload();
        } else {
            alert("Failed to load next assembly.");
        }
    };

    const completedTasks = Object.keys(selectedButtons).length;
    const totalTasks = tasks.length;
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const styles = {
        pageWrapper: {
            minHeight: '100vh',
            background: '#f8f9fa',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
        container: {
            maxWidth: '1600px',
            margin: '0 auto',
            padding: '2rem'
        },

        // Header Styles
        header: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            padding: '2.5rem 3rem',
            marginBottom: '2rem',
            boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
            position: 'relative',
            overflow: 'hidden'
        },
        headerPattern: {
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '100%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            opacity: 0.3
        },
        headerContent: {
            position: 'relative',
            zIndex: 1
        },
        stageIdBadge: {
            display: 'inline-block',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            padding: '0.5rem 1.5rem',
            borderRadius: '50px',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: '600',
            letterSpacing: '1px',
            marginBottom: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.3)'
        },
        headerTitle: {
            fontSize: '3rem',
            fontWeight: '800',
            color: 'white',
            margin: '0 0 0.5rem 0',
            textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)'
        },
        headerSubtitle: {
            fontSize: '1.25rem',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '400',
            margin: '0'
        },
        empIdContainer: {
            marginTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
        },
        empIdLabel: {
            color: 'white',
            fontSize: '1rem',
            fontWeight: '600',
            minWidth: '120px'
        },
        empIdInput: {
            flex: '1',
            maxWidth: '300px',
            padding: '0.875rem 1.25rem',
            fontSize: '1rem',
            border: '2px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            color: '#ffffff',        // ← text is now clearly visible
            fontWeight: '700',
            outline: 'none',
            transition: 'all 0.3s ease'
        },

        progressContainer: {
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.3)'
        },
        progressLabel: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem',
            color: 'white'
        },
        progressText: {
            fontSize: '0.9rem',
            fontWeight: '600',
            opacity: 0.9
        },
        progressPercentage: {
            fontSize: '1.5rem',
            fontWeight: '700'
        },
        progressBar: {
            height: '12px',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '10px',
            overflow: 'hidden',
            position: 'relative'
        },
        progressFill: {
            height: '100%',
            background: 'linear-gradient(90deg, #10b981, #34d399)',
            borderRadius: '10px',
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            width: `${progressPercentage}%`,
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)'
        },

        // Scanner Section
        scannerSection: {
            marginBottom: '2rem'
        },

        // Tasks Section
        tasksCard: {
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            marginBottom: '2rem'
        },
        tasksHeader: {
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            padding: '1.5rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        tasksTitle: {
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'white',
            margin: 0
        },
        tasksCount: {
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '0.5rem 1rem',
            borderRadius: '50px',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'white'
        },

        // Task Item Styles
        tasksList: {
            padding: '0'
        },
        taskItem: {
            display: 'grid',
            gridTemplateColumns: '80px 1fr auto',
            gap: '2rem',
            padding: '2rem',
            borderBottom: '1px solid #e5e7eb',
            transition: 'all 0.3s ease',
            alignItems: 'center',
            background: 'white'
        },
        taskItemHover: {
            background: 'linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%)',
            transform: 'translateX(4px)'
        },
        taskNumber: {
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: '800',
            color: 'white',
            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
        },
        taskDescription: {
            fontSize: '1.125rem',
            color: '#1f2937',
            fontWeight: '500',
            lineHeight: '1.6'
        },
        taskActions: {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
        },

        // Button Styles
        actionButton: {
            position: 'relative',
            padding: '1rem 2.5rem',
            fontSize: '1rem',
            fontWeight: '700',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            minWidth: '120px',
            overflow: 'hidden'
        },
        yesButton: {
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            color: '#166534',
            border: '2px solid #86efac'
        },
        yesButtonActive: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: '2px solid #059669',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
            transform: 'translateY(-2px)'
        },
        noButton: {
            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            color: '#991b1b',
            border: '2px solid #fca5a5'
        },
        noButtonActive: {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            border: '2px solid #dc2626',
            boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)',
            transform: 'translateY(-2px)'
        },
        audioIndicator: {
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            boxShadow: '0 8px 20px rgba(251, 191, 36, 0.3)'
        },

        // Action Bar
        actionBar: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '2rem',
            flexWrap: 'wrap'
        },
        submitButton: {
            padding: '1.25rem 3.5rem',
            fontSize: '1.125rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
            minWidth: '280px'
        },
        dropButton: {
            padding: '1.25rem 3.5rem',
            fontSize: '1.125rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)',
            minWidth: '280px'
        },

        // Dropped Overlay
        droppedOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(20px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        },
        droppedCard: {
            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
            borderRadius: '24px',
            padding: '4rem',
            textAlign: 'center',
            boxShadow: '0 40px 100px rgba(0, 0, 0, 0.5)',
            border: '2px solid rgba(239, 68, 68, 0.5)',
            maxWidth: '600px'
        },
        droppedIcon: {
            fontSize: '6rem',
            marginBottom: '1.5rem',
            filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.5))'
        },
        droppedTitle: {
            fontSize: '3rem',
            fontWeight: '900',
            color: '#ef4444',
            marginBottom: '1rem',
            textShadow: '0 0 30px rgba(239, 68, 68, 0.5)'
        },
        droppedMessage: {
            fontSize: '1.25rem',
            color: '#9ca3af',
            marginBottom: '3rem'
        },
        nextAssemblyButton: {
            padding: '1.5rem 4rem',
            fontSize: '1.25rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            boxShadow: '0 10px 40px rgba(59, 130, 246, 0.5)'
        }
    };

    const [hoveredTask, setHoveredTask] = useState(null);
    const [hoveredButton, setHoveredButton] = useState({});

    return (
        <div style={styles.pageWrapper}>
            {/* Dropped Overlay */}
            {isDropped && (
                <div style={styles.droppedOverlay}>
                    <div style={styles.droppedCard}>
                        <div style={styles.droppedIcon}>🚫</div>
                        <div style={styles.droppedTitle}>ASSEMBLY DROPPED</div>
                        <div style={styles.droppedMessage}>
                            This assembly has been marked as dropped and cannot be modified
                        </div>
                        <button
                            style={styles.nextAssemblyButton}
                            onClick={handleNextAssembly}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.05) translateY(-4px)';
                                e.target.style.boxShadow = '0 15px 50px rgba(59, 130, 246, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1) translateY(0)';
                                e.target.style.boxShadow = '0 10px 40px rgba(59, 130, 246, 0.5)';
                            }}
                        >
                            ➜ Load Next Assembly
                        </button>
                    </div>
                </div>
            )}

            {showAudioPopup && (
                <AudioRecorderPopup
                    onClose={() => setShowAudioPopup(false)}
                    onSave={handleAudioSave}
                />
            )}

            <div style={styles.container}>
                {/* Header Section */}
                <div style={styles.header}>
                    <div style={styles.headerPattern}></div>
                    <div style={styles.headerContent}>
                        <div style={styles.stageIdBadge}>STAGE {stageId}</div>
                        <h1 style={styles.headerTitle}>Quality Control Certification</h1>
                        <p style={styles.headerSubtitle}>Assembly Line Quality Assurance</p>

                        <div style={styles.empIdContainer}>
                            <label style={styles.empIdLabel}>Employee ID:</label>
                            <input
                                type="text"
                                style={styles.empIdInput}
                                value={empId}
                                onChange={(e) => setEmpId(e.target.value)}
                                placeholder="Enter Employee ID"
                                disabled={isDropped}
                                onFocus={(e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Scanner Section */}
                <div style={styles.scannerSection}>
                    <Scanner readOnly={!isScannerStage} masterData={masterData} />
                </div>

                {/* Tasks Section */}
                <div style={styles.tasksCard}>
                    <div style={styles.tasksHeader}>
                        <h2 style={styles.tasksTitle}>Certification Checklist</h2>
                        <div style={styles.tasksCount}>
                            {completedTasks}/{totalTasks} Completed
                        </div>
                    </div>

                    <div style={styles.tasksList}>
                        {tasks.map((task, index) => (
                            <div
                                key={index}
                                style={{
                                    ...styles.taskItem,
                                    ...(hoveredTask === index ? styles.taskItemHover : {})
                                }}
                                onMouseEnter={() => setHoveredTask(index)}
                                onMouseLeave={() => setHoveredTask(null)}
                            >
                                <div style={styles.taskNumber}>
                                    {task["S No"]}
                                </div>

                                <div style={styles.taskDescription}>
                                    {task["Description"]}
                                </div>

                                <div style={styles.taskActions}>
                                    <button
                                        style={{
                                            ...styles.actionButton,
                                            ...(selectedButtons[index] === "yes"
                                                ? styles.yesButtonActive
                                                : styles.yesButton),
                                            ...(hoveredButton[`yes-${index}`] && selectedButtons[index] !== "yes" ? {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)'
                                            } : {})
                                        }}
                                        onClick={() => handleYesClick(index)}
                                        disabled={isDropped}
                                        onMouseEnter={() => setHoveredButton({ ...hoveredButton, [`yes-${index}`]: true })}
                                        onMouseLeave={() => setHoveredButton({ ...hoveredButton, [`yes-${index}`]: false })}
                                    >
                                        ✓ Yes
                                    </button>

                                    <button
                                        style={{
                                            ...styles.actionButton,
                                            ...(selectedButtons[index] === "no"
                                                ? styles.noButtonActive
                                                : styles.noButton),
                                            ...(hoveredButton[`no-${index}`] && selectedButtons[index] !== "no" ? {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 6px 20px rgba(239, 68, 68, 0.3)'
                                            } : {})
                                        }}
                                        onClick={() => handleNoClick(index)}
                                        disabled={isDropped}
                                        onMouseEnter={() => setHoveredButton({ ...hoveredButton, [`no-${index}`]: true })}
                                        onMouseLeave={() => setHoveredButton({ ...hoveredButton, [`no-${index}`]: false })}
                                    >
                                        ✕ No
                                    </button>

                                    {audioData[index] && (
                                        <div style={styles.audioIndicator}>
                                            🎤
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Bar */}
                {!isDropped && (
                    <div style={styles.actionBar}>
                        <button
                            style={styles.submitButton}
                            onClick={handleSubmitStage}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-4px) scale(1.02)';
                                e.target.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0) scale(1)';
                                e.target.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)';
                            }}
                        >
                            ✓ Submit Certification
                        </button>

                        <button
                            style={styles.dropButton}
                            onClick={handleDropAssy}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-4px) scale(1.02)';
                                e.target.style.boxShadow = '0 15px 40px rgba(239, 68, 68, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0) scale(1)';
                                e.target.style.boxShadow = '0 10px 30px rgba(239, 68, 68, 0.3)';
                            }}
                        >
                            ✕ Drop Assembly
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.05);
                    }
                }

                button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}

export default StagePage;