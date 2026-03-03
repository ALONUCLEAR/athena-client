import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchOption } from '../generic-search.component';

@Component({
  selector: 'app-generic-search-option',
  templateUrl: './generic-search-option.component.html',
  styleUrls: ['./generic-search-option.component.less'],
})
export class GenericSearchOptionComponent {
  @Input() option!: SearchOption;
  @Input() isFavoriteSearch: boolean = false;
  @Input() isMultiChoice: boolean = false;
  @Input() isFavorite: boolean = false;

  @Output() favoriteChange = new EventEmitter<string>();
  @Output() optionSelectionChanged = new EventEmitter<string>();
  onStarClick(): void {
    this.favoriteChange.emit(this.option.title);
  }
  onOptionSelectionChanged(): void {
    this.optionSelectionChanged.emit(this.option.title);
  }
}
