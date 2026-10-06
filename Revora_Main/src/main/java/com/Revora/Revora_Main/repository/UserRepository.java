package com.Revora.Revora_Main.repository;

import com.Revora.Revora_Main.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
//    List<User> findAll(User user);

    Optional<User> findByUsername(String username);

    Long id(Long id);

    Optional<User> findByPassword(String password);

    User deleteUserById(Long id);
}
