package com.lorhs.system.controller.api;

import com.lorhs.system.model.Usuario;
import com.lorhs.system.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*") // Permite o teu Frontend acessar
public class ApiUsuarioController {

    private final UsuarioRepository repository;
    private final PasswordEncoder encoder;

    public ApiUsuarioController(UsuarioRepository repository, PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    // LISTAR
    @GetMapping
    public List<Usuario> listar() {
        return repository.findAll();
    }

    // BUSCAR UM (Para edição)
    @GetMapping("/{id}")
    public Usuario buscarUm(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    // SALVAR (CRIAR OU EDITAR)
    @PostMapping
    public Usuario salvar(@RequestBody Usuario usuario) {
        // Se a senha não estiver vazia, criptografa
        if (usuario.getSenha() != null && !usuario.getSenha().isEmpty()) {
            usuario.setSenha(encoder.encode(usuario.getSenha()));
        }
        return repository.save(usuario);
    }

    // EXCLUIR
    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        repository.deleteById(id);
    }
}