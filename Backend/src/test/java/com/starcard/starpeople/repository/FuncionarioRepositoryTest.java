package com.starcard.starpeople.repository;

import com.starcard.starpeople.model.Cargo;
import com.starcard.starpeople.model.Funcionario;
import com.starcard.starpeople.model.Setor;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest // Configura um banco em memória apenas para este teste
class FuncionarioRepositoryTest {

    @Autowired
    private FuncionarioRepository repository;

    @Autowired
    private TestEntityManager em; // O nosso "Gestor" para criar dados de mentira

    @Test
    @DisplayName("Deve retornar funcionário quando buscar por parte do nome")
    void deveBuscarPorNome() {
        // 1. CENÁRIO: Criar dados no banco de memória
        criarFuncionarioCenario("Ana Silva", "111.222.333-44", true);
        criarFuncionarioCenario("Carlos Souza", "999.888.777-66", true);

        // 2. AÇÃO: Chamar o método do repositório
        Page<Funcionario> resultado = repository.buscarComFiltros(
                "Ana", // Busca
                null,  // Setor
                null,  // Ativo
                PageRequest.of(0, 10) // Paginação
        );

        // 3. VERIFICAÇÃO
        assertThat(resultado.getTotalElements()).isEqualTo(1);
        assertThat(resultado.getContent().get(0).getNome()).isEqualTo("Ana Silva");
    }

    @Test
    @DisplayName("Deve filtrar corretamente por status Ativo/Inativo")
    void deveFiltrarPorAtivo() {
        // Cria um ativo e um inativo
        criarFuncionarioCenario("Ativo Boy", "111.111.111-11", true);
        criarFuncionarioCenario("Inativo Girl", "222.222.222-22", false);

        // Busca apenas os inativos (false)
        Page<Funcionario> resultado = repository.buscarComFiltros(null, null, false, PageRequest.of(0, 10));

        assertThat(resultado.getTotalElements()).isEqualTo(1);
        assertThat(resultado.getContent().get(0).getNome()).isEqualTo("Inativo Girl");
    }

    @Test
    @DisplayName("Deve retornar TRUE se CPF já existe")
    void deveVerificarCpfExistente() {
        String cpf = "123.456.789-00";
        criarFuncionarioCenario("Teste CPF", cpf, true);

        boolean existe = repository.existsByCpf(cpf);

        assertThat(existe).isTrue();
    }

    // --- MÉTODOS AUXILIARES PARA AJUDAR O TESTE ---

    private void criarFuncionarioCenario(String nome, String cpf, Boolean ativo) {
        // Precisamos criar Setor e Cargo antes, pois são obrigatórios no teu Model
        Setor setor = new Setor();
        setor.setNome("Geral");
        em.persist(setor); // Salva o setor temporário

        Cargo cargo = new Cargo();
        cargo.setNome("Auxiliar");
        em.persist(cargo); // Salva o cargo temporário

        Funcionario f = new Funcionario();
        f.setNome(nome);
        f.setEmail("teste@email.com");
        f.setCpf(cpf);
        f.setDataAdmissao(LocalDate.now());
        f.setAtivo(ativo);
        f.setSetor(setor);
        f.setCargo(cargo);

        em.persist(f); // Salva o funcionário no banco de memória
    }
}