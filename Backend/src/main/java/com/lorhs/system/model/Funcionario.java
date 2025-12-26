package com.lorhs.system.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor // O JPA exige um construtor vazio
@Entity
@Table(name = "funcionarios")
public class Funcionario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // No seu banco é 'nome_completo', então o @Column faz a tradução
    @Column(name = "nome_completo", nullable = false)
    @NotBlank(message = "O nome é obrigatório.")
    private String nome;

    @Column(name = "email_principal")
    @Email(message = "Digite um e-mail válido.")
    // Removi o @NotBlank porque no seu print do banco existem emails NULL
    private String email;

    @Column(length = 14)
    // Removi o @NotBlank do CPF também, pois vi vários NULL no seu banco (IDs 7, 8, 9...)
    // Se mantiver a validação, o sistema trava ao tentar editar esses usuários antigos.
    private String cpf;

    @Column(name = "data_admissao")
    // Removi @NotNull momentaneamente pois vi datas NULL no banco
    private LocalDate dataAdmissao;

    @Column(name = "ativo")
    private Boolean ativo;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    // --- RELACIONAMENTOS ---
    // O seu banco usa 'id_setor' e 'id_cargo', então o JoinColumn é obrigatório

    @ManyToOne(fetch = FetchType.EAGER) // EAGER para carregar os dados junto e não dar erro de sessão no thymeleaf
    @JoinColumn(name = "id_setor")
    private Setor setor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cargo")
    private Cargo cargo;

    // NOTA: Removi o campo 'salario' conforme você pediu.

    @PrePersist
    public void prePersist() {
        if (this.dataCriacao == null) {
            this.dataCriacao = LocalDateTime.now();
        }
        if (this.ativo == null) {
            this.ativo = true;
        }
    }
}