// src/components/StudentDashboard.tsx
import React, { useState, useEffect } from "react";
import { getCertificatesByStudent } from "../services/certificateService";
import { useAuth } from "../contexts/AuthContext";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Link,
} from "@mui/material";
import { InsertDriveFile as InsertDriveFileIcon } from "@mui/icons-material";
import { ethers } from "ethers";

interface Certificate {
  id: number;
  studentAddress: string;
  issuerAddress: string;
  ipfsHash: string;
  // Add other fields as necessary
}

export const StudentDashboard: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setError(null);
        setSuccess(null);
        const certs = await getCertificatesByStudent(user.publicAddress); // Ensure this uses publicAddress
        setCertificates(certs);
        if (certs.length === 0) {
          setSuccess("No certificates found.");
        }
      } catch (error: any) {
        console.error("Failed to fetch certificates:", error);
        setError(error.response?.data?.error || "Failed to fetch certificates.");
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, [user]);

  return (
    <Container maxWidth="lg">
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
        <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
          Your Certificates
        </Typography>

        {/* Feedback Messages */}
        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="info" sx={{ width: "100%", mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Loading Indicator */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {certificates.map((cert) => (
              <Grid item xs={12} sm={6} md={4} key={cert.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  variant="outlined"
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Certificate ID: {cert.id}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Issuer:</strong> {cert.issuerAddress}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>IPFS Hash:</strong> {cert.ipfsHash}
                    </Typography>
                    {/* Add more details as necessary */}
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<InsertDriveFileIcon />}
                      href={`https://ipfs.io/ipfs/${cert.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Certificate
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};
