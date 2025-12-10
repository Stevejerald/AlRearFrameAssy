import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import EmpLogin from './pages/EmpLogin.jsx';
import StagePage from './pages/StagePage.jsx';

import AssemblyHeadSummary from './pages/AssemblyHeadSummary.jsx';
import AssemblyHeadDashboard from './pages/AssemblyHeadDashboard.jsx';
import Workplan from './pages/Workplan.jsx';
import AssemblyHeadRework from './pages/AssemblyHeadRework.jsx';

import ReworkTeamDashboard from './pages/ReworkTeamDashboard.jsx';
import ReworkTeamList from './pages/ReworkTeamList.jsx';
import ReworkTeamDetails from './pages/ReworkTeamDetails.jsx';

import Login from './pages/Login.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<EmpLogin />} />
      <Route path="/stage/:stageId" element={<StagePage />} />

      {/* ASSEMBLY HEAD ROUTES */}
      <Route path="/AssemblyHead" element={<AssemblyHeadDashboard />} />
      <Route path="/AssemblyHead/Home" element={<AssemblyHeadDashboard />} />
      <Route path="/AssemblyHead/Summary" element={<AssemblyHeadSummary />} />
      <Route path="/AssemblyHead/Workplan" element={<Workplan />} />
      <Route path="/AssemblyHead/Rework" element={<AssemblyHeadRework />} />

      {/* REWORK TEAM ROUTES */}
      <Route path="/ReworkTeam" element={<ReworkTeamDashboard />} />
      <Route path="/ReworkTeam/Home" element={<ReworkTeamDashboard />} />
      <Route path="/ReworkTeam/List" element={<ReworkTeamList />} />
      <Route path="/rework-team/List" element={<ReworkTeamList />} />
      <Route path="/rework-details/:master_id" element={<ReworkTeamDetails />} />

    </Routes>
  </BrowserRouter>
);
