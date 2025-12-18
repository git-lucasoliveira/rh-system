package com.starcard.starpeople.dto;

import com.starcard.starpeople.model.Funcionario;
import lombok.Data;

@Data
public class FuncionarioDTO {
    private Long id;
    private String nome;
    private String cpf;
    private String email;
    private String setor;
    private String cargo;
    private Boolean ativo;

    public FuncionarioDTO(Funcionario funcionario) {
        this.id = funcionario.getId();
        this.nome = funcionario.getNome();
        this.cpf = funcionario.getCpf();
        this.email = funcionario.getEmail();
        this.setor = funcionario.getSetor() != null ? funcionario.getSetor().getNome() : null;
        this.cargo = funcionario.getCargo() != null ? funcionario.getCargo().getNome() : null;
        this.ativo = funcionario.getAtivo();
    }
}
