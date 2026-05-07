package com.campuslost.backend.service;

import com.campuslost.backend.entity.preguntaBase;
import java.util.List;

public interface preguntaBaseService {
    List<preguntaBase> listarActivas();
    preguntaBase guardar(preguntaBase pregunta);
    preguntaBase actualizar(Integer id, preguntaBase datos);
    void eliminar(Integer id);
}