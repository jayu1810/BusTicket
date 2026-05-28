package com.examly.springapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.BusTicket;
import com.examly.springapp.repository.BusTicketRepository;

@Service
public class BusTicketService {
    @Autowired
    BusTicketRepository busTicketRepository;
    public BusTicket saveTicket(BusTicket busTicket) {
        return busTicketRepository.save(busTicket);
    }
    public List<BusTicket> getAllTickets() {
        return busTicketRepository.findAll();
    }
    public List<BusTicket> getTicketsByRoute(String route) {
        return busTicketRepository.findByRoute(route);
    }
    public List<BusTicket> getTicketsSortedByDate() {
        
        return busTicketRepository.findAllByOrderByBookingDateTimeDesc();
    }
    public BusTicket cancelTicket(Long id) {
        BusTicket ticket=busTicketRepository.findById(id).orElseThrow(()->new RuntimeException("No id found"));
        ticket.setStatus("CANCELLED");
        return busTicketRepository.save(ticket);
        
    }
    public Long getActiveBookingCount() {
        return busTicketRepository.getActiveBookingsCount();
    }
    public Long getTotalRevenue() {
        return busTicketRepository.getTotalRevenue();
    }
    public Long getTotalTickets() {
        return busTicketRepository.getTotalTickets();
    }
    public Page<BusTicket> getTickets(String passengerName, String route, org.springframework.data.domain.Pageable pageable) {
       if(!passengerName.isEmpty()&&!route.isEmpty())
       {
        return busTicketRepository.findByPassengerNameContainingIgnoreCaseAndRouteContainingIgnoreCase(passengerName,route,pageable);
       }
       else if(!passengerName.isEmpty())
       {
            return busTicketRepository.findByPassengerNameContainingIgnoreCase(passengerName,pageable);
       }
       else if(!route.isEmpty()){
        return busTicketRepository.findByRouteContainingIgnoreCase(route,pageable);
       }
        return busTicketRepository.findAll(pageable);

    }
    
   

}
