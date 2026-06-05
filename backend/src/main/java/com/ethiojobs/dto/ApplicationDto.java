package com.ethiojobs.dto;

import com.ethiojobs.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDto {
    private Long id;
    private String coverLetter;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
    private Long jobId;
    private String jobTitle;
    private Long userId;
    private String userName;
    private Long resumeId;
    private String resumeFileName;
}
