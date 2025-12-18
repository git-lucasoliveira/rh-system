package com.starcard.starpeople.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

@Configuration
@EnableWebSecurity
public class SecurityConfigurations {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                // .sessionManagement(...) <-- REMOVEMOS ISSO para ativar a sessão no navegador
                .authorizeHttpRequests(req -> {
                    // Libera arquivos estáticos (para o site não ficar feio/sem CSS)
                    req.requestMatchers("/css/**", "/js/**", "/images/**", "/webjars/**").permitAll();
                    // Libera login da API também
                    req.requestMatchers("/auth/**").permitAll();
                    // Todo o resto exige login
                    req.anyRequest().authenticated();
                })
                .formLogin(form -> form
                        .loginPage("/login")// ATIVA O FORMULÁRIO DE LOGIN
                        .defaultSuccessUrl("/", true)
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout")
                )
                // Mantém o filtro de token caso queira testar API depois
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
    /*
        @Bean
        public UserDetailsService userDetailsService() {
            UserDetails admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder().encode("123"))
                    .roles("USER", "ADMIN")
                    .build();

            return new InMemoryUserDetailsManager(admin);
        }
    */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}