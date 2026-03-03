import { Component, Input, OnInit } from '@angular/core';

export interface searchOption {
  title: string;
  isFavorite?: boolean;
}

@Component({
  selector: 'app-generic-search',
  templateUrl: './generic-search.component.html',
  styleUrls: ['./generic-search.component.less'],
})
export class GenericSearchComponent implements OnInit {
  constructor() {}

  @Input() options: searchOption[] = [];
  @Input() isFavoriteSearch: boolean = false;
  @Input() isMultiChoise: boolean = false;

  searchValue = '';
  matchingOptions: searchOption[] = [];
  ngOnInit(): void {
    this.matchingOptions = this.options;
    if (this.isFavoriteSearch) {
      this.favoriteSort();
    }
  }

  favoriteSort() {
    setTimeout(() => {
      const favorites: searchOption[] = this.matchingOptions
        .filter((option) => option?.isFavorite)
        .sort();
      const noFavorites: searchOption[] = this.matchingOptions
        .filter((option) => !option?.isFavorite)
        .sort();
      this.matchingOptions = [...favorites, ...noFavorites];
      // delay because the list updates too fast
    }, 200);
  }

  onSearchValueChange(input: string) {
    this.matchingOptions = this.options.filter((option) =>
      option.title.startsWith(input),
    );
    if (this.isFavoriteSearch) {
      this.favoriteSort();
    }
  }

  onFavoriteOptionChange(title: string) {
    const option = this.options.find((o) => o.title === title);
    if (option) option.isFavorite = !option.isFavorite;
    this.favoriteSort();
    // TODO : add a service that update the s3 I guess with this choise
  }
}
