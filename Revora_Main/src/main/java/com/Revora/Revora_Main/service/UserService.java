package com.Revora.Revora_Main.service;

import com.Revora.Revora_Main.dto.*;
import com.Revora.Revora_Main.exception.UnauthorizedActionException;
import com.Revora.Revora_Main.exception.UserNotFoundException;
import com.Revora.Revora_Main.exception.WrongPasswordException;
import com.Revora.Revora_Main.model.Role;
import com.Revora.Revora_Main.model.User;
import com.Revora.Revora_Main.repository.RoleRepository;
import com.Revora.Revora_Main.repository.UserRepository;
import com.Revora.Revora_Main.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }


    public UserResponse registerUser(SignUpRequest request) {

        Optional<Role> roleOpt = roleRepository.findByName("ROLE_USER");
        Role role = roleOpt.orElseThrow(() -> new RuntimeException("Role not found"));


        User user = new User();
             user.setName(request.getName());
             user.setUsername(request.getUsername());
             user.setEmail(request.getEmail());
             user.setPassword(passwordEncoder.encode(request.getPassword()));
             user.getRole().add(role);
             user.setCreatedAt(LocalDateTime.now());

             User savedUser = userRepository.save(user);

             UserResponse response = new UserResponse();
             response.setId(savedUser.getId());
             response.setUsername(savedUser.getUsername());
             response.setEmail(savedUser.getEmail());
             response.setName(savedUser.getName());
             response.setRole(savedUser.getRole());
             response.setCreatedAt(savedUser.getCreatedAt());

             return response;
    }

    public UserResponse registerAdminUser(SignUpRequest request) {

        Optional<Role> roleOpt = roleRepository.findByName("ROLE_ADMIN");
        Role role = roleOpt.orElseThrow(() -> new RuntimeException("Role not found"));

        String currentUsername = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();

        boolean isAdmin = userRepository.findByUsername(currentUsername)
                .map(u -> u.getRole().stream().anyMatch(r -> r.getName().equals("ROLE_ADMIN")))
                .orElse(false);

        if (!isAdmin) {
            throw new UnauthorizedActionException("Only admins can change user roles.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.getRole().add(role);
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        UserResponse response = new UserResponse();
        response.setId(savedUser.getId());
        response.setUsername(savedUser.getUsername());
        response.setEmail(savedUser.getEmail());
        response.setName(savedUser.getName());
        response.setRole(savedUser.getRole());
        response.setCreatedAt(savedUser.getCreatedAt());

        return response;
    }

    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User Not Found By Id : " + id));

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());

        return response;
    }

    public List<UserResponse> getAllUsers() {

        List<User> users = userRepository.findAll();
        List<UserResponse> response = new ArrayList<>();

        for (User user : users) {

            UserResponse responseUser = new UserResponse();

            responseUser.setId(user.getId());
            responseUser.setUsername(user.getUsername());
            responseUser.setEmail(user.getEmail());
            responseUser.setName(user.getName());
            responseUser.setRole(user.getRole());
            responseUser.setCreatedAt(user.getCreatedAt());

            response.add(responseUser);

        }

        return response;

    }

    public LoginResponse loginUser(LoginRequest loginRequest) {

        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());

        User user = userOptional.orElseThrow(() -> new UserNotFoundException("User not found with username : " + loginRequest.getUsername()));


        if(passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {

            UserResponse response = new UserResponse();

            response.setId(user.getId());
            response.setUsername(user.getUsername());
            response.setEmail(user.getEmail());
            response.setName(user.getName());
            response.setRole(user.getRole());
            response.setCreatedAt(user.getCreatedAt());

            String token = jwtUtil.generateToken(user.getUsername());

            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setUser(response);
            loginResponse.setToken(token);

            return loginResponse;

        } else {

            throw new WrongPasswordException("Wrong password");
        }

    }

    public UserResponse updateUser(Long id, UpdateUserRequest userRequest) {

       User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found with id : " + id));

       user.setUsername(userRequest.getUsername());
       user.setEmail(userRequest.getEmail());
       userRepository.save(user);

       UserResponse response = new UserResponse();
       response.setId(user.getId());
       response.setUsername(user.getUsername());
       response.setEmail(user.getEmail());
       response.setName(user.getName());
       response.setRole(user.getRole());
       response.setCreatedAt(user.getCreatedAt());


        return response;
    }

    public void deleteUser(Long id) {

        userRepository.deleteById(id);

    }

    public UserResponse updateName(Long id, UpdateNameRequest nameRequest) {

        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found with id : " + id));
        user.setName(nameRequest.getName());
        userRepository.save(user);

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());

        return response;

    }

    public UserResponse changePassword(Long id, ChangePasswordRequest passwordRequest) {

        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found by Id : " + id));

        if (!user.getPassword().equals(passwordRequest.getOldPassword())) {

            throw new WrongPasswordException("Old Password is Incorrect");

        }

        user.setPassword(passwordRequest.getNewPassword());
        userRepository.save(user);

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());

        return response;
    }

//    public UserResponse updateRole(Long id,UpdateRoleRequest roleRequest) {
//
//        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User Not Found By Id : " + id));
//
//            user.setRole(roleRequest.getRole());
//            userRepository.save(user);
//
//        UserResponse response = new UserResponse();
//        response.setId(user.getId());
//        response.setUsername(user.getUsername());
//        response.setEmail(user.getEmail());
//        response.setName(user.getName());
//        response.setRole(user.getRole());
//        response.setCreatedAt(user.getCreatedAt());
//
//        return response;
//    }

    public UserResponse updateRole(Long id, UpdateRoleRequest roleRequest) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found By Id : " + id));

        List<Role> roles = roleRequest.getRole()
                .stream()
                .map(r -> roleRepository.findByName(r.getName())
                        .orElseThrow(() ->
                                new RuntimeException("Role not found : " + r.getName())))
                .collect(Collectors.toCollection(ArrayList::new)); // mutable list

        user.setRole(roles);

        userRepository.save(user);

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());

        return response;
    }
}
