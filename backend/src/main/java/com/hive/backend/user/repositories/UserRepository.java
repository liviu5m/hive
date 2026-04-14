package com.hive.backend.user.repositories;

import com.hive.backend.user.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Page<User> findByUsernameContainingIgnoreCaseOrNameContainingIgnoreCase(
            String username,
            String name,
            Pageable pageable
    );
    Optional<User> findByUsernameContainingIgnoreCase(String username);
    Page<User> findAll(Pageable pageable);
}
