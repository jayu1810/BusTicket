import React, { useState, useEffect } from "react";
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

const BASE_URL = "https://8080-befddedfaebcaabbbffbdeadcacbdaadcf.premiumproject.examly.io/api/schedules";

const Schedules = () => {
  const [tab, setTab] = useState(0);
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({
    routeId: "",
    vehicleId: "",
    departureTime: "",
    arrivalTime: "",
    availableSeats: "",
    basePrice: "",
    scheduleDate: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchSchedules = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setSchedules(res.data);
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to fetch schedules", severity: "error" });
    }
  };

  const createSchedule = async () => {
    try {
      const res = await axios.post(BASE_URL, {
        ...form,
        route: { id: form.routeId },
        vehicle: { id: form.vehicleId },
      });
      setSchedules([...schedules, res.data]);
      setForm({
        routeId: "",
        vehicleId: "",
        departureTime: "",
        arrivalTime: "",
        availableSeats: "",
        basePrice: "",
        scheduleDate: "",
      });
      setSnackbar({ open: true, message: "Schedule added successfully!", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to add schedule", severity: "error" });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Paper elevation={4} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <AppBar position="static" color="primary" sx={{ borderRadius: "12px 12px 0 0" }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} centered>
            <Tab label="View Schedules" />
            <Tab label="Add Schedule" />
          </Tabs>
        </AppBar>

        {/* View Schedules */}
        {tab === 0 && (
          <Box sx={{ p: 3 }}>
            <Button variant="outlined" onClick={fetchSchedules} sx={{ mb: 2 }}>
              Fetch Schedules
            </Button>
            {schedules.length === 0 ? (
              <Typography>No schedules found.</Typography>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>ID</strong></TableCell>
                      <TableCell><strong>Route ID</strong></TableCell>
                      <TableCell><strong>Vehicle ID</strong></TableCell>
                      <TableCell><strong>Departure</strong></TableCell>
                      <TableCell><strong>Arrival</strong></TableCell>
                      <TableCell><strong>Seats</strong></TableCell>
                      <TableCell><strong>Price</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schedules.map((s) => (
                      <TableRow key={s.id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                        <TableCell>{s.id}</TableCell>
                        <TableCell>{s.route?.id}</TableCell>
                        <TableCell>{s.vehicle?.id}</TableCell>
                        <TableCell>{s.departureTime}</TableCell>
                        <TableCell>{s.arrivalTime}</TableCell>
                        <TableCell>{s.availableSeats}</TableCell>
                        <TableCell>₹{s.basePrice}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}

        {/* Add Schedule */}
        {tab === 1 && (
          <Box sx={{ p: 4 }}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Add New Schedule
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Route ID"
                      fullWidth
                      value={form.routeId}
                      onChange={(e) => setForm({ ...form, routeId: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Vehicle ID"
                      fullWidth
                      value={form.vehicleId}
                      onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Departure Time"
                      type="time"
                      fullWidth
                      value={form.departureTime}
                      onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Arrival Time"
                      type="time"
                      fullWidth
                      value={form.arrivalTime}
                      onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Available Seats"
                      type="number"
                      fullWidth
                      value={form.availableSeats}
                      onChange={(e) => setForm({ ...form, availableSeats: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Base Price"
                      type="number"
                      fullWidth
                      value={form.basePrice}
                      onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Schedule Date"
                      type="date"
                      fullWidth
                      value={form.scheduleDate}
                      onChange={(e) => setForm({ ...form, scheduleDate: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" onClick={createSchedule} sx={{ mt: 2 }}>
                      Add Schedule
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

export default Schedules;
