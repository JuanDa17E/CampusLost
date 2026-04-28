import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';
import { EstadoService } from '../services/estado';
import { EstadoDto } from '../dto/estadoDTO';

@Component({
  selector: 'app-estados',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './estados.html',
  styleUrl: './estados.css',
})
export class Estados implements OnInit {
  private readonly estadoService = inject(EstadoService);
  private readonly platformId = inject(PLATFORM_ID);

  estados: EstadoDto[] = [];
  estadosView: EstadoDto[] = [];

  cargando = false;
  buscando = false;
  guardando = false;
  eliminandoId: number | null = null;

  searchTerm = '';
  formVisible = false;
  editMode = false;
  form: EstadoDto = { nombre: '' };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargando = true;
      setTimeout(() => void this.cargar(), 0);
    }
  }

  async cargar(): Promise<void> {
    this.cargando = true;
    try {
      this.estados = await firstValueFrom(this.estadoService.listar());
      this.aplicarFiltroLocal();
    } catch (error) {
      console.error(error);
      alert('No se pudo cargar la lista de estados.');
    } finally {
      this.cargando = false;
    }
  }

  toggleRegistrar(): void {
    if (this.formVisible && !this.editMode) {
      this.formVisible = false;
      return;
    }
    this.formVisible = true;
    this.editMode = false;
    this.form = { nombre: '' };
  }

  editar(item: EstadoDto): void {
    this.formVisible = true;
    this.editMode = true;
    this.form = { idEstado: item.idEstado, nombre: item.nombre };
  }

  cancelar(): void {
    this.formVisible = false;
    this.editMode = false;
    this.form = { nombre: '' };
  }

  aplicarFiltroLocal(): void {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) {
      this.estadosView = [...this.estados];
      return;
    }

    this.estadosView = this.estados.filter((e) =>
      (e.nombre ?? '').toLowerCase().includes(q)
    );
  }

  async buscar(): Promise<void> {
    const q = this.searchTerm.trim();
    if (!q) {
      this.aplicarFiltroLocal();
      return;
    }

    const numericId = Number(q);
    if (!Number.isNaN(numericId) && Number.isInteger(numericId)) {
      this.buscando = true;
      try {
        const item = await firstValueFrom(this.estadoService.obtenerPorId(numericId));
        this.estadosView = item ? [item] : [];
      } catch (error) {
        console.error(error);
        this.estadosView = [];
        alert('No se encontró el estado con ese ID.');
      } finally {
        this.buscando = false;
      }
      return;
    }

    this.aplicarFiltroLocal();
  }

  async guardar(): Promise<void> {
    const nombre = (this.form.nombre ?? '').trim();
    if (!nombre) {
      alert('El nombre es obligatorio.');
      return;
    }

    this.guardando = true;
    try {
      if (this.editMode && this.form.idEstado != null) {
        await firstValueFrom(
          this.estadoService.actualizar(this.form.idEstado, { nombre })
        );
      } else {
        await firstValueFrom(this.estadoService.crear({ nombre }));
      }
      this.cancelar();
      void this.cargar();
    } catch (error) {
      console.error(error);
      alert('No se pudo guardar el estado.');
    } finally {
      this.guardando = false;
    }
  }

  async eliminar(item: EstadoDto): Promise<void> {
    if (item.idEstado == null) return;
    const ok = confirm('¿Seguro que deseas eliminar este estado?');
    if (!ok) return;

    const id = item.idEstado;
    const prevEstados = this.estados;
    const prevEstadosView = this.estadosView;

    this.estados = this.estados.filter((e) => e.idEstado !== id);
    this.estadosView = this.estadosView.filter((e) => e.idEstado !== id);
    if (this.editMode && this.form.idEstado === id) {
      this.cancelar();
    }

    this.eliminandoId = id;
    try {
      await firstValueFrom(this.estadoService.eliminar(id));
      void this.cargar();
    } catch (error) {
      console.error(error);
      this.estados = prevEstados;
      this.estadosView = prevEstadosView;
      alert('No se pudo eliminar el estado.');
    } finally {
      this.eliminandoId = null;
    }
  }
}
