import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PichinchaButtonComponent } from '../pichincha-button/pichincha-button.component';

@Component({
  selector: 'app-pichincha-modal',
  templateUrl: './pichincha-modal.component.html',
  styleUrls: ['./pichincha-modal.component.scss'],
  imports:[CommonModule,PichinchaButtonComponent]
})
export class PichinchaModalComponent {
  @Input() title: string = '';
  @Input() show: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }
}
