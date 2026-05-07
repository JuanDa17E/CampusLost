import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificacionesComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('campuslost-frontend');
}
