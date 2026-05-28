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
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import axios from "axios";

const BASE_URL = "https://8080-befddedfaebcaabbbffbdeadcacbdaadcf.premiumproject.examly.io/api/bookings";

const USER_API = "https://8080-befddedfaebcaabbbffbdeadcacbdaadcf.premiumproject.examly.io/api/users";
const SCHEDULE_API = "https://8080-befddedfaebcaabbbffbdeadcacbdaadcf.premiumproject.examly.io/api/schedules";

const Bookings = () => {
  const [tab, setTab] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState({});
  const [schedules, setSchedules] = useState({});
  const [userId, setUserId] = useState("");
  const [form, setForm] = useState({ scheduleId: "", seatNumbers: "", travelDate: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Fetch bookings for a user
  const fetchBookings = async () => {
    if (!userId) return alert("Enter User ID");
    try {
      const res = await axios.get(`${BASE_URL}/user/${userId}`);
      setBookings(res.data);

      // Fetch users and schedules for all bookings
      const uniqueUserIds = [...new Set(res.data.map(b => b.userId))];
      const uniqueScheduleIds = [...new Set(res.data.map(b => b.scheduleId))];

      await Promise.all(uniqueUserIds.map(async id => {
        if (!users[id]) {
          const userRes = await axios.get(`${USER_API}/${id}`);
          setUsers(prev => ({ ...prev, [id]: userRes.data }));
        }
      }));

      await Promise.all(uniqueScheduleIds.map(async id => {
        if (!schedules[id]) {
          const scheduleRes = await axios.get(`${SCHEDULE_API}/id/${id}`);
          setSchedules(prev => ({ ...prev, [id]: scheduleRes.data }));
        }
      }));

    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to fetch bookings", severity: "error" });
    }
  };

  // Add booking
  const addBooking = async () => {
    if (!userId || !form.scheduleId || !form.seatNumbers || !form.travelDate)
      return alert("Fill all fields");

    try {
      // Fetch schedule to calculate amount
      const scheduleRes = await axios.get(`${SCHEDULE_API}/id/${form.scheduleId}`);
      const schedule = scheduleRes.data;

      const seatCount = form.seatNumbers.split(",").length;
      const totalAmount = schedule.route.distanceKm * 2 * seatCount; // example price calculation
      const pnrNumber = "PNR" + Math.floor(Math.random() * 1000000);

      const payload = {
        userId: parseInt(userId),
        scheduleId: parseInt(form.scheduleId),
        seatNumbers: form.seatNumbers,
        travelDate: form.travelDate,
        totalAmount: totalAmount,
        bookingStatus: "CONFIRMED",
        pnrNumber: pnrNumber,
      };

      await axios.post(BASE_URL, payload);

      setSnackbar({ open: true, message: "Booking added successfully!", severity: "success" });
      setForm({ scheduleId: "", seatNumbers: "", travelDate: "" });
      fetchBookings();
      setTab(0);
    } catch (err) {
      console.error("Add booking error:", err.response?.data || err);
      setSnackbar({ open: true, message: "Failed to add booking", severity: "error" });
    }
  };

  // Cancel booking
  const cancelBooking = async (id) => {
    try {
      await axios.put(`${BASE_URL}/${id}/cancel`);
      setSnackbar({ open: true, message: "Booking cancelled", severity: "info" });
      fetchBookings();
    } catch (err) {
      setSnackbar({ open: true, message: "Cancellation failed", severity: "error" });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6  }}>
      <Paper elevation={4} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <AppBar position="static" color="primary" sx={{ borderRadius: "12px 12px 0 0" }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} centered>
  <Tab 
    label="View Bookings" 
    sx={{
      color: "white",
      "&.Mui-selected": {
        color: "black",      // color when selected
        fontWeight: "bold"   // optional styling
      }
    }} 
  />
  <Tab 
    label="Add Booking" 
    sx={{
      color: "white",
      "&.Mui-selected": {
        color: "black",
        fontWeight: "bold"
      }
    }} 
  />
</Tabs>

        </AppBar>

        {/* View Bookings */}
        {tab === 0 && (
  <Box sx={{ p: 3 }}>
    {/* User ID input */}
    <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
      <Grid item xs={12} sm={6}>
        <TextField
          label="User ID"
          fullWidth
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button
          variant="contained"
          sx={{ height: "100%" }}
          onClick={fetchBookings}
        >
          Fetch Bookings
        </Button>
      </Grid>
    </Grid>

    {bookings.length === 0 ? (
      <Typography align="center" sx={{ mt: 5, fontSize: 18 }}>
        No bookings found.
      </Typography>
    ) : (
      bookings.map((b) => {
        const user = users[b.userId];
        const schedule = schedules[b.scheduleId];
        return (
          <Card key={b.id} sx={{ mb: 3, borderRadius: 3, p: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Booking ID: {b.id} | PNR: {b.pnrNumber}
            </Typography>
            <Typography
              sx={{
                color: b.bookingStatus === "CANCELLED" ? "red" : "green",
                fontWeight: "bold",
              }}
            >
              Status: {b.bookingStatus}
            </Typography>
            <Divider sx={{ my: 1 }} />

           {/* User Info */}
<Typography variant="subtitle1" fontWeight="bold">
User Info:
</Typography>
<Typography>Username: {user?.username || "Loading..."}</Typography>
<Typography>Email: {user?.email || "Loading..."}</Typography>
<Typography>Phone: {user?.mobile || "Loading..."}</Typography>
<Divider sx={{ my: 1 }} />

{/* Schedule Info */}
<Typography variant="subtitle1" fontWeight="bold">
Schedule Info:
</Typography>
<Typography>
Route: {schedule?.route?.origin} → {schedule?.route?.destination}
</Typography>
<Typography>Distance: {schedule?.route?.distanceKm} km</Typography>
<Typography>
Vehicle: {schedule?.vehicle?.model} ({schedule?.vehicle?.type})
</Typography>
<Typography>
Departure: {schedule?.departureTime?.hour}:{schedule?.departureTime?.minute}
</Typography>
<Typography>
Arrival: {schedule?.arrivalTime?.hour}:{schedule?.arrivalTime?.minute}
</Typography>
<Typography>Available Seats: {schedule?.availableSeats}</Typography>
<Typography>Base Price: {schedule?.basePrice}</Typography>
<Typography>Schedule Date: {schedule?.scheduleDate}</Typography>
<Divider sx={{ my: 1 }} />

{/* Booking Details */}
<Typography variant="subtitle1" fontWeight="bold">
Booking Details:
</Typography>
<Typography>Seat Numbers: {b.seatNumbers}</Typography>
<Typography>Travel Date: {b.travelDate}</Typography>
<Typography>Total Amount: ₹{b.totalAmount}</Typography>
<Typography>Booking Date: {new Date(b.bookingDate).toLocaleString()}</Typography>

{/* Cancel Button */}
<Box sx={{ mt: 2 }}>
<Button
variant="contained"
color="error"
disabled={b.bookingStatus === "CANCELLED"}
onClick={() => cancelBooking(b.id)}
>
Cancel Booking
</Button>
</Box>
</Card>
);
})
)}
</Box>
)}

        {/* Add Booking */}
        {tab === 1 && (
          <Box sx={{ p: 4 }}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom fontWeight="bold">Add Booking</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Schedule ID" fullWidth value={form.scheduleId} onChange={(e) => setForm({ ...form, scheduleId: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Seat Numbers" fullWidth value={form.seatNumbers} onChange={(e) => setForm({ ...form, seatNumbers: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Travel Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={form.travelDate} onChange={(e) => setForm({ ...form, travelDate: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="User ID" fullWidth value={userId} onChange={(e) => setUserId(e.target.value)} />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" onClick={addBooking} sx={{ mt: 2 }}>Add Booking</Button>
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

export default Bookings;
