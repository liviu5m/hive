package com.hive.backend.post.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostDto {

    private Long posterId;
    private String content;
    private String images;

}
