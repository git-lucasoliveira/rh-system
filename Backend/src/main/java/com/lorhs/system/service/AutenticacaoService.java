package com.lorhs.system.service;

import com.lorhs.system.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AutenticacaoService implements UserDetailsService {

    @Autowired
    private UsuarioRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Vai ao banco procurar o usuário
        UserDetails usuario = repository.findByLogin(username);

        // Se não encontrar, lança o erro padrão do Spring Security
        if (usuario == null) {
            throw new UsernameNotFoundException("Usuário não encontrado!");
        }

        // Retorna o usuário encontrado (com senha criptografada e permissões)
        return usuario;
    }
}