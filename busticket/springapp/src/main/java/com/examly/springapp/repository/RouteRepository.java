package com.examly.springapp.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.examly.springapp.model.Route;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
}


