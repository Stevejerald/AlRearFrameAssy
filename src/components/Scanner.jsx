import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import '../assets/css/form.css';
import SafetyGrid from "./SafetyGrid";
import Logo from '../assets/img/logo.png';
import QrScannerPopup from "./QrScannerPopup";
import { QRCodeCanvas } from "qrcode.react";

function Scanner({ readOnly = false, masterData = null }) {
    const { stageId } = useParams();

    // QR Popup – disabled in readonly mode
    const [showQR, setShowQR] = useState(false);
    const [activePart, setActivePart] = useState("");

    // QR values (editable for 1L, fetched for non-1L)
    const [axleQR, setAxleQR] = useState("");
    const [brakeQR, setBrakeQR] = useState("");
    const [hubQR, setHubQR] = useState("");
    const [absQR, setAbsQR] = useState("");

    // Form inputs
    const [dateShift, setDateShift] = useState("");
    const [axleSerialNo, setAxleSerialNo] = useState("");
    const [axleSpec, setAxleSpec] = useState("");
    const [axleCasingPartNo, setAxleCasingPartNo] = useState("");
    const [brakePartNoLH, setBrakePartNoLH] = useState("");
    const [brakePartNoRH, setBrakePartNoRH] = useState("");
    const [cwpDiffNo, setCwpDiffNo] = useState("");

    /* ---------------------------------------------------
        LOAD READONLY MASTER DATA FOR NON-1L STAGES
    ---------------------------------------------------- */
    useEffect(() => {
        if (readOnly && masterData) {
            setDateShift(masterData.date_shift);
            setAxleSerialNo(masterData.axle_serial_no);
            setAxleSpec(masterData.axle_spec);
            setAxleCasingPartNo(masterData.axle_casing_part_no);
            setBrakePartNoLH(masterData.brake_part_no_lh);
            setBrakePartNoRH(masterData.brake_part_no_rh);
            setCwpDiffNo(masterData.cwp_diff_carrier_no);

            setAxleQR(masterData.axle_qr);
            setBrakeQR(masterData.brake_qr);
            setHubQR(masterData.hub_qr);
            setAbsQR(masterData.abs_qr);
        }
    }, [readOnly, masterData]);


    /* ---------------------------------------------------
        OPEN QR SCANNER (DISABLED IN READONLY)
    ---------------------------------------------------- */
    const openScanner = (part) => {
        if (readOnly) return; // prevent scanner open
        setActivePart(part);
        setShowQR(true);
    };

    const handleQrScan = (value) => {
        if (activePart === "AXLE") setAxleQR(value);
        if (activePart === "BRAKE") setBrakeQR(value);
        if (activePart === "HUB") setHubQR(value);
        if (activePart === "ABS") setAbsQR(value);
        setShowQR(false);
    };

    /* ---------------------------------------------------
        AUTOSAVE ONLY IF NOT READONLY (only 1L)
    ---------------------------------------------------- */
    useEffect(() => {
        if (readOnly) return;

        const saveData = {
            stage_id: stageId,
            dateShift,
            axleSerialNo,
            axleSpec,
            axleCasingPartNo,
            brakePartNoLH,
            brakePartNoRH,
            cwpDiffNo,
            axleQR,
            brakeQR,
            hubQR,
            absQR
        };

        localStorage.setItem("scannerData", JSON.stringify(saveData));
    }, [
        readOnly,
        stageId,
        dateShift,
        axleSerialNo,
        axleSpec,
        axleCasingPartNo,
        brakePartNoLH,
        brakePartNoRH,
        cwpDiffNo,
        axleQR,
        brakeQR,
        hubQR,
        absQR
    ]);

    return (
        <div className="Main">

            {/* QR POPUP */}
            {showQR && !readOnly && (
                <QrScannerPopup
                    onClose={() => setShowQR(false)}
                    onScan={handleQrScan}
                />
            )}

            {/* ----------------- QR SCANNER BLOCK ----------------- */}
            <div className="TopHero">
                <div className="left">

                    {/* AXLE */}
                    <div className="qrbox">
                        <table><tbody>
                            <tr><td><h2>AXLE CASING</h2></td></tr>
                            <tr>
                                <td>
                                    {axleQR ? (
                                        <QRCodeCanvas value={axleQR} size={120} />
                                    ) : !readOnly ? (
                                        <button onClick={() => openScanner("AXLE")}>Scan QR Code</button>
                                    ) : (
                                        <span style={{ color: "#888" }}>No QR</span>
                                    )}
                                </td>
                            </tr>
                        </tbody></table>
                    </div>

                    {/* BRAKE */}
                    <div className="qrbox">
                        <table><tbody>
                            <tr><td><h2>BRAKE ASSY</h2></td></tr>
                            <tr>
                                <td>
                                    {brakeQR ? (
                                        <QRCodeCanvas value={brakeQR} size={120} />
                                    ) : !readOnly ? (
                                        <button onClick={() => openScanner("BRAKE")}>Scan QR Code</button>
                                    ) : (
                                        <span style={{ color: "#888" }}>No QR</span>
                                    )}
                                </td>
                            </tr>
                        </tbody></table>
                    </div>

                    {/* HUB */}
                    <div className="qrbox">
                        <table><tbody>
                            <tr><td><h2>HUB</h2></td></tr>
                            <tr>
                                <td>
                                    {hubQR ? (
                                        <QRCodeCanvas value={hubQR} size={120} />
                                    ) : !readOnly ? (
                                        <button onClick={() => openScanner("HUB")}>Scan QR Code</button>
                                    ) : (
                                        <span style={{ color: "#888" }}>No QR</span>
                                    )}
                                </td>
                            </tr>
                        </tbody></table>
                    </div>

                    {/* ABS */}
                    <div className="qrbox">
                        <table><tbody>
                            <tr><td><h2>ABS</h2></td></tr>
                            <tr>
                                <td>
                                    {absQR ? (
                                        <QRCodeCanvas value={absQR} size={120} />
                                    ) : !readOnly ? (
                                        <button onClick={() => openScanner("ABS")}>Scan QR Code</button>
                                    ) : (
                                        <span style={{ color: "#888" }}>No QR</span>
                                    )}
                                </td>
                            </tr>
                        </tbody></table>
                    </div>

                </div>

                {/* RIGHT SECTION */}
                <div className="right">
                    <img src={Logo} alt="" className="allogo" />
                    <h3>தனிப்பட்ட <br /> பாதுகாப்பு உபகரணங்கள்</h3>
                    <SafetyGrid />
                </div>
            </div>

            {/* ----------------- FORM SECTION ----------------- */}

            <div className="middle">
                <h1 className="infobar">
                    பின் அச்சு அசெம்பிளி சுயச் சான்றிதழ் / செயல்முறை கட்டுப்பாட்டுத் தாள்
                </h1>
            </div>

            <div className="divider">
                <div className="leftbox">
                    <table className="info-table">
                        <tbody>

                            {/* DATE SHIFT */}
                            <tr>
                                <td className="label-cell">தேதி மற்றும் ஷிப்ட்</td>
                                <td className="input-cell" colSpan={2}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={dateShift}
                                        disabled={readOnly}
                                        onChange={(e) => setDateShift(e.target.value)}
                                    />
                                </td>
                            </tr>

                            {/* AXLE SERIAL */}
                            <tr>
                                <td className="label-cell">ஆக்ஸ்ல் வரிசை எண்:</td>
                                <td className="input-cell" colSpan={2}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={axleSerialNo}
                                        disabled={readOnly}
                                        onChange={(e) => setAxleSerialNo(e.target.value)}
                                    />
                                </td>
                            </tr>

                            {/* AXLE SPEC */}
                            <tr>
                                <td className="label-cell">ஆக்ஸ்ல் ஸ்பெக் :</td>
                                <td className="input-cell" colSpan={2}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={axleSpec}
                                        disabled={readOnly}
                                        onChange={(e) => setAxleSpec(e.target.value)}
                                    />
                                </td>
                            </tr>

                            {/* CASING NO */}
                            <tr>
                                <td className="label-cell">ஆக்ஸல் கேசிங் பகுதி எண்:</td>
                                <td className="input-cell" colSpan={2}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={axleCasingPartNo}
                                        disabled={readOnly}
                                        onChange={(e) => setAxleCasingPartNo(e.target.value)}
                                    />
                                </td>
                            </tr>

                            {/* BRAKE */}
                            <tr>
                                <td className="label-cell">பிரேக் பார்ட் எண்:</td>

                                <td className="input-cell split-cell">
                                    <span className="prefix">LH</span>
                                    <input
                                        type="text"
                                        className="form-input small-input"
                                        value={brakePartNoLH}
                                        disabled={readOnly}
                                        onChange={(e) => setBrakePartNoLH(e.target.value)}
                                    />
                                </td>

                                <td className="input-cell split-cell">
                                    <span className="prefix">R.H.</span>
                                    <input
                                        type="text"
                                        className="form-input small-input"
                                        value={brakePartNoRH}
                                        disabled={readOnly}
                                        onChange={(e) => setBrakePartNoRH(e.target.value)}
                                    />
                                </td>
                            </tr>

                            {/* CWP DIFF */}
                            <tr>
                                <td className="label-cell">CWP / DIFF கேரியர் எண்:</td>
                                <td className="input-cell" colSpan={2}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={cwpDiffNo}
                                        disabled={readOnly}
                                        onChange={(e) => setCwpDiffNo(e.target.value)}
                                    />
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>

                {/* RIGHT BOX WITH ICONS */}
                <div className="rightbox">
                    <div className="special-features-header">சிறப்பு இயல்புகள்</div>

                    <table className="features-table">
                        <tbody>
                            <tr><td className="icon-cell"><div className="icon-circle s-icon">S</div></td><td>பாதுகாப்பு</td></tr>
                            <tr><td className="icon-cell"><div className="icon-circle c-icon">C</div></td><td>முக்கியமான</td></tr>
                            <tr><td className="icon-cell"><div className="icon-circle p-icon">P</div></td><td>முக்கிய செயல்முறை</td></tr>
                            <tr><td className="icon-cell"><div className="icon-circle i-icon">I</div></td><td>முக்கியமானது</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default Scanner;
