package com.ethiojobs.service;

import com.ethiojobs.dto.CompanyDto;
import com.ethiojobs.dto.CompanyRequest;

import java.util.List;

public interface CompanyService {
    CompanyDto createOrUpdateCompany(CompanyRequest request, String userEmail);
    CompanyDto getCompanyById(Long id);
    CompanyDto getCompanyByOwnerEmail(String email);
    List<CompanyDto> getAllCompanies();
}
