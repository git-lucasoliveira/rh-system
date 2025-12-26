package com.lorhs.system.controller.api;

import com.lorhs.system.model.LogSistema;
import com.lorhs.system.service.LogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
public class ApiLogController {

    private final LogService service;

    public ApiLogController(LogService service) {
        this.service = service;
    }

    @GetMapping
    public List<LogSistema> listarLogs() {
        return service.listarTudo();
    }
}