package com.examly.springapp.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.examly.springapp.model.Booking;
import com.examly.springapp.model.User;

import java.util.List;
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    public List<Booking> findByUserId(Long userId);
}
