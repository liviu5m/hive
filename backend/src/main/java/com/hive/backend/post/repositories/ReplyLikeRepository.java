package com.hive.backend.post.repositories;

import com.hive.backend.post.models.CommentLike;
import com.hive.backend.post.models.ReplyLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReplyLikeRepository extends JpaRepository<ReplyLike, Long> {
    List<ReplyLike> findAllByReplyId(Long replyId);
}
