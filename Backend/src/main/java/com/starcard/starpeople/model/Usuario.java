package com.starcard.starpeople.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String login;

    @Column(nullable = false)
    private String senha;

    private String perfil;

    private Boolean ativo = true;

    // Construtor auxiliar para facilitar a criação manual
    public Usuario(String login, String senha, String perfil) {
        this.login = login;
        this.senha = senha;
        this.perfil = perfil;
        this.ativo = true;
    }

    // --- MÉTODOS OBRIGATÓRIOS DE SEGURANÇA (UserDetails) ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if ("SUPERADMIN".equalsIgnoreCase(this.perfil)) {
            return List.of(
                    new SimpleGrantedAuthority("ROLE_SUPERADMIN"), // Para coisas exclusivas
                    new SimpleGrantedAuthority("ROLE_ADMIN"),      // Para gestão geral
                    new SimpleGrantedAuthority("ROLE_USER")
            );
        }
        else if ("TI".equalsIgnoreCase(this.perfil)) {
            return List.of(
                    new SimpleGrantedAuthority("ROLE_TI"),    // <--- ADICIONAMOS ISSO (Para os badges e menu pai)
                    new SimpleGrantedAuthority("ROLE_ADMIN"), // <--- Permite acessar tela de usuários
                    new SimpleGrantedAuthority("ROLE_USER")
            );
        }
        else if ("RH".equalsIgnoreCase(this.perfil)) {
            return List.of(
                    new SimpleGrantedAuthority("ROLE_RH"),    // <--- ADICIONAMOS ISSO
                    new SimpleGrantedAuthority("ROLE_USER")
            );
        }

        // Padrão
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
        return this.login;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        // Se o campo ativo for null, considera false (inativo) por segurança
        return this.ativo != null && this.ativo;
    }
}