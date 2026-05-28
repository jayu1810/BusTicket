package com.examly.springapp.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.model.BusTicket;
import com.examly.springapp.model.Dashboard;
import com.examly.springapp.service.BusTicketService;

@RestController
@RequestMapping("/api/tickets")
public class BusTicketController {
    @Autowired
    BusTicketService busTicketService;
    @PostMapping("/book")
    public BusTicket saveTicket(@RequestBody BusTicket busTicket)
    {
        return busTicketService.saveTicket(busTicket);
    }

    @GetMapping("/all")
    public List<BusTicket>getAllTickets(){
        return busTicketService.getAllTickets();
    }
    @GetMapping("/byRoute")
    public List<BusTicket>getTicketsByRoute(@RequestParam("route")String route){
        return busTicketService.getTicketsByRoute(route);
    }
    @GetMapping("/sortedByDate")
    public List<BusTicket>getTicketsSortedByDate(){
        return busTicketService.getTicketsSortedByDate();
    }
    
    @PutMapping("/cancel/{id}")
    public BusTicket cancelTicket(@PathVariable Long id){
        return busTicketService.cancelTicket(id);
    }
    @GetMapping("/statistics")
    public ResponseEntity<Dashboard> dashboard(){
        Long activeBookings= busTicketService.getActiveBookingCount();
        Long totalRevenue=busTicketService.getTotalRevenue();
        Long totalTickets=busTicketService.getTotalTickets();
        
        Dashboard table=new Dashboard(activeBookings,totalRevenue,totalTickets);
        return ResponseEntity.ok(table);
    }

    @GetMapping("/paginated")
    public Page<BusTicket> getBusPaginated(
        @RequestParam(defaultValue = "") String passengerName,
        @RequestParam(defaultValue = "") String route,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "3") int size,
        @RequestParam(defaultValue = "id") String sortBy,
        @RequestParam(defaultValue = "asc") String sortDir
        )
        {
            Sort sort=sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending(): Sort.by(sortBy).descending();
            Pageable pageable=PageRequest.of(page, size, sort);
            return busTicketService.getTickets(passengerName,route, pageable);
        }
    }
