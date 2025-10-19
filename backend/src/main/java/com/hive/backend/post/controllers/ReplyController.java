package com.hive.backend.post.controllers;

import com.hive.backend.post.dtos.CommentDto;
import com.hive.backend.post.dtos.CommentUpdateDto;
import com.hive.backend.post.dtos.ReplyDto;
import com.hive.backend.post.models.Comment;
import com.hive.backend.post.models.Reply;
import com.hive.backend.post.services.ReplyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reply")
public class ReplyController {

    private final ReplyService replyService;

    public ReplyController(ReplyService replyService) {
        this.replyService = replyService;
    }

    @GetMapping
    public List<Reply> findByCommentId(@RequestParam Long commentId) {
        return replyService.findByCommentId(commentId);
    }

    @PostMapping
    public Reply saveReply(@RequestBody ReplyDto replyDto) {
        return replyService.saveReply(replyDto);
    }

    @PutMapping("/{id}")
    public Reply updateReply(@PathVariable Long id, @RequestBody ReplyDto replyDto) {
        return replyService.updateReply(id, replyDto.getContent());
    }

    @DeleteMapping("/{id}")
    public void deleteReply(@PathVariable Long id) {
        replyService.deleteReply(id);
    }
}
