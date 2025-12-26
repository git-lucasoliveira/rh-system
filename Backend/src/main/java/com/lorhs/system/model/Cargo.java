package com.lorhs.system.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "cargos")
public class Cargo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_cargo", nullable = false)
    private String nome;

}
