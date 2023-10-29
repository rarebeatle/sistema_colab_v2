package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Inventario;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Inventario entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Long> {}
