package com.hive.backend.user.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyDto {

    private Long userId;
    private String code;

}
