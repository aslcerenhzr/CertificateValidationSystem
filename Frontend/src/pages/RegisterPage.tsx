// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "../hooks/useWeb3";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { AccountBalanceWallet as MetaMaskIcon } from "@mui/icons-material";
import { Login as LoginIcon } from "@mui/icons-material"; // Optional: Import an icon for the Login button

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { web3Service, account, connectMetaMask } = useWeb3();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  // Removed privateKey state as it's no longer needed
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic client-side validation
    if (password !== repeatedPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Ensure MetaMask is connected
      if (!web3Service) {
        await connectMetaMask();
        if (!account) {
          throw new Error("Please connect your MetaMask account.");
        }
      }

      const address = account;

      // Proceed with registration using email, password, and MetaMask address
      await registerUser(email, password, repeatedPassword, address);
      setSuccess("Registration successful. You can now log in.");
      setTimeout(() => navigate("/login"), 3000); // Redirect after 3 seconds
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.error || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  // Function to navigate to the Login page
  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <Container maxWidth="sm">
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
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Register
        </Typography>
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
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          {/* Email */}
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            required
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Repeat Password */}
          <TextField
            label="Repeat Password"
            variant="outlined"
            fullWidth
            required
            type="password"
            margin="normal"
            value={repeatedPassword}
            onChange={(e) => setRepeatedPassword(e.target.value)}
          />

          {/* MetaMask Connection Button and Public Address Display */}
          <Box
            sx={{
              mt: 2,
              mb: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              color={account ? "success" : "primary"}
              startIcon={<MetaMaskIcon />}
              onClick={connectMetaMask}
              sx={{ mb: 1, width: "100%" }}
            >
              {account ? "Connected" : "Connect MetaMask"}
            </Button>
            {account && (
              <TextField
                label="Public Address"
                variant="outlined"
                fullWidth
                value={account}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ mt: 1 }}
              />
            )}
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading || !account}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? "Registering..." : "Register"}
          </Button>

          {/* Login Button */}
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handleLoginRedirect}
            startIcon={<LoginIcon />} // Optional: Add an icon
            sx={{ mb: 2 }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
