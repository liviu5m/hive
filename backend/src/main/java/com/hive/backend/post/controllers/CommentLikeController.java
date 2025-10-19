package com.hive.backend.post.controllers;

import com.hive.backend.post.dtos.CommentLikeDto;
import com.hive.backend.post.dtos.LikeDto;
import com.hive.backend.post.models.CommentLike;
import com.hive.backend.post.services.CommentLikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comment-like")
public class CommentLikeController {

    private final CommentLikeService commentLikeService;

    public CommentLikeController(CommentLikeService commentLikeService) {
        this.commentLikeService = commentLikeService;
    }

    @GetMapping
    public ResponseEntity<List<CommentLike>> getCommentLikes(@RequestParam Long commentId){
        return ResponseEntity.ok(commentLikeService.getCommentLikes(commentId));
    }

    @PostMapping
    public ResponseEntity<?> addCommentLike(@RequestBody CommentLikeDto commentLikeDto) {
        try {
            return ResponseEntity.ok(commentLikeService.addCommentLike(commentLikeDto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void deleteLike(@PathVariable Long id) {
        commentLikeService.deleteCommentLike(id);
    }

}
