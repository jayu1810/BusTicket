package com.examly.springapp.service;

import com.examly.springapp.model.Booking;
import com.examly.springapp.model.Booking.BookingStatus;
import com.examly.springapp.model.Schedule;
import com.examly.springapp.repository.BookingRepository;
import com.examly.springapp.repository.ScheduleRepository;
import com.examly.springapp.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    // Create a new booking using only userId and scheduleId
    public Booking createBooking(Booking booking) {
    // Validate user
    if (booking.getUserId() == null || !userRepository.existsById(booking.getUserId())) {
        throw new RuntimeException("Invalid user ID");
    }

    // Validate schedule
    Schedule schedule = scheduleRepository.findById(booking.getScheduleId())
            .orElseThrow(() -> new RuntimeException("Schedule not found with ID: " + booking.getScheduleId()));

    // Get route and distance
    if (schedule.getRoute() == null) {
        throw new RuntimeException("Route not found for schedule ID: " + booking.getScheduleId());
    }
    double distanceKM = schedule.getRoute().getDistanceKm();

    // Calculate totalAmount
    int seatCount = booking.getSeatNumbers().split(",").length;
    BigDecimal totalAmount = BigDecimal.valueOf(distanceKM * 2 * seatCount);
    booking.setTotalAmount(totalAmount);

    // Auto-generate PNR, bookingDate, bookingStatus
    booking.setPnrNumber(generatePNR());
    booking.setBookingDate(LocalDateTime.now());
    if (booking.getBookingStatus() == null) {
        booking.setBookingStatus(BookingStatus.CONFIRMED);
    }

    return bookingRepository.save(booking);
}


    // Get all bookings by userId
    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    // Get booking by ID
    public Booking getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));
    }

// Cancel a booking
public Booking cancelBooking(Long bookingId) {
Booking booking = getBookingById(bookingId);
if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
throw new RuntimeException("Booking is already cancelled.");
}
booking.setBookingStatus(BookingStatus.CANCELLED);
return bookingRepository.save(booking);
}

// Process refund for a cancelled booking
    public Booking processRefund(Long bookingId) {
        Booking booking = getBookingById(bookingId);
        if (booking.getBookingStatus() != BookingStatus.CANCELLED) {
        throw new RuntimeException("Refund can only be processed for CANCELLED bookings.");
        }
        booking.setBookingStatus(BookingStatus.REFUNDED);
        return bookingRepository.save(booking);
    }

// Generate a unique PNR number
private String generatePNR() {
return "PNR-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
}
}