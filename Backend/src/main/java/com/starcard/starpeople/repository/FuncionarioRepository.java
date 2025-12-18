package com.starcard.starpeople.repository;

import com.starcard.starpeople.model.Funcionario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

    // QUERY:
    // Mudamos de List<Funcionario> para Page<Funcionario>
    // E trocamos 'Sort' por 'Pageable' no final
    @Query(value = "SELECT f FROM Funcionario f " +
            "LEFT JOIN FETCH f.setor " +
            "LEFT JOIN FETCH f.cargo " +
            "WHERE (:busca IS NULL OR f.nome LIKE %:busca% OR f.cpf LIKE %:busca%) " +
            "AND (:setorId IS NULL OR f.setor.id = :setorId) " +
            "AND (:ativo IS NULL OR f.ativo = :ativo)",
            countQuery = "SELECT COUNT(f) FROM Funcionario f " +
                    "WHERE (:busca IS NULL OR f.nome LIKE %:busca% OR f.cpf LIKE %:busca%) " +
                    "AND (:setorId IS NULL OR f.setor.id = :setorId) " +
                    "AND (:ativo IS NULL OR f.ativo = :ativo)")
    Page<Funcionario> buscarComFiltros(String busca, Long setorId, Boolean ativo, Pageable pageable);

    //Método específico para o Relatório Excel (Retorna Lista completa, sem paginação)
    @Query("SELECT f FROM Funcionario f " +
            "LEFT JOIN FETCH f.setor " +
            "LEFT JOIN FETCH f.cargo " +
            "WHERE " +
            "(:busca IS NULL OR f.nome LIKE %:busca% OR f.cpf LIKE %:busca%) AND " +
            "(:setorId IS NULL OR f.setor.id = :setorId) AND " +
            "(:ativo IS NULL OR f.ativo = :ativo)")
    List<Funcionario> buscarParaRelatorio(String busca, Long setorId, Boolean ativo, Sort sort);
    boolean existsByCpf(String cpf);
}

