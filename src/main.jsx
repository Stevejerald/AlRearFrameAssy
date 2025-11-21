import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EmpLogin from './pages/EmpLogin.jsx';
import StagePage from './pages/StagePage.jsx';

import AssemblyHeadSummary from './pages/AssemblyHeadSummary.jsx';





ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<EmpLogin />} />
      <Route path="/stage/:stageId" element={<StagePage />} />
      <Route path="/AssemblyHeadSummary" element={<AssemblyHeadSummary />} />



    </Routes>
  </BrowserRouter>
);
