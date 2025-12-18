package com.starcard.starpeople.config;

import com.starcard.starpeople.repository.UsuarioRepository;
import com.starcard.starpeople.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository repository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 1. Tenta recuperar o token do cabeçalho
        var token = recuperarToken(request);

        // 2. Se o token existir, valida ele
        if (token != null) {
            var login = tokenService.getSubject(token);

            // --- CORREÇÃO AQUI ---
            // Removemos o .orElse(null) porque o repository já devolve o UserDetails (ou null) direto
            UserDetails usuario = repository.findByLogin(login);

            // Só autentica se o usuário realmente existir no banco
            if (usuario != null) {
                // 3. Autentica o usuário para o Spring Security
                var authentication = new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        // 4. Segue o fluxo (vai para o Controller)
        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        // O token vem como "Bearer eyJhb...", precisamos tirar o "Bearer " da frente
        return authHeader.replace("Bearer ", "");
    }
}