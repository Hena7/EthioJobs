package com.ethiojobs.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyRequest {
    @NotBlank
    private String name;

    private String logo;
    private String website;
    private String description;
    private String industry;
    private String size;
    private String location;
}
