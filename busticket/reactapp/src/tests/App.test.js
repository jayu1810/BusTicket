import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import TicketList from "../components/TicketList";
import BookTicket from "../components/BookTicket";
import Home from "../pages/Home";
import App from "../App";

jest.mock("../services/ticketService", () => ({
  getAllTickets: jest.fn(),
  getTicketsByRoute: jest.fn(),
  getTicketsSortedByDate: jest.fn(),
  bookTicket: jest.fn(),
  cancelTicket: jest.fn(),
  getStatistics: jest.fn(),
}));

import {
  getAllTickets,
  getTicketsByRoute,
  getTicketsSortedByDate,
  bookTicket,
  cancelTicket,
  getStatistics,
} from "../services/ticketService";

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Bus Ticket Management React App - 10 Stable Tests", () => {
  const mockTickets = [
    {
      id: 1,
      passengerName: "John Doe",
      route: "Mumbai-Delhi",
      seatNumber: "A1",
      bookingDateTime: "2025-09-05T10:00:00Z",
      departureTime: "2025-09-10T09:00:00Z",
      fare: 1200.0,
      status: "BOOKED",
    },
    {
      id: 2,
      passengerName: "Jane Smith",
      route: "Delhi-Bangalore",
      seatNumber: "B2",
      bookingDateTime: "2025-09-05T11:00:00Z",
      departureTime: "2025-09-11T08:00:00Z",
      fare: 1800.0,
      status: "BOOKED",
    },
    {
      id: 3,
      passengerName: "Bob Johnson",
      route: "Mumbai-Delhi",
      seatNumber: "A3",
      bookingDateTime: "2025-09-05T12:00:00Z",
      departureTime: "2025-09-12T10:00:00Z",
      fare: 1200.0,
      status: "CANCELLED",
    },
  ];

  const mockStatistics = {
    totalRevenue: 3000.0,
    activeBookings: 2,
    totalTickets: 3,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "confirm").mockImplementation(() => true);
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  test("renders_home_dashboard_title", async () => {
    getStatistics.mockResolvedValueOnce({ data: mockStatistics });
    renderWithRouter(<Home />);
    expect(
      await screen.findByText("Bus Ticket Management Dashboard")
    ).toBeInTheDocument();
  });

  test("ticket_list_table_headers_display", async () => {
    getAllTickets.mockResolvedValueOnce({ data: [] });
    renderWithRouter(<TicketList />);
    
    expect(await screen.findByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Passenger")).toBeInTheDocument();
    expect(screen.getByText("Route")).toBeInTheDocument();
    expect(screen.getByText("Seat")).toBeInTheDocument();
    expect(screen.getByText("Booking Date")).toBeInTheDocument();
    expect(screen.getByText("Departure")).toBeInTheDocument();
    expect(screen.getByText("Fare")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  test("filter_controls_render_correctly", async () => {
    getAllTickets.mockResolvedValueOnce({ data: [] });
    renderWithRouter(<TicketList />);
    
    expect(await screen.findByPlaceholderText("Filter by Route")).toBeInTheDocument();
    expect(screen.getByText("Filter")).toBeInTheDocument();
    expect(screen.getByText("Reset")).toBeInTheDocument();
    expect(screen.getByText("Sort by Date")).toBeInTheDocument();
  });


  test("displays_statistics_on_dashboard", async () => {
    getStatistics.mockResolvedValueOnce({ data: mockStatistics });
    renderWithRouter(<Home />);
    
    expect(await screen.findByText("₹3000")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  test("displays_empty_state_when_no_tickets_available", async () => {
    getAllTickets.mockResolvedValueOnce({ data: [] });
    renderWithRouter(<TicketList />);
    
    expect(await screen.findByText("No tickets found")).toBeInTheDocument();
  });

  test("filter_by_route_functionality", async () => {
    getAllTickets.mockResolvedValueOnce({ data: mockTickets });
    getTicketsByRoute.mockResolvedValueOnce({ 
      data: mockTickets.filter(ticket => ticket.route === "Mumbai-Delhi") 
    });
    
    renderWithRouter(<TicketList />);
    
    // Wait for initial load
    await screen.findByText("Bus Ticket Management");
    
    // Enter route filter
    const filterInput = screen.getByPlaceholderText("Filter by Route");
    fireEvent.change(filterInput, { target: { value: "Mumbai-Delhi" } });
    
    // Click filter button
    const filterButton = screen.getByText("Filter");
    fireEvent.click(filterButton);
    
    await waitFor(() => {
      expect(getTicketsByRoute).toHaveBeenCalledWith("Mumbai-Delhi");
    });
  });

  test("cancel_ticket_removes_record", async () => {
    getAllTickets.mockResolvedValueOnce({ data: mockTickets });
    cancelTicket.mockResolvedValueOnce({});
    
    renderWithRouter(<TicketList />);
    
    // Wait for tickets to load
    await screen.findByText("John Doe");
    
    // Find cancel button for booked tickets only
    const cancelButtons = screen.getAllByText("Cancel");
    expect(cancelButtons.length).toBe(2); // Only 2 BOOKED tickets should have cancel buttons
    
    fireEvent.click(cancelButtons[0]);
    
    await waitFor(() => {
      expect(cancelTicket).toHaveBeenCalledWith(1);
    });
  });

  test("sort_by_date_button_fetches_sorted_tickets", async () => {
    getAllTickets.mockResolvedValueOnce({ data: [] });
    getTicketsSortedByDate.mockResolvedValueOnce({ data: mockTickets });
    
    renderWithRouter(<TicketList />);
    
    // Wait for initial load
    await screen.findByText("Bus Ticket Management");
    
    // Click sort by date button
    const sortButton = screen.getByText("Sort by Date");
    fireEvent.click(sortButton);
    
    await waitFor(() => {
      expect(getTicketsSortedByDate).toHaveBeenCalledTimes(1);
    });
  });

  test("reset_button_fetches_all_tickets", async () => {
    getAllTickets.mockResolvedValueOnce({ data: [] });
    getAllTickets.mockResolvedValueOnce({ data: mockTickets });
    
    renderWithRouter(<TicketList />);
    
    // Wait for initial load
    await screen.findByText("Bus Ticket Management");
    
    // Click reset button
    const resetButton = screen.getByText("Reset");
    fireEvent.click(resetButton);
    
    await waitFor(() => {
      expect(getAllTickets).toHaveBeenCalledTimes(2);
    });
  });

  test("app_component_renders_with_navigation", async () => {
    getAllTickets.mockResolvedValueOnce({ data: [] });
    getStatistics.mockResolvedValueOnce({ data: mockStatistics });
    
    render(<App />);
    
    expect(screen.getByText("Bus Ticket Manager")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("View Tickets")).toBeInTheDocument();
    expect(screen.getByText("Book Ticket")).toBeInTheDocument();
  });

  test("book_ticket_form_validation", async () => {
    renderWithRouter(<BookTicket />);
    
    // Try to submit empty form
    const submitButton = screen.getByText("Book Ticket");
    fireEvent.click(submitButton);
    
    // Form should not submit without required fields
    expect(bookTicket).not.toHaveBeenCalled();
  });

  test("displays_ticket_status_badges", async () => {
    getAllTickets.mockResolvedValueOnce({ data: mockTickets });
    renderWithRouter(<TicketList />);
    
    // Wait for tickets to load
    await screen.findByText("John Doe");
    
    // Check for status badges
    const bookedBadges = screen.getAllByText("BOOKED");
    const cancelledBadges = screen.getAllByText("CANCELLED");
    
    expect(bookedBadges.length).toBe(2);
    expect(cancelledBadges.length).toBe(1);
  });
});