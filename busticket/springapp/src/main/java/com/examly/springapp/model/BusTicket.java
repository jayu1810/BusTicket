package com.examly.springapp.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class BusTicket {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private String passengerName;
    private String route;
    private String seatNumber;
    private LocalDateTime bookingDateTime;
    private LocalDateTime departureTime;
    private Double fare;
    private String status;
}
