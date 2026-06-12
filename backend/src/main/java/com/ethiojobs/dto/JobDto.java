package com.ethiojobs.dto;

import com.ethiojobs.entity.ExperienceLevel;
import com.ethiojobs.entity.JobStatus;
import com.ethiojobs.entity.JobType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobDto {
    private Long id;
    private String title;
    private String description;
    private String requirements;
    private Double salaryMin;
    private Double salaryMax;
    private Double fixedBudget;
    private Double hourlyRateMin;
    private Double hourlyRateMax;
    private String requiredSkills;
    private String projectLength;
    private boolean hourlyProject;
    private JobType type;
    private String location;
    private String category;
    private ExperienceLevel experienceLevel;
    private LocalDateTime deadline;
    private JobStatus status;
    private boolean isFeatured;
    private int viewCount;
    private Long companyId;
    private String companyName;
    private String companyLogo;
    private LocalDateTime createdAt;
}
