package com.ethiojobs.dto;

import com.ethiojobs.entity.ExperienceLevel;
import com.ethiojobs.entity.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    private String requirements;
    private Double salaryMin;
    private Double salaryMax;
    private Double fixedBudget;
    private Double hourlyRateMin;
    private Double hourlyRateMax;
    private String requiredSkills;
    private String projectLength;
    private Boolean hourlyProject;

    @NotNull
    private JobType type;

    @NotBlank
    private String location;

    @NotBlank
    private String category;

    @NotNull
    private ExperienceLevel experienceLevel;

    @NotNull
    private LocalDateTime deadline;
}
