import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { firstValueFrom } from 'rxjs';

import { ObjetoService } from '../services/objeto';
import { ObjetoDto } from '../dto/objetoDTO';
import { CategoriaDto, CategoriaService } from '../services/categoria';
import { PreguntaBaseService } from '../services/pregunta-base.service';
import { PreguntaBaseDto } from '../dto/preguntaBaseDTO';
import { PreguntaVerificacionService } from '../services/pregunta-verificacion.service';
import { Navbar } from '../componentes-generales/navbar-component';
import { NotificacionService } from '../services/notificacion.service';

@Component({
  selector: 'app-registrar-objeto',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './registrar-objeto.html',
  styleUrl: './registrar-objeto.css',
})
export class RegistrarObjeto implements OnInit {
  private readonly objetoService = inject(ObjetoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly preguntaBaseService = inject(PreguntaBaseService);
  private readonly preguntaVerificacionService = inject(PreguntaVerificacionService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notificacion = inject(NotificacionService);
  private readonly route = inject(ActivatedRoute);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  pasoActual = 1;
  guardando = false;

  form: ObjetoDto = { titulo: '', descripcion: '', lugar: '', fecha: '' };
  categoriaId: number | null = null;

  categorias: CategoriaDto[] = [];
  categoriasLoading = false;

  preguntasBase: PreguntaBaseDto[] = [];
  respuestas: { [idPregunta: number]: string } = {};
  preguntasLoading = false;

  private rutaOrigen = '/registrar-objeto';

  private getLoggedUserId(): number | null {
    const raw = this.authService.obtenerSesion();
    if (!raw) return null;
    try {
      const data = JSON.parse(raw);
      const id = data?.idUsuario ?? data?.id_usuario;
      const n = Number(id);
      return Number.isFinite(n) ? n : null;
    } catch { return null; }
  }

  private getId(item: ObjetoDto): number | undefined {
    return item.idObjeto ?? item.id_objeto ?? (item as any)?.id;
  }

  ngOnInit(): void {
      this.rutaOrigen = this.route.snapshot.queryParams['from'] ?? '/registrar-objeto';
    void this.cargarCategorias();
    void this.cargarPreguntasBase();
  }

  async cargarCategorias(): Promise<void> {
    this.categoriasLoading = true;
    try {
      this.categorias = await firstValueFrom(this.categoriaService.listar());
    } catch { this.categorias = []; }
    finally { this.categoriasLoading = false; }
  }

  async cargarPreguntasBase(): Promise<void> {
    this.preguntasLoading = true;
    try {
      this.preguntasBase = await firstValueFrom(this.preguntaBaseService.listarActivas());
      this.respuestas = {};
      for (const p of this.preguntasBase) {
        if (p.idPreguntaBase != null) {
          this.respuestas[p.idPreguntaBase] = '';
        }
      }
    } catch { this.preguntasBase = []; }
    finally { this.preguntasLoading = false; }
  }

  siguientePaso(): void {
    if (!this.form.titulo?.trim()) { this.notificacion.advertencia('El título es obligatorio.'); return; }
    if (!this.form.lugar?.trim()) { this.notificacion.advertencia('El lugar es obligatorio.'); return; }
    if (!this.form.fecha?.trim()) { this.notificacion.advertencia('La fecha es obligatoria.'); return; }
    if (!this.categoriaId) { this.notificacion.advertencia('La categoría es obligatoria.'); return; }
    this.pasoActual = 2;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  volverPaso(): void {
    this.pasoActual = 1;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  cancelar(): void {
    this.router.navigate([this.rutaOrigen]);
  }
  async registrar(): Promise<void> {
    const todasRespondidas = this.preguntasBase.every(
      p => p.idPreguntaBase != null && (this.respuestas[p.idPreguntaBase] ?? '').trim() !== ''
    );
    if (!todasRespondidas) { this.notificacion.advertencia('Por favor responde todas las preguntas.'); return; }

    const userId = this.getLoggedUserId();
    if (!userId) {
      this.notificacion.advertencia('No se pudo identificar el usuario. Inicia sesión de nuevo.');
      this.router.navigate(['/']);
      return;
    }

    this.guardando = true;
    try {
      const payload: ObjetoDto = {
        titulo: this.form.titulo!.trim(),
        descripcion: (this.form.descripcion ?? '').trim(),
        lugar: this.form.lugar!.trim(),
        fecha: this.form.fecha!.trim(),
        fechaEvento: this.form.fecha!.trim(),
        idCategoria: this.categoriaId!,
        idUsuario: userId,
        categoria: { idCategoria: this.categoriaId! },
        usuario: { idUsuario: userId },
      };

      const objetoGuardado = await firstValueFrom(this.objetoService.crear(payload));
      const idObjeto = this.getId(objetoGuardado);

      if (idObjeto) {
        for (const p of this.preguntasBase) {
          if (p.idPreguntaBase == null) continue;
          await firstValueFrom(this.preguntaVerificacionService.guardar({
            objeto: { idObjeto },
            usuario: { idUsuario: userId },
            preguntaBase: { idPreguntaBase: p.idPreguntaBase },
            respuesta: this.respuestas[p.idPreguntaBase].trim(),
          }));
        }
      }

      this.router.navigate(['/objetos']);
    } catch (e) {
      console.error(e);
      this.notificacion.error(this.notificacion.parsearError(e));
    } finally {
      this.guardando = false;
      this.cdr.markForCheck();
    }
     this.router.navigate([this.rutaOrigen]);
  }
}