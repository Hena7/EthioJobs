package com.ethiojobs.controller;

import com.ethiojobs.dto.ApiResponse;
import com.ethiojobs.dto.BookmarkDto;
import com.ethiojobs.security.CustomUserDetails;
import com.ethiojobs.service.BookmarkService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @PostMapping("/{jobId}")
    @PreAuthorize("hasAnyRole('JOB_SEEKER', 'FREELANCER')")
    public ResponseEntity<ApiResponse<Void>> toggleBookmark(@PathVariable Long jobId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        bookmarkService.toggleBookmark(jobId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Bookmark toggled", null));
    }

    @DeleteMapping("/{jobId}")
    @PreAuthorize("hasAnyRole('JOB_SEEKER', 'FREELANCER')")
    public ResponseEntity<ApiResponse<Void>> removeBookmark(@PathVariable Long jobId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        bookmarkService.removeBookmark(jobId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Bookmark removed", null));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasAnyRole('JOB_SEEKER', 'FREELANCER')")
    public ResponseEntity<ApiResponse<List<BookmarkDto>>> getMyBookmarks(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<BookmarkDto> bookmarks = bookmarkService.getMyBookmarks(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Bookmarks retrieved", bookmarks));
    }
}
