import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { firstValueFrom } from 'rxjs';

import { ObjetoService } from '../services/objeto';
import { ObjetoDto } from '../dto/objetoDTO';
import { PreguntaBaseService } from '../services/pregunta-base.service';
import { PreguntaBaseDto } from '../dto/preguntaBaseDTO';
import { IntentoReclamacionService } from '../services/intento.reclamacion.service';
import { RespuestaReclamacionService } from '../services/respuesta.reclamacion.service';
import { Navbar } from '../componentes-generales/navbar-component';
import { NotificacionService } from '../services/notificacion.service';

@Component({
  selector: 'app-reclamar-objeto',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './reclamar-objeto.html',
  styleUrl: './reclamar-objeto.css',
})
export class ReclamarObjeto implements OnInit {
  private readonly objetoService = inject(ObjetoService);
  private readonly preguntaBaseService = inject(PreguntaBaseService);
  private readonly intentoService = inject(IntentoReclamacionService);
  private readonly respuestaService = inject(RespuestaReclamacionService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notificacion = inject(NotificacionService);
  private readonly route = inject(ActivatedRoute);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  objeto: ObjetoDto | null = null;
  preguntasBase: PreguntaBaseDto[] = [];
  respuestas: { [idPregunta: number]: string } = {};

  cargando = false;
  enviando = false;
  idObjeto: number | null = null;

  private getLoggedUserId(): number | null {
    const data = this.authService.obtenerSesion();
    if (!data) return null;
    const id = data?.idUsuario ?? data?.id_usuario;
    const n = Number(id);
    return Number.isFinite(n) ? n : null;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/objeto']); return; }
    this.idObjeto = Number(id);
    void this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando = true;
    try {
      const [objeto, preguntas] = await Promise.all([
        firstValueFrom(this.objetoService.obtenerPorId(this.idObjeto!)),
        firstValueFrom(this.preguntaBaseService.listarActivas()),
      ]);
      this.objeto = objeto;
      this.preguntasBase = preguntas;
      this.respuestas = {};
      for (const p of preguntas) {
        if (p.idPreguntaBase != null) {
          this.respuestas[p.idPreguntaBase] = '';
        }
      }
    } catch (e) {
      console.error(e);
      this.notificacion.error('No se pudo cargar el objeto.');
      this.router.navigate(['/objeto']);
    } finally {
      this.cargando = false;
      this.cdr.markForCheck();
    }
  }

  getCategoriaNombre(): string {
    if (!this.objeto) return '';
    const n = this.objeto.categoriaNombre ?? this.objeto.categoria?.nombre;
    return (typeof n === 'string' ? n : '').trim();
  }

  getFechaDisplay(): string {
    if (!this.objeto) return '';
    const raw = (this.objeto.fecha ?? this.objeto.fechaEvento ?? '').trim();
    if (!raw) return '';
    const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
    return raw;
  }

  async enviar(): Promise<void> {
    const todasRespondidas = this.preguntasBase.every(
      p => p.idPreguntaBase != null && (this.respuestas[p.idPreguntaBase] ?? '').trim() !== ''
    );
    if (!todasRespondidas) {
      this.notificacion.advertencia('Por favor responde todas las preguntas.');
      return;
    }

    const userId = this.getLoggedUserId();
    if (!userId) {
      this.notificacion.advertencia('Debes iniciar sesión para reclamar un objeto.');
      this.router.navigate(['/']);
      return;
    }

    this.enviando = true;
    try {
      const intento = await firstValueFrom(this.intentoService.crear({
        objeto: { idObjeto: this.idObjeto! },
        usuario: { idUsuario: userId },
      }));

      const idIntento = intento.idIntento;

      if (idIntento) {
        for (const p of this.preguntasBase) {
          if (p.idPreguntaBase == null) continue;
          await firstValueFrom(this.respuestaService.guardar({
            intento: { idIntento },
            preguntaBase: { idPreguntaBase: p.idPreguntaBase },
            respuestaDada: this.respuestas[p.idPreguntaBase].trim(),
          }));
        }
      }

      this.notificacion.exito('Reclamación enviada correctamente. El encargado revisará tus respuestas.');
      this.router.navigate(['/objeto']);
    } catch (e) {
      console.error(e);
      this.notificacion.error(this.notificacion.parsearError(e));
    } finally {
      this.enviando = false;
      this.cdr.markForCheck();
    }
  }

  cancelar(): void {
    this.router.navigate(['/objeto']);
  }
}