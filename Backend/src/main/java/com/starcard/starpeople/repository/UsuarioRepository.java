package com.starcard.starpeople.repository;

import com.starcard.starpeople.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // 1. Usado para o Login (Spring Security)
    UserDetails findByLogin(String login);

    // 2. Usado para evitar cadastros duplicados (Controller) -> O erro pede isto aqui!
    boolean existsByLogin(String login);
}