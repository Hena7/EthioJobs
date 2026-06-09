package com.ethiojobs.controller;

import com.ethiojobs.dto.ApiResponse;
import com.ethiojobs.dto.CompanyDto;
import com.ethiojobs.dto.CompanyRequest;
import com.ethiojobs.security.CustomUserDetails;
import com.ethiojobs.service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CompanyDto>>> getAll() {
        List<CompanyDto> companies = companyService.getAllCompanies();
        return ResponseEntity.ok(ApiResponse.success("Companies retrieved", companies));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CompanyDto>> getById(@PathVariable Long id) {
        CompanyDto company = companyService.getCompanyById(id);
        return ResponseEntity.ok(ApiResponse.success("Company retrieved", company));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<CompanyDto>> getMyCompany(@AuthenticationPrincipal CustomUserDetails userDetails) {
        CompanyDto company = companyService.getCompanyByOwnerEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Company retrieved", company));
    }

    @PutMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<CompanyDto>> updateCompany(@Valid @RequestBody CompanyRequest request,
                                                                  @AuthenticationPrincipal CustomUserDetails userDetails) {
        CompanyDto company = companyService.createOrUpdateCompany(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Company saved", company));
    }
}
