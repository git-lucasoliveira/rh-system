package com.starcard.starpeople.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfigurations {

    private final SecurityFilter securityFilter;

    public SecurityConfigurations(SecurityFilter securityFilter) {
        this.securityFilter = securityFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(req -> {
                    // 1. Acesso Público
                    req.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();
                    req.requestMatchers("/index.html", "/login.html", "/login", "/auth/**", "/api/auth/**").permitAll();
                    req.requestMatchers("/css/**", "/js/**", "/images/**", "/assets/**", "/*.html").permitAll();

                    // 2. Apenas SuperAdmin (Aceita com ou sem ROLE_)
                    req.requestMatchers("/api/usuarios/**", "/api/logs/**")
                            .hasAnyAuthority("SUPERADMIN", "ROLE_SUPERADMIN");

                    req.requestMatchers(HttpMethod.DELETE, "/api/funcionarios/**")
                            .hasAnyAuthority("SUPERADMIN", "ROLE_SUPERADMIN");

                    // 3. Criação (SuperAdmin e TI)
                    req.requestMatchers(HttpMethod.POST, "/api/funcionarios/**")
                            .hasAnyAuthority("SUPERADMIN", "ROLE_SUPERADMIN", "TI", "ROLE_TI");

                    // 4. LEITURA E EDIÇÃO (Onde estava dando erro 403)
                    // Agora aceitamos RH, ROLE_RH, TI, ROLE_TI, etc.
                    req.requestMatchers(HttpMethod.GET, "/api/**")
                            .hasAnyAuthority("SUPERADMIN", "ROLE_SUPERADMIN", "TI", "ROLE_TI", "RH", "ROLE_RH");

                    req.requestMatchers(HttpMethod.PUT, "/api/**")
                            .hasAnyAuthority("SUPERADMIN", "ROLE_SUPERADMIN", "TI", "ROLE_TI", "RH", "ROLE_RH");

                    req.anyRequest().authenticated();
                })
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 1. Origens Permitidas (FrontEnd)
        config.setAllowedOrigins(List.of(
                "http://127.0.0.1:5500",
                "http://localhost:5500",
                "http://localhost:8080"
        ));

        // 2. Métodos HTTP permitidos
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));

        // 3. Headers permitidos
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));

        // 4. Expor Headers (Importante se o front precisar ler headers de resposta)
        config.setExposedHeaders(List.of("Authorization"));

        // 5. Credenciais
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplica essa configuração para TODAS as rotas (/**)
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}