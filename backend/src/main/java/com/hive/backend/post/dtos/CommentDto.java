package com.hive.backend.post.dtos;

import lombok.Getter;

@Getter
public class CommentDto {

    private Long postId;
    private Long userId;
    private String content;

}
