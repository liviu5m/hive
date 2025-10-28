package com.hive.backend.message.dtos;

import lombok.Getter;

import java.util.Date;

@Getter
public class MessageDto {

    private String id;
    private Long senderId;
    private Long receiverId;
    private String content;
    private Date createdAt;

}
