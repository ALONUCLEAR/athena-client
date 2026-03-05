import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    <div class="modal-backdrop" (click)="onBackdropClick()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button class="close-btn" (click)="close.emit()">&times;</button>
        </div>
        <div class="modal-body">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }
    .modal-content {
      background: white;
      border-radius: 12px;
      width: 80%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }
    .modal-header {
      padding: 16px 24px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .modal-title {
      margin: 0;
      font-size: 1.25rem;
      color: #333;
    }
    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #999;
      transition: color 0.2s;
    }
    .close-btn:hover {
      color: #333;
    }
    .modal-body {
      padding: 24px;
    }
  `]
})
export class ModalComponent {
  @Input() title = '';
  @Output() close = new EventEmitter<void>();

  onBackdropClick() {
    this.close.emit();
  }
}
