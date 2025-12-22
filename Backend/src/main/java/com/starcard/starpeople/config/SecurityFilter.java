// language: java
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
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = recuperarToken(request);

        if (token != null && tokenService.isTokenValido(token)) {
            String login = tokenService.getSubject(token);
            UserDetails usuario = repository.findByLogin(login);

            if (usuario != null) {
                var authentication = new UsernamePasswordAuthenticationToken(
                        usuario, null, usuario.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    // Substitui o método recuperarToken antigo por este COM LOGS:
    private String recuperarToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");

        // --- DEBUG: VAMOS VER O QUE CHEGA ---
        System.out.println("=============================================");
        System.out.println("🔍 URL CHAMADA: " + request.getRequestURI());
        System.out.println("🔍 CABEÇALHO AUTHORIZATION: " + authHeader);
        // ------------------------------------

        if (authHeader == null) {
            System.out.println("❌ O cabeçalho está NULO (O JS não enviou nada).");
            return null;
        }

        if (!authHeader.startsWith("Bearer ")) {
            System.out.println("❌ O cabeçalho não começa com 'Bearer ' (Formato errado).");
            return null;
        }

        System.out.println("✅ Token extraído com sucesso! Enviando para validação...");
        return authHeader.replace("Bearer ", "").trim();
    }
}
