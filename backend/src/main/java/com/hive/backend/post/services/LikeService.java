package com.hive.backend.post.services;

import com.hive.backend.post.dtos.LikeDto;
import com.hive.backend.post.models.Like;
import com.hive.backend.post.models.Post;
import com.hive.backend.user.models.User;
import com.hive.backend.post.repositories.LikeRepository;
import com.hive.backend.post.repositories.PostRepository;
import com.hive.backend.user.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public LikeService(LikeRepository likeRepository, PostRepository postRepository, UserRepository userRepository) {
        this.likeRepository = likeRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public List<Like> getLikes(Long postId) {
        return likeRepository.findAllByPostId(postId);
    }

    public Like createLike(LikeDto likeDto) {
        User user = userRepository.findById(likeDto.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(likeDto.getPostId()).orElseThrow(() -> new RuntimeException("Post not found"));
        Like like = new Like(post, user);
        likeRepository.save(like);
        return like;
    }

    public void deleteLike(Long id) {
        likeRepository.deleteById(id);
    }
}
