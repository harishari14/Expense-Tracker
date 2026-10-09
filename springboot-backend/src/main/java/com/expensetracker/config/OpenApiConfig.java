package com.expensetracker.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI expenseTrackerOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("AetherSpend - Java Spring Boot REST API")
                        .description("2026 Standalone High-Performance In-Memory Spring Boot 3.3 REST API (Zero Database)")
                        .version("1.0.0")
                        .contact(new Contact().name("Engineering Team").email("api@expensetracker.internal")));
    }
}
