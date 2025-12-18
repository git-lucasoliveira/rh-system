package com.starcard.starpeople.service;

import com.starcard.starpeople.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
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

    // Pega o segredo lá do application.properties
    @Value("${api.security.token.secret}")
    private String secret;

    // 1. GERAR TOKEN (Cria o crachá)
    public String gerarToken(Usuario usuario) {
        return Jwts.builder()
                .setIssuer("StarPeople API") // Quem emitiu
                .setSubject(usuario.getLogin()) // Dono do token (login)
                .setIssuedAt(new Date()) // Data de geração
                .setExpiration(dataExpiracao()) // Data de validade (2h)
                .signWith(getChave()) // Assinatura criptografada
                .compact();
    }

    // 2. LER TOKEN (Verifica se o crachá é válido e recupera o Login)
    public String getSubject(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getChave())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getSubject(); // Retorna o login (ex: "lucas")
        } catch (Exception e) {
            throw new RuntimeException("Token inválido ou expirado!");
        }
    }

    // Métodos Auxiliares

    private Date dataExpiracao() {
        // Define validade de 2 horas
        return Date.from(LocalDateTime.now().plusHours(2)
                .atZone(ZoneId.systemDefault()).toInstant());
    }

    private Key getChave() {
        // Transforma a senha texto em uma Chave Criptográfica
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}