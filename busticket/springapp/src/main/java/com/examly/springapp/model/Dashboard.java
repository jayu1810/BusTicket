package com.examly.springapp.model;

public class Dashboard {
    Long activeBookings;
    Long totalRevenue;
    Long totalTickets;
    public Dashboard(Long activeBookings, Long totalRevenue, Long totalTickets) {
        this.activeBookings = activeBookings;
        this.totalRevenue = totalRevenue;
        this.totalTickets = totalTickets;
    }
    public Long getActiveBookings() {
        return activeBookings;
    }
    public void setActiveBookings(Long activeBookings) {
        this.activeBookings = activeBookings;
    }
    public Long getTotalRevenue() {
        return totalRevenue;
    }
    public void setTotalRevenue(Long totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
    public Long getTotalTickets() {
        return totalTickets;
    }
    public void setTotalTickets(Long totalTickets) {
        this.totalTickets = totalTickets;
    }
    
}
