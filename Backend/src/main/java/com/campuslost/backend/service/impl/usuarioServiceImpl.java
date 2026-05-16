package com.campuslost.backend.service.impl;

import com.campuslost.backend.entity.usuario;
import com.campuslost.backend.repository.usuarioRepository;
import com.campuslost.backend.service.usuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class usuarioServiceImpl implements usuarioService {

    private final usuarioRepository usuarioRepository;

    public usuarioServiceImpl(usuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public usuario guardar(usuario usuario) {

        if(!usuario.getContrasena().startsWith("$2a$")) {
            usuario.setContrasena(
                passwordEncoder.encode(usuario.getContrasena())
            );
        }

        return usuarioRepository.save(usuario);
    }

    @Override
    public List<usuario> listar() {
        return usuarioRepository.findAll();
    }

    @Override
    public usuario obtenerPorId(Integer id) {
        return usuarioRepository.findById(id).orElse(null);
    }
    
    @Override
    public usuario actualizar(Integer id, usuario usuario, Integer idUsuarioEditor) {

        usuario editor = usuarioRepository.findById(idUsuarioEditor)
                .orElseThrow(() -> new RuntimeException("Editor no encontrado"));

        boolean esEdicionPropia = idUsuarioEditor != null && idUsuarioEditor.equals(id);

        // Permite que el usuario edite su propio perfil. Para editar a terceros requiere rol ADMIN (idRol=1).
        if (!esEdicionPropia) {
            if (editor.getRol() == null || editor.getRol().getIdRol() != 1) {
                throw new RuntimeException("No tienes permisos para editar usuarios");
            }
        }

        usuario existente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getNombre() != null && !usuario.getNombre().trim().isEmpty()) {
            existente.setNombre(usuario.getNombre().trim());
        }

        if (usuario.getCorreo() != null && !usuario.getCorreo().trim().isEmpty()) {
            final String correoNuevo = usuario.getCorreo().trim();
            usuarioRepository.findByCorreo(correoNuevo).ifPresent((u) -> {
                if (u.getIdUsuario() != null && !u.getIdUsuario().equals(id)) {
                    throw new RuntimeException("El correo ya está registrado");
                }
            });
            existente.setCorreo(correoNuevo);
        }

        // Solo un ADMIN puede cambiar el rol; al editar el propio perfil, se mantiene el rol actual.
        if (!esEdicionPropia && usuario.getRol() != null) {
            existente.setRol(usuario.getRol());
        }

        if (usuario.getContrasena() != null &&
            !usuario.getContrasena().trim().isEmpty()) {

            String pass = usuario.getContrasena().trim();
            if (pass.startsWith("$2a$")) {
                // Evita doble hash en escenarios donde el frontend reenvía el hash.
                existente.setContrasena(pass);
            } else {
                existente.setContrasena(passwordEncoder.encode(pass));
            }
        }

        return usuarioRepository.save(existente);
    }

    @Override
    public void eliminar(Integer id) {
        usuarioRepository.deleteById(id);
    }
}
