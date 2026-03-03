import { Component, EventEmitter, Input, Output } from '@angular/core';
import { searchOption } from '../generic-search.component';

@Component({
  selector: 'app-generic-search-option',
  templateUrl: './generic-search-option.component.html',
  styleUrls: ['./generic-search-option.component.less'],
})
export class GenericSearchOptionComponent {
  @Input() option!: searchOption;
  @Input() isFavoriteSearch: boolean = false;
  @Input() isMultiChoise: boolean = false;
  @Input() isFavorite: boolean = false;

  @Output() onFavoriteChange: EventEmitter<string> = new EventEmitter<string>();
  onStarClick() {
    this.onFavoriteChange.emit(this.option.title);
  }
}
