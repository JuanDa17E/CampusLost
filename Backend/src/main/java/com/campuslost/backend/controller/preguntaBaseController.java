package com.campuslost.backend.controller;

import com.campuslost.backend.entity.preguntaBase;
import com.campuslost.backend.service.preguntaBaseService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/preguntas-base")
@CrossOrigin("*")
public class preguntaBaseController {

    private final preguntaBaseService service;

    public preguntaBaseController(preguntaBaseService service) {
        this.service = service;
    }

    @GetMapping
    public List<preguntaBase> listarActivas() {
        return service.listarActivas();
    }

    @PostMapping
    public preguntaBase guardar(@RequestBody preguntaBase pregunta) {
        return service.guardar(pregunta);
    }

    @PutMapping("/{id}")
    public preguntaBase actualizar(@PathVariable Integer id,
                                    @RequestBody preguntaBase pregunta) {
        return service.actualizar(id, pregunta);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}