// src/router/AppRouter.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { DashboardPage } from "../pages/DashboardPage";
import { IssueCertificatePage } from "../pages/IssueCertificatePage";
import { ViewCertificatePage } from "../pages/ViewCertificatePage";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { StudentDashboardPage } from "../pages/StudentDashboardPage";
import { PrivateRoute } from "../components/PrivateRoute";

export const AppRouter: React.FC = () => {
  return (
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/issue"
          element={
            <PrivateRoute roles={["issuer", "admin"]}>
              <IssueCertificatePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/view"
          element={
            <PrivateRoute roles={["issuer", "admin", "student"]}>
              <ViewCertificatePage />
            </PrivateRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />

        {/* Student Dashboard */}
        <Route
          path="/student-dashboard"
          element={
            <PrivateRoute roles={["student"]}>
              <StudentDashboardPage />
            </PrivateRoute>
          }
        />

        {/* Catch-all 404 */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
  );
};
