import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { firstValueFrom } from 'rxjs';

import { ObjetoService } from '../services/objeto';
import { ObjetoDto } from '../dto/objetoDTO';
import { EstadoService } from '../services/estado';
import { EstadoDto } from '../dto/estadoDTO';
import { CategoriaDto, CategoriaService } from '../services/categoria';

import { TablePagination } from '../shared/table-pagination';
import { PaginationControls } from '../shared/pagination-controls';
import { Navbar } from '../componentes-generales/navbar-component';
import { NotificacionService } from '../services/notificacion.service';

@Component({
  selector: 'app-registro-objetos',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationControls, Navbar],
  templateUrl: './registro-objetos.html',
  styleUrl: './registro-objetos.css',
})
export class RegistroObjetos implements OnInit {
  private readonly objetoService = inject(ObjetoService);
  private readonly estadoService = inject(EstadoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notificacion = inject(NotificacionService);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}


  objetos: ObjetoDto[] = [];
  objetosView: ObjetoDto[] = [];
  pagination = new TablePagination<ObjetoDto>();
  estados: EstadoDto[] = [];
  estadosLoading = false;
  categorias: CategoriaDto[] = [];
  categoriasLoading = false;
  cargando = false;
  buscando = false;
  guardando = false;
  searchTerm = '';
  totalRegistrados = 0;
  totalEntregados = 0;
  totalAbandonados = 0;

  // — Modal editar/estado —
  formVisible = false;
  editMode = false;
  estadoOnlyMode = false;
  private originalEditingItem: ObjetoDto | null = null;
  editCategoriaId: number | null = null;
  editEstadoId: number | null = null;
  form: ObjetoDto = { titulo: '', descripcion: '', lugar: '', fecha: '' };

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

  ngOnInit(): void {
    void this.cargar();
    void this.cargarEstados();
    void this.cargarCategorias();
  }

  private getId(item: ObjetoDto): number | undefined {
    return item.idObjeto ?? item.id_objeto ?? (item as any)?.id;
  }

  private getEstadoId(item: ObjetoDto): number | undefined {
    return item.idEstado ?? item.id_estado ?? item.estado?.idEstado ?? item.estado?.id_estado;
  }

  private getCategoriaId(item: ObjetoDto): number | undefined {
    return item.idCategoria ?? item.id_categoria ?? item.categoria?.idCategoria ?? item.categoria?.id_categoria;
  }

  getEstadoNombre(item: ObjetoDto): string {
    const n = item.estadoNombre ?? item.estado?.nombre ?? (item as any)?.nombreEstado;
    return (typeof n === 'string' ? n : '').trim();
  }

  getCategoriaNombre(item: ObjetoDto): string {
    const n = item.categoriaNombre ?? item.categoria?.nombre ?? (item as any)?.nombreCategoria;
    return (typeof n === 'string' ? n : '').trim();
  }

  getBadgeClass(item: ObjetoDto): string {
    const e = this.getEstadoNombre(item).toLowerCase();
    if (e.includes('entreg')) return 'badge-entregado';
    if (e.includes('registr')) return 'badge-registrado';
    if (e.includes('abandon')) return 'badge-abandonado';
    return 'badge-sin-estado';
  }

  getFechaDisplay(item: ObjetoDto): string {
    const raw = (item.fecha ?? item.fechaEvento ?? item.fecha_evento ?? '').trim();
    if (!raw) return '';
    const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
    return raw;
  }

  async cargar(): Promise<void> {
    this.cargando = true;
    try {
      this.objetos = await firstValueFrom(this.objetoService.listar());
      this.aplicarFiltroLocal();
      this.recalcularTotales();
    } catch (e) { console.error(e); }
    finally { this.cargando = false; this.cdr.markForCheck(); }
  }

  async cargarEstados(): Promise<void> {
    this.estadosLoading = true;
    try { this.estados = await firstValueFrom(this.estadoService.listar()); }
    catch { this.estados = []; }
    finally { this.estadosLoading = false; }
  }

  async cargarCategorias(): Promise<void> {
    this.categoriasLoading = true;
    try { this.categorias = await firstValueFrom(this.categoriaService.listar()); }
    catch { this.categorias = []; }
    finally { this.categoriasLoading = false; }
  }

  recalcularTotales(): void {
    this.totalRegistrados = 0;
    this.totalEntregados = 0;
    this.totalAbandonados = 0;
    for (const item of this.objetos) {
      const e = this.getEstadoNombre(item).toLowerCase();
      if (e.includes('entreg')) this.totalEntregados++;
      else if (e.includes('abandon')) this.totalAbandonados++;
      else if (e.includes('registr')) this.totalRegistrados++;
    }
  }

