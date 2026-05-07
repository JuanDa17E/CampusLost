import { Component, inject } from '@angular/core';
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

  correo = '';
  contrasena = '';
  cargando = false;

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

        console.log(resp);

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

}