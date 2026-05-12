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

  private readonly correoDominioPermitido = 'comunidad.iush.edu.co';

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

  private esCorreoInstitucional(correo: string): boolean {
    const value = (correo ?? '').trim().toLowerCase();
    // Debe ser exactamente algo@comunidad.iush.edu.co
    const re = new RegExp(`^[^@\\s]+@${this.correoDominioPermitido.replace(/\./g, '\\.')}$`, 'i');
    return re.test(value);
  }

  private errorContrasena(contrasena: string): string | null {
    const value = (contrasena ?? '').trim();
    if (value.length < 8) return 'La contraseña debe tener mínimo 8 caracteres.';
    if (!/[A-Z]/.test(value)) return 'La contraseña debe incluir al menos una mayúscula.';
    // “caracter especial”: cualquier carácter no alfanumérico
    if (!/[^A-Za-z0-9]/.test(value)) return 'La contraseña debe incluir al menos un caracter especial.';
    return null;
  }

  registrar() {
    if (!this.regNombre || !this.regCorreo || !this.regContrasena || !this.regConfirmar) {
      this.notificacion.advertencia('Completa todos los campos');
      return;
    }

    if (!this.esCorreoInstitucional(this.regCorreo)) {
      this.notificacion.advertencia(`El correo debe terminar en @${this.correoDominioPermitido}`);
      return;
    }

    if (this.regContrasena !== this.regConfirmar) {
      this.notificacion.advertencia('Las contraseñas no coinciden');
      return;
    }

    const errorPass = this.errorContrasena(this.regContrasena);
    if (errorPass) {
      this.notificacion.advertencia(errorPass);
      return;
    }

    this.cargando = true;

    this.auth.registrar({
      nombre: this.regNombre,
      correo: this.regCorreo.trim(),
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