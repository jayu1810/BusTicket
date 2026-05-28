package com.examly.springapp.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.model.Booking;
import com.examly.springapp.service.BookingService;

import java.util.List;

@RestController

@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(@PathVariable Long userId) {
        return bookingService.getBookingsByUser(userId);
    }

    
    @GetMapping("/{bookingId}")
    public Booking getBookingById(@PathVariable Long bookingId) {
        return bookingService.getBookingById(bookingId);
    }

    
    @PutMapping("/{bookingId}/cancel")
    public Booking cancelBooking(@PathVariable Long bookingId) {
        return bookingService.cancelBooking(bookingId);
    }


    @PostMapping("/{bookingId}/refund")
    public Booking processRefund(@PathVariable Long bookingId) {
        return bookingService.processRefund(bookingId);
    }
}
