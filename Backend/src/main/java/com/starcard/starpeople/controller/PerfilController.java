package com.starcard.starpeople.controller;

import com.starcard.starpeople.model.Usuario;
import com.starcard.starpeople.repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/perfil")
public class PerfilController {

    private final UsuarioRepository repository;
    private final PasswordEncoder encoder;

    public PerfilController(UsuarioRepository repository, PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    // 1. ABRE A TELA DE PERFIL DO USUÁRIO LOGADO
    @GetMapping
    public String abrirPerfil(Model model) {
        // Pega o usuário que está logado na sessão agora
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loginAtual = auth.getName();

        // CORREÇÃO: Usamos 'loginAtual' e removemos referências antigas ou opcionais
        Usuario usuario = (Usuario) repository.findByLogin(loginAtual);

        model.addAttribute("usuario", usuario);
        return "perfil/detalhes";
    }

    // 2. ALTERAR A SENHA
    @PostMapping("/alterar-senha")
    public String alterarSenha(@RequestParam String senhaAtual,
                               @RequestParam String novaSenha,
                               @RequestParam String confirmaSenha,
                               RedirectAttributes attributes) {

        // Pega o usuário logado
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loginAtual = auth.getName();

        // CORREÇÃO: Removemos .orElseThrow() e adicionamos o Cast (Usuario)
        Usuario usuario = (Usuario) repository.findByLogin(loginAtual);

        // VALIDAÇÃO 1: A senha atual confere?
        if (!encoder.matches(senhaAtual, usuario.getSenha())) {
            attributes.addFlashAttribute("mensagem", "A senha atual está incorreta.");
            attributes.addFlashAttribute("tipo", "danger");
            return "redirect:/perfil";
        }

        // VALIDAÇÃO 2: A nova senha e a confirmação batem?
        if (!novaSenha.equals(confirmaSenha)) {
            attributes.addFlashAttribute("mensagem", "A nova senha e a confirmação não coincidem.");
            attributes.addFlashAttribute("tipo", "danger");
            return "redirect:/perfil";
        }

        // TUDO CERTO: Criptografa e Salva
        usuario.setSenha(encoder.encode(novaSenha));
        repository.save(usuario);

        attributes.addFlashAttribute("mensagem", "Senha alterada com sucesso!");
        attributes.addFlashAttribute("tipo", "success");

        return "redirect:/perfil";
    }
}