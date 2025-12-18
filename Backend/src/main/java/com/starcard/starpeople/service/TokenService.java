// src/main/java/com/starcard/starpeople/service/TokenService.java
package com.starcard.starpeople.service;

import com.starcard.starpeople.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    public String gerarToken(Usuario usuario) {
        return Jwts.builder()
                .setIssuer("StarPeople API")
                .setSubject(usuario.getLogin())
                .setIssuedAt(new Date())
                .setExpiration(dataExpiracao())
                .signWith(getChave())
                .compact();
    }

    public String getSubject(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getChave())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getSubject();
        } catch (Exception e) {
            throw new RuntimeException("Token inválido ou expirado!");
        }
    }

    // NOVO MÉTODO
    public boolean isTokenValido(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getChave())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Date dataExpiracao() {
        return Date.from(LocalDateTime.now().plusHours(2)
                .atZone(ZoneId.systemDefault()).toInstant());
    }

    private Key getChave() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}
