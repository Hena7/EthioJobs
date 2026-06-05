package com.ethiojobs.service.impl;

import com.ethiojobs.dto.BookmarkDto;
import com.ethiojobs.entity.Bookmark;
import com.ethiojobs.entity.Job;
import com.ethiojobs.entity.User;
import com.ethiojobs.exception.ResourceNotFoundException;
import com.ethiojobs.repository.BookmarkRepository;
import com.ethiojobs.repository.JobRepository;
import com.ethiojobs.repository.UserRepository;
import com.ethiojobs.service.BookmarkService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookmarkServiceImpl implements BookmarkService {

        private final BookmarkRepository bookmarkRepository;
        private final UserRepository userRepository;
        private final JobRepository jobRepository;

        public BookmarkServiceImpl(BookmarkRepository bookmarkRepository,
                        UserRepository userRepository,
                        JobRepository jobRepository) {
                this.bookmarkRepository = bookmarkRepository;
                this.userRepository = userRepository;
                this.jobRepository = jobRepository;
        }

        @Override
        @Transactional
        public void toggleBookmark(Long jobId, String userEmail) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

                Job job = jobRepository.findById(jobId)
                                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

                bookmarkRepository.findByUserIdAndJobId(user.getId(), jobId)
                                .ifPresentOrElse(
                                                bookmarkRepository::delete,
                                                () -> {
                                                        Bookmark bookmark = Bookmark.builder()
                                                                        .user(user)
                                                                        .job(job)
                                                                        .build();
                                                        bookmarkRepository.save(bookmark);
                                                });
        }

        @Override
        @Transactional
        public void removeBookmark(Long jobId, String userEmail) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

                bookmarkRepository.findByUserIdAndJobId(user.getId(), jobId)
                                .ifPresent(bookmarkRepository::delete);
        }

        @Override
        public List<BookmarkDto> getMyBookmarks(String userEmail) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

                return bookmarkRepository.findByUserId(user.getId()).stream()
                                .map(this::toDto)
                                .toList();
        }

        private BookmarkDto toDto(Bookmark bookmark) {
                return BookmarkDto.builder()
                                .id(bookmark.getId())
                                .jobId(bookmark.getJob().getId())
                                .jobTitle(bookmark.getJob().getTitle())
                                .companyName(bookmark.getJob().getCompany().getName())
                                .createdAt(bookmark.getCreatedAt())
                                .build();
        }
}
