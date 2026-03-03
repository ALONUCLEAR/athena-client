import { Component } from '@angular/core';
import { SearchOption } from './generic-search/generic-search.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'athena-client';

  options: SearchOption[] = [
    { title: 'אופציה א', isFavorite: true },
    { title: 'אופציה ב', isFavorite: true },
    { title: 'אופציה ג', isFavorite: true },
    { title: 'אופציה ד', isFavorite: false },
    { title: 'אופציה ה', isFavorite: false },
  ];
}
