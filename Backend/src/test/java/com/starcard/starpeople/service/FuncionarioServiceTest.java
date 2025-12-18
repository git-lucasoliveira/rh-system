package com.starcard.starpeople.service;

import com.starcard.starpeople.model.Cargo;
import com.starcard.starpeople.model.Funcionario;
import com.starcard.starpeople.model.Setor;
import com.starcard.starpeople.repository.FuncionarioRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // Habilita o Mockito no JUnit 5
class FuncionarioServiceTest {

    @Mock
    private FuncionarioRepository repository;

    @Mock
    private LogService logService;

    @InjectMocks
    private FuncionarioService service;

    @Test
    @DisplayName("Deve salvar funcionário novo com sucesso e formatar CPF")
    void deveSalvarFuncionarioNovoComSucesso() {
        // --- 1. CENÁRIO (Arrange) ---

        // Criamos objetos auxiliares (Setor e Cargo) pois são obrigatórios no Model
        Setor setor = new Setor();
        setor.setId(1L);
        setor.setNome("TI");

        Cargo cargo = new Cargo();
        cargo.setId(1L);
        cargo.setNome("Desenvolvedor");

        // Criamos o funcionário (SEM SALÁRIO, conforme tua regra)
        Funcionario novoFuncionario = new Funcionario();
        novoFuncionario.setNome("João da Silva");
        novoFuncionario.setEmail("joao@starcard.com");
        novoFuncionario.setCpf("12345678900"); // CPF sem pontuação para testar a formatação
        novoFuncionario.setDataAdmissao(LocalDate.now());
        novoFuncionario.setSetor(setor);
        novoFuncionario.setCargo(cargo);

        // Simulamos que o CPF não existe no banco (para passar na regra de duplicidade)
        when(repository.existsByCpf(anyString())).thenReturn(false);

        // --- 2. AÇÃO (Act) ---
        service.salvarComRegras(novoFuncionario);

        // --- 3. VERIFICAÇÃO (Assert) ---

        // Verifica se chamou o repositório para salvar
        verify(repository, times(1)).save(novoFuncionario);

        // Verifica se chamou o log
        verify(logService, times(1)).registrar(anyString());

        // Verifica se a regra de formatar CPF funcionou (esperamos pontuação)
        assertEquals("123.456.789-00", novoFuncionario.getCpf());

        // Verifica se definiu Ativo como true (tua Regra 2)
        assertTrue(novoFuncionario.getAtivo());
    }

    @Test
    @DisplayName("Deve lançar erro ao tentar salvar CPF duplicado")
    void deveLancarErroCpfDuplicado() {
        // --- CENÁRIO ---
        Funcionario f = new Funcionario();
        f.setCpf("111.222.333-44");

        // Simulamos que o banco diz: "Sim, esse CPF já existe!"
        when(repository.existsByCpf(anyString())).thenReturn(true);

        // --- AÇÃO E VERIFICAÇÃO ---
        // Esperamos que o service lance uma exceção do tipo IllegalArgumentException
        IllegalArgumentException excecao = assertThrows(IllegalArgumentException.class, () -> {
            service.salvarComRegras(f);
        });

        assertEquals("Este CPF já está cadastrado no sistema.", excecao.getMessage());

        // Garante que NUNCA tentou salvar no banco se deu erro antes
        verify(repository, never()).save(any());
    }
}