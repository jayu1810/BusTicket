import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const BASE_URL = "https://8080-befddedfaebcaabbbffbdeadcacbdaadcf.premiumproject.examly.io/api/routes/search";

const BusRoutes = () => {
  const [tab, setTab] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({ origin: "", destination: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchRoutes = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setRoutes(res.data);
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to fetch routes", severity: "error" });
    }
  };

  const createRoute = async () => {
    try {
      const res = await axios.post(BASE_URL, form);
      setRoutes([...routes, res.data]);
      setForm({ origin: "", destination: "" });
      setSnackbar({ open: true, message: "Route added successfully!", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to add route", severity: "error" });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Paper elevation={4} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <AppBar position="static" color="primary" sx={{ borderRadius: "12px 12px 0 0" }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} centered>
            <Tab label="View Routes" />
            <Tab label="Add Route" />
          </Tabs>
        </AppBar>

        {tab === 0 && (
          <Box sx={{ p: 3 }}>
            <Button variant="outlined" onClick={fetchRoutes} sx={{ mb: 2 }}>
              Fetch Routes
            </Button>
            {routes.length === 0 ? (
              <Typography>No routes available.</Typography>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>ID</strong></TableCell>
                      <TableCell><strong>Origin</strong></TableCell>
                      <TableCell><strong>Destination</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {routes.map((r) => (
                      <TableRow key={r.id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                        <TableCell>{r.id}</TableCell>
                        <TableCell>{r.origin}</TableCell>
                        <TableCell>{r.destination}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ p: 4 }}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Add New Route
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Origin"
                      value={form.origin}
                      onChange={(e) => setForm({ ...form, origin: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Destination"
                      value={form.destination}
                      onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" onClick={createRoute} sx={{ mt: 2 }}>
                      Add Route
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default BusRoutes;
