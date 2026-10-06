package com.Revora.Revora_Main.config;

import com.Revora.Revora_Main.model.Role;
import com.Revora.Revora_Main.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class RoleSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public RoleSeeder(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        seedRole("ROLE_ADMIN");
        seedRole("ROLE_USER");
    }

    private void seedRole(String roleName) {

        if (!roleRepository.existsByName(roleName)) {
            Role role = new Role();

            role.setId(UUID.randomUUID().toString());
            role.setName(roleName);
            roleRepository.save(role);
        }

    }
}
