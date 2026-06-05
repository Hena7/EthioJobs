package com.ethiojobs.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyDto {
    private Long id;
    private String name;
    private String logo;
    private String website;
    private String description;
    private String industry;
    private String size;
    private String location;
    private boolean isVerified;
    private Long userId;
    private int totalJobs;
}
