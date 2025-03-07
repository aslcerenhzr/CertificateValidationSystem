// src/components/AdminDashboard.tsx
import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";
import { CheckCircle, Cancel, PersonAdd, PersonRemove, Search } from "@mui/icons-material";

import { grantIssuerRole, revokeIssuerRole, isIssuer } from "../services/adminService";

export const AdminDashboard: React.FC = () => {
  const [account, setAccount] = useState("");
  const [isIssuerStatus, setIsIssuerStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGrant = async () => {
    if (!account) {
      setError("Please enter an account address.");
      return;
    }
    setError(null);
    setSuccess(null);
    try {
      setLoading(true);
      await grantIssuerRole(account);
      setSuccess("Issuer role granted successfully.");
    } catch (error: any) {
      console.error("Granting issuer role failed:", error);
      setError(error.response?.data?.error || "Granting issuer role failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!account) {
      setError("Please enter an account address.");
      return;
    }
    setError(null);
    setSuccess(null);
    try {
      setLoading(true);
      await revokeIssuerRole(account);
      setSuccess("Issuer role revoked successfully.");
    } catch (error: any) {
      console.error("Revoking issuer role failed:", error);
      setError(error.response?.data?.error || "Revoking issuer role failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = async () => {
    if (!account) {
      setError("Please enter an account address.");
      return;
    }
    setError(null);
    setSuccess(null);
    try {
      setLoading(true);
      const issuer = await isIssuer(account);
      setIsIssuerStatus(issuer);
    } catch (error: any) {
      console.error("Checking issuer role failed:", error);
      setError(error.response?.data?.error || "Checking issuer role failed.");
      setIsIssuerStatus(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 3, color: "black" }}>
          Admin Dashboard
        </Typography>

        {/* Feedback Messages */}
        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Account Input */}
        <Box component="form" sx={{ width: "100%" }} noValidate autoComplete="off">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <TextField
                label="Account Address"
                variant="outlined"
                fullWidth
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="0x..."
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleCheck}
                startIcon={<Search />}
                disabled={loading}
                sx={{ color: "black" }}
              >
                {loading ? <CircularProgress size={24} /> : "Check"}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Issuer Status */}
        {isIssuerStatus !== null && (
          <Box sx={{ mt: 2, width: "100%" }}>
            <Alert
              severity={isIssuerStatus ? "success" : "warning"}
              icon={isIssuerStatus ? <CheckCircle /> : <Cancel />}
            >
              {account} is {isIssuerStatus ? "an Issuer" : "not an Issuer"}.
            </Alert>
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ mt: 4, width: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="success"
                fullWidth
                onClick={handleGrant}
                startIcon={<PersonAdd />}
                disabled={loading}
                sx={{ color: "black" }}
              >
                {loading ? <CircularProgress size={24} /> : "Grant Issuer Role"}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={handleRevoke}
                startIcon={<PersonRemove />}
                disabled={loading}
                sx={{ color: "black" }}
              >
                {loading ? <CircularProgress size={24} /> : "Revoke Issuer Role"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
