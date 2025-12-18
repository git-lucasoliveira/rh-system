package com.starcard.starpeople.service;

import com.starcard.starpeople.model.Usuario;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class TokenServiceTest {

    @InjectMocks
    private TokenService tokenService;

    @Test
    @DisplayName("Deve gerar um token válido (String não nula)")
    void deveGerarTokenValido() {
        // --- CENÁRIO (ARRANGE) ---
        Usuario usuario = new Usuario("lucas.teste", "123456", "ADMIN");
        usuario.setId(1L); // O @Data do Lombok cria esse setId automaticamente

        // Injetamos uma chave secreta específica para o teste
        ReflectionTestUtils.setField(tokenService, "secret", "ChaveSecretaDeTesteUnitario123456");

        // --- AÇÃO (ACT) ---
        String token = tokenService.gerarToken(usuario);
        System.out.println("Token Gerado: " + token);

        // --- VERIFICAÇÃO (ASSERT) ---
        Assertions.assertNotNull(token, "O token não deveria ser nulo");
        Assertions.assertFalse(token.isEmpty(), "O token não deveria estar vazio");
    }

    @Test
    @DisplayName("Deve conseguir ler (validar) o login dentro do token")
    void deveValidarTokenCorretamente() {
        // --- CENÁRIO ---
        Usuario usuario = new Usuario("maria.rh", "123", "RH");
        usuario.setId(2L);

        // Garante que usamos a MESMA chave para gerar e ler
        ReflectionTestUtils.setField(tokenService, "secret", "ChaveSecretaDeTesteUnitario123456");

        String tokenGerado = tokenService.gerarToken(usuario);

        // --- AÇÃO ---
        // Tenta extrair o login (subject) do token gerado
        String loginLido = tokenService.getSubject(tokenGerado);

        // --- VERIFICAÇÃO ---
        Assertions.assertEquals("maria.rh", loginLido, "O login lido do token deve ser igual ao login original");
    }
}