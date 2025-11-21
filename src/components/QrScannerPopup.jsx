import { useEffect, useRef } from "react";
import jsQR from "jsqr";

function QrScannerPopup({ onClose, onScan }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    startCamera();
    return stopCamera;
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });

      videoRef.current.srcObject = stream;
      videoRef.current.setAttribute("playsinline", true);
      videoRef.current.play();

      requestAnimationFrame(scanFrame);
    } catch (e) {
      console.error("Camera error:", e);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const scanFrame = () => {
    if (!videoRef.current || videoRef.current.readyState !== 4) {
      return requestAnimationFrame(scanFrame);
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code?.data) {
      stopCamera();
      onScan(code.data);
      return;
    }

    requestAnimationFrame(scanFrame);
  };

  return (
    <div style={overlay}>
      <div style={popup}>
        <h2>Scan QR Code</h2>
        <video ref={videoRef} style={{ width: "100%" }} />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <button style={closeBtn} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  top: 0, left: 0,
  width: "100%", height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 3000
};

const popup = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  width: "350px",
  textAlign: "center"
};

const closeBtn = {
  padding: "10px 15px",
  fontSize: "16px",
  marginTop: "10px"
};

export default QrScannerPopup;
