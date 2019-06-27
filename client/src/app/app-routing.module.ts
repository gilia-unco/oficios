import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
// import { AuthGuard } from './auth/auth.guard';

// COMPONENTES

const routes: Routes = [
  // REDIRECCIONAMIENTO A INICIO
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },

  // RUTAS A COMPONENTES
  { path: 'inicio', component: InicioComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
