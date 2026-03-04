import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GenericSearchComponent } from './generic-search/generic-search.component';
import { GenericSearchOptionComponent } from './generic-search/generic-search-option/generic-search-option.component';

@NgModule({
  declarations: [
    AppComponent,
    GenericSearchComponent,
    GenericSearchOptionComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
