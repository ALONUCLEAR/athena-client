import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() close = new EventEmitter<void>();

  allData: { key: string; value: any }[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  loadExtra() {
    this.loading = true;
    this.error = null;
    
    this.http.get<any>(`${environment.apiUrl}/sse/entity/${this.event.entityId}/details`)
      .subscribe({
        next: (res) => {
          this.prepareData(res);
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load extra data', err);
          this.error = 'Failed to load extra details';
          this.loading = false;
          // Even if extra fails, show what we have
          this.prepareData(null);
        }
      });
  }

  private prepareData(extraDetails: any) {
    const data: Record<string, any> = {
      'Entity Name': this.event.entityName,
      'Entity ID': this.event.entityId,
      'Version': this.event.version,
      ...(this.event.data as object),
    };

    if (extraDetails && extraDetails.extra) {
        Object.entries(extraDetails.extra).forEach(([key, value]) => {
            const prettyKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            data[prettyKey] = value;
        });
    }

    this.allData = Object.entries(data).map(([key, value]) => ({
        key,
        value: typeof value === 'object' ? JSON.stringify(value) : value
    }));
  }

  ngOnInit() {
    if (this.event) {
        this.loadExtra();
    }
  }
}
