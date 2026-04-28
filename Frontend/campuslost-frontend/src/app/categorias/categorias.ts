import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaDto, CategoriaService } from '../services/categoria';
import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit {
  private readonly categoriaService = inject(CategoriaService);
  private readonly platformId = inject(PLATFORM_ID);

  categorias: CategoriaDto[] = [];
  categoriasView: CategoriaDto[] = [];

  cargando = false;
  buscando = false;
  guardando = false;
  eliminandoId: number | null = null;

  searchTerm = '';
  formVisible = false;
  editMode = false;
  form: CategoriaDto = { nombre: '' };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargando = true;
      setTimeout(() => void this.cargar(), 0);
    }
  }

  async cargar(): Promise<void> {
    this.cargando = true;
    try {
      this.categorias = await firstValueFrom(this.categoriaService.listar());
      this.aplicarFiltroLocal();
    } catch (error) {
      console.error(error);
      alert('No se pudo cargar la lista de categorías.');
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

  editar(item: CategoriaDto): void {
    this.formVisible = true;
    this.editMode = true;
    this.form = { idCategoria: item.idCategoria, nombre: item.nombre };
  }

  cancelar(): void {
    this.formVisible = false;
    this.editMode = false;
    this.form = { nombre: '' };
  }

  aplicarFiltroLocal(): void {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) {
      this.categoriasView = [...this.categorias];
      return;
    }

    this.categoriasView = this.categorias.filter((c) =>
      (c.nombre ?? '').toLowerCase().includes(q)
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
        const item = await firstValueFrom(this.categoriaService.obtenerPorId(numericId));
        this.categoriasView = item ? [item] : [];
      } catch (error) {
        console.error(error);
        this.categoriasView = [];
        alert('No se encontró la categoría con ese ID.');
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
      if (this.editMode && this.form.idCategoria != null) {
        await firstValueFrom(
          this.categoriaService.actualizar(this.form.idCategoria, { nombre })
        );
      } else {
        await firstValueFrom(this.categoriaService.crear({ nombre }));
      }
      this.cancelar();
      void this.cargar();
    } catch (error) {
      console.error(error);
      alert('No se pudo guardar la categoría.');
    } finally {
      this.guardando = false;
    }
  }

  async eliminar(item: CategoriaDto): Promise<void> {
    if (item.idCategoria == null) return;
    const ok = confirm('¿Seguro que deseas eliminar esta categoría?');
    if (!ok) return;

    const id = item.idCategoria;
    const prevCategorias = this.categorias;
    const prevCategoriasView = this.categoriasView;

    this.categorias = this.categorias.filter((c) => c.idCategoria !== id);
    this.categoriasView = this.categoriasView.filter((c) => c.idCategoria !== id);
    if (this.editMode && this.form.idCategoria === id) {
      this.cancelar();
    }

    this.eliminandoId = id;
    try {
      await firstValueFrom(this.categoriaService.eliminar(id));
      void this.cargar();
    } catch (error) {
      console.error(error);
      this.categorias = prevCategorias;
      this.categoriasView = prevCategoriasView;
      alert('No se pudo eliminar la categoría.');
    } finally {
      this.eliminandoId = null;
    }
  }
}
