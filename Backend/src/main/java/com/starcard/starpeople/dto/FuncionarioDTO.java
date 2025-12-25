package com.starcard.starpeople.dto;

import com.starcard.starpeople.model.Funcionario;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
public class FuncionarioDTO {
    private Long id;
    private String nome;
    private String cpf;
    private String email;
    private SetorDTO setor;
    private CargoDTO cargo;
    private Boolean ativo;
    private LocalDate dataAdmissao;

    public FuncionarioDTO(Funcionario funcionario) {
        this.id = funcionario.getId();
        this.nome = funcionario.getNome();
        this.cpf = funcionario.getCpf();
        this.email = funcionario.getEmail();
        this.ativo = funcionario.getAtivo();
        this.dataAdmissao = funcionario.getDataAdmissao();

        // Setor com ID e nome
        if (funcionario.getSetor() != null) {
            this.setor = new SetorDTO(
                    funcionario.getSetor().getId(),
                    funcionario.getSetor().getNome()
            );
        }

        // Cargo com ID e nome
        if (funcionario.getCargo() != null) {
            this.cargo = new CargoDTO(
                    funcionario.getCargo().getId(),
                    funcionario.getCargo().getNome()
            );
        }
    }

    // Classe interna para Setor
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SetorDTO {
        private Long id;
        private String nome;
    }

    // Classe interna para Cargo
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CargoDTO {
        private Long id;
        private String nome;
    }
}