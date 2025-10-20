package com.hive.backend.post.repositories;

import com.hive.backend.post.models.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostId(Long postId);
    @Query(value = """
        SELECT COUNT(*) AS total_count 
        FROM (
            SELECT id FROM comment WHERE post_id = :postId
            UNION ALL
            SELECT id FROM reply WHERE comment_id IN (SELECT id FROM comment WHERE post_id = :postId)
        ) AS combined
        """, nativeQuery = true)
    Long countCommentsAndRepliesByPostId(@Param("postId") Long postId);

}
