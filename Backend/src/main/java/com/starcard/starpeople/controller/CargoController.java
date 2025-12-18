package com.starcard.starpeople.controller;

import com.starcard.starpeople.model.Cargo;
import com.starcard.starpeople.service.CargoService;
import com.starcard.starpeople.service.SetorService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/cargos")
public class CargoController {

    private final CargoService cargoService;

    public CargoController(CargoService cargoService, SetorService setorService) {
        this.cargoService = cargoService;
    }

    @GetMapping
    public String listarCargos(Model model) {
        model.addAttribute("cargos", cargoService.buscarTodos());
        return "cargos/lista";
    }

    @GetMapping("/novo")
    public String abrirFormulario(Model model) {
        model.addAttribute("cargo", new Cargo());

        return "cargos/formulario";
    }

    @PostMapping("/salvar")
    public String salvarCargo(Cargo cargo) {
        cargoService.salvar(cargo);
        return "redirect:/cargos";
    }

    @GetMapping("/editar/{id}")
    public String editarCargo(@PathVariable Long id, Model model) {
        model.addAttribute("cargo", cargoService.buscarPorId(id));
        return "cargos/formulario";
    }

    @GetMapping("/excluir/{id}")
    public String excluirCargo(@PathVariable Long id) {
        cargoService.excluir(id);
        return "redirect:/cargos";
    }
}