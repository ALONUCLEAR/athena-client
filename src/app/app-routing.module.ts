import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisuallyRepresentDatakComponent } from './src/app/visually-represent-datak/visually-represent-datak.component';

export const routes: Routes = [
  { path: 'datak', component: VisuallyRepresentDatakComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
