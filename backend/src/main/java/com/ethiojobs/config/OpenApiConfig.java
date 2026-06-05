package com.ethiojobs.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;

@OpenAPIDefinition(
        info = @Info(
                title = "EthioJobs Hub API",
                version = "1.0",
                description = "REST API for EthioJobs Hub - Ethiopian Job Board Platform",
                contact = @Contact(
                        name = "EthioJobs Hub",
                        email = "support@ethiojobs.com",
                        url = "https://ethiojobs.com"
                )
        )
)
public class OpenApiConfig {
}
