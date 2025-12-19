package com.starcard.starpeople.dto;

import com.starcard.starpeople.model.Funcionario;
import lombok.Data;
import java.time.LocalDate;

@Data
public class FuncionarioDTO {
    private Long id;
    private String nome;
    private String cpf;
    private String email;
    private String setor;
    private String cargo;
    private Boolean ativo;
    private LocalDate dataAdmissao;

    public FuncionarioDTO(Funcionario funcionario) {
        this.id = funcionario.getId();
        this.nome = funcionario.getNome();
        this.cpf = funcionario.getCpf();
        this.email = funcionario.getEmail();
        this.ativo = funcionario.getAtivo();
        this.dataAdmissao = funcionario.getDataAdmissao();

        // CORREÇÃO AQUI:
        // Usamos .getNome() porque no teu Model a variável chama-se 'private String nome'

        // 1. Setor
        if (funcionario.getSetor() != null) {
            this.setor = funcionario.getSetor().getNome(); // <--- Mudado de getNomeSetor() para getNome()
        } else {
            this.setor = "Não Informado";
        }

        // 2. Cargo (Provavelmente segue a mesma lógica do Setor)
        if (funcionario.getCargo() != null) {
            this.cargo = funcionario.getCargo().getNome(); // <--- Mudado de getNomeCargo() para getNome()
        } else {
            this.cargo = "Não Informado";
        }
    }
}