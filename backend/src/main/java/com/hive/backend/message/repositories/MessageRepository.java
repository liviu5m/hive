package com.hive.backend.message.repositories;

import com.hive.backend.message.models.Message;
import com.hive.backend.user.models.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderAndReceiverOrReceiverAndSenderOrderByCreatedAtAsc(
            User sender1, User receiver1, User sender2, User receiver2
    );
    @Query("SELECT DISTINCT u FROM User u " +
            "WHERE (u IN (SELECT m.sender FROM Message m WHERE m.receiver.id = :userId) " +
            "OR u IN (SELECT m.receiver FROM Message m WHERE m.sender.id = :userId)) " +
            "AND u.id <> :userId")
    List<User> findOtherUsersByMessageWithUser(@Param("userId") Long userId);
    Optional<Message> findById(String id);
    void deleteById(String id);
}
