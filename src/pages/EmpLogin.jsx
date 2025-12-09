import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QrScannerPopup from "../components/QrScannerPopup"; // make sure path is correct

function EmpLogin() {
  const [empId, setEmpId] = useState("");
  const [showScanner, setShowScanner] = useState(false); // NEW
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (empId.trim() === "") {
      alert("Please enter Employee ID");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost/AlRearFrameAssy/backend/api/getStage.php?emp_id=${empId}`
      );
      const data = await res.json();

      if (!data.status) {
        alert(data.message);
        return;
      }

      // Redirect user to specific stage
      navigate(`/stage/${data.stage}`);
    } catch (error) {
      console.error(error);
      alert("Server error. Please try again.");
    }
  };

  // 🔹 When QR is scanned successfully (NO CHANGE TO LOGIN LOGIC)
  const handleQrScan = (value) => {
    setShowScanner(false);
    setEmpId(value);  // Autofill
    handleSubmit();   // Use your SAME logic
  };

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h2>Self Certification – Employee Login</h2>

      <input
        type="text"
        placeholder="Enter Employee ID"
        value={empId}
        onChange={(e) => setEmpId(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "18px",
          width: "250px",
          marginRight: "10px",
        }}
      />

      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Enter
      </button>

      {/* 🚀 QR Code Button */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setShowScanner(true)}
          style={{
            padding: "10px 20px",
            fontSize: "18px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "6px",
          }}
        >
          📷 Scan QR Code
        </button>
      </div>

      {/* 🚀 QR Scanner Popup */}
      {showScanner && (
        <QrScannerPopup
          onClose={() => setShowScanner(false)}
          onScan={handleQrScan}
        />
      )}
    </div>
  );
}

export default EmpLogin;
