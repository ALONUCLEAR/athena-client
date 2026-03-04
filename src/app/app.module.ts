import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeeklyEventsComponent } from './components/weekly-events/weekly-events.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { EventUpdatesComponent } from './components/event-updates/event-updates.component';

@NgModule({
  declarations: [AppComponent, WeeklyEventsComponent, EventDetailsComponent, EventUpdatesComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
