import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MiniPlane, PlaneInStructure } from '../mock-datak-data';

@Component({
  selector: 'plane-in-structure-box',
  templateUrl: './plane-in-structure-box.component.html',
  styleUrls: ['./plane-in-structure-box.component.less']
})
export class PlaneInStructureBoxComponent implements OnChanges {
  @Input() planeInStructure!: PlaneInStructure;
  @Input() labelPlacement: 'top' | 'bottom' = 'top';

  plane?: MiniPlane;
  capNamePrefix = '';
  statusClass: string = '';
  takeoffTime: string = '--:--';
  middleTime: string = '--:--';
  landingTime: string = '--:--';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['planeInStructure']) {
      this.updateComponentState();
    }
  }

  private updateComponentState(): void {
    if (!this.planeInStructure) return;

    this.plane = this.planeInStructure.galileoPlane || this.planeInStructure.plane;
    
    const cap = this.plane?.capAndShelterData?.cap;
    this.capNamePrefix = Number.isNaN(Number(cap?.name)) ? '' : 'עמדה ';

    this.statusClass = `status-${this.planeInStructure.type}`;

    if (this.planeInStructure.type !== 'readiness' && this.planeInStructure.timeData) {
      this.takeoffTime = this.formatDate(this.planeInStructure.timeData.takeoff);
      this.middleTime = this.formatDate(this.planeInStructure.timeData.weirdMiddleThing);
      this.landingTime = this.formatDate(this.planeInStructure.timeData.lending);
    }
  }

  private formatDate(date: Date | undefined): string {
    if (!date) return '--:--';
    return date.toLocaleTimeString('he-IL', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
  }
}