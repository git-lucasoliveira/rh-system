package com.starcard.starpeople.dto;

import com.starcard.starpeople.model.Funcionario;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
public class FuncionarioDTO {

    private Long id;
    private String nome;
    private String email;
    private String cpf;
    private LocalDate dataAdmissao;
    private Boolean ativo;

    // Nomes para EXIBIÇÃO (Saída)
    private String nomeSetor;
    private String nomeCargo;

    // IDs para CADASTRO (Entrada) <--- NOVO
    private Long setorId;
    private Long cargoId;

    public FuncionarioDTO(Funcionario funcionario) {
        this.id = funcionario.getId();
        this.nome = funcionario.getNome();
        this.email = funcionario.getEmail();
        this.cpf = funcionario.getCpf();
        this.dataAdmissao = funcionario.getDataAdmissao();
        this.ativo = funcionario.getAtivo();

        if (funcionario.getSetor() != null) {
            this.nomeSetor = funcionario.getSetor().getNome();
            this.setorId = funcionario.getSetor().getId();
        } else {
            this.nomeSetor = "Não Definido";
        }

        if (funcionario.getCargo() != null) {
            this.nomeCargo = funcionario.getCargo().getNome();
            this.cargoId = funcionario.getCargo().getId();
        } else {
            this.nomeCargo = "Sem Cargo";
        }
    }
}