package com.examly.springapp.controller;



import org.springframework.web.bind.annotation.*;

import com.examly.springapp.model.Schedule;
import com.examly.springapp.service.ScheduleService;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    // Fetch a single schedule by scheduleId
@GetMapping("/id/{scheduleId}")
public Schedule getScheduleById(@PathVariable Long scheduleId) {
    return scheduleService.getScheduleById(scheduleId);
}

// Fetch schedules by routeId
@GetMapping("/route/{routeId}")
public List<Schedule> getSchedulesByRoute(@PathVariable Long routeId) {
    return scheduleService.getSchedulesByRoute(routeId);
}


    @PostMapping
    public Schedule createSchedule(@RequestBody Schedule schedule) {
        return scheduleService.createSchedule(schedule);
    }

    @PutMapping("/{scheduleId}")
    public Schedule updateSchedule(@PathVariable Long scheduleId, @RequestBody Schedule schedule) {
        return scheduleService.updateSchedule(scheduleId, schedule);
    }

    @GetMapping("/{scheduleId}/availability")
    public int checkSeatAvailability(@PathVariable Long scheduleId) {
        return scheduleService.checkSeatAvailability(scheduleId);
    }
    @GetMapping
    public List<Schedule> getAllSchedules() {
        return scheduleService.getAllSchedules();
    }

}
