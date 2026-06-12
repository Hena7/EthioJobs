package com.ethiojobs.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "job_seeker_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobSeekerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String skills;

    private String headline;

    private Double hourlyRate;

    private String categories;

    @Column(columnDefinition = "TEXT")
    private String portfolioLinks;

    private String availability;

    private Double ratingAverage;

    private Integer completedJobs;

    private String location;

    @Enumerated(EnumType.STRING)
    private ExperienceLevel experienceLevel;

    private Double expectedSalary;
}
