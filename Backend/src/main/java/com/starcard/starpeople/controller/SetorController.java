package com.starcard.starpeople.controller;

import com.starcard.starpeople.model.Setor;
import com.starcard.starpeople.service.SetorService; // <--- Importamos o Service!
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@Controller
@RequestMapping("/setores") // <--- Define o prefixo para todas as rotas aqui
public class SetorController {

    // 1. Trocamos o Repository direto pelo Service (o Especialista)
    private final SetorService service;

    // Injeção de dependência do Service
    public SetorController(SetorService service) {
        this.service = service;
    }

    @GetMapping // Vai cair em /setores (por causa do RequestMapping lá em cima)
    public String listarSetores(Model model) {
        // O Controller pede pro Service buscar
        model.addAttribute("setores", service.buscarTodos());
        return "setores/lista";
    }

    @GetMapping("/novo") // Vai cair em /setores/novo
    public String abrirFormulario(Model model) {
        model.addAttribute("setor", new Setor());
        return "setores/formulario";
    }

    @PostMapping("/salvar") // Vai cair em /setores/salvar
    public String salvarSetor(@Valid Setor setor, BindingResult result) {
        if (result.hasErrors()) {
            return "setores/formulario";
        }

        // O Service resolve a regra de salvar
        service.salvar(setor);

        return "redirect:/setores";
    }

    @GetMapping("/excluir/{id}")
    public String excluirSetor(@PathVariable Long id) {
        // O Service resolve a exclusão
        service.excluir(id);
        return "redirect:/setores";
    }

    @GetMapping("/editar/{id}")
    public String editarSetor(@PathVariable Long id, Model model) {
        // O Service busca o setor (e lança erro se não achar)
        Setor setorExistente = service.buscarPorId(id);

        model.addAttribute("setor", setorExistente);
        return "setores/formulario";
    }
}