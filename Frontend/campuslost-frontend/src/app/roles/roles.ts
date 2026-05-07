import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';

import { RolDto, RolService } from '../services/rol';
import { PaginationControls } from '../shared/pagination-controls';
import { TablePagination } from '../shared/table-pagination';
import { Navbar } from '../componentes-generales/navbar-component';
import { NotificacionService } from '../services/notificacion.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationControls, Navbar],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})

export class Roles implements OnInit {
  private readonly rolService = inject(RolService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notificacion = inject(NotificacionService);

  roles: RolDto[] = [];
  rolesView: RolDto[] = [];
  pagination = new TablePagination<RolDto>();

  cargando = false;
  buscando = false;
  guardando = false;
  eliminandoId: number | null = null;

  searchTerm = '';
  formVisible = false;
  editMode = false;
  form: RolDto = { nombre: '' };

  ngOnInit(): void {
    this.cargando = true;
    setTimeout(() => void this.cargar(), 0);
  }

  private getId(item: RolDto): number | undefined {
    return item.idRol ?? item.id_rol;
  }

  async cargar(): Promise<void> {
    this.cargando = true;
    try {
      this.roles = await firstValueFrom(this.rolService.listar());
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

  editar(item: RolDto): void {
    this.formVisible = true;
    this.editMode = true;
    this.form = { idRol: this.getId(item), nombre: item.nombre };
  }

  cancelar(): void {
    this.formVisible = false;
    this.editMode = false;
    this.form = { nombre: '' };
  }

  aplicarFiltroLocal(): void {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) {
      this.updatePagination([...this.roles]);
      return;
    }
    this.updatePagination(this.roles.filter((r) => (r.nombre ?? '').toLowerCase().includes(q)));
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
        const item = await firstValueFrom(this.rolService.obtenerPorId(numericId));
        this.updatePagination(item ? [item] : []);
      } catch (error) {
        console.error(error);
        this.updatePagination([]);
        this.notificacion.advertencia('No se encontró el rol con ese ID.');
      } finally {
        this.buscando = false;
      }
      return;
    }

    this.aplicarFiltroLocal();
  }

  private updatePagination(items: RolDto[]): void {
    this.rolesView = items;
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
      const id = this.form.idRol;
      if (this.editMode && id != null) {
        await firstValueFrom(this.rolService.actualizar(id, { nombre }));
      } else {
        await firstValueFrom(this.rolService.crear({ nombre }));
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

  async eliminar(item: RolDto): Promise<void> {
    const id = this.getId(item);
    if (id == null) return;
    const ok = confirm('¿Seguro que deseas eliminar este rol?');
    if (!ok) return;

    const prevRoles = this.roles;
    const prevRolesView = this.rolesView;

    this.roles = this.roles.filter((r) => this.getId(r) !== id);
    this.updatePagination(this.rolesView.filter((r) => this.getId(r) !== id));
    if (this.editMode && this.form.idRol === id) {
      this.cancelar();
    }

    this.eliminandoId = id;
    try {
      await firstValueFrom(this.rolService.eliminar(id));
      void this.cargar();
    } catch (error) {
      console.error(error);
      this.roles = prevRoles;
      this.updatePagination(prevRolesView);
      this.notificacion.error(this.notificacion.parsearError(error));
    } finally {
      this.eliminandoId = null;
    }
  }
}
