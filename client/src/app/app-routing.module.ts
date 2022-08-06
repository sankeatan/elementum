import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ElementumComponent } from './elementum/elementum.component'
import { HomeComponent } from './home/home.component'

const routes: Routes = [
  {path: "elementum", component: ElementumComponent},
  {path: "home", component: HomeComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
