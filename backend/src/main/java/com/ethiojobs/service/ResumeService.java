package com.ethiojobs.service;

import com.ethiojobs.dto.ResumeDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ResumeService {
    ResumeDto uploadResume(MultipartFile file, String userEmail);
    List<ResumeDto> getMyResumes(String userEmail);
    void deleteResume(Long id, String userEmail);
}
