// src/main/java/com/lorhs/system/service/TokenService.java
package com.lorhs.system.service;

import com.lorhs.system.model.Usuario;
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
                .issuer("LORHS API")
                .subject(usuario.getLogin())
                .claim("perfil", usuario.getPerfil())
                .issuedAt(new Date())
                .expiration(dataExpiracao())
                .signWith(getChave())
                .compact();
    }

    public String getSubject(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)))
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return claims.getSubject();
        } catch (Exception e) {
            throw new RuntimeException("Token inválido ou expirado!");
        }
    }

    // NOVO MÉTODO
    public boolean isTokenValido(String token) {
        try {
            Jwts.parser()
                    .verifyWith(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)))
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            System.out.println("ERRO AO VALIDAR TOKEN: " + e.getMessage());
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
