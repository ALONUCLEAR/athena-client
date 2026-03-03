export interface SelectionHandler {
  select(title: string): void;
  toggle(title: string): void;
  isSelected(title: string): boolean;
  getSelection(): string[];
  clear(): void;
  remove(title?: string): void;
  isEmpty(): boolean;
}

class SingleSelectionHandler implements SelectionHandler {
  private selected: string | null = null;

  select(title: string): void {
    this.selected = title;
  }

  toggle(title: string): void {
    this.selected === title ? this.remove() : this.select(title);
  }

  isSelected(title: string): boolean {
    return this.selected === title;
  }

  remove(): void {
    this.selected = null;
  }

  getSelection(): string[] {
    return this.selected ? [this.selected] : [];
  }

  clear(): void {
    this.selected = null;
  }

  isEmpty(): boolean {
    return this.selected === null;
  }
}

class MultiSelectionHandler implements SelectionHandler {
  private selected = new Set<string>();

  select(title: string): void {
    this.selected.add(title);
  }

  toggle(title: string): void {
    this.selected.has(title) ? this.remove(title) : this.select(title);
  }

  isSelected(title: string): boolean {
    return this.selected.has(title);
  }

  remove(title: string): void {
    this.selected.delete(title);
  }

  getSelection(): string[] {
    return [...this.selected];
  }

  clear(): void {
    this.selected.clear();
  }

  isEmpty(): boolean {
    return this.selected.size === 0;
  }
}

export const createSelectionHandler = (
  isMultiChoice: boolean,
): SelectionHandler => {
  return isMultiChoice
    ? new MultiSelectionHandler()
    : new SingleSelectionHandler();
};
