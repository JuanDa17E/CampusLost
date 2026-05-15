import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../componentes-generales/navbar-component';
import { PreguntaBase } from '../dto/pregunta.base.dto';
import { PreguntaBaseDto } from '../dto/preguntaBaseDTO';
import { PreguntaBaseService } from '../services/pregunta-base.service';



@Component({
  selector: 'app-crud-preguntas',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './preguntas.html',
  styleUrl: './preguntas.css',
})
export class CrudPreguntas implements OnInit {
  private readonly service = inject(PreguntaBaseService);

  preguntas: PreguntaBase[] = [];
  preguntasFiltradas: PreguntaBase[] = [];
  preguntasPagina: PreguntaBase[] = [];

  textoBusqueda = '';
  porPagina = 5;
  paginaActual = 1;
  totalPaginas = 1;

  mostrarModal = false;
  mostrarModalEliminar = false;
  editandoId: number | null = null;
  preguntaAEliminar: PreguntaBase | null = null;
  form: { texto: string; activo: boolean } = { texto: '', activo: true };

  ngOnInit(): void {
    this.cargar();
  }

  private dtoToModel(dto: PreguntaBaseDto): PreguntaBase {
    return {
      id: dto.idPreguntaBase ?? 0,
      texto: dto.pregunta ?? '',
      activo: dto.activa ?? false,
    };
  }

  cargar(): void {
    this.service.listarActivas().subscribe(data => {
      this.preguntas = data.map(dto => this.dtoToModel(dto));
      this.buscar();
    });
  }

  buscar(): void {
    const term = this.textoBusqueda.toLowerCase().trim();
    this.preguntasFiltradas = term
      ? this.preguntas.filter(p => p.texto.toLowerCase().includes(term))
      : [...this.preguntas];
    this.paginaActual = 1;
    this.calcularPaginas();
  }

  cambiarPorPagina(): void {
    this.paginaActual = 1;
    this.calcularPaginas();
  }

  calcularPaginas(): void {
    this.totalPaginas = Math.max(1, Math.ceil(this.preguntasFiltradas.length / this.porPagina));
    this.actualizarPagina();
  }

  actualizarPagina(): void {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    this.preguntasPagina = this.preguntasFiltradas.slice(inicio, inicio + this.porPagina);
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) { this.paginaActual--; this.actualizarPagina(); }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) { this.paginaActual++; this.actualizarPagina(); }
  }

  abrirModalNueva(): void {
    this.editandoId = null;
    this.form = { texto: '', activo: true };
    this.mostrarModal = true;
  }

  abrirModalEditar(p: PreguntaBase): void {
    this.editandoId = p.id;
    this.form = { texto: p.texto, activo: p.activo };
    this.mostrarModal = true;
  }

  cerrarModal(): void { this.mostrarModal = false; }

  guardar(): void {
    if (!this.form.texto.trim()) return;

    const payload: PreguntaBaseDto = {
      pregunta: this.form.texto,
      activa: this.form.activo,
    };

    if (this.editandoId !== null) {
      this.service.actualizar(this.editandoId, payload).subscribe(() => {
        this.cerrarModal(); this.cargar();
      });
    } else {
      this.service.guardar(payload).subscribe(() => {
        this.cerrarModal(); this.cargar();
      });
    }
  }

  abrirModalEliminar(p: PreguntaBase): void {
    this.preguntaAEliminar = p;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.preguntaAEliminar = null;
  }

  confirmarEliminar(): void {
    if (!this.preguntaAEliminar) return;
    this.service.eliminar(this.preguntaAEliminar.id).subscribe(() => {
      this.cerrarModalEliminar(); this.cargar();
    });
  }
}