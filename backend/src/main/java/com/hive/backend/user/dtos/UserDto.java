package com.hive.backend.user.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {
    private String name;
    private String username;
    private String profilePicture;
    private String coverPicture;
    private String bio;
    private String location;
}
