package com.starcard.starpeople.service;

import com.starcard.starpeople.model.LogSistema;
import com.starcard.starpeople.repository.LogSistemaRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogService {

    private final LogSistemaRepository repository;

    public LogService(LogSistemaRepository repository) {
        this.repository = repository;
    }

    // LISTAR PARA O ADMIN VER
    public List<LogSistema> listarTudo() {
        return repository.findAllByOrderByDataHoraDesc();
    }

    // MÉTODO MÁGICO: GRAVAR AÇÃO
    public void registrar(String acao) {
        // Pega o nome do usuário logado na sessão
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String usuarioLogado = (auth != null) ? auth.getName() : "SISTEMA";

        LogSistema log = new LogSistema(usuarioLogado, acao);
        repository.save(log);
    }
}