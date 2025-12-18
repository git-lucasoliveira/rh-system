package com.starcard.starpeople.service;

import com.starcard.starpeople.model.Cargo;
import com.starcard.starpeople.repository.CargoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CargoService {

    private final CargoRepository repository;

    public CargoService(CargoRepository repository) {
        this.repository = repository;
    }

    public List<Cargo> listarTodos() {
        return repository.findAll();
    }

    public List <Cargo> buscarTodos() {
        return repository.findAll();
    }

    public void salvar(Cargo cargo) {
        repository.save(cargo);
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }

    public Cargo buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Cargo não encontrado"));
    }

    public long contar() {
        return repository.count();
    }

}