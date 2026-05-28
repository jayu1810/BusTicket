package com.examly.springapp.service;

import com.examly.springapp.model.Vehicle;
import com.examly.springapp.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    // Get all vehicles
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }
    public List<Vehicle> addVehicles(List<Vehicle> vehicles) {
    return vehicleRepository.saveAll(vehicles);
}
    // Get vehicle by ID
    public Optional<Vehicle> getVehicleById(Long id) {
        return vehicleRepository.findById(id);
    }

    // Add new vehicle
    public Vehicle addVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    // Update vehicle
    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id " + id));

        vehicle.setRegistrationNumber(vehicleDetails.getRegistrationNumber());
        vehicle.setModel(vehicleDetails.getModel());
        vehicle.setManufacturer(vehicleDetails.getManufacturer());
        vehicle.setYear(vehicleDetails.getYear());
        vehicle.setType(vehicleDetails.getType());
        vehicle.setPrice(vehicleDetails.getPrice());
        vehicle.setAvailable(vehicleDetails.isAvailable());

        return vehicleRepository.save(vehicle);
    }

    // Delete vehicle
    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }
}
