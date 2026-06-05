package com.ethiojobs.service.impl;

import com.ethiojobs.dto.ResumeDto;
import com.ethiojobs.entity.Resume;
import com.ethiojobs.entity.User;
import com.ethiojobs.exception.BadRequestException;
import com.ethiojobs.exception.ResourceNotFoundException;
import com.ethiojobs.repository.ResumeRepository;
import com.ethiojobs.repository.UserRepository;
import com.ethiojobs.service.FileStorageService;
import com.ethiojobs.service.ResumeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public ResumeServiceImpl(ResumeRepository resumeRepository,
                             UserRepository userRepository,
                             FileStorageService fileStorageService) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    @Transactional
    public ResumeDto uploadResume(MultipartFile file, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            throw new BadRequestException("Only PDF files are allowed");
        }

        String fileUrl = fileStorageService.storeFile(file, "resumes");

        Resume resume = Resume.builder()
                .fileName(file.getOriginalFilename())
                .fileUrl(fileUrl)
                .fileSize(file.getSize())
                .user(user)
                .build();

        resume = resumeRepository.save(resume);
        return toDto(resume);
    }

    @Override
    public List<ResumeDto> getMyResumes(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        return resumeRepository.findByUserId(user.getId()).stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional
    public void deleteResume(Long id, String userEmail) {
        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", "id", id));

        if (!resume.getUser().getEmail().equals(userEmail)) {
            throw new BadRequestException("Resume does not belong to you");
        }

        fileStorageService.deleteFile(resume.getFileUrl());
        resumeRepository.delete(resume);
    }

    private ResumeDto toDto(Resume resume) {
        return ResumeDto.builder()
                .id(resume.getId())
                .fileName(resume.getFileName())
                .fileUrl(resume.getFileUrl())
                .fileSize(resume.getFileSize())
                .uploadedAt(resume.getUploadedAt())
                .build();
    }
}
