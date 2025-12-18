package com.starcard.starpeople.controller;

import com.starcard.starpeople.repository.CargoRepository;
import com.starcard.starpeople.repository.FuncionarioRepository;
import com.starcard.starpeople.repository.SetorRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    // Usamos Repositories aqui porque eles já têm o método .count() pronto
    private final FuncionarioRepository funcionarioRepository;
    private final SetorRepository setorRepository;
    private final CargoRepository cargoRepository;

    public HomeController(FuncionarioRepository funcionarioRepository,
                          SetorRepository setorRepository,
                          CargoRepository cargoRepository) {
        this.funcionarioRepository = funcionarioRepository;
        this.setorRepository = setorRepository;
        this.cargoRepository = cargoRepository;
    }

    // 1. Rota Principal do Dashboard (/home) -> Para onde o Login manda
    @GetMapping("/home")
    public String home(Model model) {
        // Busca os totais usando o método padrão .count() do banco de dados
        model.addAttribute("totalFuncionarios", funcionarioRepository.count());

        // Se ainda não tiveres dados nestas tabelas, vai mostrar 0, o que é perfeito
        model.addAttribute("totalSetores", setorRepository.count());
        model.addAttribute("totalCargos", cargoRepository.count());

        return "home"; // Abre o arquivo home.html
    }

    // 2. Redirecionamento da Raiz (localhost:8080) -> Manda para o /home
    @GetMapping("/")
    public String index() {
        return "redirect:/home";
    }
}