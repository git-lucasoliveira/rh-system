package com.starcard.starpeople.config;

import com.starcard.starpeople.model.Usuario;
import com.starcard.starpeople.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class CarregadorDados implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // NOVA LÓGICA:
        // Só cria o admin padrão se a tabela de usuários estiver COMPLETAMENTE VAZIA.
        if (usuarioRepository.count() == 0) {

            Usuario admin = new Usuario();
            admin.setLogin("admin");
            admin.setSenha(passwordEncoder.encode("123"));
            admin.setPerfil("SUPERADMIN");
            admin.setAtivo(true);

            usuarioRepository.save(admin);
            System.out.println("--- NENHUM USUÁRIO ENCONTRADO. ADMIN PADRÃO CRIADO (admin/123) ---");
        } else {
            System.out.println("--- USUÁRIOS JÁ EXISTEM. O CARREGADOR DE DADOS NÃO FEZ NADA. ---");
        }
    }
}