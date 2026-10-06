package com.Revora.Revora_Main.repository;

import com.Revora.Revora_Main.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository  extends JpaRepository<Role, String> {

    boolean existsByName(String name);

    Optional<Role> findByName(String name);

}
