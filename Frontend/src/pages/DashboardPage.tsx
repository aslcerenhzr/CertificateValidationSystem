import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  CircularProgress,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Grid,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import {
  AccountCircle,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Receipt as ReceiptIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { AdminDashboard } from "../components/AdminDashboard";
import { StudentDashboard } from "../components/StudentDashboard";
import { IssueCertificatePage } from "./IssueCertificatePage";
import { ViewCertificatePage } from "./ViewCertificatePage";

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleMenu}
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer (Navigation Sidebar) */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile.
        sx={{
          display: { xs: "block", md: "none" },
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem disablePadding>
              <Box
                display={"flex"}
                justifyContent="center"
                flexDirection={"column"}
                alignItems="center"
                padding={"1rem"}
              >
                <Avatar
                  sx={{ width: 80, height: 80, bgcolor: "primary.main", mb: 1 }}
                >
                  {user.email?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Typography variant="subtitle1">{user.email}</Typography>
                <Typography variant="caption">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Typography>
              </Box>
            </ListItem>
            <Divider />
          </List>
        </Box>
      </Drawer>

      {/* Permanent Drawer on larger screens */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem disablePadding>
              <Box
                display={"flex"}
                justifyContent="center"
                flexDirection={"column"}
                alignItems="center"
                padding={"1rem"}
              >
                <Avatar
                  sx={{ width: 80, height: 80, bgcolor: "primary.main", mb: 1 }}
                >
                  {user.email?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Typography variant="subtitle1">{user.email}</Typography>
                <Typography variant="caption">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Typography>
              </Box>
            </ListItem>
            <Divider />
          </List>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // push the main content down
          overflowX: "hidden",
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>
                  Welcome
                </Typography>
                <Typography variant="body1">
                  Hi <strong>{user.email}</strong>, your role is{" "}
                  <strong>{user.role}</strong>.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {user.role === "student"
                      ? "Your Certificates"
                      : user.role === "issuer"
                      ? "Issue Statistics"
                      : "Additional Info"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.role === "student"
                      ? "View all your earned certificates here."
                      : user.role === "issuer"
                      ? "Track your issued certificates and statistics."
                      : "This is just a sample card for additional info."}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {user.role === "admin" ? (
              <>
                <Grid item xs={12}></Grid>
                <AdminDashboard />
              </>
            ) : user.role === "student" ? (
              <>
                <Grid item xs={12}></Grid>
                <StudentDashboard />
              </>
            ) : user.role === "issuer" ? (
              <>
                <Grid item xs={12}></Grid>
                <div>
                  <IssueCertificatePage />
                </div>
                <div>
                  <ViewCertificatePage />
                </div>
              </>
            ) : null}
          </Grid>
        </Container>
        {/* User Menu */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem disabled>
            <Typography variant="subtitle1">Hello, {user.email}</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};
