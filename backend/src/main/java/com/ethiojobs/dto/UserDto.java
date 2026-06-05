package com.ethiojobs.dto;

import com.ethiojobs.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private boolean isVerified;
    private boolean isActive;
    private LocalDateTime createdAt;
}
