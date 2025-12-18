package com.starcard.starpeople.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class LogSistema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dataHora;
    private String usuario; // Login de quem fez a ação (ex: admin, maria.rh)
    private String acao;    // Ex: "EXCLUIU O FUNCIONÁRIO LUCAS"

    // Construtor vazio (obrigatório pro JPA)
    public LogSistema() {}

    // Construtor prático
    public LogSistema(String usuario, String acao) {
        this.dataHora = LocalDateTime.now();
        this.usuario = usuario;
        this.acao = acao;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }

    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }

    public String getAcao() { return acao; }
    public void setAcao(String acao) { this.acao = acao; }
}