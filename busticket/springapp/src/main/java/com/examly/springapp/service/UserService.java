package com.examly.springapp.service;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Register a new user
     */
    public User register(User user) {
        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered: " + user.getEmail());
        }

        // Check if username already exists
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already taken: " + user.getUsername());
        }

        // Encode the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    /**
     * Login validation
     */
    public Optional<User> login(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return userOpt;
        }
        return Optional.empty();
    }

    /**
     * Find a user by ID
     */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Get all users
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Register multiple users
     */
 public List<User> registerUsers(List<User> users) {
users.forEach(user ->
user.setPassword(passwordEncoder.encode(user.getPassword()))
);
return userRepository.saveAll(users);
}

/**
* Update user details
*/
public User update(Long id, User updatedUser) {
User existingUser = userRepository.findById(id)
.orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

existingUser.setUsername(updatedUser.getUsername());
existingUser.setEmail(updatedUser.getEmail());
existingUser.setMobile(updatedUser.getMobile());

// Encode password if provided
if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
}

return userRepository.save(existingUser);
}

/**
* Delete user by ID
*/
public void delete(Long id) {
if (!userRepository.existsById(id)) {
throw new RuntimeException("User not found with ID: " + id);
}
userRepository.deleteById(id);
}
}