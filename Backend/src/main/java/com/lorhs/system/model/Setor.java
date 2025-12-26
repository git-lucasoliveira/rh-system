package com.lorhs.system.model;

import jakarta.persistence.*; // Importa as ferramentas de banco (JPA)
import jakarta.validation.constraints.NotBlank; // Validação para não deixar os campos vazios
import lombok.Data; // O Lombok cria os Getters e Setters sozinho

@Data // Cria getters, setters, toString, equals...
@Entity // Tabela no banco
@Table(name = "setores") // Nome da tabela no SQL é 'setores'"
public class Setor {

    @Id // Diz que este campo é a Chave Primária (PK)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Aqui mapeamos a coluna do banco para o Java

    // No banco chama "nome_setor", no Java chamamos de "nome"
    @Column(name = "nome_setor", nullable = false)
    @NotBlank(message = "O nome do setor não pode ficar vazio!")
    private String nome;
}