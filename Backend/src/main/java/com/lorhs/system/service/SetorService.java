package com.lorhs.system.service;

import com.lorhs.system.model.Setor;
import com.lorhs.system.repository.SetorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SetorService {

    private final SetorRepository repository;

    public SetorService(SetorRepository repository) {
        this.repository = repository;
    }

    public List<Setor> listarTodos() {
        return repository.findAll();
    }

    public List<Setor> buscarTodos() {
        return repository.findAll();
    }

    public void salvar(Setor setor) {
        repository.save(setor);
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }

    public Setor buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Setor não encontrado"));
    }

    public long contar() {
        return repository.count();
    }
}