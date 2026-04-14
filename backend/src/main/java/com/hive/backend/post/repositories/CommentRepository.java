package com.hive.backend.post.repositories;

import com.hive.backend.post.models.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByPostId(Long postId, Pageable pageable);
    @Query("""
    SELECT 
        COALESCE(
            (SELECT COUNT(c) FROM Comment c WHERE c.post.id = :postId), 
            0
        ) + 
        COALESCE(
            (SELECT COUNT(r) FROM Reply r WHERE r.comment.post.id = :postId), 
            0
        )
    """)
    Long countCommentsAndRepliesByPostId(@Param("postId") Long postId);

}
