package com.starcard.starpeople.controller.api;

import com.starcard.starpeople.model.Funcionario;
import com.starcard.starpeople.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
@CrossOrigin(origins = "*") // 🚨 OBRIGATÓRIO: Permite que o Frontend (porta 5500) acesse
public class FuncionarioAPIController {

    @Autowired
    private FuncionarioRepository repository;

    // 1. Endpoint para LISTAR todos os funcionários (Preenche o Dashboard)
    @GetMapping
    public ResponseEntity<List<Funcionario>> listarTodos() {
        List<Funcionario> lista = repository.findAll();
        return ResponseEntity.ok(lista);
    }

    // 2. Endpoint para BUSCAR um funcionário por ID (Para Edição)
    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Endpoint para CADASTRAR novo funcionário
    @PostMapping
    public ResponseEntity<Funcionario> cadastrar(@RequestBody Funcionario dados) {
        // Define data de criação se não vier
        if (dados.getAtivo() == null) dados.setAtivo(true);

        Funcionario novo = repository.save(dados);
        return ResponseEntity.ok(novo);
    }

    // 4. Endpoint para ATUALIZAR funcionário
    @PutMapping("/{id}")
    public ResponseEntity<Funcionario> atualizar(@PathVariable Long id, @RequestBody Funcionario dados) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        dados.setId(id); // Garante que atualiza o ID correto
        Funcionario atualizado = repository.save(dados);
        return ResponseEntity.ok(atualizado);
    }

    // 5. Endpoint para DELETAR (Soft Delete ou Hard Delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}