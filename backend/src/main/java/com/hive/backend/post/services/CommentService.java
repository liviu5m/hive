package com.hive.backend.post.services;

import com.hive.backend.post.dtos.CommentDto;
import com.hive.backend.post.models.Comment;
import com.hive.backend.post.models.Post;
import com.hive.backend.user.models.User;
import com.hive.backend.post.repositories.CommentRepository;
import com.hive.backend.post.repositories.PostRepository;
import com.hive.backend.user.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public CommentService(CommentRepository commentRepository, UserRepository userRepository, PostRepository postRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    public Page<Comment> findByPostId(Long postId, int page, int size) {
        Pageable pageable =  PageRequest.of(0, (page + 1) * size);
        return commentRepository.findByPostId(postId, pageable);
    }

    public Comment saveComment(CommentDto commentDto) {
        User user = userRepository.findById(commentDto.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(commentDto.getPostId()).orElseThrow(() -> new RuntimeException("Post not found"));
        Comment comment = new Comment(post, user, commentDto.getContent());
        commentRepository.save(comment);
        return comment;
    }

    @Transactional
    public Comment updateComment(Long id, String content) {
        Comment comment = commentRepository.findById(id).orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setContent(content);
        commentRepository.save(comment);
        return comment;
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }


    public Long findCommentsAndRepliesByPostId(Long postId) {
        return commentRepository.countCommentsAndRepliesByPostId(postId);
    }
}
