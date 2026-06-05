package com.ethiojobs.service;

import com.ethiojobs.dto.BookmarkDto;

import java.util.List;

public interface BookmarkService {
    void toggleBookmark(Long jobId, String userEmail);

    void removeBookmark(Long jobId, String userEmail);

    List<BookmarkDto> getMyBookmarks(String userEmail);
}
