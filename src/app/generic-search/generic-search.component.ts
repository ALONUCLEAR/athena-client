import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { SelectionHandler, createSelectionHandler } from './selection';

export interface SearchOption {
  title: string;
  isFavorite?: boolean;
}

@Component({
  selector: 'app-generic-search',
  templateUrl: './generic-search.component.html',
  styleUrls: ['./generic-search.component.less'],
})
export class GenericSearchComponent implements OnInit {
  constructor(private viewContainerRef: ViewContainerRef) {}

  @Input() options: SearchOption[] = [];
  @Input() isFavoriteSearch: boolean = false;
  @Input() isMultiChoice: boolean = false;

  @Output() singleSelectedChoice = new EventEmitter<string>();
  @Output() multiSelectedChoices = new EventEmitter<string[]>();
  @Output() optionAdded = new EventEmitter<string>();

  searchValue = '';
  matchingOptions: SearchOption[] = [];
  displayAddOption: boolean = false;
  selectionHandler!: SelectionHandler;
  noSelectionChosen: boolean = false;
  ngOnInit(): void {
    this.selectionHandler = createSelectionHandler(this.isMultiChoice);
    this.matchingOptions = [...this.options];
    if (this.isFavoriteSearch) {
      this.sortBasedOnFavorites();
    }
  }

  sortBasedOnFavorites(): void {
    // Delay re-sorting so the user can see the favorite toggle before the item moves position
    setTimeout(() => {
      const favorites: SearchOption[] = this.matchingOptions
        .filter((option) => option?.isFavorite)
        .sort((a, b) => a.title.localeCompare(b.title));
      const noFavorites: SearchOption[] = this.matchingOptions
        .filter((option) => !option?.isFavorite)
        .sort((a, b) => a.title.localeCompare(b.title));
      this.matchingOptions = [...favorites, ...noFavorites];
    }, 200);
  }

  sortOptions(): void {
    if (this.isFavoriteSearch) {
      this.sortBasedOnFavorites();
    } else {
      this.matchingOptions.sort((a, b) => a.title.localeCompare(b.title));
    }
  }

  updateDisplayedOptions(): void {
    this.matchingOptions = [...this.options.filter((option) =>
      option.title.startsWith(this.searchValue),
    )];
    this.sortOptions();
    this.displayAddOption = this.matchingOptions.length === 0;
  }

  addSearchOption(): void {
    const alreadyExists = this.options.some(
      (o) => o.title === this.searchValue,
    );
    if (alreadyExists) return;
    this.options.push({ title: this.searchValue, isFavorite: false });
    this.updateDisplayedOptions();
    this.optionAdded.emit(this.searchValue);
  }

  onFavoriteOptionChange(title: string): void {
    const option = this.options.find((o) => o.title === title);
    if (option) option.isFavorite = !option.isFavorite;
    this.sortBasedOnFavorites();
    // TODO : add a service that update the s3 I guess with this choice
  }

  updateSelectedOptions(title: string): void {
    this.noSelectionChosen = false;
    this.selectionHandler.toggle(title);
  }

  trackByTitle(index: number, option: SearchOption): string {
    return option.title;
  }

  onClose(): void {
    this.viewContainerRef.clear();
  }

  onSelect(): void {
    if (this.selectionHandler.isEmpty()) {
      this.noSelectionChosen = true;
      return;
    }
    const selection = this.selectionHandler.getSelection();
    if (this.isMultiChoice) {
      this.multiSelectedChoices.emit(selection);
    } else {
      this.singleSelectedChoice.emit(selection[0]);
    }
  }
}
