package com.examly.springapp.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Store only the user ID
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // Store only the schedule ID
    @Column(name = "schedule_id", nullable = false)
    private Long scheduleId;

    @Column(name = "seat_numbers", nullable = false, length = 100)
    private String seatNumbers;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_status", nullable = false, length = 20)
    private BookingStatus bookingStatus;

    @Column(name = "booking_date", nullable = false)
    private LocalDateTime bookingDate;

    @Column(name = "travel_date", nullable = false)
    private LocalDate travelDate;

    @Column(name = "pnr_number", nullable = false, unique = true, length = 20)
    private String pnrNumber;

    @PrePersist
    public void onCreate() {
        bookingDate = LocalDateTime.now();
        if (bookingStatus == null) {
            bookingStatus = BookingStatus.CONFIRMED;
        }
    }

    public enum BookingStatus {
        CONFIRMED, CANCELLED, REFUNDED, COMPLETED
    }
}
