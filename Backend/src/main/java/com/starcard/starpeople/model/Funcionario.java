package com.starcard.starpeople.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.br.CPF;
import lombok.Data;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "funcionarios")
public class Funcionario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_completo", nullable = false)
    @NotBlank(message = "O nome é obrigatório.")
    private String nome;

    @Column(name = "email_principal")
    @Email(message = "Digite um e-mail válido.")
    @NotBlank(message = "O e-mail é obrigatório.")
    private String email;

    @Column(length = 14)
    @NotBlank(message = "O CPF é obrigatório.")
    //@CPF(message = "CPF inválido.")
    private String cpf;

    @Column(name = "data_admissao")
    @NotNull(message = "A data de admissão é obrigatória.")
    private LocalDate dataAdmissao;

    private Boolean ativo; // Mapeia colunas BIT

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    // --- RELACIONAMENTOS ---

    @ManyToOne
    @JoinColumn(name = "id_setor")
    @NotNull(message = "Selecione um setor.")
    private Setor setor;

    @ManyToOne
    @JoinColumn(name = "id_cargo")
    @NotNull(message = "Selecione um cargo.")
    private Cargo cargo;

    @PrePersist
    public void prePersist() {
        if (this.dataCriacao == null) {
            this.dataCriacao = LocalDateTime.now();
        }
    }
}
