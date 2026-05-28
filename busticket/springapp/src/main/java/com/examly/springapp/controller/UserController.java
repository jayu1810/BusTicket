package com.examly.springapp.controller;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.model.User;
import com.examly.springapp.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }
    @PostMapping("/bulk")
    public List<User> registerUsers(@RequestBody List<User> users) {
        return userService.registerUsers(users);
    }
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    @PostMapping("/login")
    public String login(@RequestParam String username, @RequestParam String password) {
        Optional<User> user = userService.login(username, password);
        return user.isPresent() ? "✅ Login successful" : "❌ Invalid credentials";
    }
    
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.update(id, user);
    }


    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return "User deleted successfully";
    }
}

