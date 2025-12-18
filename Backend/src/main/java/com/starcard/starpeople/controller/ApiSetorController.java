package com.starcard.starpeople.controller;

import com.starcard.starpeople.model.Setor;
import com.starcard.starpeople.repository.SetorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/setores") // <--- Endereço que o React chama
public class ApiSetorController {

    @Autowired
    private SetorRepository repository;

    @GetMapping
    public ResponseEntity<List<Setor>> listar() {
        // Busca todos os setores no banco e devolve como JSON
        return ResponseEntity.ok(repository.findAll());
    }
}