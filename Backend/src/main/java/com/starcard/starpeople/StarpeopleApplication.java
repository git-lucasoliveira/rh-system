package com.starcard.starpeople;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
// 1. Define as informações da API e diz que ela requer segurança globalmente
@OpenAPIDefinition(
        info = @Info(title = "StarPeople API", version = "1.0", description = "API de Gestão de RH"),
        security = @SecurityRequirement(name = "bearerAuth")
)
// 2. Define COMO é essa segurança (Bearer Token JWT)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class StarpeopleApplication {

    public static void main(String[] args) {
        SpringApplication.run(StarpeopleApplication.class, args);
    }

}