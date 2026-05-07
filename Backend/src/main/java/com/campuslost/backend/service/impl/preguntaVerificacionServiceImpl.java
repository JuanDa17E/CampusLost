package com.campuslost.backend.service.impl;

import com.campuslost.backend.entity.preguntaVerificacion;
import com.campuslost.backend.repository.preguntaVerificacionRepository;
import com.campuslost.backend.service.preguntaVerificacionService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class preguntaVerificacionServiceImpl implements preguntaVerificacionService {

    private final preguntaVerificacionRepository repository;

    public preguntaVerificacionServiceImpl(preguntaVerificacionRepository repository) {
        this.repository = repository;
    }

    @Override
    public preguntaVerificacion guardar(preguntaVerificacion pregunta) {
        return repository.save(pregunta);
    }

    @Override
    public List<preguntaVerificacion> listarPorObjeto(Integer idObjeto) {
        return repository.findByObjetoIdObjeto(idObjeto);
    }
    
    @Override
    public preguntaVerificacion actualizar(Integer id, preguntaVerificacion datos) {
        preguntaVerificacion existente = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pregunta no encontrada"));
        existente.setRespuesta(datos.getRespuesta());
        return repository.save(existente);
    }

    @Override
    public void eliminar(Integer id) {
        repository.deleteById(id);
    }
}