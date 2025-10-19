package com.hive.backend.post.dtos;

import lombok.Getter;

@Getter
public class ReplyDto {

    private Long commentId;
    private Long userId;
    private String content;

}
