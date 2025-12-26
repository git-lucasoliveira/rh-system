package com.lorhs.system.model;

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
@Table(name = "usuarios") // Confirme se a tabela é 'usuarios' mesmo
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "login", nullable = false, unique = true)
    private String login;

    @Column(name = "senha", nullable = false)
    private String senha;

    @Column(name = "perfil") // Se no banco for 'id_perfil', isso vai dar erro. Assumindo que é String.
    private String perfil;

    @Column(name = "ativo")
    private Boolean ativo = true;

    // Construtor auxiliar para testes ou carga de dados
    public Usuario(String login, String senha, String perfil) {
        this.login = login;
        this.senha = senha;
        this.perfil = perfil;
        this.ativo = true;
    }

    // --- MÉTODOS OBRIGATÓRIOS DO SPRING SECURITY ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if ("SUPERADMIN".equalsIgnoreCase(this.perfil)) {
            return List.of(
                    new SimpleGrantedAuthority("ROLE_SUPERADMIN"),
                    new SimpleGrantedAuthority("ROLE_ADMIN"),
                    new SimpleGrantedAuthority("ROLE_USER")
            );
        }
        else if ("TI".equalsIgnoreCase(this.perfil)) {
            return List.of(
                    new SimpleGrantedAuthority("ROLE_TI"),
                    new SimpleGrantedAuthority("ROLE_ADMIN"),
                    new SimpleGrantedAuthority("ROLE_USER")
            );
        }
        else if ("RH".equalsIgnoreCase(this.perfil)) {
            return List.of(
                    new SimpleGrantedAuthority("ROLE_RH"),
                    new SimpleGrantedAuthority("ROLE_USER")
            );
        }
        // Perfil padrão caso não venha nada ou seja desconhecido
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
        // Garante que não dá NullPointerException se ativo for nulo
        return this.ativo != null && this.ativo;
    }
}