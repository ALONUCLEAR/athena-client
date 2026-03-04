import { Component, Input } from '@angular/core';
import { DiffEntityResult } from '../../models/diff';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.less'],
})
export class EventDetailsComponent {
  @Input() event!: DiffEntityResult;

  extraData: any = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  loadExtra() {
    this.loading = true;
    this.error = null;
    
    this.http.get(`${environment.apiUrl}/sse/entity/${this.event.entityId}/details`)
      .subscribe({
        next: (res) => {
          this.extraData = res;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load extra data', err);
          this.error = 'Failed to load extra details';
          this.loading = false;
        }
      });
  }
}
