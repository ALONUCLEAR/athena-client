import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { mockPlanesInStructrue, PlaneInStructure } from './mock-datak-data';

@Component({
  selector: 'app-visually-represent-datak',
  templateUrl: './visually-represent-datak.component.html',
  styleUrls: ['./visually-represent-datak.component.less']
})
export class VisuallyRepresentDatakComponent implements OnChanges {
  @Input() datakId = '9'; //obviously, we don't want the default value to be '9' in the real implementation

  shelteredPlanesInStructure: PlaneInStructure[] = [];
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.updatePlanesInShelter();
  }

  updatePlanesInShelter(): void {
    const allPlanesInStructure = mockPlanesInStructrue;
    const getDatakId = (planeInStructure: PlaneInStructure) => {
      const plane = planeInStructure?.plane ?? planeInStructure?.galileoPlane;

      return plane?.capAndShelterData?.shelter?.id;
    }

    this.shelteredPlanesInStructure = allPlanesInStructure.filter(planeInStructure => getDatakId(planeInStructure) === this.datakId);
  }
}
