package com.hive.backend.post.controllers;

import com.hive.backend.post.dtos.LikeDto;
import com.hive.backend.post.models.Like;
import com.hive.backend.post.services.LikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/like")
@RestController
public class LikeController {

    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @GetMapping
    public ResponseEntity<List<Like>> getLikes(@RequestParam Long postId){
        return ResponseEntity.ok(likeService.getLikes(postId));
    }

    @PostMapping
    public ResponseEntity<?> addLike(@RequestBody LikeDto likeDto) {
        try {
            return ResponseEntity.ok(likeService.createLike(likeDto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void deleteLike(@PathVariable Long id) {
        likeService.deleteLike(id);
    }
}
