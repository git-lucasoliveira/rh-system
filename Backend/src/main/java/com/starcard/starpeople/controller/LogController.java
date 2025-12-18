package com.starcard.starpeople.controller;

import com.starcard.starpeople.service.LogService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/logs")
public class LogController {

    private final LogService service;

    public LogController(LogService service) {
        this.service = service;
    }

    @GetMapping
    public String listarLogs(Model model) {
        model.addAttribute("logs", service.listarTudo());
        return "logs/lista";
    }
}