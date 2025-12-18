package com.starcard.starpeople.controller.api;

import com.starcard.starpeople.dto.FuncionarioDTO;
import com.starcard.starpeople.model.Funcionario;
import com.starcard.starpeople.model.Setor;
import com.starcard.starpeople.model.Cargo;
import com.starcard.starpeople.repository.CargoRepository;
import com.starcard.starpeople.repository.SetorRepository;
import com.starcard.starpeople.service.FuncionarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/funcionarios")
@Tag(name = "Funcionários", description = "Endpoints para gestão de colaboradores")
public class FuncionarioAPIController {

    private final FuncionarioService service;
    // Precisamos deles para buscar o Setor/Cargo pelo ID
    private final SetorRepository setorRepository;
    private final CargoRepository cargoRepository;

    public FuncionarioAPIController(FuncionarioService service, SetorRepository setorRepository, CargoRepository cargoRepository) {
        this.service = service;
        this.setorRepository = setorRepository;
        this.cargoRepository = cargoRepository;
    }

    // 1. LISTAR (GET)
    @GetMapping
    @Operation(summary = "Listar todos", description = "Retorna a lista completa de funcionários")
    public ResponseEntity<List<FuncionarioDTO>> listarTodos() {
        List<Funcionario> lista = service.listarFuncionarios(null, null, null, "nome", "asc");
        List<FuncionarioDTO> dtos = lista.stream().map(FuncionarioDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // 2. BUSCAR POR ID (GET)
    @GetMapping("/{id}")
    @Operation(summary = "Buscar por ID", description = "Retorna os dados detalhados de um colaborador")
    public ResponseEntity<FuncionarioDTO> buscarPorId(@PathVariable Long id) {
        Funcionario funcionario = service.buscarPorId(id);
        return ResponseEntity.ok(new FuncionarioDTO(funcionario));
    }

    // 3. CADASTRAR (POST)
    @PostMapping
    @Operation(summary = "Cadastrar novo", description = "Cria um novo funcionário. Requer IDs de Setor e Cargo válidos.")
    public ResponseEntity<?> cadastrar(@RequestBody FuncionarioDTO dto) {
        try {
            // Conversão Manual DTO -> Entidade
            Funcionario f = new Funcionario();
            f.setNome(dto.getNome());
            f.setEmail(dto.getEmail());
            f.setCpf(dto.getCpf());
            f.setDataAdmissao(dto.getDataAdmissao());
            f.setAtivo(dto.getAtivo() != null ? dto.getAtivo() : true);

            // Buscar Setor e Cargo pelo ID que veio no JSON
            if (dto.getSetorId() != null) {
                Setor setor = setorRepository.findById(dto.getSetorId()).orElse(null);
                f.setSetor(setor);
            }
            if (dto.getCargoId() != null) {
                Cargo cargo = cargoRepository.findById(dto.getCargoId()).orElse(null);
                f.setCargo(cargo);
            }

            // A Mágica: Reaproveitamos toda a regra de negócio do Service (CPF, Validação, Log)
            service.salvarComRegras(f);

            return ResponseEntity.status(HttpStatus.CREATED).body(new FuncionarioDTO(f));

        } catch (IllegalArgumentException e) {
            // Se der erro de regra (ex: CPF duplicado), devolvemos erro 400 (Bad Request)
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao cadastrar: " + e.getMessage());
        }
    }

    // 4. ATUALIZAR (PUT)
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar existente", description = "Atualiza os dados de um funcionário. Requer IDs de Setor e Cargo.")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody FuncionarioDTO dto) {
        try {
            // 1. Busca o funcionário antigo (se não achar, o service lança erro)
            Funcionario f = service.buscarPorId(id);

            // 2. Atualiza os dados básicos
            f.setNome(dto.getNome());
            f.setEmail(dto.getEmail());
            f.setCpf(dto.getCpf());
            f.setDataAdmissao(dto.getDataAdmissao());
            // Mantém o status antigo se não vier no JSON, ou atualiza se vier
            if (dto.getAtivo() != null) f.setAtivo(dto.getAtivo());

            // 3. Atualiza Setor (se informado)
            if (dto.getSetorId() != null) {
                Setor setor = setorRepository.findById(dto.getSetorId()).orElse(null);
                f.setSetor(setor);
            }

            // 4. Atualiza Cargo (se informado)
            if (dto.getCargoId() != null) {
                Cargo cargo = cargoRepository.findById(dto.getCargoId()).orElse(null);
                f.setCargo(cargo);
            }

            // 5. Salva (Service aplica validações, formatação e Log de Edição)
            service.salvarComRegras(f);

            return ResponseEntity.ok(new FuncionarioDTO(f));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Funcionário não encontrado ou erro interno.");
        }
    }

    // 5. EXCLUIR (DELETE)
    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir", description = "Remove um funcionário do banco de dados (Cuidado: ação irreversível)")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        try {
            service.excluirDefinitivamente(id);
            return ResponseEntity.noContent().build(); // Retorna 204 (Sucesso sem conteúdo)
        } catch (Exception e) {
            // Se tentar excluir alguém que tem vínculos (segurança do banco)
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Não é possível excluir este funcionário pois existem registros vinculados.");
        }
    }
}