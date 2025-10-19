package com.hive.backend.post.services;

import com.hive.backend.post.dtos.ReplyDto;
import com.hive.backend.post.models.Comment;
import com.hive.backend.post.models.Reply;
import com.hive.backend.user.models.User;
import com.hive.backend.post.repositories.CommentRepository;
import com.hive.backend.post.repositories.ReplyRepository;
import com.hive.backend.user.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReplyService {

    private final ReplyRepository replyRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    public ReplyService(ReplyRepository replyRepository, UserRepository userRepository, CommentRepository commentRepository) {
        this.replyRepository = replyRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    public List<Reply> findByCommentId(Long commentId) {
        return replyRepository.findByCommentId(commentId);
    }

    public Reply saveReply(ReplyDto replyDto) {
        Comment comment = commentRepository.findById(replyDto.getCommentId()).orElseThrow(() -> new RuntimeException("Comment not found"));
        User user = userRepository.findById(replyDto.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        Reply reply = new Reply(comment, user, replyDto.getContent());
        return replyRepository.save(reply);
    }

    public Reply updateReply(Long id, String content) {
        Reply reply = replyRepository.findById(id).orElseThrow(() -> new RuntimeException("Reply not found"));
        reply.setContent(content);
        return replyRepository.save(reply);
    }

    public void deleteReply(Long id) {
        replyRepository.deleteById(id);
    }

}
