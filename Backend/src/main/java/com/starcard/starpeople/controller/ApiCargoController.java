package com.starcard.starpeople.controller;

import com.starcard.starpeople.model.Cargo;
import com.starcard.starpeople.repository.CargoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cargos") // <--- Endereço que o React chama
public class ApiCargoController {

    @Autowired
    private CargoRepository repository;

    @GetMapping
    public ResponseEntity<List<Cargo>> listar() {
        // Busca todos os cargos no banco e devolve como JSON
        return ResponseEntity.ok(repository.findAll());
    }
}