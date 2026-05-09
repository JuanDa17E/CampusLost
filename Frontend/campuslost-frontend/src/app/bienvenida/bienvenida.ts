import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { NotificacionService } from '../services/notificacion.service';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bienvenida.html',
  styleUrl: './bienvenida.css'
})
export class Bienvenida {

  private auth = inject(AuthService);
  private router = inject(Router);
  private notificacion = inject(NotificacionService);
  private cdr = inject(ChangeDetectorRef);

  // Control de vista
  vistaActual: 'login' | 'registro' = 'login';

  // Campos login
  correo = '';
  contrasena = '';

  // Campos registro
  regNombre = '';
  regCorreo = '';
  regContrasena = '';
  regConfirmar = '';

  cargando = false;

  cambiarVista(vista: 'login' | 'registro') {
    this.vistaActual = vista;
    // Limpia campos al cambiar de vista
    this.correo = '';
    this.contrasena = '';
    this.regNombre = '';
    this.regCorreo = '';
    this.regContrasena = '';
    this.regConfirmar = '';
  }

  iniciarSesion() {
    if (!this.correo || !this.contrasena) {
      this.notificacion.advertencia('Completa los campos');
      return;
    }

    this.cargando = true;

    this.auth.login({
      correo: this.correo,
      contrasena: this.contrasena
    }).subscribe({
      next: (resp) => {
        if (typeof resp === 'string') {
          this.notificacion.exito(resp);
          this.cargando = false;
          return;
        }
        this.auth.guardarSesion(resp);
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        console.error(err);
        this.notificacion.advertencia('Credenciales incorrectas');
        this.cargando = false;
      },
      complete: () => {
        this.cargando = false;
      }
    });
  }

  registrar() {
    if (!this.regNombre || !this.regCorreo || !this.regContrasena || !this.regConfirmar) {
      this.notificacion.advertencia('Completa todos los campos');
      return;
    }

    if (this.regContrasena !== this.regConfirmar) {
      this.notificacion.advertencia('Las contraseñas no coinciden');
      return;
    }

    if (this.regContrasena.length < 6) {
      this.notificacion.advertencia('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    this.cargando = true;

    this.auth.registrar({
      nombre: this.regNombre,
      correo: this.regCorreo,
      contrasena: this.regContrasena
    }).subscribe({
      next: (resp) => {
        this.notificacion.exito('Cuenta creada correctamente. Ahora puedes iniciar sesión.');
        this.cambiarVista('login');
        // Pre-rellena el correo para que el usuario solo ponga la contraseña
        this.correo = this.regCorreo;
      },
      error: (err) => {
        console.error(err);
        const msg = err?.error?.mensaje || err?.error?.message || 'No se pudo crear la cuenta';
        this.notificacion.advertencia(msg);
        this.cargando = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

}