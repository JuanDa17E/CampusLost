import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { LoadingOverlay } from "./componentes-generales/loading-overlay";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificacionesComponent, LoadingOverlay],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('campuslost-frontend');
}
