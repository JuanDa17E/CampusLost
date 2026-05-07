import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaDto, CategoriaService } from '../services/categoria';
import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';
import { PaginationControls } from '../shared/pagination-controls';
import { TablePagination } from '../shared/table-pagination';
import { Navbar } from '../componentes-generales/navbar-component';
import { NotificacionService } from '../services/notificacion.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationControls,Navbar],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit {
  private readonly categoriaService = inject(CategoriaService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notificacion = inject(NotificacionService);

  categorias: CategoriaDto[] = [];
  categoriasView: CategoriaDto[] = [];
  pagination = new TablePagination<CategoriaDto>();

  cargando = false;
  buscando = false;
  guardando = false;
  eliminandoId: number | null = null;

  searchTerm = '';
  formVisible = false;
  editMode = false;
  form: CategoriaDto = { nombre: '' };

  ngOnInit(): void {
    this.cargando = true;
    setTimeout(() => void this.cargar(), 0);
  }

  async cargar(): Promise<void> {
    this.cargando = true;
    try {
      this.categorias = await firstValueFrom(this.categoriaService.listar());
      this.aplicarFiltroLocal();
    } catch (error) {
      console.error(error);
      this.notificacion.error(this.notificacion.parsearError(error));
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
      this.updatePagination([...this.categorias]);
      return;
    }

    this.updatePagination(
      this.categorias.filter((c) =>
        (c.nombre ?? '').toLowerCase().includes(q)
      )
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
        this.updatePagination(item ? [item] : []);
      } catch (error) {
        console.error(error);
        this.updatePagination([]);
        this.notificacion.advertencia('No se encontró la categoría con ese ID.');
      } finally {
        this.buscando = false;
      }
      return;
    }

    this.aplicarFiltroLocal();
  }

  private updatePagination(items: CategoriaDto[]): void {
    this.categoriasView = items;
    this.pagination.data = items;
    this.cdr.markForCheck();
  }

  async guardar(): Promise<void> {
    const nombre = (this.form.nombre ?? '').trim();
    if (!nombre) {
      this.notificacion.advertencia('El nombre es obligatorio.');
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
      this.notificacion.error(this.notificacion.parsearError(error));
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
    this.updatePagination(this.categoriasView.filter((c) => c.idCategoria !== id));
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
      this.updatePagination(prevCategoriasView);
      this.notificacion.error(this.notificacion.parsearError(error));
    } finally {
      this.eliminandoId = null;
    }
  }
}
