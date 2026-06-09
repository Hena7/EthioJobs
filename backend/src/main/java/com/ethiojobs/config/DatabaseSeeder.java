package com.ethiojobs.config;

import com.ethiojobs.entity.*;
import com.ethiojobs.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final ResumeRepository resumeRepository;
    private final BookmarkRepository bookmarkRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            log.info("Database is already seeded. Skipping seeding process.");
            return;
        }

        log.info("Seeding database with initial data...");
        String defaultPassword = passwordEncoder.encode("password123");
        Random random = new Random();

        // 1. Seed Users
        // Admin
        User admin = User.builder()
                .name("System Admin")
                .email("admin@ethiojobs.com")
                .password(defaultPassword)
                .role(Role.ADMIN)
                .isVerified(true)
                .isActive(true)
                .build();
        userRepository.save(admin);

        // Employers
        List<User> employers = new ArrayList<>();
        for (int i = 1; i <= 3; i++) {
            User employer = User.builder()
                    .name("Employer User " + i)
                    .email("employer" + i + "@ethiojobs.com")
                    .password(defaultPassword)
                    .role(Role.EMPLOYER)
                    .isVerified(true)
                    .isActive(true)
                    .build();
            employers.add(userRepository.save(employer));
        }

        // Job Seekers
        List<User> jobSeekers = new ArrayList<>();
        for (int i = 1; i <= 5; i++) {
            User seeker = User.builder()
                    .name("Job Seeker " + i)
                    .email("seeker" + i + "@ethiojobs.com")
                    .password(defaultPassword)
                    .role(Role.JOB_SEEKER)
                    .isVerified(true)
                    .isActive(true)
                    .build();
            
            JobSeekerProfile profile = JobSeekerProfile.builder()
                    .user(seeker)
                    .bio("Enthusiastic professional looking for opportunities. Seeker " + i)
                    .skills("Java, Spring Boot, React, Next.js, PostgreSQL")
                    .location("Addis Ababa, Ethiopia")
                    .experienceLevel(ExperienceLevel.values()[random.nextInt(ExperienceLevel.values().length)])
                    .expectedSalary(50000.0 + random.nextInt(50000))
                    .build();
            
            seeker.setJobSeekerProfile(profile);
            jobSeekers.add(userRepository.save(seeker));
        }

        // 2. Seed Companies
        List<Company> companies = new ArrayList<>();
        String[] companyNames = {"Tech Ethio", "Addis Systems", "Ethio Cloud Solutions"};
        String[] industries = {"Information Technology", "Software Development", "Cloud Computing"};
        for (int i = 0; i < employers.size(); i++) {
            Company company = Company.builder()
                    .name(companyNames[i])
                    .description("Leading " + industries[i] + " company in Ethiopia.")
                    .industry(industries[i])
                    .size("50-200 employees")
                    .location("Addis Ababa, Ethiopia")
                    .website("https://" + companyNames[i].toLowerCase().replace(" ", "") + ".com")
                    .isVerified(true)
                    .user(employers.get(i))
                    .build();
            companies.add(companyRepository.save(company));
        }

        // 3. Seed Jobs
        List<Job> jobs = new ArrayList<>();
        String[] jobTitles = {"Senior Backend Engineer", "Frontend Developer", "Full Stack Developer", "DevOps Engineer", "UI/UX Designer", "Product Manager", "Data Analyst", "QA Tester", "Mobile Developer", "Systems Administrator"};
        for (int i = 0; i < 15; i++) {
            Company company = companies.get(random.nextInt(companies.size()));
            Job job = Job.builder()
                    .title(jobTitles[random.nextInt(jobTitles.length)])
                    .description("We are looking for a talented professional to join our team at " + company.getName() + ".")
                    .requirements("3+ years of experience. Strong problem-solving skills. Excellent communication.")
                    .salaryMin(20000.0 + random.nextInt(30000))
                    .salaryMax(60000.0 + random.nextInt(40000))
                    .type(JobType.values()[random.nextInt(JobType.values().length)])
                    .location(company.getLocation())
                    .category(industries[random.nextInt(industries.length)])
                    .experienceLevel(ExperienceLevel.values()[random.nextInt(ExperienceLevel.values().length)])
                    .deadline(LocalDateTime.now().plusDays(15 + random.nextInt(30)))
                    .status(JobStatus.ACTIVE)
                    .isFeatured(random.nextBoolean())
                    .viewCount(random.nextInt(500))
                    .company(company)
                    .build();
            jobs.add(jobRepository.save(job));
        }

        // 4. Seed Resumes and Applications
        for (User seeker : jobSeekers) {
            Resume resume = Resume.builder()
                    .fileName(seeker.getName().replace(" ", "_") + "_Resume.pdf")
                    .fileUrl("https://example.com/resumes/" + seeker.getId() + ".pdf")
                    .fileSize(1024 * 1024)
                    .user(seeker)
                    .build();
            resume = resumeRepository.save(resume);

            // Apply to 2-4 random jobs
            int applicationsCount = 2 + random.nextInt(3);
            for (int j = 0; j < applicationsCount; j++) {
                Job job = jobs.get(random.nextInt(jobs.size()));
                
                // Avoid duplicate applications to the same job
                boolean alreadyApplied = applicationRepository.findAll().stream()
                        .anyMatch(a -> a.getUser().getId().equals(seeker.getId()) && a.getJob().getId().equals(job.getId()));
                
                if (!alreadyApplied) {
                    Application application = Application.builder()
                            .coverLetter("I am very interested in this position and believe my skills align perfectly with your requirements.")
                            .status(ApplicationStatus.values()[random.nextInt(ApplicationStatus.values().length)])
                            .job(job)
                            .user(seeker)
                            .resume(resume)
                            .build();
                    applicationRepository.save(application);
                }
            }

            // 5. Seed Bookmarks
            int bookmarksCount = 1 + random.nextInt(3);
            for (int k = 0; k < bookmarksCount; k++) {
                Job job = jobs.get(random.nextInt(jobs.size()));
                
                // Avoid duplicate bookmarks
                boolean alreadyBookmarked = bookmarkRepository.findAll().stream()
                        .anyMatch(b -> b.getUser().getId().equals(seeker.getId()) && b.getJob().getId().equals(job.getId()));
                
                if (!alreadyBookmarked) {
                    Bookmark bookmark = Bookmark.builder()
                            .user(seeker)
                            .job(job)
                            .build();
                    bookmarkRepository.save(bookmark);
                }
            }
        }

        log.info("Database seeding completed successfully!");
    }
}
