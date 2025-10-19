package com.hive.backend.user.repositories;

import com.hive.backend.enums.FollowRequestStatus;
import com.hive.backend.user.models.FollowRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRequestRepository extends JpaRepository<FollowRequest, Long> {
    void deleteByFollowerIdAndFollowingId(Long followerId, Long followingId);

    Optional<FollowRequest> findByFollowerIdAndFollowingId(Long followerId, Long followingId);

    List<FollowRequest> findByFollowerId(Long followerId);

    List<FollowRequest> findByFollowingId(Long followingId);

    @Query("SELECT fr FROM FollowRequest fr WHERE " +
            "(:followerId = -1 OR fr.follower.id = :followerId) AND " +
            "(:followingId = -1 OR fr.following.id = :followingId) AND " +
            "(:status IS NULL OR fr.status = :status)")
    List<FollowRequest> findRequests(
            @Param("followerId") Long followerId,
            @Param("followingId") Long followingId,
            @Param("status") FollowRequestStatus status
    );

}
