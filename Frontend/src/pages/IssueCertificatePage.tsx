// src/pages/IssueCertificatePage.tsx
import React, { useState } from "react";
import { useWeb3 } from "../hooks/useWeb3";
import { uploadCertificate } from "../services/certificateService";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { 
  AccountBalanceWallet as MetaMaskIcon, 
  Key as KeyIcon, 
  UploadFile as UploadFileIcon, 
  Visibility, 
  VisibilityOff 
} from "@mui/icons-material";
import { ethers } from "ethers";

export const IssueCertificatePage: React.FC = () => {
  const { web3Service, account, connectMetaMask, connectPrivateKey } = useWeb3();
  const [studentAddress, setStudentAddress] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [privateKey, setPrivateKey] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState<boolean>(false);

  const handleIssue = async () => {
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!web3Service) {
      setError("Please connect your wallet first.");
      return;
    }

    if (!ethers.isAddress(studentAddress)) {
      setError("Please enter a valid Ethereum address for the student.");
      return;
    }

    if (!file) {
      setError("Please upload a certificate file.");
      return;
    }

    setLoading(true);

    try {
      // Upload file to IPFS
      const certificate = await uploadCertificate(studentAddress, account, file);
      const ipfsHash = certificate.ipfsHash;
      const docHash = certificate.docHash;

      // Issue Certificate on Blockchain
      const receipt = await web3Service.issueCertificate(studentAddress, ipfsHash, docHash);
      setTransactionHash(receipt.hash);
      setSuccess(`Certificate issued successfully! Transaction Hash: ${receipt.hash}`);
    } catch (error: any) {
      console.error("Issuing certificate failed:", error);
      setError(error.response?.data?.error || error.message || "Issuing certificate failed");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectPrivateKey = async () => {
    if (!privateKey) {
      setError("Please enter your private key.");
      return;
    }
    try {
      await connectPrivateKey(privateKey);
    } catch (error: any) {
      console.error("Connection via Private Key failed:", error);
      setError(error.response?.data?.error || error.message || "Connection via Private Key failed");
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
          Issue Certificate
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

        {/* Wallet Connection Section */}
        {!web3Service && (
          <Box sx={{ width: "100%", mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, color: "black" }}>
              Connect Your Wallet
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<MetaMaskIcon />}
                  fullWidth
                  onClick={connectMetaMask}
                  sx={{ color: "black" }}
                >
                  Connect MetaMask
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Private Key"
                  variant="outlined"
                  type={showPrivateKey ? "text" : "password"}
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle private key visibility"
                          onClick={() => setShowPrivateKey(!showPrivateKey)}
                          edge="end"
                        >
                          {showPrivateKey ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<KeyIcon />}
                  fullWidth
                  onClick={handleConnectPrivateKey}
                  sx={{ mt: 1, color: "black" }}
                >
                  Connect via Private Key
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Action Form */}
        {web3Service && (
          <Box component="form" sx={{ width: "100%" }} noValidate>
            <Typography variant="h6" sx={{ mb: 2, color: "black" }}>
              Issue a New Certificate
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Connected Account"
                  variant="outlined"
                  value={account}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Student Ethereum Address"
                  variant="outlined"
                  type="text"
                  value={studentAddress}
                  onChange={(e) => setStudentAddress(e.target.value)}
                  fullWidth
                  required
                  placeholder="0x..."
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<UploadFileIcon />}
                  fullWidth
                >
                  Upload Certificate File
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFile(e.target.files[0]);
                      }
                    }}
                  />
                </Button>
                {file && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected File: {file.name}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleIssue}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? "Issuing Certificate..." : "Issue Certificate"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Display Transaction Hash */}
        {transactionHash && (
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="subtitle1">
              Transaction Hash:{" "}
              <a
                href={`https://etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {transactionHash}
              </a>
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};
