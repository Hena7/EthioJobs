package com.ethiojobs.service;

import com.ethiojobs.dto.NotificationDto;

import java.util.List;

public interface NotificationService {
    void createNotification(Long userId, String title, String message, String type);
    List<NotificationDto> getMyNotifications(String userEmail);
    void markAsRead(Long id, String userEmail);
    void markAllAsRead(String userEmail);
}
