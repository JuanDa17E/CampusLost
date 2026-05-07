import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { ObjetoService } from '../services/objeto';
import { ObjetoDto } from '../dto/objetoDTO';
import { Navbar } from "../componentes-generales/navbar-component";

@Component({
  selector: 'app-objetos',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './objeto.html',
  styleUrl: './objeto.css',
})
export class Objeto implements OnInit {
  private readonly objetoService = inject(ObjetoService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  objetos: ObjetoDto[] = [];
  objetosFiltrados: ObjetoDto[] = [];
  cargando = false;

  filtroBusqueda = '';
  filtroCategoria = '';
  filtroFecha = '';

  categorias: string[] = [];

  ngOnInit(): void {
    void this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando = true;
    try {
      this.objetos = await firstValueFrom(this.objetoService.listar());
      this.extraerCategorias();
      this.aplicarFiltros();
    } catch (e) {
      console.error(e);
    } finally {
      this.cargando = false;
      this.cdr.markForCheck();
    }
  }

  extraerCategorias(): void {
    const set = new Set<string>();
    for (const o of this.objetos) {
      const nombre = this.getCategoriaNombre(o);
      if (nombre) set.add(nombre);
    }
    this.categorias = Array.from(set).sort();
  }

  aplicarFiltros(): void {
    let resultado = [...this.objetos];

    const q = this.filtroBusqueda.trim().toLowerCase();
    if (q) {
      resultado = resultado.filter(o =>
        (o.titulo ?? '').toLowerCase().includes(q) ||
        (o.descripcion ?? '').toLowerCase().includes(q)
      );
    }

    if (this.filtroCategoria) {
      resultado = resultado.filter(o =>
        this.getCategoriaNombre(o) === this.filtroCategoria
      );
    }

    if (this.filtroFecha) {
      resultado = resultado.filter(o => {
        const fecha = (o.fecha ?? o.fechaEvento ?? o.fecha_evento ?? '').substring(0, 10);
        return fecha === this.filtroFecha;
      });
    }

    this.objetosFiltrados = resultado;
    this.cdr.markForCheck();
  }

  limpiarFiltros(): void {
    this.filtroBusqueda = '';
    this.filtroCategoria = '';
    this.filtroFecha = '';
    this.aplicarFiltros();
  }

  getCategoriaNombre(item: ObjetoDto): string {
    const n = item.categoriaNombre ?? item.categoria?.nombre ?? (item as any)?.nombreCategoria;
    return (typeof n === 'string' ? n : '').trim();
  }

  getFechaDisplay(item: ObjetoDto): string {
    const raw = (item.fecha ?? item.fechaEvento ?? item.fecha_evento ?? '').trim();
    if (!raw) return '';
    const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
    return raw;
  }

  irAInicio(): void {
    this.router.navigate(['/inicio']);
  }
}