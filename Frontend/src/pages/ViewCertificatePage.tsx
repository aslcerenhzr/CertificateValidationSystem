// src/pages/ViewCertificatePage.tsx
import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Grid,
  Link,
} from "@mui/material";
import { Search as SearchIcon, Verified as VerifiedIcon, Close as CloseIcon } from "@mui/icons-material";
import { getCertificate, verifyCertificate } from "../services/certificateService";

interface Certificate {
  id: number;
  studentAddress: string;
  issuerAddress: string;
  ipfsHash: string;
  // Add other fields as necessary
}

export const ViewCertificatePage: React.FC = () => {
  const [certId, setCertId] = useState<number>(0);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [loadingVerify, setLoadingVerify] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!certId) {
      setError("Please enter a valid Certificate ID.");
      return;
    }

    setError(null);
    setSuccess(null);
    setCertificate(null);
    setVerified(null);
    setLoadingSearch(true);

    try {
      const cert = await getCertificate(certId);
      setCertificate(cert);
      setSuccess("Certificate fetched successfully.");
    } catch (error: any) {
      console.error("Certificate not found:", error);
      setError(error.response?.data?.error || "Certificate not found.");
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleVerify = async () => {
    if (!certificate) {
      setError("No certificate to verify.");
      return;
    }

    setError(null);
    setSuccess(null);
    setLoadingVerify(true);

    try {
      const result = await verifyCertificate(certId);
      setVerified(result.verified);
      setSuccess(`Certificate verification ${result.verified ? "successful" : "failed"}.`);
    } catch (error: any) {
      console.error("Verification error:", error);
      setError(error.response?.data?.error || "Verification error.");
    } finally {
      setLoadingVerify(false);
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
          View & Verify Certificate
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

        {/* Search Form */}
        <Box sx={{ width: "100%", mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <TextField
                label="Certificate ID"
                variant="outlined"
                type="number"
                fullWidth
                value={certId}
                onChange={(e) => setCertId(Number(e.target.value))}
                placeholder="Enter Certificate ID"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                disabled={loadingSearch}
                sx={{ color: "black" }}
              >
                {loadingSearch ? <CircularProgress size={24} /> : "Search"}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Certificate Details */}
        {certificate && (
          <Card sx={{ width: "100%", mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "black" }}>
                Certificate ID: {certificate.id}
              </Typography>
              <Typography variant="body1" sx={{ color: "black" }}>
                <strong>Student Address:</strong> {certificate.studentAddress}
              </Typography>
              <Typography variant="body1" sx={{ color: "black" }}>
                <strong>Issuer Address:</strong> {certificate.issuerAddress}
              </Typography>
              <Typography variant="body1" sx={{ color: "black" }}>
                <strong>IPFS Hash:</strong>{" "}
                <Link
                  href={`https://ipfs.io/ipfs/${certificate.ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "black" }}
                >
                  {certificate.ipfsHash}
                </Link>
              </Typography>
              {/* Add more details or links as needed */}
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleVerify}
                startIcon={<VerifiedIcon />}
                disabled={loadingVerify}
                sx={{ color: "black" }}
              >
                {loadingVerify ? <CircularProgress size={24} /> : "Verify Signature"}
              </Button>
            </CardActions>
          </Card>
        )}

        {/* Verification Result */}
        {verified !== null && (
          <Alert
            severity={verified ? "success" : "warning"}
            icon={verified ? <VerifiedIcon /> : <CloseIcon />}
            sx={{ width: "100%", mt: 2, color: "black" }}
          >
            Certificate has been {verified ? "verified successfully." : "failed verification."}
          </Alert>
        )}
      </Box>
    </Container>
  );
};
