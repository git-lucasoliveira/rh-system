package com.starcard.starpeople.controller;

import com.starcard.starpeople.model.Usuario;
import com.starcard.starpeople.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioRepository repository;
    private final PasswordEncoder encoder;

    public UsuarioController(UsuarioRepository repository, PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    // Listar todos os usuários
    @GetMapping
    public String listar(Model model) {
        model.addAttribute("usuarios", repository.findAll());
        return "usuarios/lista";
    }

    // Abrir formulário para novo usuário
    @GetMapping("/novo")
    public String novo(Model model) {
        model.addAttribute("usuario", new Usuario());
        return "usuarios/formulario";
    }

    // Abrir formulário para edição
    @GetMapping("/editar/{id}")
    public String editar(@PathVariable Long id, Model model) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        model.addAttribute("usuario", usuario);
        return "usuarios/formulario";
    }

    // Excluir usuário
    @GetMapping("/excluir/{id}")
    public String excluir(@PathVariable Long id, RedirectAttributes attributes) {
        repository.deleteById(id);
        attributes.addFlashAttribute("mensagem", "Usuário excluído com sucesso!");
        attributes.addFlashAttribute("tipo", "success");
        return "redirect:/usuarios";
    }

    // Salvar (Criar ou Atualizar)
    @PostMapping("/salvar")
    public String salvar(@Valid Usuario usuario, BindingResult result, RedirectAttributes attributes) {

        // 1. Verificar se o Login já existe (apenas para novos cadastros)
        if (usuario.getId() == null && repository.existsByLogin(usuario.getLogin())) {
            result.rejectValue("login", "error.usuario", "Este login já está em uso.");
            return "usuarios/formulario";
        }

        // 2. Se houver erros de validação (campos vazios, etc.)
        if (result.hasErrors()) {
            return "usuarios/formulario";
        }

        // 3. Lógica da Senha (Criptografia)
        if (usuario.getId() != null) {
            // EDICÃO:
            // Busca o usuário atual no banco para comparar a senha
            Usuario usuarioAntigo = repository.findById(usuario.getId()).orElseThrow();

            // Se o campo senha estiver vazio, mantemos a senha antiga (o usuário não quis trocar)
            if (usuario.getSenha() == null || usuario.getSenha().isEmpty()) {
                usuario.setSenha(usuarioAntigo.getSenha());
            } else {
                // Se digitou algo novo, criptografamos a nova senha
                usuario.setSenha(encoder.encode(usuario.getSenha()));
            }
        } else {
            // NOVO CADASTRO:
            // A senha é obrigatória e deve ser criptografada
            usuario.setSenha(encoder.encode(usuario.getSenha()));
        }

        // 4. Salvar no banco
        repository.save(usuario);

        attributes.addFlashAttribute("mensagem", "Usuário salvo com sucesso!");
        attributes.addFlashAttribute("tipo", "success");

        return "redirect:/usuarios";
    }
}