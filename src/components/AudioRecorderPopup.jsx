import { useState, useRef } from "react";

function AudioRecorderPopup({ onClose, onSave }) {
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState("");
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];

        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = e => {
            audioChunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
            const url = URL.createObjectURL(audioBlob);
            setAudioURL(url);
            onSave(audioBlob); // send recorded file to parent
        };

        mediaRecorderRef.current.start();
        setRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setRecording(false);
    };

    return (
        <div style={overlay}>
            <div style={popup}>
                <h2>Audio Recorder</h2>

                {!recording ? (
                    <button style={btnRecord} onClick={startRecording}>🎤 Start Recording</button>
                ) : (
                    <button style={btnStop} onClick={stopRecording}>⏹ Stop Recording</button>
                )}

                {audioURL && (
                    <div style={{ marginTop: "20px" }}>
                        <audio controls src={audioURL}></audio>
                    </div>
                )}

                <button style={closeBtn} onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

const overlay = {
    position: "fixed",
    top: 0, left: 0,
    width: "100%", height: "100%",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5000
};

const popup = {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    width: "350px",
    textAlign: "center"
};

const btnRecord = {
    padding: "10px 20px",
    background: "#ff5722",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    fontSize: "18px"
};

const btnStop = {
    padding: "10px 20px",
    background: "#e53935",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    fontSize: "18px"
};

const closeBtn = {
    marginTop: "15px",
    padding: "10px 20px",
    background: "#333",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    fontSize: "16px"
};

export default AudioRecorderPopup;
