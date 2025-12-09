import React, { useState } from 'react';
import '../assets/css/rework.css';

const Rework = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState([
    { id: 1, engineNo: 'ABCD1234', uploadDate: '2024/10/03' },
    { id: 2, engineNo: 'MFDS1234', uploadDate: '2024/10/03' },
    { id: 3, engineNo: '121dde', uploadDate: '2024/10/03' },
    { id: 4, engineNo: 'DAYE7364', uploadDate: '2024/10/05' }
  ]);

  const [allData] = useState([
    { id: 1, engineNo: 'ABCD1234', uploadDate: '2024/10/03' },
    { id: 2, engineNo: 'MFDS1234', uploadDate: '2024/10/03' },
    { id: 3, engineNo: '121dde', uploadDate: '2024/10/03' },
    { id: 4, engineNo: 'DAYE7364', uploadDate: '2024/10/05' }
  ]);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredData(allData);
      return;
    }

    const filtered = allData.filter(item => {
      const uploadDate = new Date(item.uploadDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        return uploadDate >= start && uploadDate <= end;
      } else if (start) {
        return uploadDate >= start;
      } else if (end) {
        return uploadDate <= end;
      }
      return true;
    });

    setFilteredData(filtered);
  };

  const handleRework = (engineNo) => {
    alert(Rework initiated for Engine: ${engineNo});
  };

  return (
    <div className="rework-container">
      <div className="rework-header">
        <h1 className="rework-title">Engine Rework Audio Overview</h1>
        
        <div className="filter-section">
          <div className="date-filter">
            <label htmlFor="start-date">Start Date:</label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
            />
          </div>

          <div className="date-filter">
            <label htmlFor="end-date">End Date:</label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
            />
          </div>

          <button onClick={handleFilter} className="filter-btn">
            Filter
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="rework-table">
          <thead>
            <tr>
              <th>Serial Number</th>
              <th>Engine No</th>
              <th>Upload Date</th>
              <th>Rework</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.engineNo}</td>
                  <td>{item.uploadDate}</td>
                  <td>
                    <button
                      onClick={() => handleRework(item.engineNo)}
                      className="rework-btn"
                    >
                      Rework
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">
                  No data found for the selected date range
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="rework-footer">
        © 2024 Engine Rework Audio Overview
      </footer>
    </div>
  );
};

export default Rework;