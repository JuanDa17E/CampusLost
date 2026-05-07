package com.campuslost.backend.service.impl;

import com.campuslost.backend.entity.preguntaBase;
import com.campuslost.backend.repository.preguntaBaseRepository;
import com.campuslost.backend.service.preguntaBaseService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class preguntaBaseServiceImpl implements preguntaBaseService {

    private final preguntaBaseRepository repository;

    public preguntaBaseServiceImpl(preguntaBaseRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<preguntaBase> listarActivas() {
        return repository.findByActivaTrue();
    }

    @Override
    public preguntaBase guardar(preguntaBase pregunta) {
        return repository.save(pregunta);
    }

    @Override
    public preguntaBase actualizar(Integer id, preguntaBase datos) {
        preguntaBase existente = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pregunta no encontrada"));
        existente.setPregunta(datos.getPregunta());
        existente.setActiva(datos.getActiva());
        return repository.save(existente);
    }

    @Override
    public void eliminar(Integer id) {
        repository.deleteById(id);
    }
}