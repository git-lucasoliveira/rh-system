package com.lorhs.system.repository;

import com.lorhs.system.model.LogSistema;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LogSistemaRepository extends JpaRepository<LogSistema, Long> {

    // Busca tudo ordenado pela data (os últimos aparecem primeiro)
    List<LogSistema> findAllByOrderByDataHoraDesc();
}
