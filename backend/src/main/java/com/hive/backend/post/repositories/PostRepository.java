package com.hive.backend.post.repositories;

import com.hive.backend.post.models.Post;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByOrderByCreatedAtDesc();
    @Query("""
        SELECT p FROM Post p
        WHERE LOWER(p.content) LIKE LOWER(CONCAT('%', :search, '%'))
           OR LOWER(p.poster.name) LIKE LOWER(CONCAT('%', :search, '%'))
        ORDER BY p.createdAt DESC
    """)
    List<Post> searchPosts(@Param("search") String search);
    List<Post> findAllByPosterIdOrderByCreatedAtDesc(Long userId);

}
