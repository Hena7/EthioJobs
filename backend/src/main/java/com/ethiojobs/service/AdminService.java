package com.ethiojobs.service;

import com.ethiojobs.dto.UserDto;

import java.util.List;
import java.util.Map;

public interface AdminService {
    List<UserDto> getAllUsers();
    void updateUserStatus(Long userId, boolean active);
    Map<String, Object> getOverview();
    Map<String, Object> getUserAnalytics();
    Map<String, Object> getJobAnalytics();
}
