package com.lorhs.system.controller.api;

import com.lorhs.system.model.Cargo;
import com.lorhs.system.repository.CargoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cargos")
public class ApiCargoController {

    @Autowired
    private CargoRepository repository;

    @GetMapping
    public ResponseEntity<List<Cargo>> listar() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cargo> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Cargo> criar(@RequestBody Cargo cargo) {
        Cargo salvo = repository.save(cargo);
        return ResponseEntity.ok(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cargo> atualizar(@PathVariable Long id, @RequestBody Cargo cargo) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        cargo.setId(id);
        Cargo atualizado = repository.save(cargo);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}