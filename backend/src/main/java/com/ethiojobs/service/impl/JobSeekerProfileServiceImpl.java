package com.ethiojobs.service.impl;

import com.ethiojobs.dto.JobSeekerProfileDto;
import com.ethiojobs.dto.JobSeekerProfileRequest;
import com.ethiojobs.entity.JobSeekerProfile;
import com.ethiojobs.entity.User;
import com.ethiojobs.exception.ResourceNotFoundException;
import com.ethiojobs.repository.JobSeekerProfileRepository;
import com.ethiojobs.repository.UserRepository;
import com.ethiojobs.service.JobSeekerProfileService;
import org.springframework.stereotype.Service;

@Service
public class JobSeekerProfileServiceImpl implements JobSeekerProfileService {

    private final JobSeekerProfileRepository profileRepository;
    private final UserRepository userRepository;

    public JobSeekerProfileServiceImpl(JobSeekerProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    @Override
    public JobSeekerProfileDto getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        JobSeekerProfile profile = profileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    JobSeekerProfile newProfile = JobSeekerProfile.builder()
                            .user(user)
                            .build();
                    return profileRepository.save(newProfile);
                });

        return mapToDto(profile);
    }

    @Override
    public JobSeekerProfileDto getProfileByUserId(Long userId) {
        JobSeekerProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile", "userId", userId));
        return mapToDto(profile);
    }

    @Override
    public JobSeekerProfileDto updateProfile(JobSeekerProfileRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        JobSeekerProfile profile = profileRepository.findByUserId(user.getId())
                .orElseGet(() -> JobSeekerProfile.builder().user(user).build());

        profile.setBio(request.getBio());
        profile.setSkills(request.getSkills());
        profile.setHeadline(request.getHeadline());
        profile.setHourlyRate(request.getHourlyRate());
        profile.setCategories(request.getCategories());
        profile.setPortfolioLinks(request.getPortfolioLinks());
        profile.setAvailability(request.getAvailability());
        profile.setLocation(request.getLocation());
        profile.setExperienceLevel(request.getExperienceLevel());
        profile.setExpectedSalary(request.getExpectedSalary());

        JobSeekerProfile savedProfile = profileRepository.save(profile);
        return mapToDto(savedProfile);
    }

    private JobSeekerProfileDto mapToDto(JobSeekerProfile profile) {
        return JobSeekerProfileDto.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .name(profile.getUser().getName())
                .email(profile.getUser().getEmail())
                .bio(profile.getBio())
                .skills(profile.getSkills())
                .headline(profile.getHeadline())
                .hourlyRate(profile.getHourlyRate())
                .categories(profile.getCategories())
                .portfolioLinks(profile.getPortfolioLinks())
                .availability(profile.getAvailability())
                .ratingAverage(profile.getRatingAverage())
                .completedJobs(profile.getCompletedJobs())
                .location(profile.getLocation())
                .experienceLevel(profile.getExperienceLevel())
                .expectedSalary(profile.getExpectedSalary())
                .build();
    }
}
