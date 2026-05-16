import { Routes } from '@angular/router';

import { Bienvenida } from './bienvenida/bienvenida';
import { Crud } from './crud/crud';
import { Categorias } from './categorias/categorias';
import { Estados } from './estados/estados';
import { Roles } from './roles/roles';
import { Usuarios } from './usuarios/usuarios';
import { RegistroObjetos } from './registro-objetos/registro-objetos';
import { inicio } from './Inicio/inicio';
import { auth } from './auth/auth';
import { RegistrarObjeto } from './registrar-objeto/registrar-objeto';
import { Objeto} from './objeto/objeto';
import { CrudPreguntas } from './preguntas/preguntas';
import { ReclamarObjeto } from './reclamar-objeto/reclamar-objeto';
import { Perfil } from './perfil/perfil';




export const routes: Routes = [

  /* LOGIN */
  {
    path: '',
    component: Bienvenida,
    pathMatch: 'full'
  },

  /* DASHBOARD */
  {
    path: 'inicio',
    component: inicio,
    canActivate: [auth]
  },

  {
    path: 'perfil',
    component: Perfil,
    canActivate: [auth]
  },

  /* CRUD */
  {
    path: 'crud',
    component: Crud,
    canActivate: [auth]
  },

  {
    path: 'crud/categorias',
    component: Categorias,
    canActivate: [auth]
  },

  {
    path: 'crud/estados',
    component: Estados,
    canActivate: [auth]
  },

  {
    path: 'crud/roles',
    component: Roles,
    canActivate: [auth]
  },

  {
    path: 'crud/usuarios',
    component: Usuarios,
    canActivate: [auth]
  },

  {
    path: 'registro-objetos',
    component: RegistroObjetos,
    canActivate: [auth]
  },
  {
  path: 'registrar-objeto',
  component: RegistrarObjeto,
  canActivate: [auth]
  },
  {
  path: 'objeto',
  component: Objeto
  },
  {
    path: 'pregunta',
    redirectTo: 'crud/preguntas'
  },
  {
    path: 'crud/preguntas',
    component: CrudPreguntas,
    canActivate: [auth]
  },
  {
  path: 'reclamar-objeto/:id',
  component: ReclamarObjeto,
  canActivate: [auth]
},
  {
    path: '**',
    redirectTo: ''
  }

];