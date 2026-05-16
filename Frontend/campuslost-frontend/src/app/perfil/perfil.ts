import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom, timeout } from 'rxjs';

import { Navbar } from '../componentes-generales/navbar-component';
import { AuthService } from '../services/auth';
import { NotificacionService } from '../services/notificacion.service';
import { UsuarioDto, UsuarioService } from '../services/usuario';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly authService = inject(AuthService);
  private readonly notificacion = inject(NotificacionService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cdr = inject(ChangeDetectorRef);

  cargando = false;
  guardando = false;

  usuario: UsuarioDto | null = null;

  form = {
    nombre: '',
    correo: '',
    nuevaContrasena: '',
    confirmarContrasena: '',
  };

  ngOnInit(): void {
    void this.cargarPerfil();
  }

  private getLoggedUserId(): number | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    const data = this.authService.obtenerSesion();
    if (!data) return null;

    const id =
      data?.idUsuario ??
      data?.id_usuario ??
      data?.usuario?.idUsuario ??
      data?.usuario?.id_usuario;

    const n = Number(id);
    return Number.isFinite(n) ? n : null;
  }

  private errorContrasena(contrasena: string): string | null {
    const value = (contrasena ?? '').trim();
    if (value.length < 8) return 'La contraseña debe tener mínimo 8 caracteres.';
    if (!/[A-Z]/.test(value)) return 'La contraseña debe incluir al menos una mayúscula.';
    if (!/[^A-Za-z0-9]/.test(value)) return 'La contraseña debe incluir al menos un caracter especial.';
    return null;
  }

  async cargarPerfil(): Promise<void> {
    const userId = this.getLoggedUserId();
    if (!userId) {
      this.notificacion.advertencia('Debes iniciar sesión.');
      this.router.navigate(['/'], { replaceUrl: true });
      return;
    }

    this.cargando = true;
    try {
      const user = await firstValueFrom(
        this.usuarioService.obtenerPorId(userId).pipe(timeout({ first: 10000 }))
      );
      this.usuario = user;
      this.form.nombre = (user?.nombre ?? '').trim();
      this.form.correo = (user?.correo ?? '').trim();
      this.form.nuevaContrasena = '';
      this.form.confirmarContrasena = '';
    } catch (error) {
      console.error(error);
      this.notificacion.error('No se pudo cargar tu perfil.');
    } finally {
      this.cargando = false;
      // En algunas configuraciones (fetch/hydration), forzamos el refresco del UI.
      try {
        this.cdr.detectChanges();
      } catch {
        // Ignore
      }
    }
  }

  getRolNombre(): string {
    const n = this.usuario?.rol?.nombre ?? (this.usuario as any)?.rol;
    return (typeof n === 'string' ? n : '').trim() || '—';
  }

  getFechaCreacionDisplay(): string {
    const rawAny = (this.usuario?.fechaCreacion ?? this.usuario?.fecha_creacion) as any;
    const raw = (rawAny ?? '').toString().trim();
    if (!raw) return '—';

    const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;

    return raw;
  }

  async guardarCambios(): Promise<void> {
    const userId = this.getLoggedUserId();
    if (!userId) {
      this.notificacion.advertencia('Debes iniciar sesión.');
      this.router.navigate(['/'], { replaceUrl: true });
      return;
    }

    const nombre = (this.form.nombre ?? '').trim();
    const correoActual = (this.usuario?.correo ?? this.form.correo ?? '').trim();
    const nueva = (this.form.nuevaContrasena ?? '').trim();
    const confirm = (this.form.confirmarContrasena ?? '').trim();

    if (!nombre) {
      this.notificacion.advertencia('El nombre es obligatorio.');
      return;
    }

    if (!correoActual) {
      this.notificacion.advertencia('No se pudo identificar tu correo actual. Recarga la página e inténtalo de nuevo.');
      return;
    }

    if (nueva || confirm) {
      if (!nueva) {
        this.notificacion.advertencia('Ingresa la nueva contraseña.');
        return;
      }

      if (!confirm) {
        this.notificacion.advertencia('Confirma la nueva contraseña.');
        return;
      }

      if (nueva !== confirm) {
        this.notificacion.advertencia('Las contraseñas no coinciden.');
        return;
      }

      const errorPass = this.errorContrasena(nueva);
      if (errorPass) {
        this.notificacion.advertencia(errorPass);
        return;
      }
    }

    this.guardando = true;
    try {
      // En perfil NO se permite editar el correo.
      const payload: UsuarioDto = { nombre, correo: correoActual };
      if (nueva) payload.contrasena = nueva;

      const actualizado = await firstValueFrom(this.usuarioService.actualizar(userId, payload, userId));
      this.usuario = actualizado;

      // Refresca el nombre en sesión (si otras vistas lo usan)
      this.authService.guardarSesion(actualizado);

      this.form.nuevaContrasena = '';
      this.form.confirmarContrasena = '';

      this.notificacion.exito('Perfil actualizado correctamente.');
    } catch (error) {
      console.error(error);
      if (error instanceof HttpErrorResponse) {
        const serverMsg =
          typeof error.error === 'string'
            ? error.error
            : (error.error?.message as string | undefined);
        this.notificacion.error(serverMsg || 'No se pudo actualizar tu perfil.');
      } else {
        this.notificacion.error('No se pudo actualizar tu perfil.');
      }
    } finally {
      this.guardando = false;
    }
  }
}
