package com.examly.springapp.controller;



import org.springframework.web.bind.annotation.*;

import com.examly.springapp.model.Route;
import com.examly.springapp.service.RouteService;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping("/search")
    public List<Route> searchRoutes() {
        return routeService.getAllRoutes();
    }

    @PostMapping
    public Route createRoute(@RequestBody Route route) {
        return routeService.saveRoute(route);
    }
}

