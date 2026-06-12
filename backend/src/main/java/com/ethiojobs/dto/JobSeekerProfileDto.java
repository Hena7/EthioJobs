package com.ethiojobs.dto;

import com.ethiojobs.entity.ExperienceLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobSeekerProfileDto {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String bio;
    private String skills;
    private String headline;
    private Double hourlyRate;
    private String categories;
    private String portfolioLinks;
    private String availability;
    private Double ratingAverage;
    private Integer completedJobs;
    private String location;
    private ExperienceLevel experienceLevel;
    private Double expectedSalary;
}
