package com.hive.backend.user.dtos;

import com.hive.backend.enums.FollowRequestStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FollowRequestDto {

    private Long followerId;
    private Long followingId;
    private FollowRequestStatus status = FollowRequestStatus.PENDING;

}
