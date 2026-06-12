package com.ethiojobs.service.impl;

import com.ethiojobs.dto.CompanyDto;
import com.ethiojobs.dto.CompanyRequest;
import com.ethiojobs.entity.Company;
import com.ethiojobs.entity.User;
import com.ethiojobs.exception.ResourceNotFoundException;
import com.ethiojobs.repository.CompanyRepository;
import com.ethiojobs.repository.UserRepository;
import com.ethiojobs.service.CompanyService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public CompanyServiceImpl(CompanyRepository companyRepository,
                              UserRepository userRepository) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public CompanyDto createOrUpdateCompany(CompanyRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Company company = companyRepository.findByUserId(user.getId())
                .orElse(Company.builder().user(user).build());

        company.setName(request.getName());
        company.setLogo(request.getLogo());
        company.setWebsite(request.getWebsite());
        company.setDescription(request.getDescription());
        company.setIndustry(request.getIndustry());
        company.setSize(request.getSize());
        company.setLocation(request.getLocation());

        company = companyRepository.save(company);
        return toDto(company);
    }

    @Override
    public CompanyDto getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", id));
        return toDto(company);
    }

    @Override
    public List<CompanyDto> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public CompanyDto getCompanyByOwnerEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        Company company = companyRepository.findByUserId(user.getId())
                .orElse(null);
        if (company == null) {
            return CompanyDto.builder()
                    .userId(user.getId())
                    .name("")
                    .build();
        }
        return toDto(company);
    }

    private CompanyDto toDto(Company company) {
        return CompanyDto.builder()
                .id(company.getId())
                .name(company.getName())
                .logo(company.getLogo())
                .website(company.getWebsite())
                .description(company.getDescription())
                .industry(company.getIndustry())
                .size(company.getSize())
                .location(company.getLocation())
                .isVerified(company.isVerified())
                .userId(company.getUser().getId())
                .totalJobs(company.getJobs() != null ? company.getJobs().size() : 0)
                .build();
    }
}
