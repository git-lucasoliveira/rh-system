// language: java
package com.starcard.starpeople.controller;

import com.starcard.starpeople.dto.DadosAutenticacao;
import com.starcard.starpeople.dto.DadosTokenJWT;
import com.starcard.starpeople.model.Usuario;
import com.starcard.starpeople.repository.UsuarioRepository;
import com.starcard.starpeople.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AutenticacaoController {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid DadosAutenticacao dados) {
        try {
            // Tenta criar o token de autenticação
            var authenticationToken = new UsernamePasswordAuthenticationToken(dados.login(), dados.senha());

            // Tenta autenticar no banco
            var authentication = manager.authenticate(authenticationToken);

            // Se passar, gera o token JWT
            var tokenJWT = tokenService.gerarToken((Usuario) authentication.getPrincipal());

            return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));

        } catch (Exception e) {
            // --- AQUI ESTÁ A CORREÇÃO DE DEBUG ---
            // Imprime o erro real no terminal do Java para sabermos o que é
            e.printStackTrace();

            // Devolve o erro para o Frontend ver também (opcional, mas ajuda no teste)
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody @Valid DadosAutenticacao dados) {
        if (repository.existsByLogin(dados.login())) {
            return ResponseEntity.badRequest().body("Usuário já existe!");
        }
        String senhaCriptografada = passwordEncoder.encode(dados.senha());
        Usuario novoUsuario = new Usuario(dados.login(), senhaCriptografada, "ADMIN");
        repository.save(novoUsuario);
        return ResponseEntity.status(201).build();
    }
}
