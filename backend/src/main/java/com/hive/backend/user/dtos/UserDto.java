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

    @Override
    public String toString() {
        return "UserDto{" +
                "name='" + name + '\'' +
                ", username='" + username + '\'' +
                ", profilePicture='" + profilePicture + '\'' +
                ", coverPicture='" + coverPicture + '\'' +
                ", bio='" + bio + '\'' +
                ", location='" + location + '\'' +
                '}';
    }
}
