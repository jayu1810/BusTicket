package com.examly.springapp.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.examly.springapp.model.BusTicket;
@Repository
public interface BusTicketRepository extends JpaRepository<BusTicket,Long>{

    List<BusTicket> findByRoute(String route);

    List<BusTicket> findAllByOrderByBookingDateTimeDesc();

    @Query("select sum(b.fare) from BusTicket b where b.status='BOOKED'")
    Long getTotalRevenue();

    @Query("select count(b.id) from BusTicket b where b.status='BOOKED'")
    Long getActiveBookingsCount();

    @Query("select count(b.id) from BusTicket b")
    Long getTotalTickets();

    Page<BusTicket> findByPassengerNameContainingIgnoreCaseAndRouteContainingIgnoreCase(String passengerName,
            String route, Pageable pageable);

    Page<BusTicket> findByPassengerNameContainingIgnoreCase(String passengerName, Pageable pageable);

    Page<BusTicket> findByRouteContainingIgnoreCase(String route, Pageable pageable);


    

   

}
