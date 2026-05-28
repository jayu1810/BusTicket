package com.examly.springapp.service;

import org.springframework.stereotype.Service;

import com.examly.springapp.model.Schedule;
import com.examly.springapp.repository.ScheduleRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    public ScheduleService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    public Schedule createSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    public Schedule getScheduleById(Long scheduleId) {
        Optional<Schedule> scheduleOpt = scheduleRepository.findById(scheduleId);
        if (scheduleOpt.isPresent()) {
            return scheduleOpt.get();
        } else {
            throw new RuntimeException("Schedule not found with id: " + scheduleId);
        }
    }

    // Fetch schedules by routeId
    public List<Schedule> getSchedulesByRoute(Long routeId) {
        return scheduleRepository.findByRouteId(routeId);
    
    }
    public Schedule updateSchedule(Long scheduleId, Schedule updatedSchedule) {
        return scheduleRepository.findById(scheduleId)
                .map(schedule -> {
                    schedule.setAvailableSeats(updatedSchedule.getAvailableSeats());
                    schedule.setBasePrice(updatedSchedule.getBasePrice());
                    schedule.setDepartureTime(updatedSchedule.getDepartureTime());
                    schedule.setArrivalTime(updatedSchedule.getArrivalTime());
                    schedule.setScheduleDate(updatedSchedule.getScheduleDate());
                    schedule.setIsActive(updatedSchedule.getIsActive());
                    return scheduleRepository.save(schedule);
                })
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
    }

    public int checkSeatAvailability(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        return schedule.getAvailableSeats();
    }

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();    
    }

    
}
