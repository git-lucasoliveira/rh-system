package com.starcard.starpeople.controller.api;

import com.starcard.starpeople.dto.FuncionarioDTO;
import com.starcard.starpeople.model.Funcionario;
import com.starcard.starpeople.service.FuncionarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/funcionarios")
@CrossOrigin(origins = "*")
public class ApiFuncionarioController {

    private final FuncionarioService service;

    // Injeção de dependência via Construtor (Prática Recomendada)
    public ApiFuncionarioController(FuncionarioService service) {
        this.service = service;
    }

    // 1. LISTAR TODOS (Retorna DTO para proteger a entidade e evitar loop JSON)
    @GetMapping
    public ResponseEntity<List<FuncionarioDTO>> listarTodos(
            @RequestParam(required = false) String busca,
            @RequestParam(required = false) Long setorId,
            @RequestParam(required = false) Boolean ativo) {

        // Reutiliza a busca inteligente do Service
        List<Funcionario> lista = service.listarFuncionarios(busca, setorId, ativo, "nome", "asc");

        // Converte Entidade -> DTO
        List<FuncionarioDTO> dtos = lista.stream()
                .map(FuncionarioDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    // 2. BUSCAR POR ID
    @GetMapping("/{id}")
    public ResponseEntity<FuncionarioDTO> buscarPorId(@PathVariable Long id) {
        // O service lança exceção se não achar, então não precisamos de if/else aqui
        // (Assumindo que existe um GlobalExceptionHandler, senão retornará 500, o que é aceitável por enquanto)
        Funcionario funcionario = service.buscarPorId(id);
        return ResponseEntity.ok(new FuncionarioDTO(funcionario));
    }

    // 3. CADASTRAR (Usa as regras de negócio: Log, CPF, Validação)
    @PostMapping
    public ResponseEntity<FuncionarioDTO> cadastrar(@RequestBody @Valid Funcionario dados) {
        // Chama o service que formata CPF, valida duplicidade e gera LOG
        service.salvarComRegras(dados);

        // Cria a URI para o cabeçalho Location (Padrão REST)
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(dados.getId())
                .toUri();

        return ResponseEntity.created(uri).body(new FuncionarioDTO(dados));
    }

    // 4. ATUALIZAR
    @PutMapping("/{id}")
    public ResponseEntity<FuncionarioDTO> atualizar(@PathVariable Long id, @RequestBody @Valid Funcionario dados) {
        // Garante que estamos atualizando o ID correto
        dados.setId(id);

        // O Service sabe lidar com atualização (gera log de edição)
        service.salvarComRegras(dados);

        return ResponseEntity.ok(new FuncionarioDTO(dados));
    }

    // 5. EXCLUIR (Com Log de Auditoria)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        // O service gera o log "EXCLUIU DEFINITIVAMENTE..." antes de apagar
        service.excluirDefinitivamente(id);
        return ResponseEntity.noContent().build();
    }
}