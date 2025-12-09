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
import ProtectedRoute from './components/ProtectedRoute.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<EmpLogin />} />
      <Route path="/stage/:stageId" element={<StagePage />} />

      {/* -----------------------
          ASSEMBLY HEAD PROTECTED ROUTES
         ----------------------- */}
      <Route
        path="/AssemblyHead"
        element={
          <ProtectedRoute allowedRoles={["assemblyHead"]}>
            <AssemblyHeadDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/AssemblyHead/Home"
        element={
          <ProtectedRoute allowedRoles={["assemblyHead"]}>
            <AssemblyHeadDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/AssemblyHead/Summary"
        element={
          <ProtectedRoute allowedRoles={["assemblyHead"]}>
            <AssemblyHeadSummary />
          </ProtectedRoute>
        }
      />

      <Route
        path="/AssemblyHead/Workplan"
        element={
          <ProtectedRoute allowedRoles={["assemblyHead"]}>
            <Workplan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/AssemblyHead/Rework"
        element={
          <ProtectedRoute allowedRoles={["assemblyHead"]}>
            <AssemblyHeadRework />
          </ProtectedRoute>
        }
      />

      {/* -----------------------
          REWORK TEAM PROTECTED ROUTES
         ----------------------- */}
      <Route
        path="/ReworkTeam"
        element={
          <ProtectedRoute allowedRoles={["reworkTeam"]}>
            <ReworkTeamDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ReworkTeam/Home"
        element={
          <ProtectedRoute allowedRoles={["reworkTeam"]}>
            <ReworkTeamDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ReworkTeam/List"
        element={
          <ProtectedRoute allowedRoles={["reworkTeam"]}>
            <ReworkTeamList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rework-team/List"
        element={
          <ProtectedRoute allowedRoles={["reworkTeam"]}>
            <ReworkTeamList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rework-details/:master_id"
        element={
          <ProtectedRoute allowedRoles={["reworkTeam"]}>
            <ReworkTeamDetails />
          </ProtectedRoute>
        }
      />

    </Routes>
  </BrowserRouter>
);
