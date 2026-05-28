package com.examly.springapp.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.examly.springapp.model.Schedule;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    List<Schedule> findByRouteId(Long routeId);

    List<Schedule> findByRouteOriginAndRouteDestinationAndIsActiveTrue(
            String origin, String destination
    );
}
