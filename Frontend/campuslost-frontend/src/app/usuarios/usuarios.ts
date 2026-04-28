import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';

import { UsuarioDto, UsuarioService } from '../services/usuario';
import { RolDto, RolService } from '../services/rol';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly rolService = inject(RolService);
  private readonly authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);

  usuarios: UsuarioDto[] = [];
  usuariosView: UsuarioDto[] = [];

  roles: RolDto[] = [];
  rolesLoading = false;

  cargando = false;
  buscando = false;
  guardando = false;
  eliminandoId: number | null = null;

  searchTerm = '';
  formVisible = false;
  editMode = false;
  puedeEditar = false;
  private editorIdFromSession: number | null = null;
  rolId: number | null = null;
  form: UsuarioDto = { nombre: '', correo: '', contrasena: '' };
  private currentPassword: string | null = null;

  private getSessionData(): any | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const raw = this.authService.obtenerSesion();
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private getLoggedUserId(): number | null {
    const data = this.getSessionData();
    if (!data) return null;

    const id =
      data?.idUsuario ??
      data?.id_usuario ??
      data?.usuario?.idUsuario ??
      data?.usuario?.id_usuario;

    const n = Number(id);
    return Number.isFinite(n) ? n : null;
  }

  private getLoggedRoleInfo(): { roleId: number | null; roleName: string | null } {
    const data = this.getSessionData();
    if (!data) return { roleId: null, roleName: null };

    const roleIdRaw =
      data?.idRol ??
      data?.id_rol ??
      data?.rol?.idRol ??
      data?.rol?.id_rol ??
      data?.usuario?.idRol ??
      data?.usuario?.id_rol ??
      data?.usuario?.rol?.idRol ??
      data?.usuario?.rol?.id_rol;

    const roleNameRaw =
      data?.rol?.nombre ??
      data?.rol?.name ??
      data?.usuario?.rol?.nombre ??
      data?.usuario?.rol?.name ??
      data?.nombreRol ??
      data?.role;

    const roleId = Number.isFinite(Number(roleIdRaw)) ? Number(roleIdRaw) : null;
    const roleName = typeof roleNameRaw === 'string' ? roleNameRaw.trim() : null;
    return { roleId, roleName };
  }

  private isAdminFromSession(): boolean {
    const { roleId, roleName } = this.getLoggedRoleInfo();
    const normalizedName = (roleName ?? '').toLowerCase();

    // Prefer role name when available; fallback to common ADMIN roleId=1.
    if (normalizedName) {
      return normalizedName.includes('admin');
    }

    return roleId === 1;
  }

  private refreshEditPermissions(): void {
    const isAdmin = this.isAdminFromSession();
    const userId = this.getLoggedUserId();
    this.editorIdFromSession = isAdmin ? userId : null;
    this.puedeEditar = this.editorIdFromSession != null;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.refreshEditPermissions();
      this.cargando = true;
      setTimeout(() => {
        void this.cargar();
        void this.cargarRoles();
      }, 0);
    }
  }

  private getId(item: UsuarioDto): number | undefined {
    return item.idUsuario ?? item.id_usuario;
  }

  private getFecha(item: UsuarioDto): string | undefined {
    return item.fechaCreacion ?? item.fecha_creacion;
  }

  private getRolId(item: UsuarioDto): number | undefined {
    return (
      item.idRol ??
      item.id_rol ??
      item.rol?.idRol ??
      item.rol?.id_rol ??
      (item as any)?.rol?.idRol ??
      (item as any)?.rol?.id_rol
    );
  }

  private getRolIdFromRolDto(rol: RolDto): number | undefined {
    return rol.idRol ?? rol.id_rol;
  }

  async cargar(): Promise<void> {
    this.cargando = true;
    try {
      this.usuarios = await firstValueFrom(this.usuarioService.listar());
      this.aplicarFiltroLocal();
    } catch (error) {
      console.error(error);
      alert('No se pudo cargar la lista de usuarios.');
    } finally {
      this.cargando = false;
    }
  }

  async cargarRoles(): Promise<void> {
    this.rolesLoading = true;
    try {
      this.roles = await firstValueFrom(this.rolService.listar());
    } catch (error) {
      console.warn('No se pudieron cargar roles (endpoint /api/roles).', error);
      this.roles = [];
    } finally {
      this.rolesLoading = false;
    }
  }

  toggleRegistrar(): void {
    if (this.formVisible && !this.editMode) {
      this.formVisible = false;
      return;
    }
    this.formVisible = true;
    this.editMode = false;
    this.rolId = null;
    this.currentPassword = null;
    this.form = { nombre: '', correo: '', contrasena: '' };
  }

  editar(item: UsuarioDto): void {
    this.refreshEditPermissions();
    if (!this.puedeEditar) {
      alert('Solo los administradores pueden editar usuarios.');
      return;
    }
    this.formVisible = true;
    this.editMode = true;
    this.rolId = this.getRolId(item) ?? null;
    this.currentPassword = (item.contrasena ?? '').trim() || null;
    this.form = {
      idUsuario: this.getId(item),
      nombre: item.nombre,
      correo: item.correo,
      contrasena: '',
      fechaCreacion: this.getFecha(item),
    };
  }

  cancelar(): void {
    this.formVisible = false;
    this.editMode = false;
    this.rolId = null;
    this.currentPassword = null;
    this.form = { nombre: '', correo: '', contrasena: '' };
  }

  aplicarFiltroLocal(): void {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) {
      this.usuariosView = [...this.usuarios];
      return;
    }

    this.usuariosView = this.usuarios.filter((u) => {
      const nombre = (u.nombre ?? '').toLowerCase();
      const correo = (u.correo ?? '').toLowerCase();
      return nombre.includes(q) || correo.includes(q);
    });
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
        const item = await firstValueFrom(this.usuarioService.obtenerPorId(numericId));
        this.usuariosView = item ? [item] : [];
      } catch (error) {
        console.error(error);
        this.usuariosView = [];
        alert('No se encontró el usuario con ese ID.');
      } finally {
        this.buscando = false;
      }
      return;
    }

    this.aplicarFiltroLocal();
  }

  async guardar(): Promise<void> {
    const nombre = (this.form.nombre ?? '').trim();
    const correo = (this.form.correo ?? '').trim();
    const contrasena = (this.form.contrasena ?? '').trim();
    const rolId = this.rolId;

    if (!nombre || !correo) {
      alert('Nombre y correo son obligatorios.');
      return;
    }

    if (rolId == null || Number.isNaN(Number(rolId))) {
      alert('El Id_Rol es obligatorio.');
      return;
    }

    this.guardando = true;
    try {
      const id = this.form.idUsuario;
      const rolNumericId = Number(rolId);
      const payload: UsuarioDto = {
        nombre,
        correo,
        idRol: rolNumericId,
        id_rol: rolNumericId,
        rol: { idRol: rolNumericId },
      };

      if (!this.editMode) {
        if (!contrasena) {
          alert('La contraseña es obligatoria al registrar.');
          return;
        }
        payload.contrasena = contrasena;
      } else {
        // Si no se ingresa contraseña, reenviamos la actual para que el backend no la deje en null/vacía.
        // (Esto asume que el backend retorna la contraseña; en tu UI ya se muestra en tabla.)
        if (contrasena) {
          payload.contrasena = contrasena;
        } else if (this.currentPassword) {
          payload.contrasena = this.currentPassword;
        }
      }

      if (this.editMode && id != null) {
        this.refreshEditPermissions();
        const editorId = this.editorIdFromSession;
        if (editorId == null || Number.isNaN(Number(editorId))) {
          alert('No se pudo identificar un administrador en la sesión para editar. Inicia sesión con un admin.');
          return;
        }
        await firstValueFrom(this.usuarioService.actualizar(id, payload, editorId));
      } else {
        await firstValueFrom(this.usuarioService.crear(payload));
      }

      this.cancelar();
      void this.cargar();
    } catch (error) {
      console.error(error);
      if (error instanceof HttpErrorResponse) {
        const serverMsg =
          typeof error.error === 'string'
            ? error.error
            : (error.error?.message as string | undefined);
        alert(serverMsg || 'No se pudo guardar el usuario.');
      } else {
        alert('No se pudo guardar el usuario.');
      }
    } finally {
      this.guardando = false;
    }
  }

  async eliminar(item: UsuarioDto): Promise<void> {
    const id = this.getId(item);
    if (id == null) return;
    const ok = confirm('¿Seguro que deseas eliminar este usuario?');
    if (!ok) return;

    const prevUsuarios = this.usuarios;
    const prevUsuariosView = this.usuariosView;

    this.usuarios = this.usuarios.filter((u) => this.getId(u) !== id);
    this.usuariosView = this.usuariosView.filter((u) => this.getId(u) !== id);
    if (this.editMode && this.form.idUsuario === id) {
      this.cancelar();
    }

    this.eliminandoId = id;
    try {
      await firstValueFrom(this.usuarioService.eliminar(id));
      void this.cargar();
    } catch (error) {
      console.error(error);
      this.usuarios = prevUsuarios;
      this.usuariosView = prevUsuariosView;
      alert('No se pudo eliminar el usuario.');
    } finally {
      this.eliminandoId = null;
    }
  }
}
