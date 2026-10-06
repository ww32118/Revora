package com.Revora.Revora_Main.controller;

import com.Revora.Revora_Main.dto.*;
import com.Revora.Revora_Main.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;


    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public UserResponse registerUser(@RequestBody SignUpRequest request) {

        return userService.registerUser(request);

    }

    @PostMapping("/admin-register")
    public UserResponse registerAdminUser(@RequestBody SignUpRequest request) {

        return userService.registerAdminUser(request);

    }

    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Long id) {

        return userService.getUserById(id);
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {

        return userService.getAllUsers();
    }

    @PostMapping("/login")
    public LoginResponse loginUser(@RequestBody LoginRequest loginRequest) {

        return userService.loginUser(loginRequest);
    }

    @PutMapping("/{id}")
    public UserResponse updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest userRequest) {

        return userService.updateUser(id, userRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {

        userService.deleteUser(id);
    }

    @PutMapping("/{id}/name")
    public UserResponse updateName(@PathVariable Long id, @RequestBody UpdateNameRequest nameRequest) {

        return userService.updateName(id, nameRequest);
    }

    @PutMapping("/{id}/change-password")
    public UserResponse changePassword(@PathVariable Long id,@RequestBody ChangePasswordRequest passwordRequest) {

        return userService.changePassword(id, passwordRequest);
    }

    @PutMapping("/{id}/update-role")
    public UserResponse updateRole(@PathVariable Long id,@RequestBody UpdateRoleRequest roleRequest) {

        return userService.updateRole(id, roleRequest);
    }
}
