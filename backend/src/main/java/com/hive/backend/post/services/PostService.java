package com.hive.backend.post.services;

import com.hive.backend.post.dtos.PostDto;
import com.hive.backend.post.models.Post;
import com.hive.backend.user.models.User;
import com.hive.backend.post.repositories.PostRepository;
import com.hive.backend.user.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public List<Post> findAll() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Post> findPostsByUserId(Long userId) {
        return postRepository.findAllByPosterIdOrderByCreatedAtDesc(userId);
    }

    public Optional<Post> findById(Long id) {
        return postRepository.findById(id);
    }

    public ResponseEntity<?> createPost(PostDto postDto) {
        try {
            User poster = userRepository.findById(postDto.getPosterId()).orElseThrow(() -> new RuntimeException("Poster not found"));
            Post post = new Post(poster, postDto.getContent(), postDto.getImages());
            return ResponseEntity.ok(postRepository.save(post));
        }catch(Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public Post updatePost(Long id, PostDto postDto) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        User poster = userRepository.findById(postDto.getPosterId()).orElseThrow(() -> new RuntimeException("Poster not found"));
        post.setPoster(poster);
        post.setContent(postDto.getContent());
        post.setImages(postDto.getImages());
        return postRepository.save(post);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}
