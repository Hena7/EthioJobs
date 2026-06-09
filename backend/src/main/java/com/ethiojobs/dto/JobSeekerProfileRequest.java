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
public class JobSeekerProfileRequest {
    private String bio;
    private String skills;
    private String location;
    private ExperienceLevel experienceLevel;
    private Double expectedSalary;
}
