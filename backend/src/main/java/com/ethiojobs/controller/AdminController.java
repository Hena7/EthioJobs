package com.ethiojobs.controller;

import com.ethiojobs.dto.ApiResponse;
import com.ethiojobs.dto.UserDto;
import com.ethiojobs.repository.UserRepository;
import com.ethiojobs.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<Void>> updateUserStatus(@PathVariable Long id,
                                                               @RequestBody Map<String, Boolean> body) {
        adminService.updateUserStatus(id, body.get("active"));
        return ResponseEntity.ok(ApiResponse.success("User status updated", null));
    }

    @GetMapping("/analytics/overview")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOverview() {
        Map<String, Object> overview = adminService.getOverview();
        return ResponseEntity.ok(ApiResponse.success("Overview retrieved", overview));
    }

    @GetMapping("/analytics/users")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserAnalytics() {
        Map<String, Object> analytics = adminService.getUserAnalytics();
        return ResponseEntity.ok(ApiResponse.success("User analytics retrieved", analytics));
    }

    @GetMapping("/analytics/jobs")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getJobAnalytics() {
        Map<String, Object> analytics = adminService.getJobAnalytics();
        return ResponseEntity.ok(ApiResponse.success("Job analytics retrieved", analytics));
    }
}
