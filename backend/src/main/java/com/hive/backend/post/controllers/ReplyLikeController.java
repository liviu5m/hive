package com.hive.backend.post.controllers;

import com.hive.backend.post.dtos.LikeDto;
import com.hive.backend.post.dtos.ReplyLikeDto;
import com.hive.backend.post.models.Like;
import com.hive.backend.post.models.ReplyLike;
import com.hive.backend.post.services.ReplyLikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reply-like")
public class ReplyLikeController {

    private final ReplyLikeService replyLikeService;

    public ReplyLikeController(ReplyLikeService replyLikeService) {
        this.replyLikeService = replyLikeService;
    }

    @GetMapping
    public ResponseEntity<List<ReplyLike>> getReplyLikes(@RequestParam Long replyId){
        return ResponseEntity.ok(replyLikeService.getReplyLikes(replyId));
    }

    @PostMapping
    public ResponseEntity<?> addReplyLike(@RequestBody ReplyLikeDto replyLikeDto) {
        try {
            return ResponseEntity.ok(replyLikeService.createReplyLike(replyLikeDto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void deleteReplyLike(@PathVariable Long id) {
        replyLikeService.deleteReplyLike(id);
    }
}
