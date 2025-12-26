package com.lorhs.system.service;

import com.lorhs.system.model.Funcionario;
import com.lorhs.system.repository.FuncionarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FuncionarioService {

    private final FuncionarioRepository repository;
    private final LogService logService; // 1. Dependência de Log Injetada

    public FuncionarioService(FuncionarioRepository repository, LogService logService) {
        this.repository = repository;
        this.logService = logService;
    }

    // --- LEITURA (READ) ---

    // 1. Método para a TELA (Paginado)
    public Page<Funcionario> listarComFiltros(String busca, Long setorId, Boolean ativo, String ordenacao, String direcao, int pagina) {
        int itensPorPagina = 25; // Mantive seu padrão de 25
        Sort.Direction direction = "desc".equalsIgnoreCase(direcao) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(pagina, itensPorPagina, Sort.by(direction, ordenacao));

        if (busca != null && busca.isEmpty()) busca = null;

        return repository.buscarComFiltros(busca, setorId, ativo, pageable);
    }

    // 2. Método para o EXCEL (Lista Completa)
    public List<Funcionario> listarFuncionarios(String busca, Long setorId, Boolean ativo, String ordenacao, String direcao) {
        Sort.Direction direction = "desc".equalsIgnoreCase(direcao) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, ordenacao);

        if (busca != null && busca.isEmpty()) busca = null;

        return repository.buscarParaRelatorio(busca, setorId, ativo, sort);
    }

    public Funcionario buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));
    }

    public long contar() {
        return repository.count();
    }

    // --- ESCRITA (WRITE) COM REGRAS DE NEGÓCIO ---

    @Transactional // Garante que tudo salva ou nada salva
    public void salvarComRegras(Funcionario funcionario) {

        // Regra 1: Formatação de CPF (Removemos do Controller)
        if (funcionario.getCpf() != null) {
            funcionario.setCpf(formatarCpf(funcionario.getCpf()));
        }

        // Regra 2: Default Ativo
        if (funcionario.getAtivo() == null) {
            funcionario.setAtivo(true);
        }

        // Regra 3: Validação de Duplicidade (Blindagem)
        // Se for NOVO (id null) e o CPF já existe no banco -> Erro
        if (funcionario.getId() == null && repository.existsByCpf(funcionario.getCpf())) {
            throw new IllegalArgumentException("Este CPF já está cadastrado no sistema.");
        }

        // Regra 4: Auditoria (Log)
        if (funcionario.getId() == null) {
            logService.registrar("Cadastrou o colaborador: " + funcionario.getNome() + " (CPF: " + funcionario.getCpf() + ")");
        } else {
            logService.registrar("Editou dados do colaborador ID: " + funcionario.getId() + " - " + funcionario.getNome());
        }

        // Salvar final
        repository.save(funcionario);
    }

    @Transactional
    public void alternarStatus(Long id) {
        Funcionario funcionario = buscarPorId(id);

        // Alterna o valor (true vira false, false vira true)
        funcionario.setAtivo(!funcionario.getAtivo());
        repository.save(funcionario);

        // Gera Log Automático
        String novoStatus = funcionario.getAtivo() ? "ATIVO" : "INATIVO";
        logService.registrar("Alterou status do ID " + id + " para " + novoStatus);
    }

    @Transactional
    public void excluirDefinitivamente(Long id) {
        // Gera Log antes de apagar (para ter rastro de quem sumiu)
        logService.registrar("EXCLUIU DEFINITIVAMENTE o colaborador ID: " + id);
        repository.deleteById(id);
    }

    // --- MÉTODOS AUXILIARES ---

    public boolean existePorCpf(String cpf) {
        return repository.existsByCpf(cpf);
    }

    // Método privado para formatar CPF (000.000.000-00)
    private String formatarCpf(String cpf) {
        String numeros = cpf.replaceAll("[^0-9]", "");
        if (numeros.length() == 11) {
            return numeros.substring(0, 3) + "." +
                    numeros.substring(3, 6) + "." +
                    numeros.substring(6, 9) + "-" +
                    numeros.substring(9, 11);
        }
        return cpf; // Retorna original se não tiver 11 dígitos
    }
}