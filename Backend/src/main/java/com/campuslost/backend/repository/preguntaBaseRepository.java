package com.campuslost.backend.repository;

import com.campuslost.backend.entity.preguntaBase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface preguntaBaseRepository
    extends JpaRepository<preguntaBase, Integer> {
    List<preguntaBase> findByActivaTrue();
}