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

const API_BASE = "https://8080-befddedfaebcaabbbffbdeadcacbdaadcf.premiumproject.examly.io/api/tickets";

const BusTicket = () => {
  const [tab, setTab] = useState(0);

  // Tickets & pagination/filter data
  const [tickets, setTickets] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: 5,
    totalPages: 0,
    totalElements: 0,
  });
  const [filters, setFilters] = useState({
    passengerName: "",
    route: "",
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Booking form state
  const [form, setForm] = useState({
    passengerName: "",
    route: "",
    seatNumber: "",
    departureTime: "",
    fare: "",
  });

  // Fetch paginated & filtered tickets
  const fetchTickets = async (page = 0) => {
    try {
      const params = {
        page,
        size: pageInfo.size,
        passengerName: filters.passengerName,
        route: filters.route,
        sortBy: "id",
        sortDir: "asc",
      };
      const response = await axios.get(`${API_BASE}/paginated`, { params });
      // response.data is a Page<BusTicket>
      const pageData = response.data;
      setTickets(pageData.content);
      setPageInfo({
        page: pageData.number,
        size: pageData.size,
        totalPages: pageData.totalPages,
        totalElements: pageData.totalElements,
      });
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setSnackbar({ open: true, message: "Failed to fetch tickets", severity: "error" });
    }
  };

  useEffect(() => {
    fetchTickets(0);
    // eslint-disable-next-line
  }, []);

  const handleTabChange = (e, newVal) => {
    setTab(newVal);
  };

  // For filter input changes (in view tab)
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchTickets(0);
  };

  const goToPage = (newPage) => {
    if (newPage >= 0 && newPage < pageInfo.totalPages) {
      fetchTickets(newPage);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBookTicket = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/book`, {
        ...form,
        bookingDateTime: new Date(),
      });
      setSnackbar({ open: true, message: "Ticket booked successfully!", severity: "success" });
      setForm({ passengerName: "", route: "", seatNumber: "", departureTime: "", fare: "" });
      // Refresh the ticket list
      fetchTickets(0);
      setTab(0);
    } catch (err) {
      console.error("Booking error:", err);
      setSnackbar({ open: true, message: "Booking failed!", severity: "error" });
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.put(`${API_BASE}/cancel/${id}`);
      setSnackbar({ open: true, message: "Ticket cancelled", severity: "info" });
      fetchTickets(pageInfo.page);
    } catch (err) {
      console.error("Cancel error:", err);
      setSnackbar({ open: true, message: "Cancellation failed", severity: "error" });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Paper elevation={4} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <AppBar position="static" color="primary" sx={{ borderRadius: "12px 12px 0 0" }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            indicatorColor="secondary"
            textColor="inherit"
            centered
          >
            <Tab label="View Tickets" />
            <Tab label="Book Ticket" />
          </Tabs>
        </AppBar>

        {tab === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              View Tickets
            </Typography>

            {/* Filters */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Passenger Name"
                  name="passengerName"
                  value={filters.passengerName}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Route"
                  name="route"
                  value={filters.route}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button variant="contained" onClick={applyFilters} sx={{ height: "100%" }}>
                  Filter
                </Button>
              </Grid>
            </Grid>

            {tickets.length === 0 ? (
              <Typography color="text.secondary">No tickets found.</Typography>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Passenger</strong></TableCell>
                      <TableCell><strong>Route</strong></TableCell>
                      <TableCell><strong>Seat</strong></TableCell>
                      <TableCell><strong>Departure</strong></TableCell>
                      <TableCell><strong>Fare</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell align="center"><strong>Action</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tickets.map((ticket) => (
                      <TableRow
                        key={ticket.id}
                        sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                      >
                        <TableCell>{ticket.passengerName}</TableCell>
                        <TableCell>{ticket.route}</TableCell>
                        <TableCell>{ticket.seatNumber}</TableCell>
                        <TableCell>
                          {ticket.departureTime
                            ? new Date(ticket.departureTime).toLocaleString()
                            : "—"}
                        </TableCell>
                        <TableCell>₹{ticket.fare}</TableCell>
                        <TableCell>
  <Typography
    fontWeight="bold"
    sx={{
      color: ticket.status === "CANCELLED" ? "red" : "green",
    }}
  >
    {ticket.status === "CANCELLED" ? "CANCELLED" : "BOOKED"}
  </Typography>
</TableCell>

                        <TableCell align="center">
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            disabled={ticket.status === "CANCELLED"}
                            onClick={() => handleCancel(ticket.id)}
                          >
                            Cancel
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Pagination Controls */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                disabled={pageInfo.page <= 0}
                onClick={() => goToPage(pageInfo.page - 1)}
              >
                Previous
              </Button>
              <Typography>
                Page {pageInfo.page + 1} of {pageInfo.totalPages}
              </Typography>
              <Button
                variant="outlined"
                disabled={pageInfo.page >= pageInfo.totalPages - 1}
                onClick={() => goToPage(pageInfo.page + 1)}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ p: 4 }}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Book a New Ticket
                </Typography>
                <Box component="form" onSubmit={handleBookTicket} sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Passenger Name"
                        name="passengerName"
                        value={form.passengerName}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Route"
                        name="route"
                        value={form.route}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Seat Number"
                        name="seatNumber"
                        value={form.seatNumber}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="datetime-local"
                        label="Departure Time"
                        name="departureTime"
                        InputLabelProps={{ shrink: true }}
                        value={form.departureTime}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Fare (₹)"
                        name="fare"
                        value={form.fare}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    color="primary"
                    sx={{ mt: 3, borderRadius: 2 }}
                  >
                    Book Ticket
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BusTicket;
