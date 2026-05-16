package com.campuslost.backend.controller;

import com.campuslost.backend.entity.usuario;
import com.campuslost.backend.repository.usuarioRepository;
import com.campuslost.backend.service.impl.loginRequest;
import com.campuslost.backend.service.impl.registerRequest;
import com.campuslost.backend.entity.rol;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final usuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(usuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public Object login(@RequestBody loginRequest request) {
        usuario user = usuarioRepository
                .findByCorreo(request.getCorreo())
                .orElse(null);

        if (user == null) {
            return "Correo no encontrado";
        }

        boolean ok = passwordEncoder.matches(
                request.getContrasena(),
                user.getContrasena()
        );

        if (!ok) {
            return "Contraseña incorrecta";
        }

        return user;
    }

    @PostMapping("/registro")
    public Object registro(@RequestBody registerRequest request) {

        boolean existe = usuarioRepository.findByCorreo(request.getCorreo()).isPresent();
        if (existe) {
            return "El correo ya está registrado";
        }

        usuario nuevoUsuario = new usuario();
        nuevoUsuario.setNombre(request.getNombre());
        nuevoUsuario.setCorreo(request.getCorreo());
        nuevoUsuario.setContrasena(passwordEncoder.encode(request.getContrasena()));

        rol rolDefault = new rol();
        // Por defecto, todo usuario nuevo se registra como USUARIO (id=2).
        rolDefault.setIdRol(2);
        nuevoUsuario.setRol(rolDefault);

        usuarioRepository.save(nuevoUsuario);

        return "Usuario registrado correctamente";
    }

}