  aplicarFiltroLocal(): void {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) { this.updatePagination([...this.objetos]); return; }
    this.updatePagination(this.objetos.filter(o =>
      (o.titulo ?? '').toLowerCase().includes(q) ||
      (o.lugar ?? '').toLowerCase().includes(q) ||
      (o.descripcion ?? '').toLowerCase().includes(q) ||
      this.getEstadoNombre(o).toLowerCase().includes(q) ||
      this.getCategoriaNombre(o).toLowerCase().includes(q)
    ));
  }

  async buscar(): Promise<void> {
    const q = this.searchTerm.trim();
    if (!q) { this.aplicarFiltroLocal(); return; }
    const numericId = Number(q);
    if (!Number.isNaN(numericId) && Number.isInteger(numericId)) {
      this.buscando = true;
      try {
        const item = await firstValueFrom(this.objetoService.obtenerPorId(numericId));
        this.updatePagination(item ? [item] : []);
      } catch { this.updatePagination([]); }
      finally { this.buscando = false; }
      return;
    }
    this.aplicarFiltroLocal();
  }

  private updatePagination(items: ObjetoDto[]): void {
    this.objetosView = items;
    this.pagination.data = items;
    this.cdr.markForCheck();
  }

  irARegistrar(): void {
    this.router.navigate(['/registrar-objeto'], { 
      queryParams: { from: '/registro-objetos' } 
    });
  }

  // — Modal editar/estado —
  editar(item: ObjetoDto): void {
    this.formVisible = true;
    this.editMode = true;
    this.estadoOnlyMode = false;
    this.originalEditingItem = item;
    this.editEstadoId = this.getEstadoId(item) ?? null;
    this.editCategoriaId = this.getCategoriaId(item) ?? null;
    this.form = {
      idObjeto: this.getId(item),
      titulo: item.titulo ?? '',
      descripcion: item.descripcion ?? '',
      lugar: item.lugar ?? '',
      fecha: item.fecha ?? item.fechaEvento ?? item.fecha_evento ?? '',
    };
  }

  editarEstado(item: ObjetoDto): void {
    this.formVisible = true;
    this.editMode = true;
    this.estadoOnlyMode = true;
    this.originalEditingItem = item;
    this.editEstadoId = this.getEstadoId(item) ?? null;
    this.editCategoriaId = this.getCategoriaId(item) ?? null;
    this.form = { idObjeto: this.getId(item) };
  }

  cancelar(): void {
    this.formVisible = false;
    this.editMode = false;
    this.estadoOnlyMode = false;
    this.originalEditingItem = null;
    this.editEstadoId = null;
    this.editCategoriaId = null;
    this.form = { titulo: '', descripcion: '', lugar: '', fecha: '' };
  }

  async guardar(): Promise<void> {
    const titulo = (this.form.titulo ?? '').trim();
    const lugar = (this.form.lugar ?? '').trim();
    const descripcion = (this.form.descripcion ?? '').trim();
    const fecha = (this.form.fecha ?? '').trim();
    const userId = this.getLoggedUserId();

    if (!this.estadoOnlyMode) {
      if (!titulo || !lugar) { this.notificacion.advertencia('Título y lugar son obligatorios.'); return; }
      if (!fecha) { this.notificacion.advertencia('La fecha es obligatoria.'); return; }
      if (!this.editCategoriaId) { this.notificacion.advertencia('La categoría es obligatoria.'); return; }
    }

    this.guardando = true;
    try {
      const id = this.getId(this.form) ?? (this.originalEditingItem ? this.getId(this.originalEditingItem) : undefined);
      if (!id) { this.notificacion.advertencia('No se pudo determinar el ID.'); return; }

      const payload: ObjetoDto = {
        ...this.originalEditingItem,
        idObjeto: id,
        titulo, lugar, descripcion, fecha,
        fechaEvento: fecha,
        idEstado: this.editEstadoId ?? undefined,
        idCategoria: this.editCategoriaId ?? undefined,
        estado: { idEstado: this.editEstadoId ?? undefined },
        categoria: { idCategoria: this.editCategoriaId ?? undefined },
        usuario: { idUsuario: userId ?? undefined },
      };

      await firstValueFrom(this.objetoService.actualizar(id, payload));
      this.notificacion.exito('Objeto actualizado correctamente.');
      this.cancelar();
      await this.cargar();
      this.cdr.markForCheck();
    } catch (e) {
      console.error(e);
      this.notificacion.error(this.notificacion.parsearError(e));
    } finally {
      this.guardando = false;
      this.cdr.markForCheck();
    }
  }
}