import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VisuallyRepresentDatakComponent } from './src/app/visually-represent-datak/visually-represent-datak.component';
import { PlaneInStructureBoxComponent } from './src/app/visually-represent-datak/plane-in-structure-box/plane-in-structure-box.component';

@NgModule({
  declarations: [
    AppComponent,
    VisuallyRepresentDatakComponent,
    PlaneInStructureBoxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
