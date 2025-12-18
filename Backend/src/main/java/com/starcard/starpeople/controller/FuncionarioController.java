package com.starcard.starpeople.controller;

import com.starcard.starpeople.dto.FuncionarioDTO;
import com.starcard.starpeople.model.Funcionario;
import com.starcard.starpeople.service.CargoService;
import com.starcard.starpeople.service.FuncionarioService;
import com.starcard.starpeople.service.RelatorioService;
import com.starcard.starpeople.service.SetorService;
import com.starcard.starpeople.service.LogService; // Import do Log
import jakarta.validation.Valid;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.ByteArrayInputStream;

@Controller
@RequestMapping("/funcionarios")
public class FuncionarioController {

    private final FuncionarioService service;
    private final SetorService setorService;
    private final CargoService cargoService;
    private final RelatorioService relatorioService;
    private final LogService logService; // Serviço de Auditoria

    public FuncionarioController(FuncionarioService service,
                                 SetorService setorService,
                                 CargoService cargoService,
                                 RelatorioService relatorioService,
                                 LogService logService) {
        this.service = service;
        this.setorService = setorService;
        this.cargoService = cargoService;
        this.relatorioService = relatorioService;
        this.logService = logService;
    }

    // --- LISTAGEM USANDO DTO ---
    @GetMapping
    public String listarFuncionarios(Model model,
                                     @RequestParam(required = false) String busca,
                                     @RequestParam(required = false) Long setorId,
                                     @RequestParam(required = false) Boolean ativo,
                                     @RequestParam(defaultValue = "nome") String sort,
                                     @RequestParam(defaultValue = "asc") String dir,
                                     @RequestParam(defaultValue = "0") int page) {

        // 1. Buscamos a Entidade no Banco (Panela Suja)
        Page<Funcionario> paginaEntidades = service.listarComFiltros(busca, setorId, ativo, sort, dir, page);

        // 2. CONVERTEMOS para DTO (Prato Limpo)
        // O comando .map() pega cada item da lista e passa pelo construtor do DTO
        Page<FuncionarioDTO> paginaDTOs = paginaEntidades.map(FuncionarioDTO::new);

        // 3. Enviamos o DTO para o HTML
        model.addAttribute("paginaFuncionarios", paginaDTOs);
        model.addAttribute("funcionarios", paginaDTOs.getContent());

        // Filtros e Ordenação (Continua igual)
        model.addAttribute("buscaAtual", busca);
        model.addAttribute("setorAtual", setorId);
        model.addAttribute("ativoAtual", ativo);
        model.addAttribute("listaSetores", setorService.listarTodos());
        model.addAttribute("reverseSortDir", dir.equals("asc") ? "desc" : "asc");

        // Paginação
        model.addAttribute("paginaAtual", page);
        model.addAttribute("totalPaginas", paginaDTOs.getTotalPages()); // Usa o total do DTO
        model.addAttribute("sortAtual", sort);
        model.addAttribute("dirAtual", dir);

        return "funcionarios/lista";
    }

    // EXPORTAR EXCEL
    @GetMapping("/exportar")
    public ResponseEntity<InputStreamResource> exportarExcel(
            @RequestParam(required = false) String busca,
            @RequestParam(required = false) Long setorId,
            @RequestParam(required = false) Boolean ativo) {

        var lista = service.listarFuncionarios(busca, setorId, ativo, "nome", "asc");
        ByteArrayInputStream in = relatorioService.gerarExcelFuncionarios(lista);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=colaboradores.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
                .body(new InputStreamResource(in));
    }

    // --- MÉTODOS DE CADASTRO ---

    @GetMapping("/novo")
    public String abrirFormulario(Model model) {
        model.addAttribute("funcionario", new Funcionario());
        carregarListas(model);
        return "funcionarios/formulario";
    }

    @PostMapping("/salvar")
    public String salvar(@Valid @ModelAttribute("funcionario") Funcionario funcionario,
                         BindingResult result,
                         Model model,
                         RedirectAttributes attributes) {

        // 1. SE TIVER ERRO DE VALIDAÇÃO BÁSICA (Campos vazios, etc)
        if (result.hasErrors()) {
            carregarListas(model);
            return "funcionarios/formulario";
        }

        try {
            // --- AQUI ESTAVA O ERRO ---
            // Antes: service.salvar(funcionario);
            // AGORA: Chamamos o método novo com as regras
            service.salvarComRegras(funcionario);

            attributes.addFlashAttribute("mensagem", "Colaborador salvo com sucesso!");
            attributes.addFlashAttribute("tipo", "success");
            return "redirect:/funcionarios";

        } catch (IllegalArgumentException e) {
            // CAPTURA O ERRO DE CPF DUPLICADO QUE VEM DO SERVICE
            result.rejectValue("cpf", "error.funcionario", e.getMessage());

            carregarListas(model);
            return "funcionarios/formulario";
        }
    }

    @GetMapping("/editar/{id}")
    public String editarFuncionario(@PathVariable Long id, Model model) {
        model.addAttribute("funcionario", service.buscarPorId(id));
        carregarListas(model);
        return "funcionarios/formulario";
    }

    @GetMapping("/status/{id}")
    public String alternarStatus(@PathVariable Long id, RedirectAttributes attributes) {
        try {
            // O Service já faz o LOG e a regra de negócio
            service.alternarStatus(id);

            attributes.addFlashAttribute("mensagem", "Status atualizado com sucesso!");
            attributes.addFlashAttribute("tipo", "info");
        } catch (Exception e) {
            attributes.addFlashAttribute("mensagem", "Erro ao atualizar status.");
            attributes.addFlashAttribute("tipo", "danger");
        }
        return "redirect:/funcionarios";
    }

    @GetMapping("/excluir/{id}")
    public String excluirDefinitivamente(@PathVariable Long id, RedirectAttributes attributes) {
        try {
            // O Service já faz o LOG e deleta
            service.excluirDefinitivamente(id);

            attributes.addFlashAttribute("mensagem", "Registro apagado do banco com sucesso!");
            attributes.addFlashAttribute("tipo", "success");
        } catch (Exception e) {
            attributes.addFlashAttribute("mensagem", "Não é possível excluir: Este colaborador possui vínculos no sistema.");
            attributes.addFlashAttribute("tipo", "danger");
        }
        return "redirect:/funcionarios";
    }

    private void carregarListas(Model model) {
        model.addAttribute("listaSetores", setorService.listarTodos());
        model.addAttribute("listaCargos", cargoService.listarTodos());
    }
}