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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth") // <--- MUDANÇA IMPORTANTE: Prefixo /api
public class ApiAutenticacaoController { // Sugiro renomear a classe para evitar confusão

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
            var authenticationToken = new UsernamePasswordAuthenticationToken(dados.login(), dados.senha());
            var authentication = manager.authenticate(authenticationToken);
            var tokenJWT = tokenService.gerarToken((Usuario) authentication.getPrincipal());

            return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody @Valid DadosAutenticacao dados) {
        if (repository.existsByLogin(dados.login())) {
            return ResponseEntity.badRequest().body("Usuário já existe!");
        }
        String senhaCriptografada = passwordEncoder.encode(dados.senha());
        Usuario novoUsuario = new Usuario(dados.login(), senhaCriptografada, "ADMIN"); // Atenção ao role fixo
        repository.save(novoUsuario);
        return ResponseEntity.status(201).build();
    }
}