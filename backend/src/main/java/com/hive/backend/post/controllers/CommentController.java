package com.hive.backend.post.controllers;

import com.hive.backend.post.dtos.CommentDto;
import com.hive.backend.post.dtos.CommentUpdateDto;
import com.hive.backend.post.models.Comment;
import com.hive.backend.post.services.CommentService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comment")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public Page<Comment> findByPostId(@RequestParam Long postId,
                                      @RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "10") int size) {
        return commentService.findByPostId(postId, page, size);
    }

    @GetMapping("/reply")
    public Long findCommentsAndRepliesByPostId(@RequestParam Long postId) {
        return commentService.findCommentsAndRepliesByPostId(postId);
    }

    @PostMapping
    public Comment saveComment(@RequestBody CommentDto commentDto) {
        return commentService.saveComment(commentDto);
    }

    @PutMapping("/{id}")
    public Comment updateComment(@PathVariable Long id, @RequestBody CommentUpdateDto commentDto) {
        return commentService.updateComment(id, commentDto.getContent());
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
    }
}
