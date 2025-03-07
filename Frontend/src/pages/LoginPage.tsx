// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { loginUser } from "../services/authService";
import { setAuthToken } from "../services/api";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
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

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { web3Service, account, connectMetaMask } = useWeb3();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
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

      // Proceed with login using email, password, and MetaMask address
      const { user, token } = await loginUser(email, password, address);
      setAuthToken(token);
      login(token, user);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.response?.data?.error || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  // Function to navigate to the Register page
  const handleRegisterRedirect = () => {
    navigate("/register");
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
          Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
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
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* Register Button */}
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handleRegisterRedirect}
            sx={{ mb: 2 }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
