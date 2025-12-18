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
    private AuthenticationManager manager; // O "Gerente" de login do Spring

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder; // O Criptografador

    // 1. FAZER LOGIN
    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid DadosAutenticacao dados) {
        try {
            // 1. Cria o token com os dados que chegaram (login/senha texto puro)
            var authenticationToken = new UsernamePasswordAuthenticationToken(dados.login(), dados.senha());

            // 2. Tenta autenticar (Aqui é onde deve estar explodindo)
            var authentication = manager.authenticate(authenticationToken);

            // 3. Se passou, gera o token JWT
            var tokenJWT = tokenService.gerarToken((Usuario) authentication.getPrincipal());

            return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));

        } catch (Exception e) {
            // ISSO VAI NOS SALVAR: Imprime o erro real no console
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro na autenticação: " + e.getMessage());
        }
    }

    // 2. REGISTRAR USUÁRIO (Para podermos criar o primeiro acesso)
    // ATENÇÃO: Em produção, essa rota deve ser bloqueada ou protegida
    @PostMapping("/registrar")
    public ResponseEntity registrar(@RequestBody @Valid DadosAutenticacao dados) {
        if (repository.existsByLogin(dados.login())) {
            return ResponseEntity.badRequest().body("Usuário já existe!");
        }

        // Criptografa a senha antes de salvar
        String senhaCriptografada = passwordEncoder.encode(dados.senha());

        Usuario novoUsuario = new Usuario(dados.login(), senhaCriptografada, "ADMIN");
        repository.save(novoUsuario);

        return ResponseEntity.ok().build();
    }
}