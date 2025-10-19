package com.hive.backend.post.services;

import com.hive.backend.post.dtos.CommentLikeDto;
import com.hive.backend.post.models.Comment;
import com.hive.backend.post.models.CommentLike;
import com.hive.backend.post.models.Like;
import com.hive.backend.post.repositories.CommentLikeRepository;
import com.hive.backend.post.repositories.CommentRepository;
import com.hive.backend.user.models.User;
import com.hive.backend.user.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentLikeService {

    private final CommentLikeRepository commentLikeRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public CommentLikeService(CommentLikeRepository commentLikeRepository, CommentRepository commentRepository, UserRepository userRepository) {
        this.commentLikeRepository = commentLikeRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }

    public List<CommentLike> getCommentLikes(Long commentId) {
        return commentLikeRepository.findAllByCommentId(commentId);
    }

    public CommentLike addCommentLike(CommentLikeDto commentLikeDto) {
        Comment comment = commentRepository.findById(commentLikeDto.getCommentId()).orElseThrow(() -> new RuntimeException("Comment not found"));
        User user = userRepository.findById(commentLikeDto.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        CommentLike commentLike = new CommentLike(comment, user);
        return commentLikeRepository.save(commentLike);
    }

    public void deleteCommentLike(Long id) {
        commentLikeRepository.deleteById(id);
    }
}
