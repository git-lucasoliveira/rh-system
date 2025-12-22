package com.starcard.starpeople.controller;

import com.starcard.starpeople.model.LogSistema;
import com.starcard.starpeople.service.LogService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController // Mudou de @Controller para @RestController (retorna dados, não HTML)
@RequestMapping("/api/logs") // Boa prática: separar APIs com /api
@CrossOrigin(origins = "*") // CORREÇÃO DO ERRO: Permite acesso de qualquer frontend
public class LogController {

    private final LogService service;

    public LogController(LogService service) {
        this.service = service;
    }

    @GetMapping
    public List<LogSistema> listarLogs() {
        // Agora retorna a lista diretamente. O Spring converte para JSON automaticamente.
        return service.listarTudo();
    }
}