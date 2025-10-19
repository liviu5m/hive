package com.hive.backend.post.services;

import com.hive.backend.post.dtos.LikeDto;
import com.hive.backend.post.dtos.ReplyLikeDto;
import com.hive.backend.post.models.Like;
import com.hive.backend.post.models.Post;
import com.hive.backend.post.models.Reply;
import com.hive.backend.post.models.ReplyLike;
import com.hive.backend.post.repositories.ReplyLikeRepository;
import com.hive.backend.post.repositories.ReplyRepository;
import com.hive.backend.user.models.User;
import com.hive.backend.user.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReplyLikeService {

    private final ReplyLikeRepository replyLikeRepository;
    private final ReplyRepository replyRepository;
    private final UserRepository userRepository;

    public ReplyLikeService(ReplyLikeRepository replyLikeRepository, ReplyRepository replyRepository, UserRepository userRepository) {
        this.replyLikeRepository = replyLikeRepository;
        this.replyRepository = replyRepository;
        this.userRepository = userRepository;
    }

    public List<ReplyLike> getReplyLikes(Long replyId) {
        return replyLikeRepository.findAllByReplyId(replyId);
    }

    public ReplyLike createReplyLike(ReplyLikeDto replyLikeDto) {
        User user = userRepository.findById(replyLikeDto.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        Reply reply = replyRepository.findById(replyLikeDto.getReplyId()).orElseThrow(() -> new RuntimeException("Reply not found"));
        ReplyLike replyLike = new ReplyLike(reply, user);
        replyLikeRepository.save(replyLike);
        return replyLike;
    }

    public void deleteReplyLike(Long id) {
        replyLikeRepository.deleteById(id);
    }
}
