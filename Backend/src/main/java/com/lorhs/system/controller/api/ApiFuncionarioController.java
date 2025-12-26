package com.lorhs.system.controller.api;

import com.lorhs.system.dto.FuncionarioDTO;
import com.lorhs.system.model.Cargo;
import com.lorhs.system.model.Funcionario;
import com.lorhs.system.model.Setor;
import com.lorhs.system.repository.CargoRepository;
import com.lorhs.system.repository.FuncionarioRepository;
import com.lorhs.system.repository.SetorRepository;
import com.lorhs.system.service.FuncionarioService;
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
    private final FuncionarioRepository funcionarioRepository;
    private final SetorRepository setorRepository;
    private final CargoRepository cargoRepository;

    // Injeção de dependência via Construtor (Prática Recomendada)
    public ApiFuncionarioController(FuncionarioService service,
                                    FuncionarioRepository funcionarioRepository,
                                    SetorRepository setorRepository,
                                    CargoRepository cargoRepository) {
        this.service = service;
        this.funcionarioRepository = funcionarioRepository;
        this.setorRepository = setorRepository;
        this.cargoRepository = cargoRepository;
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
        Funcionario funcionario = service.buscarPorId(id);
        return ResponseEntity.ok(new FuncionarioDTO(funcionario));
    }

    // 3. CADASTRAR (Usa as regras de negócio: Log, CPF, Validação)
    @PostMapping
    public ResponseEntity<FuncionarioDTO> cadastrar(@RequestBody @Valid Funcionario dados) {
        service.salvarComRegras(dados);

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(dados.getId())
                .toUri();

        return ResponseEntity.created(uri).body(new FuncionarioDTO(dados));
    }

    // 4. ATUALIZAR
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Funcionario funcionarioAtualizado) {
        try {
            // 1. Buscar o funcionário existente no banco
            Funcionario funcionarioExistente = funcionarioRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

            // 2. Buscar Setor e Cargo do banco (entidades gerenciadas)
            Setor setor = setorRepository.findById(funcionarioAtualizado.getSetor().getId())
                    .orElseThrow(() -> new RuntimeException("Setor não encontrado"));

            Cargo cargo = cargoRepository.findById(funcionarioAtualizado.getCargo().getId())
                    .orElseThrow(() -> new RuntimeException("Cargo não encontrado"));

            // 3. Atualizar os campos do funcionário existente
            funcionarioExistente.setNome(funcionarioAtualizado.getNome());
            funcionarioExistente.setCpf(funcionarioAtualizado.getCpf());
            funcionarioExistente.setEmail(funcionarioAtualizado.getEmail());
            funcionarioExistente.setDataAdmissao(funcionarioAtualizado.getDataAdmissao());
            funcionarioExistente.setAtivo(funcionarioAtualizado.getAtivo());
            funcionarioExistente.setSetor(setor);
            funcionarioExistente.setCargo(cargo);

            // 4. Salvar
            Funcionario salvo = funcionarioRepository.save(funcionarioExistente);

            return ResponseEntity.ok(new FuncionarioDTO(salvo));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 5. EXCLUIR (Com Log de Auditoria)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluirDefinitivamente(id);
        return ResponseEntity.noContent().build();
    }
}