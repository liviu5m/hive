package com.hive.backend.user.controllers;

import com.hive.backend.user.dtos.FollowRequestDto;
import com.hive.backend.enums.FollowRequestStatus;
import com.hive.backend.user.models.FollowRequest;
import com.hive.backend.user.services.FollowRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follow-request")
public class FollowRequestController {

    private final FollowRequestService followRequestService;

    public FollowRequestController(FollowRequestService followRequestService) {
        this.followRequestService = followRequestService;
    }

    @GetMapping
    public List<FollowRequest> getFollowRequests(@RequestParam Long followerId, @RequestParam Long followingId, @RequestParam FollowRequestStatus status) {
        return followRequestService.findRequests(followerId, followingId, status);
    }

    @GetMapping("/check")
    public ResponseEntity<?> getRequestByIds(@RequestParam Long followerId, @RequestParam Long followingId) {
        return ResponseEntity.ok(followRequestService.getRequestByIds(followerId, followingId));
    }

    @PostMapping
    public ResponseEntity<?> addFollowRequest(@RequestBody FollowRequestDto followRequestDto) {
        FollowRequest followRequest = followRequestService.createRequest(followRequestDto);
        return ResponseEntity.ok(followRequest);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> addFollowRequest(@PathVariable Long id, @RequestBody FollowRequestDto followRequestDto) {
        FollowRequest followRequest = followRequestService.updateRequest(id, followRequestDto);
        return ResponseEntity.ok(followRequest);
    }

    @DeleteMapping
    public void removeFollowRequest(@RequestParam Long followerId, @RequestParam Long followingId) {
        followRequestService.deleteRequest(followerId, followingId);
    }
}
