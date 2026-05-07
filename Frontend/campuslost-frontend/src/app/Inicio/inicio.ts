import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { Navbar } from '../componentes-generales/navbar-component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class inicio implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  nombreUsuario = '';
  mostrarConfirmCerrarSesion = false;

  ngOnInit(): void {
    const raw = this.authService.obtenerSesion();
    if (raw) {
      try {
        const data = JSON.parse(raw);
        this.nombreUsuario = data?.nombre ?? 'Usuario';
      } catch {
        this.nombreUsuario = 'Usuario';
      }
    }
  }

  irAObjetos(): void {
     this.router.navigate(['/objeto'], { 
    queryParams: { from: '/inicio' } 
  });
  }

  irARegistrar(): void {
   this.router.navigate(['/registrar-objeto'], { 
    queryParams: { from: '/inicio' } 
  });
  }

  abrirConfirmCerrarSesion(): void {
    this.mostrarConfirmCerrarSesion = true;
  }

  cancelarCerrarSesion(): void {
    this.mostrarConfirmCerrarSesion = false;
  }

  confirmarCerrarSesion(): void {
    this.mostrarConfirmCerrarSesion = false;
    this.authService.cerrarSesion();
    this.router.navigate(['/'], { replaceUrl: true });
  }
}