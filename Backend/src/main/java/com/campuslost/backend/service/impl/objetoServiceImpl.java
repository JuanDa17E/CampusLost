package com.campuslost.backend.service.impl;

import com.campuslost.backend.entity.objeto;
import com.campuslost.backend.repository.categoriaRepository;
import com.campuslost.backend.repository.estadoRepository;
import com.campuslost.backend.repository.objetoRepository;
import com.campuslost.backend.repository.usuarioRepository;
import com.campuslost.backend.service.objetoService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import com.campuslost.backend.config.CONSTANTES;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class objetoServiceImpl implements objetoService {
    private final objetoRepository objetoRepository;
    private final usuarioRepository usuarioRepository;
    private final categoriaRepository categoriaRepository;
    private final estadoRepository estadoRepository;

   
    
    
    public objetoServiceImpl(
        objetoRepository objetoRepository,
        usuarioRepository usuarioRepository,
        categoriaRepository categoriaRepository,
        estadoRepository estadoRepository
    ) {
        this.objetoRepository = objetoRepository;
        this.usuarioRepository = usuarioRepository;
        this.categoriaRepository = categoriaRepository;
        this.estadoRepository = estadoRepository;
    }
    

    @Override
    public objeto guardar(objeto objeto) {

        if (objeto.getCategoria() != null && objeto.getCategoria().getIdCategoria() != null) {
            objeto.setCategoria(
                categoriaRepository.findById(objeto.getCategoria().getIdCategoria()).orElse(null)
            );
        }

        if (objeto.getUsuario() != null && objeto.getUsuario().getIdUsuario() != null) {
            objeto.setUsuario(
                usuarioRepository.findById(objeto.getUsuario().getIdUsuario()).orElse(null)
            );
        }
        if (objeto.getEstado() == null || objeto.getEstado().getIdEstado() == null) {
            estadoRepository.findById(CONSTANTES.ESTADO_REGISTRADO).ifPresent(objeto::setEstado);
        } else {
            objeto.setEstado(
                estadoRepository.findById(objeto.getEstado().getIdEstado()).orElse(null)
            );
        }
        return objetoRepository.save(objeto);
    }

    @Override
    public List<objeto> listar() {
        return objetoRepository.findAll();
    }

    @Override
    public objeto obtenerPorId(Integer id) {
        return objetoRepository.findById(id).orElse(null);
    }

    @Override
    public objeto actualizar(Integer id, objeto datos) {

        objeto existente = objetoRepository.findById(id).orElse(null);

        if (existente == null) {
            throw new RuntimeException("Objeto no encontrado");
        }

        existente.setTitulo(datos.getTitulo());
        existente.setDescripcion(datos.getDescripcion());
        existente.setLugar(datos.getLugar());
        existente.setFechaEvento(datos.getFechaEvento());
        existente.setImagenUrl(datos.getImagenUrl());
        existente.setCategoria(datos.getCategoria());
        existente.setEstado(datos.getEstado());
        existente.setEnPuntoEncuentro(datos.getEnPuntoEncuentro());
        existente.setFechaPuntoEncuentro(datos.getFechaPuntoEncuentro());

        return objetoRepository.save(existente);
    }

    @Override
    public void eliminar(Integer id) {
        objetoRepository.deleteById(id);
    }
    
    @Override
    public objeto marcarPuntoEncuentro(Integer id, Boolean valor) {
        objeto existente = objetoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Objeto no encontrado"));
        existente.setEnPuntoEncuentro(valor);
        existente.setFechaPuntoEncuentro(valor ? LocalDateTime.now() : null);
        return objetoRepository.save(existente);
    }
}