import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WeeklyEventsComponent } from './components/weekly-events/weekly-events.component';
import { EventUpdatesComponent } from './components/event-updates/event-updates.component';

const routes: Routes = [
  { path: '', redirectTo: 'weekly-events', pathMatch: 'full' },
  { path: 'weekly-events', component: WeeklyEventsComponent },
  { path: 'event-updates', component: EventUpdatesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
