package com.hive.backend.user.services;

import com.hive.backend.user.dtos.FollowRequestDto;
import com.hive.backend.enums.FollowRequestStatus;
import com.hive.backend.user.models.FollowRequest;
import com.hive.backend.user.models.User;
import com.hive.backend.user.repositories.FollowRequestRepository;
import com.hive.backend.user.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FollowRequestService {

    private final FollowRequestRepository followRequestRepository;
    private final UserRepository userRepository;

    public FollowRequestService(FollowRequestRepository followRequestRepository, UserRepository userRepository) {
        this.followRequestRepository = followRequestRepository;
        this.userRepository = userRepository;
    }

    public FollowRequest createRequest(FollowRequestDto followRequestDto) {
        User follower = userRepository.findById(followRequestDto.getFollowerId()).orElseThrow(() -> new RuntimeException("Follower not found"));
        User following = userRepository.findById(followRequestDto.getFollowingId()).orElseThrow(() -> new RuntimeException("Following not found"));
        FollowRequest followRequest = new FollowRequest(follower, following, followRequestDto.getStatus());
        return followRequestRepository.save(followRequest);
    }

    public List<FollowRequest> findRequests(Long followerId, Long followingId, FollowRequestStatus status) {
        return followRequestRepository.findRequests(
                followerId != null ? followerId : -1L,
                followingId != null ? followingId : -1L,
                status
        );
    }

    public FollowRequest updateRequest(Long id, FollowRequestDto followRequestDto) {
        FollowRequest followRequest = followRequestRepository.findById(id).orElseThrow(() -> new RuntimeException("Follow Request not found"));
        User follower = userRepository.findById(followRequestDto.getFollowerId()).orElseThrow(() -> new RuntimeException("Follower not found"));
        User following = userRepository.findById(followRequestDto.getFollowingId()).orElseThrow(() -> new RuntimeException("Following not found"));
        followRequest.setStatus(followRequestDto.getStatus());
        followRequest.setFollower(follower);
        followRequest.setFollowing(following);
        return followRequestRepository.save(followRequest);
    }

    @Transactional
    public void deleteRequest(Long followerId, Long followingId) {
        followRequestRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
    }

    public FollowRequest getRequestByIds(Long followerId,  Long followingId) {
        return followRequestRepository.findByFollowerIdAndFollowingId(followerId, followingId).orElseThrow(() -> new RuntimeException("Follow Request not found"));
    }
}
