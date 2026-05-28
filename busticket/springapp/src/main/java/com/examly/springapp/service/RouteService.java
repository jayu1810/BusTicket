package com.examly.springapp.service;

import org.springframework.stereotype.Service;

import com.examly.springapp.model.Route;
import com.examly.springapp.repository.RouteRepository;

import java.util.List;

@Service
public class RouteService {

    private final RouteRepository routeRepository;

    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    public Route saveRoute(Route route) {
        return routeRepository.save(route);
    }
}
