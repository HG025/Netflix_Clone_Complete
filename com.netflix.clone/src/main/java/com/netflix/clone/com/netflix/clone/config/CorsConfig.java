package com.netflix.clone.com.netflix.clone.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer{

    @Value("${app.cors.allowed-origins:htto://localhost:4202}")
    private String[] allowedOrigins;

    public void addCorsMapping(CorsRegistry registry){
        registry.addMapping("/api/**")
        .allowedOrigins(allowedOrigins)
        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        .allowedHeaders("*")
        .exposedHeaders("Location", "Content-Disposition")
        .allowCredentials(false)
        .maxAge(3600);

    }



}
